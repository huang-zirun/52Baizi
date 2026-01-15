/**
 * <ai_context>
 * Type definitions for bazi (八字) calculations.
 * These types are used by the bazi service and components.
 * </ai_context>
 */

/**
 * Gender type for bazi calculations
 */
export type Gender = "male" | "female"

/**
 * Birth information input for bazi calculation
 */
export interface BirthInfo {
    year: number
    month: number
    day: number
    hour: number
    minute?: number
    gender: Gender
    birthPlace?: string
}

/**
 * A single pillar (柱) consisting of heavenly stem (天干) and earthly branch (地支)
 */
export interface Pillar {
    stem: string // 天干
    branch: string // 地支
    stemElement: string // 天干五行
    branchElement: string // 地支五行
}

/**
 * Complete bazi chart result (四柱八字)
 */
export interface BaziChart {
    yearPillar: Pillar // 年柱
    monthPillar: Pillar // 月柱
    dayPillar: Pillar // 日柱
    hourPillar: Pillar // 时柱
    dayMaster: string // 日主
    dayMasterElement: string // 日主五行
}

/**
 * Luck period (大运) information
 */
export interface LuckPeriod {
    startAge: number
    endAge: number
    stem: string
    branch: string
    element: string
}

/**
 * Annual fortune (流年) information
 */
export interface AnnualFortune {
    year: number
    stem: string
    branch: string
    element: string
}
