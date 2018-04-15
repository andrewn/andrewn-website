// @flow

import moment from 'moment';

export const dateToYear = (calendarDate: string): number =>
  new Date(calendarDate).getFullYear();

export const dateToMonthYear = (calendarDate: string): string => {
  return moment(calendarDate).format('MMMM YYYY');
};

export const dateToDayMonthYear = (calendarDate: string): string => {
  return moment(calendarDate).format('DD MMMM YYYY');
};
