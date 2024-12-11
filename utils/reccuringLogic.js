/**
 * Generate recurring dates based on the schedule's start date, pattern, custom days, and count.
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} recurringPattern - "weekly" or "daily"
 * @param {string|null} customDays - A 7-character binary string representing active days (e.g., "1111100")
 * @param {number} bookingCount - Number of dates to generate
 * @returns {Array} - List of recurring dates
 */
const generateRecurringDates = (
  startDate,
  recurringPattern,
  customDays,
  bookingCount
) => {
  console.log("Start Date:", startDate);
  console.log("Recurring Pattern:", recurringPattern);
  console.log("Custom Days:", customDays);
  console.log("Booking Count:", bookingCount);

  const dates = [];
  let currentDate = new Date(startDate);
  let count = 0;

  // Validate the startDate
  if (isNaN(currentDate.getTime())) {
    throw new Error("Invalid startDate provided.");
  }

  // Validate customDays
  if (customDays && customDays.length !== 7) {
    throw new Error("customDays must be a 7-character string.");
  }

  if (customDays && /[^01]/.test(customDays)) {
    throw new Error("customDays must only contain '1' or '0'.");
  }

  while (count < bookingCount) {
    if (recurringPattern === "weekly") {
      const dayIndex = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      // Check if the current day is included in the customDays pattern
      if (customDays && customDays[dayIndex] === "1") {
        dates.push(currentDate.toISOString().split("T")[0]); // Add date in YYYY-MM-DD format
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    } else if (recurringPattern === "daily") {
      dates.push(currentDate.toISOString().split("T")[0]);
      count++;
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    } else {
      throw new Error(
        "Invalid recurringPattern. It must be 'daily' or 'weekly'."
      );
    }
  }

  return dates;
};

module.exports = { generateRecurringDates };
