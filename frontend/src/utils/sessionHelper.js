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

export function parseDbDate(str) {
  if (!str) return null;
  const p = str.split(" ");
  if (p.length < 3) return null;
  return { d: parseInt(p[0]), m: MONTH_IDX[p[1]], y: parseInt(p[2]) };
}

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

export function fmtShort(str) {
  const p = parseDbDate(str);
  if (!p) {
    if (str) return str;
    return "";
  }
  return p.d + ordinal(p.d) + " " + MONTHS_SHORT[p.m] + " " + p.y;
}

export function fmtLong(str) {
  const p = parseDbDate(str);
  if (!p) {
    if (str) return str;
    return "";
  }
  return p.d + ordinal(p.d) + " " + MONTHS[p.m] + " " + p.y;
}

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

export function parseReason(reason) {
  if (!reason) return "";
  if (reason.includes("]")) {
    return reason.split("]")[1].trim();
  }
  return reason;
}

// This is for session testing
export function isSessionTime(date, timeSlot) {
  return true;
}