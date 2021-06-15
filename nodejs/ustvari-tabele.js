//DB CONNECTION (CHANGE THIS FOR YOUR LOCAL SERVER)
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

//DROP TABLES
async function napolniBazo() {
    knex.schema.dropTableIfExists('komentarji').catch((err) => {
        console.log(err);
        throw err
    });
    knex.schema.dropTableIfExists('hoteli_na_poti').catch((err) => {
        console.log(err);
        throw err
    });
    knex.schema.dropTableIfExists('hoteli').catch((err) => {
        console.log(err);
        throw err
    });
    knex.schema.dropTableIfExists('odgovori').catch((err) => {
        console.log(err);
        throw err
    });
    knex.schema.dropTableIfExists('vprasanja').catch((err) => {
        console.log(err);
        throw err
    });
    knex.schema.dropTableIfExists('nasveti').catch((err) => {
        console.log(err);
        throw err
    });
    knex.schema.dropTableIfExists('poti').catch((err) => {
        console.log(err);
        throw err
    });
    knex.schema.dropTableIfExists('priljubljeni').catch((err) => {
        console.log(err);
        throw err
    });
    knex.schema.dropTableIfExists('uporabnik').catch((err) => {
        console.log(err);
        throw err
    });
    knex.schema.dropTableIfExists('tip_uporabnika').catch((err) => {
        console.log(err);
        throw err
    });

    //TIP_UPORABNIK
    await knex.schema.createTable('tip_uporabnika', (table) => {
            table.increments('id');
            table.enu('tip_uporabnika', ['Registriran uporabnik', 'Strokovnjak', 'Administrator']).notNullable();
        }).then(() =>
            console.log("Tabela 'tip_uporabnika' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    //UPORABNIK
    await knex.schema.createTable('uporabnik', (table) => {
            table.increments('id');
            table.string('uporabnisko_ime').notNullable();
            table.string('geslo').notNullable();
            table.integer('tip').notNullable();
            table.string('ime').notNullable();
            table.string('priimek').notNullable();
            table.string('email').notNullable();
            /* table.date('datum_rojstva').notNullable();
             table.integer('spol').notNullable();
             table.integer('visina');
             table.integer('teza');
             //table.integer('tip_uporabnika_id').references('id').inTable('tip_uporabnika');
             */
        }).then(() =>
            console.log("Tabela 'uporabnik' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    let uporabniki = [
        {
            'uporabnisko_ime': 'test1',
            'geslo': 'test',
            'ime': 'Test',
            'priimek': 'Test',
            'email': 'test@test',
            'tip': 1
        },
        {
            'uporabnisko_ime': 'test2',
            'geslo': 'test',
            'ime': 'Test',
            'priimek': 'Test',
            'email': 'test@test',
            'tip': 2
        },
        {
            'uporabnisko_ime': 'test3',
            'geslo': 'test',
            'ime': 'Test',
            'priimek': 'Test',
            'email': 'test@test',
            'tip': 3
        }
    ]
    await knex('uporabnik').insert(uporabniki)
        .then(() => {
            console.log("Poti vstavljene");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    //PRILJUBLJENI
    await knex.schema.createTable('priljubljeni', (table) => {
            table.increments('ID_priljubljeni');
            table.integer('TK_ID_poti').unsigned().references('id').inTable('poti');
            table.integer('TK_ID_uporabnik').unsigned().references('id').inTable('uporabnik');
        }).then(() =>
            console.log("Tabela 'priljubljeni' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    //POTI
    await knex.schema.createTable('poti', (table) => {
            table.increments('id');
            table.string('zacetnaTocka').notNullable();
            table.string('koncnaTocka').notNullable();
            table.enu('tip', ['Cestno kolo', 'Gorsko kolo', 'Downhill kolo']).notNullable();
            table.enu('profil', ['Ravninski', 'Gričevnat', 'Hribovit', 'Gorski']).notNullable();
            table.integer('razdalja').notNullable();
            table.integer('vzpon').notNullable();
            table.integer('spust').notNullable();
            table.enu('tezavnost', ['1', '2', '3', '4', '5']).notNullable();
            table.string('mapa', [1000]);
            table.float('povprecnaOcena');
            table.integer('stOcenov');
            table.string('img');
            table.integer('fk_uporabnik').unsigned().references('id').inTable('uporabnik');
            table.boolean('potrjeno').defaultTo(true);
        }).then(() =>
            console.log("Tabela 'poti' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    const poti = require('../nodejs/poti.json');

    await knex('poti').insert(poti)
        .then(() => {
            console.log("Poti vstavljene");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    //VPRASANJA
    await knex.schema.createTable('vprasanja', (table) => {
            table.increments('ID_vprasanja');
            table.string('vprasanje').notNullable();
        }).then(() =>
            console.log("Tabela 'vprasanja' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    const vprasanja = require('../nodejs/questions.json');

    await knex('vprasanja').insert(vprasanja)
        .then(() => {
            console.log("Vprasanja vstavljene");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    // ODGOVORI
    await knex.schema.createTable('odgovori', (table) => {
            table.increments('ID_odgovori');
            table.string('odgovor').notNullable();
            table.integer('ID_TK_vprasanja').unsigned().references('ID_vprasanja').inTable('vprasanja');
        }).then(() =>
            console.log("Tabela 'odgovori' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    const odgovori = require('../nodejs/odgovori.json');

    await knex('odgovori').insert(odgovori)
        .then(() => {
            console.log("Odgovori vstavljene");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    // NASVETI
    await knex.schema.createTable('nasveti', (table) => {
            table.increments('ID_nasvet');
            table.string('naslovNasveta').notNullable();
            table.string('nasvet');
        }).then(() =>
            console.log("Tabela 'nasveti' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });


    const nasveti = require('../nodejs/nasveti.json');

    await knex('nasveti').insert(nasveti)
        .then(() => {
            console.log("Nasveti vstavljeni");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    // KOMENTARJI
    await knex.schema.createTable('komentarji', (table) => {
            table.increments('ID_komentarji');
            table.string('komentar');
            table.integer('fk_poti').unsigned().references('id').inTable('poti');
            table.integer('fk_uporabnik').unsigned().references('id').inTable('uporabnik');

        }).then(() =>
            console.log("Tabela 'komentarji' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    const komentarji = require('../nodejs/komentarji.json');

    await knex('komentarji').insert(komentarji)
        .then(() => {
            console.log("Komentarji vstavljeni");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    //HOTELI
    await knex.schema.createTable('hoteli', (table) => {
            table.increments('id');
            table.string('naziv').notNullable();
            table.string('naslov').notNullable();
            table.string('email').notNullable();
            table.string('telefon').notNullable();
        }).then(() =>
            console.log("Tabela hoteli ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    //HOTELI_NA_POTI
    await knex.schema.createTable('hoteli_na_poti', (table) => {
            table.integer('fk_poti').unsigned().references('id').inTable('poti');
            table.integer('fk_hoteli').unsigned().references('id').inTable('hoteli');
        }).then(() =>
            console.log("Tabela hoteli_na_poti ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    const hoteli = require('../hoteli.json');

    await knex('hoteli').insert(hoteli)
        .then(() => {
            console.log("Hoteli vstavljeni");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    const hoteli_na_poti = require('./hoteli_na_poti.json');

    await knex('hoteli_na_poti').insert(hoteli_na_poti)
        .then(() => {
            console.log("Hoteli na poti vstavljeni");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });


    knex.destroy();
}

napolniBazo();