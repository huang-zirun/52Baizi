"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface BaziFormProps {
    onSubmit: (data: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        place: string;
        gender: string;
    }) => void;
    isLoading: boolean;
}

export function BaziForm({ onSubmit, isLoading }: BaziFormProps) {
    const [formData, setFormData] = useState({
        year: "",
        month: "",
        day: "",
        time: "12:00", // Default time
        place: "",
        gender: "male",
    })

    const handleSubmit = () => {
        const y = parseInt(formData.year)
        const m = parseInt(formData.month)
        const d = parseInt(formData.day)

        // Parse time
        const [hStr, minStr] = formData.time.split(":")
        const h = parseInt(hStr)
        const min = parseInt(minStr)

        if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h) || isNaN(min)) {
            alert("请输入完整的日期和时间")
            return
        }

        onSubmit({
            year: y,
            month: m,
            day: d,
            hour: h,
            minute: min,
            place: formData.place,
            gender: formData.gender
        })
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="year" className="text-stone-600">出生年份</Label>
                    <Input
                        id="year"
                        placeholder="2024"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="bg-stone-50 border-stone-200 focus:border-stone-400 focus:ring-stone-200 transition-all font-light"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="month" className="text-stone-600">出生月份</Label>
                    <Input
                        id="month"
                        placeholder="1"
                        type="number"
                        min="1"
                        max="12"
                        value={formData.month}
                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                        className="bg-stone-50 border-stone-200 focus:border-stone-400 focus:ring-stone-200 transition-all font-light"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="day" className="text-stone-600">出生日期</Label>
                    <Input
                        id="day"
                        placeholder="1"
                        type="number"
                        min="1"
                        max="31"
                        value={formData.day}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        className="bg-stone-50 border-stone-200 focus:border-stone-400 focus:ring-stone-200 transition-all font-light"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time" className="text-stone-600">出生时间</Label>
                    <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="bg-stone-50 border-stone-200 focus:border-stone-400 focus:ring-stone-200 transition-all font-light"
                    />
                </div>
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="place" className="text-stone-600">出生地点 (城市)</Label>
                    <Input
                        id="place"
                        placeholder="例如：北京"
                        value={formData.place}
                        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                        className="bg-stone-50 border-stone-200 focus:border-stone-400 focus:ring-stone-200 transition-all font-light"
                    />
                    <p className="text-xs text-stone-400 font-light">用于计算真太阳时，如不填默认为北京时间</p>
                </div>
                <div className="space-y-2 col-span-2">
                    <Label className="text-stone-600">性别</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={() => setFormData({ ...formData, gender: 'male' })}
                                className="accent-stone-700 w-4 h-4"
                            />
                            <span className="text-sm font-light text-stone-700">男</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={() => setFormData({ ...formData, gender: 'female' })}
                                className="accent-stone-700 w-4 h-4"
                            />
                            <span className="text-sm font-light text-stone-700">女</span>
                        </label>
                    </div>
                </div>
            </div>

            <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-stone-800 hover:bg-stone-700 text-white font-light tracking-widest shadow-md hover:shadow-lg transition-all"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        计算中...
                    </>
                ) : (
                    "排盘"
                )}
            </Button>
        </div>
    )
}
