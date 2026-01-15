import { NextRequest, NextResponse } from "next/server";
import { analyzeFortuneWithAI } from "@/lib/services/openai-service";
import {
    calculateBazi,
    calculateDecadeFortunes,
    getBaziCalculationContext,
} from "@/lib/services/bazi/bazi-service";
import { Gender } from "tyme4ts";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            year,
            month,
            day,
            hour,
            minute,
            place,
            gender,
            selectedDecadeIndex,
            selectedYearIndex,
        } = body;

        // Validate required fields
        if (!year || !month || !day || hour === undefined || minute === undefined) {
            return NextResponse.json(
                { error: "Missing required birth information" },
                { status: 400 }
            );
        }

        // Calculate Bazi data
        const baziData = await calculateBazi(
            year,
            month,
            day,
            hour,
            minute,
            place || "",
            gender || "male"
        );

        // Get calculation context for decade fortunes
        const context = await getBaziCalculationContext(
            year,
            month,
            day,
            hour,
            minute,
            place || "",
            gender || "male"
        );

        // Calculate decade fortunes
        const decadeData = await calculateDecadeFortunes(
            context.solarTime,
            context.gender
        );

        // Call OpenAI service for AI analysis
        const analysisResult = await analyzeFortuneWithAI(
            baziData,
            context.solarTime,
            decadeData,
            selectedDecadeIndex,
            selectedYearIndex
        );

        return NextResponse.json(analysisResult);
    } catch (error: any) {
        console.error("Fortune analysis API error:", error);

        // Handle specific error types
        if (error.message?.includes("OPENAI_API_KEY")) {
            return NextResponse.json(
                { error: "OpenAI API key is not configured" },
                { status: 500 }
            );
        }

        if (error.message?.includes("Failed to analyze fortune")) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error during fortune analysis" },
            { status: 500 }
        );
    }
}
