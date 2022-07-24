import { MonthDate } from './constructs';

export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;

/** The current month as a MonthDate interface */
export const CURRENT_MONTHDATE: MonthDate = {
	month: CURRENT_MONTH,
	year: CURRENT_YEAR
};

/** The number of years to show in the UI graphs */
const YEAR_LOOKAHEAD = 20;
const MONTH_LOOKAHEAD = YEAR_LOOKAHEAD*12;

/** An array of the months to place along the X-axis of relevant graphs */
export const graphMonthRange = generateMonthRange();

/** An array of the years to place along the X-axis of relevant graphs */
export const graphYearRange = [...Array(20).keys()].map(i => i + CURRENT_YEAR);

export function monthsBetween(from: MonthDate, to: MonthDate): number {
  /**
   * Finds the number of months between two MonthDates. Will return negative
   * numbers if 'to' comes before 'for'; this is useful for sorting.
   */
	return (to.year - from.year)*12 + (to.month - from.month);
}

export function getDateText(date: MonthDate): string {
  /**
   * Converts a MonthDate to a string (eg 01/2022 => "Jan 2022")
   */
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return `${months[date.month-1]} ${date.year}`;
}

export function incrementMonth(date: MonthDate) {
  /**
   * Increments a MonthDate by a month and returns the result
   */
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

function generateMonthRange() {
  /**
   * Generates the graphMonthRange array
   */
  
	let months: MonthDate[] = [];

	let curMonth: MonthDate = CURRENT_MONTHDATE;
	months.push(curMonth);

	while (months.length < MONTH_LOOKAHEAD) {
    curMonth = incrementMonth(curMonth);

		months.push(curMonth);
	}

	return months
}