import OpenAI from "openai";
import { SolarTime } from "tyme4ts";
import { FortuneAnalysisResult } from "@/types/fortune-analysis-types";
import { BaziResult } from "./bazi/bazi-service";
import { DecadeFortuneData } from "@/types/fortune-types";

/**
 * OpenAI Service for AI-powered Bazi Fortune Analysis
 */

// Build system prompt - defines AI as expert fortune teller
function buildSystemPrompt(): string {
    return `🕯️【资深命理师人格提示词 / AI System Prompt】

角色定位：
你是一位拥有极高造诣的中国传统命理师，通晓八字命理学、五行生克、十神格局、调候取用、从格真假、神煞流通、大运流年推演。
你研习《滴天髓》《渊海子平》《子平真诠》《穷通宝鉴》等古籍多年,融汇古今，理解命理之"气势"与"平衡"之道。
你洞察人性、气运与命格的微妙流转，分析命局如观山水，深远而透彻。

【分析原则】

当用户提供八字（年、月、日、时、性别，可附出生地），你应依以下步骤逐层推断：

整体气势判断：

先观月令，定旺衰根基；

次看日主得令与否，察天干透出、地支藏干生克；

论格局成败、从化真假；

判断命局总体结构（成格、破格、从格、假从、化格、调候失衡等）。

用神与喜忌分析：

明确日主所需之气势、五行喜忌；

判断取用是否得力、是否顺势、是否违气。

六大主题详析（每一项都须结合命局、气势与十神）：

健康情况

判断五行偏枯或过旺之处；

观财官食伤印比之平衡；

指出身体易感之部位、气血阴阳倾向；

若岁运引动病象，指出可能年份与调理建议。

亲情分析

以印星、比劫看父母缘；

以财星、食伤观夫妻关系与情感取向；

观兄弟宫、年支、月支定家庭和睦程度；

分析命主在家庭中的位置与情感依附。

财运分析

以财星旺衰与通关状况为核心；

看偏财、正财得否透根、受制、化泄；

结合大运流年，推断财富积聚或流散之时机；

提示理财方式与财富来源倾向（动财、静财、偏业或正业）。

事业分析

以官杀星为核心，辅以印星、食伤、财星；

判断事业成就、职位高低、名声显隐；

若官杀混杂，论事业压力与权力斗争；

结合岁运看事业关键转折与发展周期。

子女情况

以食伤为子女星，观其旺衰与受制情况；

判断子女缘分深浅、数量倾向、性格特征；

若岁运冲克子女宫，提示注意子女健康或关系波动。

性格情况

以日主五行与格局结构为主；

结合十神气势，看性格核心特质（刚柔、理性、情绪、权力心等）；

可提炼其处世态度、人际模式与情感表达方式。

【风格与语言要求】

用语应深刻、稳重、含哲理，如传统命理师口吻；

叙述清晰、条理严谨、推理有序；

断语应"有据可循"，可引用命理古语佐证；

结论不宜绝对，以"趋向"、"可能"、"气势流转"表述；

末尾可附"命理启示"一句，点出命主一生之主调或修行方向。

【示例格式（输出模板）】

命理总论：
（简述八字结构、旺衰、格局、气势流转、总体命象）

一、健康情况：
（五行偏枯、易感病象、身体倾向、岁运引动等）

二、亲情分析：
（父母缘、婚姻情感、家庭结构、感情态度）

三、财运分析：
（财星旺衰、理财之道、财富起伏、大运走势）

四、事业分析：
（事业格局、职位倾向、成就潜质、关键流年）

五、子女情况：
（子女缘分、教育关系、性格特征）

六、性格情况：
（性格主线、优缺点、处事模式、修行建议）

命理启示：
（以哲理之语收尾，如"命非定数，唯人心可化气运"）

请严格按照用户提供的格式输出分析结果，确保包含：命理总论、健康情况、亲情分析、财运分析、事业分析、子女情况、性格情况、命理启示这八个部分。这八个部分要尽可能详细尽可能多的输出分析内容`;
}

