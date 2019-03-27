// @flow

import moment from "moment";
import { DateTime } from "luxon";

// export const dateToISO

export const dateToYear = (calendarDate: string): number =>
  new Date(calendarDate).getFullYear();

export const dateToMonthYear = (calendarDate: string): string => {
  return moment(calendarDate).format("MMMM YYYY");
};

export const dateToDayMonthYear = (calendarDate: string): string => {
  return moment(calendarDate).format("DD MMMM YYYY");
};

export const numberYears = (fromDate: string, toDate: string = Date.now()) => {
  return Math.floor(
    Math.abs(
      DateTime.fromISO(fromDate).diffNow('years').toObject().years
    )
  );
}