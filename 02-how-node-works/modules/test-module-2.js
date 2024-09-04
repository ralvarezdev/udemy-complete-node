export const add = (...numbers) => numbers.reduce((acc, cur) => acc + cur, 0);
export const subtract = (...numbers) => numbers.reduce((acc, cur) => acc - cur, 0);
export const multiply = (...numbers) => numbers.reduce((acc, cur) => acc * cur, 1);
export const divide = (...numbers) => numbers.reduce((acc, cur) => acc / cur, 1);