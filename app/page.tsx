import Link from "next/link"
import { Button } from "@/components/ui/button"

const HomePage = () => (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-slate-900">
        <div className="text-center space-y-6">
            <h1 className="text-4xl font-light tracking-[0.2em] text-slate-800">52Baizi</h1>

            <p className="text-lg text-slate-500 font-light tracking-wide">
                八字排盘与流年运势分析系统
            </p>

            <div className="flex justify-center pt-8">
                <Link href="/bazi">
                    <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white rounded-full px-8 tracking-widest font-light shadow-lg hover:shadow-xl transition-all">
                        开始排盘
                    </Button>
                </Link>
            </div>
        </div>
    </main>
)

export default HomePage
