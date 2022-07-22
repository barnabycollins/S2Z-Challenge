export interface MonthDate {
    month: number,
    year: number
};

export interface OffsetPlanEntry {
    date: MonthDate,
    trees: number
};

export interface FormDataType {
    estimatedProduction: number,
    offsetPlan: OffsetPlanEntry[]
}
