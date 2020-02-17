const calculator = require('../../calculator/calculator');
const addition = calculator.addition;
const subtraction = calculator.subtraction;
const multiplication = calculator.multiplication;
const division = calculator.division;

describe('Функция addition()', () => {
    it("Доджна возвращать 5 при аргументах (3, 2)", function() {
        expect(addition(3, 2)).toBe(5);
    });

    it("Доджна возвращать null если первый параметр не число", function() {
        expect(addition('8', 3)).toBeNull();
    });

    it("Доджна возвращать null если второй параметр не число", function() {
        expect(addition(10, '1')).toBeNull();
    });

    it("Доджна возвращать null если оба параметра не число", function() {
        expect(addition('6', '0')).toBeNull();
    });
});

describe('Функция subtraction()', () => {
    it("Доджна возвращать 10 при аргументах (15, 5)", function() {
        expect(subtraction(15, 5)).toBe(10);
    });

    it("Доджна возвращать null если первый параметр не число", function() {
        expect(subtraction('4', 2)).toBeNull();
    });

    it("Доджна возвращать null если второй параметр не число", function() {
        expect(subtraction(7, '2')).toBeNull();
    });

    it("Доджна возвращать null если оба параметра не число", function() {
        expect(subtraction('9', '2')).toBeNull();
    });
});

describe('Функция multiplication()', () => {
    it("Доджна возвращать 30 при аргументах (10, 3)", function() {
        expect(multiplication(10, 3)).toBe(30);
    });

    it("Доджна возвращать null если первый параметр не число", function() {
        expect(multiplication('5', 10)).toBeNull();
    });

    it("Доджна возвращать null если второй параметр не число", function() {
        expect(multiplication(9, '20')).toBeNull();
    });

    it("Доджна возвращать null если оба параметра не число", function() {
        expect(multiplication('90', '1')).toBeNull();
    });
});

describe('Функция division()', () => {
    it("Доджна возвращать 1 при аргументах (3, 3)", function() {
        expect(division(3, 3)).toBe(1);
    });

    it("Доджна возвращать null если первый параметр не число", function() {
        expect(division('5', 1)).toBeNull();
    });

    it("Доджна возвращать null если второй параметр не число", function() {
        expect(division(7, '8')).toBeNull();
    });

    it("Доджна возвращать null если оба параметра не число", function() {
        expect(division('12', '119')).toBeNull();
    });
});