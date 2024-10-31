export function validateDateFormat(date: string): boolean {
  // รูปแบบ DD/MM/YY
  const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{2})$/;
  return datePattern.test(date);
}

export function validateTimeFormat(time: string): boolean {
  // รูปแบบ HH:MM AM|PM
  const timePattern = /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;
  return timePattern.test(time);
}

// Convert time to 24-hour format for comparison
export function convertTo24HourFormat(time: string): string {
  const [hoursMinutes, period] = time.split(' ');
  let [hours, minutes] = hoursMinutes.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0; // Midnight case
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
