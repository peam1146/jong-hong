type Booking = {
  bookingId: string
  userId: string
  checkIn: string // ISO string
  checkOut: string // ISO string
}

type Result =
  | { type: 'slot'; length: number; status: 'available' | 'booked' }
  | { type: 'separator'; label: string }

/**
 * Parses an ISO string to a Date object.
 * @param isoString - The ISO string to parse.
 * @returns A Date object.
 */
const parseISOToDate = (isoString: string): Date => {
  return new Date(isoString)
}

/**
 * Parses an "HH:MM AM/PM" string to a Date object on a specific day.
 * @param timeStr - Time string in "HH:MM AM/PM" format.
 * @param referenceDate - Date object representing the day.
 * @returns A Date object with the specified time.
 */
const parseTimeToDate = (timeStr: string, referenceDate: Date): Date => {
  const [time, modifier] = timeStr.split(' ')
  let [hours, minutes] = time.split(':').map(Number)

  if (modifier.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12
  }
  if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0
  }

  const date = new Date(referenceDate)
  date.setHours(hours, minutes, 0, 0) // Using local time
  return date
}

/**
 * Formats a Date object to "HH:MM AM/PM" string.
 * @param date - The Date object to format.
 * @returns A string in "HH:MM AM/PM" format.
 */
const formatTimeAMPM = (date: Date): string => {
  let hours = date.getHours() // Local hours
  const minutes = date.getMinutes() // Local minutes
  const modifier = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const minutesStr = minutes.toString().padStart(2, '0')
  return `${hours}:${minutesStr} ${modifier}`
}

/**
 * Calculates the duration between two Date objects in hours.
 * @param start - Start time.
 * @param end - End time.
 * @returns Duration in hours.
 */
const getDurationInHours = (start: Date, end: Date): number => {
  const diffMs = end.getTime() - start.getTime()
  return parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2))
}

/**
 * Determines if a given interval is booked.
 * @param start - Start time of the interval.
 * @param end - End time of the interval.
 * @param mergedBookings - Array of merged bookings.
 * @returns True if the interval is booked, false otherwise.
 */
const isBooked = (
  start: Date,
  end: Date,
  mergedBookings: { checkIn: Date; checkOut: Date }[]
): boolean => {
  for (const booking of mergedBookings) {
    // Check if the interval [start, end) overlaps with [booking.checkIn, booking.checkOut)
    if (start < booking.checkOut && end > booking.checkIn) {
      return true
    }
  }
  return false
}

/**
 * Processes bookings to generate an array of slots and separators.
 * Ensures every slot is separated by a separator.
 * @param bookings - Array of bookings from the server.
 * @param openTime - Opening time in "HH:MM AM/PM" format.
 * @param closeTime - Closing time in "HH:MM AM/PM" format.
 * @returns Array of Result objects.
 */
export const processBookings = (
  bookings: Booking[],
  openTime: string,
  closeTime: string
): Result[] => {
  const results: Result[] = []

  // Step 1: Determine the reference date from the bookings or use current date
  const referenceDate = bookings.length > 0 ? parseISOToDate(bookings[0].checkIn) : new Date()

  // Step 2: Parse open and close times
  const openDate = parseTimeToDate(openTime, referenceDate)
  const closeDate = parseTimeToDate(closeTime, referenceDate)

  // Step 3: Sort and merge bookings
  const sortedBookings = bookings
    .map((b) => ({
      ...b,
      checkInDate: parseISOToDate(b.checkIn),
      checkOutDate: parseISOToDate(b.checkOut),
    }))
    .sort((a, b) => a.checkInDate.getTime() - b.checkInDate.getTime())

  // Merge overlapping or adjacent bookings
  const mergedBookings: { checkIn: Date; checkOut: Date }[] = []
  if (sortedBookings.length > 0) {
    let current = {
      checkIn: sortedBookings[0].checkInDate,
      checkOut: sortedBookings[0].checkOutDate,
    }

    for (let i = 1; i < sortedBookings.length; i++) {
      const booking = sortedBookings[i]
      if (booking.checkInDate <= current.checkOut) {
        // Overlapping or adjacent
        current.checkOut = new Date(
          Math.max(current.checkOut.getTime(), booking.checkOutDate.getTime())
        )
      } else {
        // No overlap, push current and start new
        mergedBookings.push({ ...current })
        current = {
          checkIn: booking.checkInDate,
          checkOut: booking.checkOutDate,
        }
      }
    }
    // Push the last interval
    mergedBookings.push({ ...current })
  }

  // Step 4: Collect all relevant time points
  const timePointsSet: Set<number> = new Set()
  timePointsSet.add(openDate.getTime())
  timePointsSet.add(closeDate.getTime())

  mergedBookings.forEach((booking) => {
    timePointsSet.add(booking.checkIn.getTime())
    timePointsSet.add(booking.checkOut.getTime())
  })

  const timePoints: Date[] = Array.from(timePointsSet).map((time) => new Date(time))
  timePoints.sort((a, b) => a.getTime() - b.getTime())

  // Step 5: Iterate through time points and build results
  for (let i = 0; i < timePoints.length - 1; i++) {
    const current = timePoints[i]
    const next = timePoints[i + 1]

    // Add separator for the current time
    results.push({ type: 'separator', label: formatTimeAMPM(current) })

    // Determine if the interval [current, next) is booked
    const status = isBooked(current, next, mergedBookings) ? 'booked' : 'available'

    // Calculate duration
    const length = getDurationInHours(current, next)

    // Add slot
    results.push({ type: 'slot', length, status })
  }

  // Add separator for the last time point
  const lastTime = timePoints[timePoints.length - 1]
  results.push({ type: 'separator', label: formatTimeAMPM(lastTime) })

  return results
}
