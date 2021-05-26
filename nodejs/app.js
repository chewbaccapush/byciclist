const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//DB CONNECTION (CHANGE THIS FOR YOUR LOCAL SERVER)
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "kolesarskepoti"
});
con.connect(function (err) {
    if (err) throw err;
});

con.query("SELECT * FROM vprasanja", function (err, result, fields) {
    if (err) throw err;
    //GET QUESTIONS FROM DB
    app.get('/questions', async (req, res, next) => {
        try {
            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    })
});

//INSERT QUESTIONS INTO DB
app.post('/questions', async (req, res, next) => {
    if (!req.body.title) {
        res.status(400);
        res.json({ message: "Bad Request" });
    } else {
        console.log(req.body.title);
        var siteResponse = req.body.title;
        var sql = "INSERT INTO vprasanja (ID_vprasanja, vprasanje) VALUES (default,'"+siteResponse+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    }
})

app.listen(port, () => console.log("Listening on port: " + port));