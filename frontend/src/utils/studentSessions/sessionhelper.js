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
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTH_IDX = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export const parseDbDate = (str) => {
  if (!str) return null;
  const p = str.split(" ");
  if (p.length < 3) return null;
  return { d: parseInt(p[0]), m: MONTH_IDX[p[1]], y: parseInt(p[2]) };
};

export const ordinal = (n) => {
  if ([11, 12, 13].includes(n % 100)) return "th";
  return ["", "st", "nd", "rd"][n % 10] || "th";
};

export const fmtShort = (str) => {
  const p = parseDbDate(str);
  if (!p) return str || "";
  return `${p.d}${ordinal(p.d)} ${MONTHS_SHORT[p.m]} ${p.y}`;
};

export const fmtLong = (str) => {
  const p = parseDbDate(str);
  if (!p) return str || "";
  return `${p.d}${ordinal(p.d)} ${MONTHS[p.m]} ${p.y}`;
};

export const parseTopics = (reason) => {
  if (!reason?.includes("]")) return [];
  const match = reason.match(/\[(.*?)\]/);
  return match
    ? match[1].split(",").map((t) => t.trim()).filter(Boolean)
    : [];
};

export const parseReason = (reason) => {
  if (!reason) return "";
  if (reason.includes("]")) return reason.split("]")[1].trim();
  return reason;
};

export const isSessionTime = (date, timeSlot) => {
  if (!date || !timeSlot) return false;
  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2, "0")} ${MONTHS_SHORT[now.getMonth()]} ${now.getFullYear()}`;
  if (date !== todayStr) return false;
  const parts = timeSlot.split(" - ")[0].trim().split(" ");
  if (parts.length < 2) return false;
  const [tp, ampm] = parts;
  const [h, m] = tp.split(":").map(Number);
  let hr = h;
  if (ampm === "PM" && hr !== 12) hr += 12;
  if (ampm === "AM" && hr === 12) hr = 0;
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= hr * 60 + m - 10 && cur <= hr * 60 + m + 60;
};