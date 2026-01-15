import { SolarTime, EightChar, HeavenStem, EarthBranch, SixtyCycle, ChildLimit, DecadeFortune, Fortune, Gender } from "tyme4ts"
import { getLocationCoordinates, calculateTrueSolarTime } from "../location-service"
import { DecadeFortuneData, FlowYearInfo, FlowMonthInfo, HideHeavenInfo } from "@/types/fortune-types"

export interface PillarInfo {
    ganZhi: string;
    gan: string;
    zhi: string;
    zodiac: string;
    element: string; // NaYin
    tenStar: string; // Ten Star
}

export interface BaziResult {
    yearPillar: PillarInfo;
    monthPillar: PillarInfo;
    dayPillar: PillarInfo;
    hourPillar: PillarInfo;
    trueSolarTime: string;
    dayMaster: string;
    gender: string;
    birthPlace?: string;
    solarTimeObject?: SolarTime;
}

export interface BaziCalculationContext {
    solarTime: SolarTime;
    eightChar: EightChar;
    gender: Gender;
    dayGan: HeavenStem;
}

export async function getBaziCalculationContext(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    place: string,
    genderStr: string
): Promise<BaziCalculationContext> {
    let longitude = 120;
    if (place) {
        const coords = await getLocationCoordinates(place);
        if (coords) {
            longitude = coords.longitude;
        }
    }

    const tst = calculateTrueSolarTime(year, month, day, hour, minute, longitude);
    const solarTime = SolarTime.fromYmdHms(tst.year, tst.month, tst.day, tst.hour, tst.minute, 0);
    const lunarHour = solarTime.getLunarHour();
    const eightChar = lunarHour.getEightChar();

    const gender = genderStr === "female" ? Gender.WOMAN : Gender.MAN;
    const dayGan = eightChar.getDay().getHeavenStem();

    return {
        solarTime,
        eightChar,
        gender,
        dayGan
    };
}

export async function calculateBazi(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    place: string,
    genderStr: string = "male"
): Promise<BaziResult> {
    const context = await getBaziCalculationContext(year, month, day, hour, minute, place, genderStr);
    const { eightChar, dayGan, solarTime } = context;

    const formatPillar = (pillar: SixtyCycle, isDayPillar: boolean = false): PillarInfo => {
        const gan = pillar.getHeavenStem();
        const zhi = pillar.getEarthBranch();

        let tenStar = "";
        if (!isDayPillar) {
            tenStar = dayGan.getTenStar(gan).getName();
        } else {
            tenStar = "日主";
        }

        return {
            ganZhi: pillar.getName(),
            gan: gan.getName(),
            zhi: zhi.getName(),
            zodiac: zhi.getZodiac().getName(),
            element: pillar.getSound().getName(),
            tenStar: tenStar
        };
    };

    return {
        yearPillar: formatPillar(eightChar.getYear()),
        monthPillar: formatPillar(eightChar.getMonth()),
        dayPillar: formatPillar(eightChar.getDay(), true),
        hourPillar: formatPillar(eightChar.getHour()),
        trueSolarTime: `${solarTime.getYear()}-${solarTime.getMonth()}-${solarTime.getDay()} ${solarTime.getHour().toString().padStart(2, '0')}:${solarTime.getMinute().toString().padStart(2, '0')}`,
        dayMaster: dayGan.getName(),
        gender: genderStr,
        birthPlace: place,
        solarTimeObject: solarTime
    };
}

