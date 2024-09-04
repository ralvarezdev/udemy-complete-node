export default class Calculator{
    add(...numbers){
        return numbers.reduce((acc, cur) => acc + cur, 0);
    }
    subtract(...numbers){
        return numbers.reduce((acc, cur) => acc - cur, 0);
    }
    multiply(...numbers){
        return numbers.reduce((acc, cur) => acc * cur, 1);
    }
    divide(...numbers){
        return numbers.reduce((acc, cur) => acc / cur, 1);
    }
}