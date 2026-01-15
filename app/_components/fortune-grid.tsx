"use client"

import { useState, useEffect } from "react"
import { DecadeFortuneData, FlowYearInfo, FlowMonthInfo, FortuneBaseInfo } from "@/types/fortune-types"
import { cn } from "@/lib/utils"
// import { Card } from "@/components/ui/card" // Using div for lighter weight in lists

interface FortuneGridProps {
    decades: DecadeFortuneData[];
}

const ELEMENT_COLORS: Record<string, string> = {
    // 5 Elements (WuXing) - We can guess by Gan/Zhi or NaYin?
    // Usually mapping: 
    // Wood (Jia, Yi, Yin, Mao): Green
    // Fire (Bing, Ding, Si, Wu): Red
    // Earth (Wu, Ji, Chen, Xu, Chou, Wei): Brown/Yellow
    // Metal (Geng, Xin, Shen, You): Gold/Gray
    // Water (Ren, Gui, Hai, Zi): Blue/Black
    // This requires parsing the Gan/Zhi character.
    // For now, I'll just use a default style or try to be smart if Chinese chars are provided.
    // Ideally the service should provide the element 'code'.
    // Since I don't have it, I'll skip complex color logic for now and use neutral or 'stone' styles 
    // unless I can infer it. 
    // The user said "Five element colors (consistent with existing comp)". Existing comp uses 'stone'.
    // So maybe just distinct highlights?
    // I will implement a basic color map based on character string check.
    "甲": "text-green-600", "乙": "text-green-600", "寅": "text-green-600", "卯": "text-green-600",
    "丙": "text-rose-600", "丁": "text-rose-600", "巳": "text-rose-600", "午": "text-rose-600",
    "戊": "text-amber-600", "己": "text-amber-600", "辰": "text-amber-600", "戌": "text-amber-600", "丑": "text-amber-600", "未": "text-amber-600",
    "庚": "text-slate-600", "辛": "text-slate-600", "申": "text-slate-600", "酉": "text-slate-600",
    "壬": "text-blue-600", "癸": "text-blue-600", "亥": "text-blue-600", "子": "text-blue-600",
};

const getElementColor = (char: string) => ELEMENT_COLORS[char] || "text-stone-800";

const InfoItemDisplay = ({ label, value, sub }: { label: string, value: string, sub?: string }) => (
    <div className="flex flex-col items-center">
        <span className="text-[10px] text-stone-400 uppercase">{label}</span>
        <span className={cn("text-sm font-medium", getElementColor(value))}>{value}</span>
        {sub && <span className="text-[10px] text-stone-300">{sub}</span>}
    </div>
)

/* 
 * Detail Card Component
 * Displays the detailed info for a given fortune unit (Decade, Year, Month)
 */
