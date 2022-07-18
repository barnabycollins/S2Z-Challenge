interface monthDate {
    month: number,
    year: number
};

function monthsBetween(from: monthDate, to: monthDate): number {
    return (to.year - from.year)*12 + (to.month - from.month);
}
