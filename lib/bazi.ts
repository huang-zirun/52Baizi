import { SolarTime } from 'tyme4ts';

export interface BaziResult {
    year: string;
    month: string;
    day: string;
    time: string;
    full: string;
}

export function calculateBazi(year: number, month: number, day: number, hour: number, minute: number): BaziResult {
    // SolarTime.fromYmdHms(year, month, day, hour, minute, second)
    const st = SolarTime.fromYmdHms(year, month, day, hour, minute, 0);
    const lh = st.getLunarHour();
    const baZi = lh.getEightChar();

    return {
        year: baZi.getYear().toString(),
        month: baZi.getMonth().toString(),
        day: baZi.getDay().toString(),
        time: baZi.getHour().toString(),
        full: baZi.toString()
    };
}