const FortuneDetailCard = ({ info, title }: { info: FortuneBaseInfo, title: string }) => {
    if (!info) return null;
    return (
        <div className="bg-white/50 rounded-xl p-4 border border-stone-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest text-center">{title}</h4>

            <div className="flex flex-col items-center">
                {/* Main Pillar Display */}
                <div className="flex gap-4 items-end mb-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-stone-500 mb-1">{info.tenStar}</span>
                        <span className={cn("text-2xl font-serif font-bold", getElementColor(info.gan))}>{info.gan}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className={cn("text-2xl font-serif font-bold", getElementColor(info.zhi))}>{info.zhi}</span>
                        <span className="text-[10px] text-stone-500 mt-1">{info.earthlyBranch}</span>
                    </div>
                </div>
            </div>

            {/* Grid for details */}
            <div className="grid grid-cols-3 gap-2 text-center bg-stone-50/50 rounded-lg p-2">
                <InfoItemDisplay label="纳音" value={info.naYin} />
                <InfoItemDisplay label="地势" value={info.diShi} />
                <InfoItemDisplay label="自坐" value={info.ziZuo} />
            </div>

            {/* Hidden Stems */}
            <div className="pt-2 border-t border-stone-100">
                <p className="text-[10px] text-stone-400 text-center mb-1">藏干</p>
                <div className="flex justify-center gap-2">
                    {info.hiddenStems.map((h, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className={cn("text-xs font-serif", getElementColor(h.heavenStem))}>{h.heavenStem}</span>
                            <span className="text-[8px] text-stone-400">{h.tenStar}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function FortuneGrid({ decades }: FortuneGridProps) {
    const [selectedDecadeIdx, setSelectedDecadeIdx] = useState<number>(0);
    const [selectedYearIdx, setSelectedYearIdx] = useState<number>(0);
    const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(0);

    // Initial load check
    useEffect(() => {
        if (decades.length > 0) {
            // Default select roughly 'now' if possible? 
            // For now default to 0. User might want to find current year.
            // But let's stick to simple logic: Select first.
        }
    }, [decades]);

    // Reset loop when higher order selection changes
    useEffect(() => {
        setSelectedYearIdx(0);
        setSelectedMonthIdx(0);
    }, [selectedDecadeIdx]);

    useEffect(() => {
        setSelectedMonthIdx(0);
    }, [selectedYearIdx]);

    const currentDecade = decades[selectedDecadeIdx];
    const currentYear = currentDecade?.years[selectedYearIdx];
    const currentMonth = currentYear?.months[selectedMonthIdx];

    if (!decades || decades.length === 0) return null;

    return (
        <div className="mt-8 space-y-6 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-light text-stone-800 tracking-[0.2em] uppercase">运势推演</h3>
                <span className="text-xs text-stone-400 font-light">
                    选择大运、流年查看详细信息
                </span>
            </div>

            {/* Decade Selector */}
            <div className="space-y-2">
                <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wider ml-1">大运 (10年)</h4>
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent snap-x">
                    {decades.map((d, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedDecadeIdx(idx)}
                            className={cn(
                                "flex-shrink-0 min-w-[100px] p-3 rounded-xl border transition-all snap-start text-left bg-white",
                                selectedDecadeIdx === idx
                                    ? "border-stone-800 ring-1 ring-stone-800 shadow-md bg-stone-50"
                                    : "border-stone-100 hover:border-stone-300 hover:bg-stone-50/50"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={cn("text-lg font-serif font-bold", getElementColor(d.gan))}>{d.ganZhi}</span>
                                <span className="text-xs text-stone-400">{d.startAge}-{d.endAge}岁</span>
                            </div>
                            <div className="text-[10px] text-stone-400 font-light">
                                {d.startYear} - {d.endYear}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Year Selector */}
            {currentDecade && (
                <div className="space-y-2">
                    <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wider ml-1">流年 (1年)</h4>
                    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent snap-x">
                        {currentDecade.years.map((y, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedYearIdx(idx)}
                                className={cn(
                                    "flex-shrink-0 min-w-[90px] p-3 rounded-xl border transition-all snap-start text-left bg-white",
                                    selectedYearIdx === idx
                                        ? "border-stone-800 ring-1 ring-stone-800 shadow-md bg-stone-50"
                                        : "border-stone-100 hover:border-stone-300 hover:bg-stone-50/50"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={cn("text-lg font-serif font-bold", getElementColor(y.gan))}>{y.ganZhi}</span>
                                    <span className="text-xs text-stone-400">{y.age}岁</span>
                                </div>
                                <div className="text-[10px] text-stone-400 font-light">
                                    {y.year}年
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Month Selector */}
            {currentYear && (
                <div className="space-y-2">
                    <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wider ml-1">流月 (1月)</h4>
                    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent snap-x">
                        {currentYear.months.map((m, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedMonthIdx(idx)}
                                className={cn(
                                    "flex-shrink-0 min-w-[70px] p-2 rounded-xl border transition-all snap-start text-center bg-white",
                                    selectedMonthIdx === idx
                                        ? "border-stone-800 ring-1 ring-stone-800 shadow-md bg-stone-50"
                                        : "border-stone-100 hover:border-stone-300 hover:bg-stone-50/50"
                                )}
                            >
                                <div className={cn("text-lg font-serif font-bold", getElementColor(m.gan))}>{m.ganZhi}</div>
                                <div className="text-[10px] text-stone-400 font-light">{m.monthIndex}月</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Detailed Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
                {currentDecade && <FortuneDetailCard info={currentDecade} title="大运详情" />}
                {currentYear && <FortuneDetailCard info={currentYear} title="流年详情" />}
                {currentMonth && <FortuneDetailCard info={currentMonth} title="流月详情" />}
            </div>
        </div>
    )
}
