"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateBazi, calculateDecadeFortunes, BaziResult } from "@/lib/services/bazi/bazi-service"
import { BaziForm } from "../_components/bazi-form"
import { BaziDisplay } from "../_components/bazi-display"
import { FortuneGrid } from "../_components/fortune-grid"
import FortuneAnalysis from "../_components/fortune-analysis"
import { DecadeFortuneData } from "@/types/fortune-types"
import { Gender } from "tyme4ts"

export default function BaziPage() {
    const [result, setResult] = useState<BaziResult | null>(null)
    const [decades, setDecades] = useState<DecadeFortuneData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [birthData, setBirthData] = useState<any>(null)

    const handleCalculate = async (data: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        place: string;
        gender: string;
    }) => {
        setIsLoading(true)
        setResult(null)
        setDecades([])

        try {
            // 1. Calculate main Bazi
            const res = await calculateBazi(
                data.year,
                data.month,
                data.day,
                data.hour,
                data.minute,
                data.place,
                data.gender
            )
            setResult(res)
            setBirthData(data)

            // 2. Calculate Fortune Flow (Decades, Years, Months)
            if (res.solarTimeObject) {
                const genderEnum = data.gender === "female" ? Gender.WOMAN : Gender.MAN;
                const fortuneData = await calculateDecadeFortunes(res.solarTimeObject, genderEnum);
                setDecades(fortuneData);
            }

        } catch (e) {
            console.error(e)
            alert("计算出错，请检查输入或网络连接")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-800">
            <Card className="w-full max-w-4xl shadow-xl border-stone-100 bg-white/95 backdrop-blur-sm ring-1 ring-stone-900/5 my-8">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-light tracking-wide text-center text-stone-800">52Baizi</CardTitle>
                    <CardDescription className="text-center text-stone-500 font-light tracking-widest text-xs uppercase">
                        Eight Characters & Fortune Flow
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-lg mx-auto mb-8">
                        <BaziForm onSubmit={handleCalculate} isLoading={isLoading} />
                    </div>

                    <div className="space-y-8">
                        {result && <BaziDisplay result={result} />}

                        {decades.length > 0 && <FortuneGrid decades={decades} />}

                        {/* AI Fortune Analysis */}
                        {birthData && result && (
                            <div className="mt-8 pt-8 border-t border-stone-200">
                                <FortuneAnalysis birthInfo={birthData} />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
