"use client"

import { BaziResult, PillarInfo } from "@/lib/services/bazi/bazi-service"

interface BaziDisplayProps {
    result: BaziResult;
}

const PillarDisplay = ({ name, info }: { name: string, info: PillarInfo }) => (
    <div className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-stone-50 transition-colors">
        <span className="text-xs text-stone-400 uppercase tracking-wider mb-2">{name}</span>

        {/* Ten Star (Main Star) */}
        <span className="text-xs text-stone-500 font-light h-4">{info.tenStar}</span>

        {/* Gan (Heavenly Stem) */}
        <span className="text-xl font-serif text-stone-800">{info.gan}</span>

        {/* Zhi (Earthly Branch) */}
        <span className="text-xl font-serif text-stone-800">{info.zhi}</span>

        {/* Hidden Components or other details can go here if needed */}

        <div className="w-8 h-px bg-stone-200 my-1"></div>

        {/* Zodiac */}
        <span className="text-xs text-stone-500 font-light">{info.zodiac}</span>

        {/* Element (NaYin) */}
        <span className="text-[10px] text-stone-400 font-light scale-90">{info.element}</span>
    </div>
)

export function BaziDisplay({ result }: BaziDisplayProps) {
    return (
        <div className="mt-8 pt-6 border-t border-stone-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-center text-lg font-light text-stone-400 mb-2 tracking-[0.2em] uppercase text-xs">命盘信息</h3>

            {/* Info Bar */}
            <div className="flex justify-center flex-wrap gap-4 mb-6 text-xs text-stone-500 font-light">
                <span className="px-3 py-1 bg-stone-100 rounded-full">
                    真太阳时: {result.trueSolarTime}
                </span>
                <span className="px-3 py-1 bg-stone-100 rounded-full">
                    {result.birthPlace || "未知地点"}
                </span>
                <span className="px-3 py-1 bg-stone-100 rounded-full">
                    日主: {result.dayMaster}
                </span>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
                <PillarDisplay name="年柱" info={result.yearPillar} />
                <PillarDisplay name="月柱" info={result.monthPillar} />
                <PillarDisplay name="日柱" info={result.dayPillar} />
                <PillarDisplay name="时柱" info={result.hourPillar} />
            </div>
        </div>
    )
}
