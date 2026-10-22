import createHttpError from "http-errors";

export const parsePositiveInteger = (
  value,
  { name, defaultValue, max = Number.MAX_SAFE_INTEGER },
) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    throw createHttpError(400, `${name} must be a positive integer`);
  }

  const parsedValue = Number(value);

  if (!Number.isSafeInteger(parsedValue) || parsedValue > max) {
    throw createHttpError(400, `${name} must be a positive integer`);
  }

  return parsedValue;
};
