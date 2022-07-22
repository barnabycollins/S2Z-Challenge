export interface MonthDate {
    month: number,
    year: number
};

export interface OffsetPlanEntry {
    date: MonthDate,
    trees: number
};

export interface FormDataType {
    estimatedConsumption: number,
    offsetPlan: OffsetPlanEntry[]
}
