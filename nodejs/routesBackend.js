const express = require('express');
const fs = require('fs');
//const poti = express();
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
let potiJson = require('./poti.json');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/routes', function (req, res) {
    res.json(potiJson);
})

app.post('/routes', function (req, res) {
    let responz = [];
    let profil, tip, tezavnost;
    console.log(req.body);
    if (req.body.profil === 'vse')
        profil = ''
    else
        profil = req.body.profil
    if (req.body.tip === 'vse')
        tip = ''
    else
        tip = req.body.tip;
    if (req.body.tezavnosti === 'vse')
        tezavnost = ''
    else
        tezavnost = req.body.tezavnosti;
    for (let i = 0; i < potiJson.length; i++) {
        if ((potiJson[i].zacetnaTocka.toUpperCase().includes(req.body.niz) || potiJson[i].koncnaTocka.toUpperCase().includes(req.body.niz))
            && potiJson[i].profil.includes(profil) && potiJson[i].tip.includes(tip) && potiJson[i].tezavnost.includes(tezavnost)) {
            responz.push(potiJson[i]);
        }
    }
    res.json(responz);
})

const questions = require('./questions.json');

app.get('/', function (req, res) {
    res.json(questions);
});

app.post('/', function (req, res) {
    if (!req.body.title){

        res.status(400);
        res.json({ message: "Bad Request" });
    } else {
        let rawdata = fs.readFileSync('nodejs/questions.json');
        let JSONdata = JSON.parse(rawdata);
        var userInput = req.body.title;
        var count = JSONdata.length;
        var title = {id: count+1, title: userInput};
        JSONdata.push(title);
        fs.writeFileSync('nodejs/questions.json', JSON.stringify(JSONdata));
    }
});

app.listen(port, () => console.log("port: " + port));

