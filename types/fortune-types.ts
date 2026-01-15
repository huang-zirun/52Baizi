export interface HideHeavenInfo {
    heavenStem: string;
    tenStar: string;
}

export interface FortuneBaseInfo {
    name: string; // e.g. "Year 2024", "Month 1"
    ganZhi: string; // e.g. "JiaChen"
    gan: string;
    zhi: string;
    tenStar: string; // Ten Star of the Stem (relative to Day Master)
    earthlyBranch: string; // Earthly Branch name (same as zhi?) Maybe user means "DiShi" (12 Stages of Life)?
    // User Prompt: "Grid display items (Ten Star, DiShi (Earthly Branch Stage), Self Seat, NaYin, Hidden Stems)"
    diShi: string; // 12 Life Stages
    ziZuo: string; // Self Seat (Ten Star of Branch? Or just Branch?) Usually "Self Seat" implies the relationship of the stem to the branch or the Ten Star of the branch relative to stem? Or Ten Star of Branch relative to Day Master? 
    // In Bazi, "Zi Zuo" usually means the 12 Life Stage of the Stem on the Branch. 
    // BUT "DiShi" usually refers to that. 
    // Maybe "Zi Zuo" means the Ten Stars of the hidden stems in the branch.
    // Let's assume:
    // Ten Star: Stem's Ten Star relative to Day Master
    // DiShi: Stem's 12 Life Stage on Branch (or Day Master's 12 Life Stage on Branch?)
    //   - For Decade/Year/Month, usually it's Day Master's stage on that branch.
    // NaYin: NaYin Element of the pillar.
    // Hidden Stems: List of stems inside the branch.
    naYin: string;
    hiddenStems: HideHeavenInfo[];
    kongWang?: string; // 空亡地支，格式："戌、亥"
    fullLabel?: string; // Optional label
    year?: number; // For flow year
    age?: number; // For flow year
    scope?: string; // date range for decade
}

export interface FlowMonthInfo extends FortuneBaseInfo {
    monthIndex: number;
}

export interface FlowYearInfo extends FortuneBaseInfo {
    year: number;
    age: number;
    months: FlowMonthInfo[];
}

export interface DecadeFortuneData extends FortuneBaseInfo {
    startAge: number; // e.g. 4
    endAge: number;   // e.g. 13
    startYear: number;
    endYear: number;
    years: FlowYearInfo[];
}

// Result structure to be stored in the state
export interface BaziFortuneResult {
    childLimit: any; // Keep 'any' or specific type if needed, mainly for reference
    decades: DecadeFortuneData[];
}
