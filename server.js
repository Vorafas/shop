const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

const ACTION_TYPES = {
    add: 'add',
    remove: 'remove'
};

const log = (type, goodName) => {
    fs.readFile('./data/stats.json', 'utf-8', (err, data) => {
        const stats = !!data ? JSON.parse(data) : [];
        stats.push({
            type,
            name: goodName,
            createAt: +new Date()
        });
        fs.writeFile('./data/stats.json', JSON.stringify(stats), () => {});
    });
};

app.get('/api/goods', (req, res) => {
    fs.readFile('./data/catalog.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(520).send();
        } else {
            res.send(data);
        }
    });
});

app.get('/api/cart', (req, res) => {
    fs.readFile('./data/cart.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(520).send();
        } else {
            res.send(data);
        }
    });
});

app.delete('/api/cart/:id', (req, res) => {
    const id = req.params.id;
    if (id.length !== 0 && !isNaN(+id)) {
        fs.readFile('./data/cart.json', 'utf-8', (err, data) => {
            if (err) {
                res.status(500).send();
                return;
            }
            const cart = !!data ? JSON.parse(data) : [];
            const goodIndex = cart.findIndex((item) => item.id === Number(req.params.id));
            const good = cart[goodIndex];
            cart.splice(goodIndex, 1);
            fs.writeFile('./data/cart.json', JSON.stringify(cart), (err, data) => {
                if (err) {
                    res.status(500).send();
                    return;
                }
                log(ACTION_TYPES.remove, good.name);
                res.send(cart);
            });

        });
    } else {
        res.status(500).send();
    }
});

app.post('/api/cart', (req, res) => {
    if (req.body && typeof req.body === 'object') {
        fs.readFile('./data/cart.json', 'utf-8', (err, data) => {
            if (err) {
                res.status(500).send();
                return;
            }
            const cart = !!data ? JSON.parse(data) : [];
            const goodItem = req.body;

            cart.push(goodItem);
            fs.writeFile('./data/cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.status(520).send();
                    return
                }
                log(ACTION_TYPES.add, goodItem.name);
                res.send(cart);
            })
        });
    } else {
        res.status(500).send();
    }
});

app.listen(3000, () => {
    console.log('server is running on port 3000!');
})