// Build user prompt with detailed Bazi information
function buildUserPrompt(
    baziData: BaziResult,
    solarTime: SolarTime,
    decadeData: DecadeFortuneData[],
    selectedDecadeIndex?: number,
    selectedYearIndex?: number
): string {
    // Use the solarTime object directly (passed from caller)
    // Note: baziData.trueSolarTime is the ADJUSTED true solar time string,
    // while solarTime is the SolarTime object used for calculations

    const lunar = solarTime.getSolarDay().getLunarDay();
    const lunarDate = `${lunar.getYear()}年${lunar.getMonth()}月${lunar.getDay()}日`;

    // Calculate five elements count
    const eightChar = solarTime.getLunarHour().getEightChar();
    const allStems = [
        eightChar.getYear().getHeavenStem(),
        eightChar.getMonth().getHeavenStem(),
        eightChar.getDay().getHeavenStem(),
        eightChar.getHour().getHeavenStem(),
    ];

    const allBranches = [
        eightChar.getYear().getEarthBranch(),
        eightChar.getMonth().getEarthBranch(),
        eightChar.getDay().getEarthBranch(),
        eightChar.getHour().getEarthBranch(),
    ];

    // Count elements
    const elementCounts: Record<string, number> = {
        木: 0,
        火: 0,
        土: 0,
        金: 0,
        水: 0,
    };

    // Count from stems
    allStems.forEach((stem) => {
        const element = stem.getElement().getName();
        elementCounts[element]++;
    });

    // Count from branches
    allBranches.forEach((branch) => {
        const element = branch.getElement().getName();
        elementCounts[element]++;
    });

    // Count from hidden stems
    allBranches.forEach((branch) => {
        const hiddenStems = branch.getHideHeavenStems();
        hiddenStems.forEach((hs: any) => {
            const element = hs.getHeavenStem().getElement().getName();
            elementCounts[element]++;
        });
    });

    // Count ten stars
    const dayGan = eightChar.getDay().getHeavenStem();
    const tenStarCounts: Record<string, number> = {};

    const countTenStar = (stem: any) => {
        const tenStar = dayGan.getTenStar(stem).getName();
        tenStarCounts[tenStar] = (tenStarCounts[tenStar] || 0) + 1;
    };

    // Count ten stars from stems
    allStems.forEach(countTenStar);

    // Count ten stars from hidden stems
    allBranches.forEach((branch) => {
        const hiddenStems = branch.getHideHeavenStems();
        hiddenStems.forEach((hs: any) => {
            countTenStar(hs.getHeavenStem());
        });
    });

    const tenStarCountsStr = Object.entries(tenStarCounts)
        .map(([star, count]) => `${star}: ${count}个`)
        .join("\n");

    // 获取日柱空亡（旬空）- 原局空亡从日柱干支计算
    const dayPillarEmptyBranches = eightChar.getDay().getExtraEarthBranches();
    const dayKongWang = dayPillarEmptyBranches.map((b: any) => b.getName()).join("、");

    // Helper function to format pillar details
    const formatPillarDetails = (
        pillarName: string,
        pillar: any,
        isDayPillar: boolean = false
    ) => {
        const gan = pillar.getHeavenStem();
        const zhi = pillar.getEarthBranch();
        const hiddenStems = zhi.getHideHeavenStems();

        const hiddenStemsStr = hiddenStems
            .map((hs: any) => {
                const hstem = hs.getHeavenStem();
                const tenStar = dayGan.getTenStar(hstem).getName();
                return `${hstem.getName()}(${tenStar})`;
            })
            .join("、");

        const tenStar = isDayPillar ? "日主" : dayGan.getTenStar(gan).getName();
        const starLuck = dayGan.getTerrain(zhi).getName();
        const selfSit = gan.getTerrain(zhi).getName();

        // 判断当前柱的地支是否落入空亡
        const isKongWang = dayPillarEmptyBranches.some((b: any) => b.getName() === zhi.getName());
        const kongWangStatus = isKongWang ? `是（${dayKongWang}）` : `否（空亡：${dayKongWang}）`;

        return `${pillarName}柱：${pillar.getName()}
  天干：${gan.getName()}（${gan.getElement().getName()}）
  地支：${zhi.getName()}（${zhi.getElement().getName()}，生肖：${zhi
                .getZodiac()
                .getName()}）
  十神：${tenStar}
  藏干：${hiddenStemsStr}
  星运（日干对${pillarName === "日" ? "日" : pillarName}支）：${starLuck}
  自坐（${pillarName}干对${pillarName}支）：${selfSit}
  落空：${kongWangStatus}
  纳音：${pillar.getSound().getName()}`;
    };

    let prompt = `【出生信息】
公历日期：${solarTime.getYear()}年${solarTime.getMonth()}月${solarTime.getDay()}日
农历日期：${lunarDate}
真太阳时：${baziData.trueSolarTime}
出生地点：${baziData.birthPlace || "未提供"}
性别：${baziData.gender === "male" ? "男" : "女"}

【四柱八字详细排盘】

${formatPillarDetails("年", eightChar.getYear())}

${formatPillarDetails("月", eightChar.getMonth())}

${formatPillarDetails("日", eightChar.getDay(), true)}【日主】

${formatPillarDetails("时", eightChar.getHour())}

【五行统计】（包含天干、地支、藏干）
木：${elementCounts["木"]}个
火：${elementCounts["火"]}个
土：${elementCounts["土"]}个
金：${elementCounts["金"]}个
水：${elementCounts["水"]}个

【十神统计】（包含天干、藏干）
${tenStarCountsStr}

【重要宫位】
年柱：祖上、父母、早年运势
月柱：父母、兄弟、青年运势、月令（判断旺衰的关键）
日柱：日主、夫妻宫、中年运势
时柱：子女、晚年运势

【大运流年详细排盘】
`;

    // Add decade fortune details
    if (decadeData && decadeData.length > 0) {
        const decadeIndex =
            selectedDecadeIndex !== undefined ? selectedDecadeIndex : 0;
        const decade = decadeData[decadeIndex];

        if (decade) {
            const hiddenStemsStr = decade.hiddenStems
                .map((hs) => `${hs.heavenStem}(${hs.tenStar})`)
                .join("、");

            // 计算大运空亡
            const decadeKongWang = decade.kongWang || "未计算";

            prompt += `
【${decade.ganZhi}大运】
时间：${decade.startYear}年-${decade.endYear}年（${decade.startAge}岁-${decade.endAge}岁）
大运干支：${decade.ganZhi}
大运十神：${decade.tenStar}
大运星运（日干对大运支）：${decade.diShi}
大运自坐（大运干对大运支）：${decade.ziZuo}
大运纳音：${decade.naYin}
大运空亡：${decadeKongWang}
大运藏干：${hiddenStemsStr}

流年详情：
`;

            // Add selected year or first 3 years
            const yearsToShow =
                selectedYearIndex !== undefined
                    ? [decade.years[selectedYearIndex]]
                    : decade.years.slice(0, 3);

            yearsToShow.forEach((year) => {
                if (!year) return;

                const yearHiddenStems = year.hiddenStems
                    .map((hs) => `${hs.heavenStem}(${hs.tenStar})`)
                    .join("、");

                const flowMonths = year.months
                    .slice(0, 6)
                    .map((m) => m.ganZhi)
                    .join("、");

                // 计算流年空亡
                const yearKongWang = year.kongWang || "未计算";

                prompt += `  ${year.ganZhi}流年（${year.year}年，${year.age}岁）：
    流年干支：${year.ganZhi}
    流年十神：${year.tenStar}
    流年星运：${year.diShi}
    流年自坐：${year.ziZuo}
    流年纳音：${year.naYin}
    流年空亡：${yearKongWang}
    流年藏干：${yearHiddenStems}
    前6个月流月：${flowMonths}

`;
            });
        }
    }

    prompt += `
【分析要求】

请根据以上详尽的八字、大运、流年信息，进行深度命理分析。分析时请注意：

1. 结合月令判断日主旺衰，分析格局成败
2. 观察五行分布是否平衡，找出偏枯或过旺的五行
3. 统计十神分布，分析十神配置对命局的影响
4. 结合大运流年的十神、星运、纳音等信息，分析运势起伏
5. 特别注意流年流月对命局的引动作用
6. 结合空亡、自坐、星运等细节信息，做出更精准的判断

请按照以下格式进行详细分析：

命理总论：
（详细分析八字结构、日主旺衰、格局类型、用神喜忌、五行平衡、十神配置、气势流转、总体命象特征）

一、健康情况：
（分析五行偏枯情况、易感疾病部位、气血阴阳倾向、身体强弱、结合大运流年指出可能引发健康问题的年份和调理建议）

二、亲情分析：
（分析印星比劫看父母缘深浅、财星食伤看夫妻关系、年支月支看家庭和睦、分析命主在家庭中的位置、情感依附模式、婚姻情感走向）

三、财运分析：
（分析财星旺衰、正偏财配置、财星是否透根受制、结合大运流年分析财富积聚或流散的时机、理财方式建议、财富来源倾向）

四、事业分析：
（分析官杀星配置、印星食伤财星对事业的影响、事业格局高低、职位倾向、名声显隐、结合大运流年指出事业关键转折点和发展周期）

五、子女情况：
（分析食伤星旺衰、子女缘分深浅、数量倾向、子女性格特征、结合大运流年分析子女健康或关系波动）

六、性格情况：
（分析日主五行特性、格局结构对性格的影响、十神配置反映的性格特质、处世态度、人际模式、情感表达方式、优缺点、修行建议）

命理启示：
（以深刻哲理之语收尾，点出命主一生之主调、修行方向、人生启示）

每个部分尽可能多的输出详细的分析内容`;

    return prompt;
}

