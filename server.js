const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

app.get('/api/goods', (req, res) => {
    fs.readFile('./data/catalog.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(520);
        } else {
            res.send(data);
        }
    });
});

app.listen(3000, () => {
    console.log('server is running on port 3000!');
})