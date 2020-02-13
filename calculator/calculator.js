function addition(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return null;
    }
    return a + b;
}

function subtraction(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return null;
    }
    return a - b;
}

function multiplication(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return null;
    }
    return a * b;
}

function division(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return null;
    }
    return a / b;
}

module.exports = {
    addition: addition,
    subtraction: subtraction,
    multiplication: multiplication,
    division: division
}