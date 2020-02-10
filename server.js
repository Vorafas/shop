const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

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

app.post('/api/cart/:id', (req, res) => {
    const id = req.params.id;
    if (id.length !== 0 && !isNaN(+id)) {
        fs.readFile('./data/cart.json', 'utf-8', (err, data) => {
            if (err) {
                res.send({ result: 0 });
                return;
            }
            const cart = !!data ? JSON.parse(data) : [];
            const goods = cart.filter((item) => item.id !== Number(req.params.id));

            fs.writeFile('./data/cart.json', JSON.stringify(goods), (err, data) => {
                if (err) {
                    res.send({ result: 0 });
                    return;
                }
                res.send({ result: 1 });
            });

        });
    } else {
        res.send({ result: 0 });
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