// Parse AI response into structured result
function parseAnalysisResult(content: string): FortuneAnalysisResult {
    const result: FortuneAnalysisResult = {
        summary: "",
        health: "",
        family: "",
        wealth: "",
        career: "",
        children: "",
        personality: "",
        revelation: "",
        rawContent: content,
    };

    // Extract sections using regex patterns
    const extractSection = (
        pattern: RegExp,
        defaultValue: string = ""
    ): string => {
        const match = content.match(pattern);
        return match ? match[1].trim() : defaultValue;
    };

    // Extract 命理总论
    result.summary = extractSection(
        /命理总论[：:]\s*([\s\S]*?)(?=\n\s*[一二三四五六七八]、|$)/i
    );

    // Extract 健康情况
    result.health = extractSection(
        /[一1]、?\s*健康情况[：:]\s*([\s\S]*?)(?=\n\s*[二三四五六七八]、|$)/i
    );

    // Extract 亲情分析
    result.family = extractSection(
        /[二2]、?\s*亲情分析[：:]\s*([\s\S]*?)(?=\n\s*[三四五六七八]、|$)/i
    );

    // Extract 财运分析
    result.wealth = extractSection(
        /[三3]、?\s*财运分析[：:]\s*([\s\S]*?)(?=\n\s*[四五六七八]、|$)/i
    );

    // Extract 事业分析
    result.career = extractSection(
        /[四4]、?\s*事业分析[：:]\s*([\s\S]*?)(?=\n\s*[五六七八]、|$)/i
    );

    // Extract 子女情况
    result.children = extractSection(
        /[五5]、?\s*子女情况[：:]\s*([\s\S]*?)(?=\n\s*[六七八]、|$)/i
    );

    // Extract 性格情况
    result.personality = extractSection(
        /[六6]、?\s*性格情况[：:]\s*([\s\S]*?)(?=\n\s*[七八]、|命理启示|$)/i
    );

    // Extract 命理启示
    result.revelation = extractSection(/命理启示[：:]\s*([\s\S]*?)$/i);

    return result;
}

