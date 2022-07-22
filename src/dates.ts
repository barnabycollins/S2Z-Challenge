import { MonthDate } from './constructs';

export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;
export const CURRENT_MONTHDATE: MonthDate = {
	month: CURRENT_MONTH,
	year: CURRENT_YEAR
};

const YEAR_LOOKAHEAD = 10*12; // 10 years

export const currentMonthRange = generateMonthRange();
console.log(currentMonthRange);

export function monthsBetween(from: MonthDate, to: MonthDate): number {
	return (to.year - from.year)*12 + (to.month - from.month);
}

export function getDateText(date: MonthDate): string {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return `${months[date.month-1]} ${date.year}`;
}

export function generateMonthRange() {
	let months: MonthDate[] = [];

	let curMonth: MonthDate = CURRENT_MONTHDATE;
	months.push(curMonth);

	while (months.length < YEAR_LOOKAHEAD) {
		curMonth = {
      ...curMonth,
      month: curMonth.month + 1
    };

		if (curMonth.month > 12) {
			curMonth = {
				month: 1,
				year: curMonth.year + 1
			};
		}

		console.log(JSON.stringify(curMonth));

		months.push(curMonth);
	}

	return months
}