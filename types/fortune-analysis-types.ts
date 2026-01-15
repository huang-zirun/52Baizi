/**
 * Type definitions for AI-powered fortune analysis
 */

/**
 * AI Fortune Analysis Result - structured output from AI
 */
export interface FortuneAnalysisResult {
    summary: string;        // 命理总论
    health: string;         // 健康情况
    family: string;         // 亲情分析
    wealth: string;         // 财运分析
    career: string;         // 事业分析
    children: string;       // 子女情况
    personality: string;    // 性格情况
    revelation: string;     // 命理启示
    rawContent: string;     // AI完整原始内容
}

/**
 * Fortune Analysis Request Parameters
 */
export interface FortuneAnalysisRequest {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    place: string;
    gender: string;
    selectedDecadeIndex?: number;
    selectedYearIndex?: number;
}
