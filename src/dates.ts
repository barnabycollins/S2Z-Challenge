import { MonthDate } from './constructs';

export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;
export const CURRENT_MONTHDATE: MonthDate = {
	month: CURRENT_MONTH,
	year: CURRENT_YEAR
};

const YEAR_LOOKAHEAD = 20;
const MONTH_LOOKAHEAD = YEAR_LOOKAHEAD*12;

export const graphMonthRange = generateMonthRange();
export const graphYearRange = [...Array(20).keys()].map(i => i + CURRENT_YEAR);

export function monthsBetween(from: MonthDate, to: MonthDate): number {
	return (to.year - from.year)*12 + (to.month - from.month);
}

export function getDateText(date: MonthDate): string {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return `${months[date.month-1]} ${date.year}`;
}

export function incrementMonth(date: MonthDate) {
  date = {
    ...date,
    month: date.month + 1
  };

  if (date.month > 12) {
    date = {
      month: 1,
      year: date.year + 1
    };
  }
  
  return date;
}

export function generateMonthRange() {
	let months: MonthDate[] = [];

	let curMonth: MonthDate = CURRENT_MONTHDATE;
	months.push(curMonth);

	while (months.length < MONTH_LOOKAHEAD) {
    curMonth = incrementMonth(curMonth);

		months.push(curMonth);
	}

	return months
}