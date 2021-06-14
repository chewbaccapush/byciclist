const express = require('express');
const fs = require('fs');
//const poti = express();
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
let potiJson = require('./poti.json');
const questions = require('./questions.json');
const mysql = require('mysql');
var hbs = require('express-handlebars');
var path = require('path');



/* -----ENGINE----- */
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/../views/layouts/' }));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', '.hbs');
app.use(express.static('../'));

/* -----------------------------------BAZA SETUP----------------------------------- */

var knex = require('knex')({
    client: 'mysql',
    connection: {
        //host: '192.168.0.1',
        host: '5.153.252.199',
        port: 3306,
        user: 'bicyclist_user',
        password: '*yO4p,R;-;1y',
        database: 'bicyclist_db'
    }
});

const bookshelf = require('bookshelf')(knex);

var Poti = bookshelf.Model.extend({
    tableName: 'poti',
    idAttribute: 'id'
})

var Komentarji = bookshelf.Model.extend({
    tableName: 'komentarji',
    idAttribute: 'ID_komentarji'
})

/* -----------------------------------CORS----------------------------------- */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* -----------------------------------LOGIKA----------------------------------- */

/* -----NALAGANJE POTI----- */
app.get('/routes', async(req, res, next) => {
    try {
        let poti = await new Poti().fetchAll();
        res.json(poti.toJSON());
    } catch (err) {
        res.status(500).json(err);
    }
})

/* -----VRAČANJE ISKANJA----- */
app.post('/routes', async(req, res, next) => {
    try {
        let poti = await new Poti().fetchAll();
        potiJson = poti.toJSON();
        console.log(potiJson);

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
            if ((potiJson[i].zacetnaTocka.toUpperCase().includes(req.body.niz) || potiJson[i].koncnaTocka.toUpperCase().includes(req.body.niz)) &&
                potiJson[i].profil.includes(profil) && potiJson[i].tip.includes(tip) && potiJson[i].tezavnost.includes(tezavnost)) {
                responz.push(potiJson[i]);
            }
        }
        //res.send('jaja');
        res.json(responz);
    } catch (err) {
        res.status(500).json(err);
    }
})