// Main function to analyze fortune with AI
export async function analyzeFortuneWithAI(
    baziData: BaziResult,
    solarTime: SolarTime,
    decadeData: DecadeFortuneData[],
    selectedDecadeIndex?: number,
    selectedYearIndex?: number
): Promise<FortuneAnalysisResult> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "OPENAI_API_KEY is not configured in environment variables"
        );
    }

    // Detect API type and configure base URL
    const isOpenRouter = apiKey.startsWith("sk-or-v1-");
    const baseURL = isOpenRouter
        ? "https://openrouter.ai/api/v1"
        : "https://api.openai.com/v1";

    // Configure OpenAI client with proper settings
    const clientConfig: any = {
        apiKey,
        baseURL,
    };

    const openai = new OpenAI(clientConfig);

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(
        baziData,
        solarTime,
        decadeData,
        selectedDecadeIndex,
        selectedYearIndex
    );

    // Use correct model name based on API type
    const modelName = isOpenRouter ? "openai/gpt-4o" : "gpt-4o";

    try {
        const completion = await openai.chat.completions.create({
            model: modelName,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 4096,
        });

        const content = completion.choices[0]?.message?.content || "";

        if (!content) {
            throw new Error("No content returned from AI");
        }

        return parseAnalysisResult(content);
    } catch (error: any) {
        console.error("OpenAI API Error:", error);
        throw new Error(
            `Failed to analyze fortune: ${error.message || "Unknown error"}`
        );
    }
}
