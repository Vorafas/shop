const str = "Let's imagine …You're watching TV. It's a hot evening: You feel thirsty. The oil company Shell invented a new 'matching-half' promotion called 'Make Money' ";
console.log(str);

const regExp = /([^\w])'|'[^\w]/g;
console.log(str.replace(regExp, '"'));