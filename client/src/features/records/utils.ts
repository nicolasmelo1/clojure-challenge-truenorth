export const operationsReferenceTable = {
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division",
  square_root: "Square root",
  random_string: "Random string",
};

export function convertNumberToMoney(number: number) {
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function convertIsoDateToDate(isoDate: string) {
  return new Date(isoDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
