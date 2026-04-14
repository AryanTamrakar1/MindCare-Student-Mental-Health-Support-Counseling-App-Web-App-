export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MONTH_IDX = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

// It parses a date string and returns day, month, and year
export function parseDbDate(str) {
  if (!str) return null;
  const p = str.split(" ");
  if (p.length < 3) return null;
  return { d: parseInt(p[0]), m: MONTH_IDX[p[1]], y: parseInt(p[2]) };
}

// It returns the ordinal suffix for a given number
export function ordinal(n) {
  const lastTwo = n % 100;
  if (lastTwo === 11 || lastTwo === 12 || lastTwo === 13) {
    return "th";
  }
  const lastOne = n % 10;
  if (lastOne === 1) return "st";
  if (lastOne === 2) return "nd";
  if (lastOne === 3) return "rd";
  return "th";
}

// It formats a date string into short format like "5th Jan 2025"
export function fmtShort(str) {
  const p = parseDbDate(str);
  if (!p) {
    if (str) return str;
    return "";
  }
  return p.d + ordinal(p.d) + " " + MONTHS_SHORT[p.m] + " " + p.y;
}

// It formats a date string into long format like "5th January 2025"
export function fmtLong(str) {
  const p = parseDbDate(str);
  if (!p) {
    if (str) return str;
    return "";
  }
  return p.d + ordinal(p.d) + " " + MONTHS[p.m] + " " + p.y;
}

// It gets the list of topics from the reason 
export function parseTopics(reason) {
  if (!reason) return [];
  if (!reason.includes("]")) return [];

  const start = reason.indexOf("[");
  const end = reason.indexOf("]");

  if (start === -1 || end === -1) return [];

  const inside = reason.substring(start + 1, end);
  const rawTopics = inside.split(",");
  const topics = [];

  for (let i = 0; i < rawTopics.length; i++) {
    const trimmed = rawTopics[i].trim();
    if (trimmed) {
      topics.push(trimmed);
    }
  }

  return topics;
}

// It gets the reason text after the topics
export function parseReason(reason) {
  if (!reason) return "";
  if (reason.includes("]")) {
    return reason.split("]")[1].trim();
  }
  return reason;
}

// This is for session testing
// It checks if the given date and time slot corresponds to the current time and date
export function isSessionNow(date, timeSlot) {
  if (!date || !timeSlot) return false;

  const now = new Date();

  const dayNum = now.getDate();
  let dayStr = "";
  if (dayNum < 10) {
    dayStr = "0" + dayNum;
  } else {
    dayStr = "" + dayNum;
  }

  const todayStr =
    dayStr + " " + MONTHS_SHORT[now.getMonth()] + " " + now.getFullYear();

  if (date !== todayStr) return false;

  const slotStart = timeSlot.split(" - ")[0].trim();
  const parts = slotStart.split(" ");

  if (parts.length < 2) return false;

  const timePart = parts[0];
  const ampm = parts[1];

  const timeSplit = timePart.split(":");
  let hour = parseInt(timeSplit[0]);
  const minute = parseInt(timeSplit[1]);

  if (ampm === "PM" && hour !== 12) {
    hour = hour + 12;
  }
  if (ampm === "AM" && hour === 12) {
    hour = 0;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sessionStart = hour * 60 + minute;

  if (
    currentMinutes >= sessionStart - 10 &&
    currentMinutes <= sessionStart + 60
  ) {
    return true;
  }
  return false;
}