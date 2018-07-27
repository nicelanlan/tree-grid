/**
 * Set the date's year, month and date by given date.
 * @param {date} dateTime the date to be changed
 * @param {date} date the given date
 * @returns {date}
 */
export function setDateByDay(dateTime = new Date(), date) {
  if (!date) {
    return dateTime;
  }
  dateTime.setFullYear(date.getFullYear());
  dateTime.setMonth(date.getMonth());
  dateTime.setDate(date.getDate());
  return dateTime;
}

/**
 * Set the date's hour, minute, second and millisecond by given date.
 * @param {date} dateTime the date to be changed
 * @param {date} time the given date
 * @returns {date}
 */
export function setDateByTime(dateTime = new Date(), time) {
  if (!dateTime) {
    return dateTime;
  }
  dateTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
  return dateTime;
}

/**
 * Add the specified number of months to the given date.
 * @param {date|string|number} date the date to be changed
 * @param {number} amount the amount of months to be added
 * @returns {date} the new date with the months added
 */
export function addMonths(date, amount = 0) {
  const cloneDate = date ? new Date(date) : new Date();
  return new Date(cloneDate.setMonth(cloneDate.getMonth() + amount));
}

/**
 * Subtract the specified number of months from the given date.
 * @param {date|string|number} date the date to be changed
 * @param {number} amount the amount of months to be subtracted
 * @returns {date} the new date with the months subtracted
 */
export function subtractMonths(date, amount = 0) {
  return addMonths(date, -amount);
}

/**
 * Get the last second of the given date's month
 * @param {date} date the given date
 * @returns {date} the date of the last second of the given date's month
 */
export function getEndOfMonth(date = new Date()) {
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  date.setHours(23, 59, 59);
  return new Date(date);
}

/**
 * Get the first second of the given date's month
 *
 * @param {date} [date=new Date()] the given date
 * @returns the date of the first second of the given date's month
 */
export function getStartOfMonth(date = new Date()) {
  date.setDate(1);
  date.setHours(0, 0, 0);
  return new Date(date);
}
