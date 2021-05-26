var knex = require('knex')({
    client: 'mysql',
    connection: {
        //host: '192.168.0.1',
        port: 3307,
        user: 'root',
        password: 'kolesarji',
        database: 'kolesarskepoti'
    }
});

async function napolniBazo() {
    knex.schema.dropTableIfExists('poti').catch((err) => {
        console.log(err);
        throw err
    });
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
        }).then(() =>
            console.log("Tabela 'poti' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    const poti = require('./nodejs/poti.json');

    await knex('poti').insert(poti)
        .then(() => {
            console.log("Poti vstavljene");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    knex.destroy();
    //VPRASANJA

    knex.schema.dropTableIfExists('vprasanja').catch((err) => {
        console.log(err);
        throw err
    });
    await knex.schema.createTable('vprasanja', (table) => {
            table.increments('ID_vprasanja');
            table.string('vprasanje').notNullable();
        }).then(() =>
            console.log("Tabela 'vprasanja' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    const vprasanja = require('./nodejs/questions.json');

    await knex('vprasanje').insert(vprasanje)
        .then(() => {
            console.log("Vprasanje vstavljene");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    knex.destroy();
    // ODGOVORI

    knex.schema.dropTableIfExists('odgovori').catch((err) => {
        console.log(err);
        throw err
    });
    await knex.schema.createTable('odgovori', (table) => {
            table.increments('ID_odgovori');
            table.string('odgovor').notNullable();
            table.integer('ID_TK_vprasanja').references('ID_vprasanja');
        }).then(() =>
            console.log("Tabela 'odgovori' ustvarjena."))
        .catch((err) => {
            console.log(err);
            throw err
        });

    const vprasanja = require('./nodejs/anwsers.json');

    await knex('vprasanje').insert(vprasanje)
        .then(() => {
            console.log("Vprasanje vstavljene");
        })
        .catch((err) => {
            console.log(err);
            throw err
        });

    knex.destroy();
}

napolniBazo();