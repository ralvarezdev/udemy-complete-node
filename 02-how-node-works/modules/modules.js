import Calculator from "./test-module-1.js";
import { add, subtract, multiply, divide } from "./test-module-2.js";

const calc = new Calculator();
console.log(calc.add(1, 2, 3, 4, 5));

console.log(add(1, 2, 3, 4, 5));