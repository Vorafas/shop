const goods = [
    { title: "Робот-пылесос xiaomi", price: 20000, img: 'https://via.placeholder.com/150' },
    { title: "Samsung Galaxy", price: 21500, img: 'https://via.placeholder.com/150' },
    { title: "Стиральная машина hotpoint", price: 32000, img: 'https://via.placeholder.com/150' },
    { title: "Умные часы apple watch", price: 26000, img: 'https://via.placeholder.com/150' },
];

const renderGoodsItem = ({ title = '', price = '', img = '' }) => {
    return `<div class="goods-item">
        <img class="image" src="${img}" alt="alt" />
        <h3 class="title">${title}</h3>
        <p class="price">${price}</p>
    </div>`;
};

const renderGoodsList = (list, container) => {
    const goodsList = list.map(good => renderGoodsItem(good));
    document.querySelector(container).innerHTML = goodsList.join('');
};

renderGoodsList(goods, '.goods-list');