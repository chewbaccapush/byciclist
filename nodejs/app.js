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
    host: "5.153.252.199",
    port: "3306",
    user: "bicyclist_user",
    database: "bicyclist_db",
    password: "*yO4p,R;-;1y"
});
con.connect(function (err) {
    if (err) throw err;
});

//GET QUESTIONS FROM DB
con.query("SELECT * FROM vprasanja", function (err, result, fields) {
    if (err) throw err;
    app.get('/questions', async (req, res, next) => {
        try {
            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    })
});

//GET ANSWERS FROM DB
//con.query("SELECT odgovori.odgovor, odgovori.ID_TK_vprasanja FROM odgovori INNER JOIN vprasanja ON odgovori.ID_TK_vprasanja = vprasanja.ID_vprasanja", function(err, result, fields) {
con.query("SELECT * FROM odgovori", function (err, result, fields) {
    if (err) throw err;
    app.get('/answers', async (req, res, next) => {
        try {
            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    })
});

con.query("SELECT naslovNasveta FROM nasveti", function (err, result, fields) {
    if (err) throw err;
    app.get('/nasveti', async (req, res, next) => {
        try {
            console.log(result);
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
        var sql = "INSERT INTO vprasanja (ID_vprasanja, vprasanje) VALUES (default,'" + siteResponse + "')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    }
})

//INSERT ANSWERS INTO DB
app.post('/answers', async (req, res, next) => {
    if (!req.body.title && !req.body.foreignID) {
        res.status(400);
        res.json({ message: "Bad Request" });
    } else {
        console.log(req.body.title);
        var siteResponse = req.body.title;
        var siteResponseID = req.body.foreignID;
        var sql = "INSERT INTO odgovori (ID_odgovori, odgovor, ID_TK_vprasanja) VALUES (default,'" + siteResponse + "', " + siteResponseID + ")";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    }
})

//DODAJANJE NASVETOV V BAZO
app.post('/nasveti', async (req, res, next) => {
    if (!req.body.naslovNasveta) {
        res.status(400);
        res.json({ message: "Bad Request" });
    } else {

        let siteResponse = req.body.naslovNasveta;
        var sql = "INSERT INTO nasveti (ID_nasvet, naslovNasveta) VALUES (default,'" + siteResponse + "')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    }
})

//CHECK CREDS
app.post('/checkCreds', async (req, res, next) => {
    if (!req.body.username && !req.body.password) {
        res.status(400);
        res.json({ message: "Bad Request" });
    } else {
        let username = req.body.username;
        let password = req.body.password;
        var sql = "SELECT id, uporabnisko_ime, geslo, tip FROM uporabnik WHERE uporabnisko_ime='" + username + "' AND geslo='" + password + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            if(result.length>0)
                res.json(result);
            else {
                var invalidCreds = new Object();
                invalidCreds.error = 1;
                res.json(invalidCreds);
            }
        });
    }
})

app.listen(port, () => console.log("Listening on port: " + port));