import { Injectable } from '@nestjs/common';

/**
 * 스윙 분석 데이터의 타입 (예시)
 * (FastAPI Analyzer가 보내주는 JSON 형식과 일치해야 함)
 */
export interface SwingAnalysisData {
  backswingAngle: number;
  downswingAngle: number;
  impactAngle: number;
  errors: string[];
  // ... 기타 분석 데이터
}

/**
 * 프롬프트 엔지니어링을 전담하는 서비스입니다.
 * ChatService로부터 프롬프트 생성 로직을 분리합니다.
 */
@Injectable()
export class PromptTemplateService {
  /**
   * 스윙 분석 데이터를 기반으로 LLM에 전달할
   * System 프롬프트와 User 프롬프트를 조합하여 반환합니다.
   * * @param analysisData FastAPI로부터 받은 분석 데이터
   * @param language 'ko', 'en' 등 응답 언어
   * @returns LLM에 전달할 최종 프롬프트 문자열 (System + User)
   */
  buildSwingAnalysisPrompt(
    analysisData: SwingAnalysisData,
    language: 'ko' | 'en' = 'ko',
  ): string {
    const languageInstruction = this.getLanguageInstruction(language);

    // System 프롬프트: LLM의 역할과 응답 형식을 정의
    const systemPrompt = `
당신은 20년 경력의 PGA 프로 골프 코치입니다.
사용자의 스윙 분석 데이터를 바탕으로 구체적이고 실행 가능한 피드백을 제공합니다.
항상 친절하고 격려하는 말투를 사용하세요.

## 출력 형식
**문제점**: (데이터 기반의 가장 심각한 문제 1가지)
**원인 분석**: (왜 이런 문제가 발생했는지 생체역학적 원리)
**교정 방법**:
1. (즉시 실행 가능한 동작)
2. (연습 드릴)
**기대 효과**: (개선 후 예상되는 변화)

${languageInstruction}
`;

    // User 프롬프트: 실제 데이터를 제공
    const userPrompt = `
## 분석 데이터
- 백스윙 각도: ${analysisData.backswingAngle}도 (권장: 90-110도)
- 다운스윙 각도: ${analysisData.downswingAngle}도 (권장: 45-60도)
- 임팩트 각도: ${analysisData.impactAngle}도 (권장: 0-5도)
- 감지된 오류: ${analysisData.errors.join(', ') || '없음'}

위 데이터를 분석하여 피드백을 제공하세요.
`;

    // System 프롬프트와 User 프롬프트를 조합
    // (OpenAI의 경우 System 메시지로 합치는 것이 효과적)
    return systemPrompt + '\n\n' + userPrompt;
  }

  /**
   * 다국어 지시문을 반환하는 헬퍼 함수
   */
  private getLanguageInstruction(language: 'ko' | 'en'): string {
    const instructions = {
      ko: '모든 응답은 한국어로 작성하세요. 전문 용어는 한글로 번역하되 영문을 병기하세요 (예: 얼리 익스텐션 (Early Extension)).',
      en: 'Write all responses in English. Use professional golf terminology.',
    };
    return instructions[language] || instructions['ko']; // 기본값 영어
  }

  /**
   * (RAG 확장용) 검색된 문서를 프롬프트에 추가하는 함수
   */
  augmentWithRAG(basePrompt: string, retrievedDocs: string[]): string {
    if (!retrievedDocs || retrievedDocs.length === 0) return basePrompt;

    const ragContext = `
## 참고 자료 (전문가 지식)
${retrievedDocs.map((doc, i) => `${i + 1}. ${doc}`).join('\n')}

위 전문 자료를 참고하여 더 구체적인 피드백을 제공하세요.
`;

    return basePrompt + '\n\n' + ragContext;
  }
}
