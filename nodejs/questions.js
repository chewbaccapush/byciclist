const express = require('express');
const router = express.Router();
const questions = require('./questions.json');
const fs = require('fs');

router.get('/', function (req, res) {
    res.json(questions);
});

router.post('/', function (req, res) {
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

module.exports = router;