/* -----BRISANJE POTI----- */
app.post('/routesBrisi/:id', async(req, res, next) => {
    try {
        console.log(typeof req.params.id);
        new Poti({ id: req.params.id })
            .destroy()
            .then(async() => {
                let poti = await new Poti().fetchAll();
                res.json(poti.toJSON());
            });
        /*console.log(typeof req.body.id);
        Poti.query().whereIn('id', parseInt(req.body.id)).del().then( async () => {
            let poti = await new Poti().fetchAll();
            res.send(poti.toJSON());
        }).error()*/
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

/* -----PRIKAZ POTI IN HOTELOV NA POTI----- */
app.get('/pot', async(req, res, next) => {
    try {
        console.log(req.query.id);
        //Query
        let poti = await Poti.forge({ id: req.query.id }).fetch();
        let hoteli_na_poti = await knex('hoteli_na_poti')
            .innerJoin('hoteli', 'hoteli.id', 'hoteli_na_poti.fk_hoteli')
            .where('fk_poti', req.query.id);

        //Zvezdice za tezavnost
        var tezavnost = 'težavnost: <br>';
        for (let i = 1; i <= 5; i++) {
            if (i <= parseInt(poti.get("tezavnost"))) {
                tezavnost += '<li class="list-inline-item m-0"><i class="fa fa-star fa-lg text-success"></i></li>'
            } else {
                tezavnost += '<li class="list-inline-item m-0"><i class="fa fa-star fa-lg text-muted"></i></li>'
            }
        }

        let komentarji_na_poti = await knex('komentarji')
            .where('fk_poti', req.query.id);
        console.log(komentarji_na_poti);

        //konstruktor za hbs
        let napolniPot = {
            title: poti.get("zacetnaTocka") + " - " + poti.get("koncnaTocka"),
            razdalja: poti.get("razdalja"),
            vzpon: poti.get("vzpon"),
            spust: poti.get("spust"),
            mapa: poti.get("mapa"),
            img: poti.get("img"),
            tezavnost: tezavnost,
            ocena: poti.get("povprecnaOcena"),
            oprema: poti.get("tip"),
            hoteli: hoteli_na_poti,
            ID_komentar: poti.get("id"),
            komentarji: komentarji_na_poti
        }

        res.render('pot', napolniPot);
    } catch (err) {
        res.render('error', { message: "404: Ta stran ne obstaja :(" });
    }
})

app.get('/komentarji/:id', async(req, res, next) => {
    try {
        let komentarji_na_poti = await knex('komentarji')
            .where('fk_poti', req.params.id);
        console.log(komentarji_na_poti);

        res.status(200).json({ komentarji: komentarji_na_poti });
    } catch (err) {
        res.render('error', { message: "404: Ta stran ne obstaja :(" });
    }
})

app.listen(port, () => console.log("port: " + port));

//DODAJANJE OCENE - VLADO
//DB CONNECTION (CHANGE THIS FOR YOUR LOCAL SERVER)
var con = mysql.createConnection({
    host: "5.153.252.199",
    port: "3306",
    user: "bicyclist_user",
    database: "bicyclist_db",
    password: "*yO4p,R;-;1y"
});
con.connect(function(err) {
    if (err) throw err;
});

//DODAJANJE OCEN
app.post('/ocena', async(req, res, next) => {
    if (!req.body.ocena) {
        res.status(400);
        res.json({ message: "Bad Request" });
    } else {
        var ocena = req.body.ocena;
        var ocenaId = req.body.ocenaId;
        con.query("SELECT povprecnaOcena, stOcenov FROM poti WHERE id=" + ocenaId, function(err, result, fields) {
            if (err) throw err;
            var prethodnaOcena = result[0].povprecnaOcena;
            var prethodniStOcenov = result[0].stOcenov;
            var novaOcena = ((prethodnaOcena * prethodniStOcenov) + ocena) / (prethodniStOcenov + 1);
            var sql = "UPDATE poti SET povprecnaOcena='" + novaOcena + "', stOcenov=stOcenov+1 WHERE id=" + ocenaId;
            con.query(sql, function(err, result) {
                if (err) throw err;
                console.log("1 record updated");
            });
        });
    }
})

//DODAJANJE PRILJUBLJENIH POTI
app.post('/priljubljeno/:id', function(req, res, next) {

    if (!req.params.id) {
        res.status(400);
        res.json({ message: "Bad Request" });
    } else {
        var potID = req.params.id;
        con.query("SELECT TK_ID_poti FROM priljubljeni WHERE TK_ID_poti = '" + potID + "'", function(err, result, field) {

            if (result.length === 0) {
                var sql = "INSERT INTO priljubljeni (ID_priljubljeni, TK_ID_poti, TK_ID_uporabnik) VALUES (default,'" + potID + "', 1)";
                con.query(sql, function(err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
            } else {
                var sql2 = "DELETE FROM priljubljeni WHERE TK_ID_poti = '" + potID + "'";
                con.query(sql2, 1, (error, results, fields) => {
                    if (err) throw err;
                    console.log("Deleted");
                });
            }
        });
    }
});

//PRIKAZ PRILJUBLJENIH POTI
app.get('/priljubljeni/:idUporabnika', async(req, res, next) => {
    try {
        let priljubljenePot = await knex('priljubljeni')
            .innerJoin('poti', 'priljubljeni.TK_ID_poti', 'poti.id')
            .where('TK_ID_uporabnik', req.params.idUporabnika);

        res.json(priljubljenePot);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

/* -----REGISTRACIJA UPORABNIKA----- */
app.post('/registracija', async(req, res, next) => {
    let uporabniskoIme = req.body.username;
    let email = req.body.email;

    let uporabnik = {
        'uporabnisko_ime': uporabniskoIme,
        'email': email,
        'geslo': req.body.password,
        'ime': req.body.first_name,
        'priimek': req.body.last_name,
        'tip': 1
    }

    knex.select('uporabnisko_ime', 'email')
        .from('uporabnik')
        .where('uporabnisko_ime', uporabniskoIme)
        .orWhere('email', email)
        .then(uporabniki => {
            if (uporabniki.length === 0) {
                return knex('uporabnik')
                    .insert(uporabnik)
                    .then((idUporabnika) => {
                        console.log(`Uporabnik ${idUporabnika} vstavljen.`);
                        res.json({ 'id': idUporabnika[0],
                                        'sporocilo': "Registracija uspešna."});
                    })
            }
            console.log("Vstavljanje neuspešno");
            res.json({ "sporocilo": "Uporabniško ime/geslo je že v uporabi." });
            return;
        })
})

//GET za profil uporabnika
app.get('/profil/:idUporabnika', async(req, res, next) => {
    try {
        let uporabnik = await knex('uporabnik').where('id', req.params.idUporabnika);
        console.log(uporabnik);
        res.json(uporabnik);
    } catch (err) {
        res.status(500).json(err);
    }
})

app.post('/urediProfil', async(req, res, next) => {
    try {
        await knex('uporabnik')
            .where('id', req.body.id)
            .update({
                'uporabnisko_ime': req.body.uporabnisko_ime,
                'geslo': req.body.geslo,
                'ime': req.body.ime,
                'priimek': req.body.priimek,
                'email': req.body.email
            });
        res.send('Uspesno spremenjeno')
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

/* -----DODAJANJE POTI---- */
app.post('/dodajPot', async(req, res, next) => {
    try {
        console.log(req.body)
        /*let nov = {
            zacetnaTocka: req.body.zacetnaTocka,
            koncnaTocka: req.body.koncnaTocka,
            tip: req.body.tip,
            profil: req.body.profil,
            razdalja: req.body.razdalja,
            vzpon: req.body.vzpon,
            spust: req.body.spust,
            tezavnost: req.body.tezavnost
        };*/
        let pot = await new Poti().save(req.body);
        res.json(await new Poti().fetchAll().toJSON());
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/urediPot/:id', async(req, res, next) => {
    try {
        let pot = await knex('poti').where({id: req.params.id}).select();
        console.log(pot);
        res.json(pot);
    } catch (err) {

    }
})

app.post('/urediPotSpremeni/:id', async(req, res, next) => {
    try {
        console.log("heh");
        await knex('poti').where({id: req.params.id})
            .update(req.body);
    } catch (err) {

    }
})

/* -----DODAJANJE KOMENTARJEV---- */
app.post('/dodajKomentar', async(req, res, next) => {
    try {
        let nov = {
            komentar: req.body.komentar,
            fk_poti: req.body.id
        };
        let pot = await new Komentarji().save(nov);
        res.json({"sporocilo": "pot dodana"});
    } catch (error) {
        /*res.status(500).json(error);*/
    }
});

//Brisanje komentarja
app.post('/brisiKomentar/:idKomentar', async(req, res, next) => {
    try {
        await knex('komentarji')
            .where('ID_komentarji', req.params.idKomentar)
            .del();
        res.send('Komentar zbrisan');
    } catch (error) {
        res.status(500).json(error);
    }
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