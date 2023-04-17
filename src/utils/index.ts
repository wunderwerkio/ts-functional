/**
 * Convert a value to a string.
 *
 * @param val - The value to convert.
 */
export const toString = (val: unknown): string => {
  if (typeof val === "object") {
    return JSON.stringify(val);
  }

  return String(val);
};
