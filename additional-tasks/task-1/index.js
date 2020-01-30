const str = 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.';
console.log(str);

const regExp = /"/g;
console.log(str.replace(regExp, "'")); 