export async function calculateDecadeFortunes(
    solarTime: SolarTime,
    gender: Gender
): Promise<DecadeFortuneData[]> {
    const childLimit = ChildLimit.fromSolarTime(solarTime, gender);
    let currentDecade = childLimit.getDecadeFortune();

    const decades: DecadeFortuneData[] = [];
    const eightChar = solarTime.getLunarHour().getEightChar();
    const dayGan = eightChar.getDay().getHeavenStem();

    // Helper: Hidden Stems
    const getHiddenStems = (zhi: EarthBranch): HideHeavenInfo[] => {
        const hidden = zhi.getHideHeavenStems();
        return hidden.map((item: any) => {
            const hs = item.getHeavenStem();
            return {
                heavenStem: hs.getName(),
                tenStar: dayGan.getTenStar(hs).getName()
            };
        });
    };

    // Helper: Get KongWang (空亡) from SixtyCycle
    const getKongWang = (sixtyCycle: SixtyCycle): string => {
        const emptyBranches = sixtyCycle.getExtraEarthBranches();
        return emptyBranches.map((b: any) => b.getName()).join("、");
    };

    // Helper: Calculate Flow Months manually (Five Tigers rule)
    const getFlowMonths = (yearGan: HeavenStem): FlowMonthInfo[] => {
        const months: FlowMonthInfo[] = [];
        // Year Gan -> First Month Stem
        // Formula: MonthGanIndex = (YearGanIndex % 5) * 2 + 2

        const yearGanIndex = yearGan.getIndex();
        let monthGanIndex = (yearGanIndex % 5) * 2 + 2;
        if (monthGanIndex >= 10) monthGanIndex -= 10;

        // Branches start from Yin (Tiger = 2) for standard calendar month 1 but
        // Bazi months usually align with Solar Terms.
        // We assume standard sequence logic here matching standard Bazi charts.
        let branchIndex = 2; // Yin

        for (let m = 0; m < 12; m++) {
            const mGan = HeavenStem.fromIndex(monthGanIndex % 10);
            const mZhi = EarthBranch.fromIndex(branchIndex % 12);

            // Try to find NaYin
            const name = mGan.getName() + mZhi.getName();
            let naYin = "";
            let sixtyCycle: SixtyCycle | null = null;
            try {
                sixtyCycle = SixtyCycle.fromName(name);
                if (sixtyCycle) naYin = sixtyCycle.getSound().getName();
            } catch (e) {
                // Ignore
            }

            months.push({
                name: name,
                ganZhi: name,
                gan: mGan.getName(),
                zhi: mZhi.getName(),
                tenStar: dayGan.getTenStar(mGan).getName(),
                earthlyBranch: mZhi.getName(),
                diShi: dayGan.getTerrain(mZhi).getName(),
                ziZuo: mGan.getTerrain(mZhi).getName(),
                naYin: naYin,
                hiddenStems: getHiddenStems(mZhi),
                kongWang: sixtyCycle ? getKongWang(sixtyCycle) : "",
                monthIndex: m + 1
            });

            monthGanIndex++;
            branchIndex++;
        }
        return months;
    };

    // Generate 8 decades
    for (let i = 0; i < 8; i++) {
        if (!currentDecade) break;

        const decadeGan = currentDecade.getSixtyCycle().getHeavenStem();
        const decadeZhi = currentDecade.getSixtyCycle().getEarthBranch();

        const years: FlowYearInfo[] = [];

        let flowYear = currentDecade.getStartFortune();
        for (let y = 0; y < 10; y++) {
            const yearGanZhi = flowYear.getSixtyCycle();
            const yearGan = yearGanZhi.getHeavenStem();
            const yearZhi = yearGanZhi.getEarthBranch();

            const age = flowYear.getAge();
            const currentYearVal = solarTime.getYear() + age;

            const months = getFlowMonths(yearGan);

            years.push({
                name: currentYearVal + " " + yearGanZhi.getName(),
                ganZhi: yearGanZhi.getName(),
                gan: yearGan.getName(),
                zhi: yearZhi.getName(),
                tenStar: dayGan.getTenStar(yearGan).getName(),
                earthlyBranch: yearZhi.getName(),
                diShi: dayGan.getTerrain(yearZhi).getName(),
                ziZuo: yearGan.getTerrain(yearZhi).getName(),
                naYin: flowYear.getSixtyCycle().getSound().getName(),
                hiddenStems: getHiddenStems(yearZhi),
                kongWang: getKongWang(flowYear.getSixtyCycle()),
                year: currentYearVal,
                age: age,
                months
            });

            flowYear = flowYear.next(1);
        }

        decades.push({
            name: currentDecade.getName(),
            ganZhi: currentDecade.getName(),
            gan: decadeGan.getName(),
            zhi: decadeZhi.getName(),
            tenStar: dayGan.getTenStar(decadeGan).getName(),
            earthlyBranch: decadeZhi.getName(),
            diShi: dayGan.getTerrain(decadeZhi).getName(),
            ziZuo: decadeGan.getTerrain(decadeZhi).getName(),
            naYin: currentDecade.getSixtyCycle().getSound().getName(),
            hiddenStems: getHiddenStems(decadeZhi),
            kongWang: getKongWang(currentDecade.getSixtyCycle()),
            startAge: currentDecade.getStartAge(),
            endAge: currentDecade.getEndAge(),
            startYear: currentDecade.getStartLunarYear().getYear(),
            endYear: currentDecade.getEndLunarYear().getYear(),
            years
        });

        currentDecade = currentDecade.next(1);
    }

    return decades;
}
