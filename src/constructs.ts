export interface MonthDate {
    /**
     * A simplified interface for storing a month.
     * Relevant operations can be found in dates.ts.
     */

    month: number,
    year: number
};

export interface OffsetPlanEntry {
    /**
     * An interface representing a single purchase of trees in an offset plan.
     */

    date: MonthDate,
    trees: number
};
