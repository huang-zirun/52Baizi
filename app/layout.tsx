import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "52Baizi - 八字排盘与运势分析",
    description: "专业的八字排盘与流年运势分析工具"
}

interface RootLayoutProps {
    children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => (
    <html lang="zh-CN">
        <body className={inter.className}>{children}</body>
    </html>
)

export default RootLayout
