"use client";

import { useState } from "react";
import { FortuneAnalysisResult } from "@/types/fortune-analysis-types";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface FortuneAnalysisProps {
    birthInfo: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        place: string;
        gender: string;
    };
    selectedDecadeIndex?: number;
    selectedYearIndex?: number;
}

interface AnalysisSection {
    title: string;
    key: keyof Omit<FortuneAnalysisResult, "rawContent">;
    icon: string;
}

const analysisSections: AnalysisSection[] = [
    { title: "命理总论", key: "summary", icon: "🔮" },
    { title: "健康情况", key: "health", icon: "💊" },
    { title: "亲情分析", key: "family", icon: "👨‍👩‍👧‍👦" },
    { title: "财运分析", key: "wealth", icon: "💰" },
    { title: "事业分析", key: "career", icon: "💼" },
    { title: "子女情况", key: "children", icon: "👶" },
    { title: "性格情况", key: "personality", icon: "🎭" },
    { title: "命理启示", key: "revelation", icon: "✨" },
];

export default function FortuneAnalysis({
    birthInfo,
    selectedDecadeIndex,
    selectedYearIndex,
}: FortuneAnalysisProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FortuneAnalysisResult | null>(null);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(analysisSections.map((s) => s.key))
    );
    const [showRawContent, setShowRawContent] = useState(false);

    const toggleSection = (key: string) => {
        setExpandedSections((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("/api/fortune-analysis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...birthInfo,
                    selectedDecadeIndex,
                    selectedYearIndex,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to analyze fortune");
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || "An error occurred during analysis");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Analyze Button */}
            {!result && (
                <div className="flex justify-center">
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                AI分析中...
                            </span>
                        ) : (
                            "开始AI命理分析"
                        )}
                    </button>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">分析失败</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
            )}

            {/* Analysis Result */}
            {result && (
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            AI命理分析结果
                        </h2>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            重新分析
                        </button>
                    </div>

                    {/* Analysis Sections */}
                    <div className="space-y-3">
                        {analysisSections.map((section) => {
                            const isExpanded = expandedSections.has(section.key);
                            const content = result[section.key];

                            return (
                                <div
                                    key={section.key}
                                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Section Header */}
                                    <button
                                        onClick={() => toggleSection(section.key)}
                                        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{section.icon}</span>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {section.title}
                                            </h3>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-600" />
                                        )}
                                    </button>

                                    {/* Section Content */}
                                    {isExpanded && (
                                        <div className="px-6 py-5 bg-white">
                                            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {content || "暂无内容"}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Raw Content Toggle */}
                    <div className="border-t pt-4">
                        <button
                            onClick={() => setShowRawContent(!showRawContent)}
                            className="text-sm text-gray-600 hover:text-gray-800 underline"
                        >
                            {showRawContent ? "隐藏AI完整原始内容" : "显示AI完整原始内容"}
                        </button>

                        {showRawContent && (
                            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto">
                                    {result.rawContent}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
