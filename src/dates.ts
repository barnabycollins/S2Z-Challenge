import { MonthDate } from './constructs';

export function monthsBetween(from: MonthDate, to: MonthDate): number {
    return (to.year - from.year)*12 + (to.month - from.month);
}

export function getDateText(date: MonthDate): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.month-1]} ${date.year}`;
}