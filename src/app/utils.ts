export const isTouchscreen =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

// Generates a random integer whose value lies between lower and upper
export const randomIntBetween = (lower: number, upper: number) => {
  return Math.floor(Math.random() * (upper - lower)) + lower;
};

export const randomItemFromArray = <T>(array: T[]) => {
  return array[randomIntBetween(0, array.length)];
};

export const wait = (delayTime: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delayTime));
};

export const deepCopy = <T>(item: T): T => {
  return JSON.parse(JSON.stringify(item));
};

export const getValueFromInputEvent = (event: Event) => {
  const htmlInputElement = <HTMLInputElement>event.target;

  return htmlInputElement.value;
};
