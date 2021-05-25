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
    knex.schema.dropTableIfExists('poti').catch( (err) => {
        console.log(err); throw err
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
    }).then( () =>
        console.log("Tabela 'poti' ustvarjena."))
        .catch( (err) => {
            console.log(err); throw  err
        });

        const poti = require('./nodejs/poti.json');

        await knex('poti').insert(poti)
            .then( () => {
                console.log("Poti vstavljene");
            })
            .catch( (err) => {
                console.log(err); throw  err
            });

        knex.destroy();
}

napolniBazo();