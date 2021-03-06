function prikazPoti() {
    var poti;
    $.ajax({
        dataType: "json",
        type: 'GET',
        url: "http://localhost:3000/routes",
        async: false,
        success: function(data) {
            poti = data;
        }
    });

    localStorage.setItem("poti", JSON.stringify(poti));
    for (let i = 0; i < poti.length; i++) {
        if (poti[i].potrjeno == 1)
            prikazJson(poti[i]);
    }
    //STARS
    $(document).ready(function() {
        $('.star').hover(function() {
            if (!$(".voted")[0]) {
                $(this).prevAll().andSelf().removeClass('fa-star-o').addClass('fa-star');
            }
        });
        $('.star').mouseout(function() {
            if (!$(".voted")[0]) {
                $(this).prevAll().andSelf().removeClass('fa-star').addClass('fa-star-o');
            }
        });
        $('.star').click(function(e) {
            if (!$(".voted")[0]) {
                const url = 'http://localhost:3000/ocena';
                var ocena = $(this).prevAll().length + 1;
                var ocenaId = e.target.parentNode.id;
                $(this).prevAll().andSelf().removeClass('fa-star-o').addClass('voted');
                var pOcena = new Object();
                pOcena.ocena = ocena;
                pOcena.ocenaId = ocenaId;
                const data = JSON.stringify(pOcena);
                console.log(data);
                $.ajax({
                    contentType: 'application/json',
                    url: url,
                    data: data,
                    type: 'POST',
                    success: function(data) {
                        console.log(JSON.stringify(data));
                    }
                });
                if (confirm('Vaša ocena je ' + ocena + '. Hvala za oceno!')) {
                    window.location.reload();
                } else {
                    window.location.reload();
                }
            }
        });
    });
    //STARS END
}

function prikazJson(poti) {
    var telo = document.getElementById("routesContainer");
    var tezavnost = 'težavnost: ';

    for (let i = 1; i <= 5; i++) {
        if (i <= parseInt(poti.tezavnost)) {
            tezavnost += '<li class="list-inline-item m-0"><i class="fa fa-star fa-lg text-success"></i></li>'
        } else {
            tezavnost += '<li class="list-inline-item m-0"><i class="fa fa-star fa-lg text-light"></i></li>'
        }
    }

    potElement = `
<div style="color:#fff" class="rateClass">Oceni pot :) </div>
                <div id="${poti.id}" class="stars">
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                </div>
<div class="potMain media align-items-lg-center flex-column flex-lg-row pr-3 border-bottom roundedt" style="background-color: rgba(255, 255, 255, 0.7)">
            <div class="media-body order-2 order-lg-1">
            <div style="display: flex; justify-content: space-between;">
               
                <h3 class="mt-0 font-weight-bold mb-2">${poti.zacetnaTocka} - ${poti.koncnaTocka}</h3>
                <div class="fav-btn"  style="margin: 0 0px 10px 10px; padding-bottom: 30px;">
                <button class="btn btn-success preglej-pot" id="preglej${poti.id}" onclick="preglejPot(this.id)">Preglej pot</button>   
                <i class="i" id="priljubljena${poti.id}" onclick="dodajPriljubljene(this.id)"></i>
                 <span id="liked">liked!</span>
                </div>  
            </div>
              <h6>Profil: <b>${poti.profil}</b> &nbsp;&nbsp;&nbsp; Tip: <b>${poti.tip}</b></h6>   
              <div class="d-flex align-items-center justify-content-between mt-1">
                <h6 class="font-weight-bold my-2">Razdalja: ${poti.razdalja}km</h6>
                <h6 class="font-weight-bold my-2">Vzpon: ${poti.vzpon}m</h6>
                <h6 class="font-weight-bold my-2">Spust: ${poti.spust}m</h6>
                <ul class="list-inline small">
                    ${tezavnost}
                </ul>
               
              </div>
            </div>
            <div class="fill" style="width: 30%; height: 200px;"> 
                <img src="${poti.img}">
            
            </iframe>              
            </div><!--TU SLIKA-->
          </div>
        <div class="potBrisi media align-items-lg-center flex-column flex-lg-row pr-3 border-bottom roundedt" style="background-color: rgba(255, 255, 255, 0.7)">
            <button class="btn btn-danger brisiPotGumb" id="brisiPot${poti.id}" onclick="brisiPot(this.id)">Izbriši</button>
            <a class="btn btn-success urediPotGumb" id="urediPot${poti.id}" target="__blank" href="urejanje_poti.html" onclick="shraniPot(this.id)">Uredi</a>
        </div>
        <hr class="lineBreak" style="background-color: white">
    `
    $(telo).append(potElement);
    //access
    if (sessionStorage.getItem("loggedIn") === null) {
        var x = document.getElementsByClassName('stars').length;
        for (let i = 0; i < x; i++) {
            document.getElementsByClassName('stars')[i].innerHTML = "";
            document.getElementsByClassName('rateClass')[i].innerHTML = "";
            document.getElementsByClassName('potBrisi')[i].innerHTML = "";
            var l = i + 1;
            var tmp = "priljubljena" + l;
            document.getElementById(tmp).style.display = "none";
        }
    } else {
        if (sessionStorage.getItem("loggedIn") !== null && JSON.parse(sessionStorage.getItem("loggedIn")).tip != 3) {
            var x = document.getElementsByClassName('potBrisi').length;
            for (let i = 0; i < x; i++)
                document.getElementsByClassName('potBrisi')[i].innerHTML = "";
        }
    }
    //access end
}

function prikazJsonPriljubljeni(poti) {
    var telo = document.getElementById("routesContainer");
    var tezavnost = 'težavnost: ';

    for (let i = 1; i <= 5; i++) {
        if (i <= parseInt(poti.tezavnost)) {
            tezavnost += '<li class="list-inline-item m-0"><i class="fa fa-star fa-lg text-success"></i></li>'
        } else {
            tezavnost += '<li class="list-inline-item m-0"><i class="fa fa-star fa-lg text-light"></i></li>'
        }
    }

    potElement = `
<div style="color:#fff" class="rateClass">Oceni pot :) </div>
                <div id="${poti.id}" class="stars">
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                    <span class="fa fa-star-o star"></span>
                </div>
<div class="potMain media align-items-lg-center flex-column flex-lg-row pr-3 border-bottom roundedt" style="background-color: rgba(255, 255, 255, 0.7)">
            <div class="media-body order-2 order-lg-1">
            <div style="display: flex; justify-content: space-between;">
               
                <h3 class="mt-0 font-weight-bold mb-2">${poti.zacetnaTocka} - ${poti.koncnaTocka}</h3>
                <div class="fav-btn"  style="margin: 0 0px 10px 10px; padding-bottom: 30px;">
                <button class="btn btn-success preglej-pot" id="preglej${poti.id}" onclick="preglejPot(this.id)">Preglej pot</button>   
                <i class="i2" id="priljubljena${poti.id}" onclick="dodajPriljubljene(this.id)"></i>
                 <span id="liked">liked!</span>
                </div>  
            </div>
              <h6>Profil: <b>${poti.profil}</b> &nbsp;&nbsp;&nbsp; Tip: <b>${poti.tip}</b></h6>   
              <div class="d-flex align-items-center justify-content-between mt-1">
                <h6 class="font-weight-bold my-2">Razdalja: ${poti.razdalja}km</h6>
                <h6 class="font-weight-bold my-2">Vzpon: ${poti.vzpon}m</h6>
                <h6 class="font-weight-bold my-2">Spust: ${poti.spust}m</h6>
                <ul class="list-inline small">
                    ${tezavnost}
                </ul>
               
              </div>
            </div>
            <div class="fill" style="width: 30%; height: 200px;"> 
                <img src="${poti.img}">
            
            </iframe>              
            </div><!--TU SLIKA-->
          </div>
        <div class="potBrisi media align-items-lg-center flex-column flex-lg-row pr-3 border-bottom roundedt" style="background-color: rgba(255, 255, 255, 0.7)">
            <button class="btn btn-danger brisiPotGumb" id="brisiPot${poti.id}" onclick="brisiPot(this.id)">Izbriši</button>
            <a class="btn btn-success urediPotGumb" id="urediPot${poti.id}" target="__blank" href="urejanje_poti.html" onclick="shraniPot(this.id)">Uredi</a>
        </div>
        <hr class="lineBreak" style="background-color: white">
    `
    $(telo).append(potElement);
    //access
    if (sessionStorage.getItem("loggedIn") === null) {
        var x = document.getElementsByClassName('stars').length;
        for (let i = 0; i < x; i++) {
            document.getElementsByClassName('stars')[i].innerHTML = "";
            document.getElementsByClassName('rateClass')[i].innerHTML = "";
            document.getElementsByClassName('potBrisi')[i].innerHTML = "";
            var l = i + 1;
            var tmp = "priljubljena" + l;
            document.getElementById(tmp).style.display = "none";
        }
    } else {
        if (sessionStorage.getItem("loggedIn") !== null && JSON.parse(sessionStorage.getItem("loggedIn")).tip != 3) {
            var x = document.getElementsByClassName('potBrisi').length;
            for (let i = 0; i < x; i++)
                document.getElementsByClassName('potBrisi')[i].innerHTML = "";
        }
    }
    //access end
}

function dodajPriljubljene(idPriljubljena) {
    let id = idPriljubljena.slice(idPriljubljena.length - 1);

    $("#" + idPriljubljena).toggleClass("press", 1000);

    $.ajax({
        type: 'POST',
        url: "http://localhost:3000/priljubljeno/" + id,
        success: function() {
            console.log("Uspešno shranjeno");
        }
    });

}

function preisci() {
    let niz = document.getElementById("textSearch").value;
    let profil = document.getElementById("profilSearch").value;
    let tip = document.getElementById("tipSearch").value;
    let tezavnost = document.getElementById("tezavnostSearch").value;
    niz = niz.toUpperCase();

    let search = {
        "niz": niz,
        "profil": profil,
        "tip": tip,
        "tezavnosti": tezavnost
    }
    $.ajax({
        dataType: "json",
        type: "POST",
        url: "http://localhost:3000/routes",
        data: search,
        async: false,
        success: function(data) {
            console.log(data.length)
            $("div.potMain").remove();
            $("div.potBrisi").remove();
            $("div.stars").remove();
            $("div.rateClass").remove();
            $("hr.lineBreak").remove();
            for (let i = 0; i < data.length; i++) {
                console.log(data[i]);
                prikazJson(data[i]);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function brisiPot(idBrisi) {
    let id = idBrisi.slice(idBrisi.length - 1);

    $.ajax({
        type: "POST",
        url: "http://localhost:3000/routesBrisi/" + id,
        success: function(data) {
            alert("Brisanje uspešno");
            $("div.potMain").remove();
            $("div.potBrisi").remove();
            $("div.stars").remove();
            $("div.rateClass").remove();
            $("hr.lineBreak").remove();
            for (let i = 0; i < data.length; i++) {
                console.log(data[i]);
                prikazJson(data[i]);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function preglejPot(idPreglej) {
    let id = idPreglej.slice(idPreglej.length - 1);
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/pot?id=" + id,
        success: function(res) {
            /*var tabPoti = window.open();
            tabPoti.document.write(res);
            tabPoti.document.close();*/
            localStorage.setItem("trenutnaPot", id);
            document.open();
            document.write(res);
            document.close();
        }
    })
}

function brisiKomentar(idKomentar) {
    console.log(idKomentar)
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/brisiKomentar/" + idKomentar,
        success: function(data) {
            console.log(data);
            preglejPot("Pot" + localStorage.getItem("trenutnaPot"));
        },
        error: function(err) {
            console.log(err);
        }
    });
}

$(document).ready(() => {
    //Gumb za dodajanje k priljubljenim
    $('#i').click(function() {
            $.ajax({
                contentType: 'application/json',
                url: "http://localhost:3000/priljubljeno",
                data: poti.id,
                type: 'POST',
                success: function() {
                    console.log("Uspešno shranjeno");
                }
            });
        })
        // Gumb za spremembo podatkov uporabnike
    $('#buttonSpremembe').click(function() {
        let ime = $("#spremeniIme").val();
        let priimek = $("#spremeniPriimek").val();
        let mail = $("#spremeniMail").val();
        let uporabniskoIme = $("#spremeniUime").val();
        let geslo = $("#spremeniGeslo").val();

        let user = JSON.parse(sessionStorage.getItem("loggedIn")).ID;

        let uporabnik = {
            'id': user,
            'uporabnisko_ime': uporabniskoIme,
            'geslo': geslo,
            'ime': ime,
            'priimek': priimek,
            'email': mail
        };

        console.log(uporabnik);


        $.ajax({
            dataType: 'application/json',
            type: 'POST',
            url: 'http://localhost:3000/urediProfil',
            data: uporabnik,
            success: function(data) {
                alert(data);
            },
            error: function(err) {
                console.log(err);
            }
        });
        location.reload();
    })
});


function prikazPriljubljenih(bolean) {
    //Dodaj ID uporabnika iz sessionStorage-a

    $.ajax({
        dataType: "json",
        type: 'GET',
        url: "http://localhost:3000/priljubljeni/" + 1,
        success: function(data) {

            for (let i = 0; i < data.length; i++) {
                prikazJsonPriljubljeni(data[i]);

            }
        }
    });
}

$('#registracijaForm').submit(() => {
    let pass = document.forms["registracija"]["password"].value;
    let pass2 = document.forms["registracija"]["confirm_password"].value;
    let username = document.forms["registracija"]["username"].value;
    let email = document.forms["registracija"]["email"].value;

    var format = /[ `!#$%^&*()_+čćšđž\-=\[\]{};':"\\|,<>\/?~]/;
    if (pass.length < 6) {
        alert("Geslo mora vsebovati vsaj 6 znakov.");
        return false;
    } else if (format.test(username) || format.test(email)) {
        alert("Geslo in E-pošta ne smeta vsebovati šumnikov ter posebnih znakov, z izjemo @.");
        return false;
    } else {
        if (pass === pass2)
            registriraj();
        else {
            alert("Gesli se ne ujemata.");
            return false;
        }
    }
})

function registriraj() {
    let url = 'http://localhost:3000/registracija';
    let password = document.forms["registracija"]["password"].value;
    let first_name = document.forms["registracija"]["first_name"].value;
    let last_name = document.forms["registracija"]["last_name"].value;
    let email = document.forms["registracija"]["email"].value;
    let username = document.forms["registracija"]["username"].value;

    let uporabnik = {
        'password': password,
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'username': username,
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: uporabnik,
        async: false,
        success: function(data) {
            alert(data.sporocilo);
        },
        error: function(err) {
            alert(err.sporocilo);
        }
    });
}

function izpisiUporabnika(izpisiIme) {
    //Dodaj ID uporabnika iz sessionStorage-a

    let imeU = document.getElementById("imeUporabika");
    let mail = document.getElementById("mailUporabnika");
    let rd = document.getElementById("rdUporabnika");
    let uporabniskoIme = document.getElementById("uporabniskoIme");
    let user = JSON.parse(sessionStorage.getItem("loggedIn")).ID;

    $.ajax({
        dataType: 'json',
        type: 'GET',
        type: 'GET',
        url: 'http://localhost:3000/profil/' + user,
        success: function(data) {
            data = data[0];

            imeU.innerHTML = (`${data.ime} ${data.priimek}`);
            if (izpisiIme == 1) {
                uporabniskoIme.innerHTML = `${data.uporabnisko_ime}`;
                mail.innerHTML = `${data.email}`;
            }

            if (izpisiIme == 0) {
                document.getElementById("spremeniIme").value = data.ime;
                document.getElementById("spremeniPriimek").value = data.priimek;
                document.getElementById("spremeniMail").value = data.email;
                document.getElementById("spremeniUime").value = data.uporabnisko_ime;
                document.getElementById("spremeniGeslo").value = data.ime;
            }
        },
        error: function(err) {
            console.log(err);
        }
    });

}

function dodajKomentar(komentar, id) {
    let uporabnik = JSON.parse(sessionStorage.getItem("loggedIn")).username;
    $.ajax({
        dataType: 'application/json',
        type: 'POST',
        url: 'http://localhost:3000/dodajKomentar',
        data: {
            'komentar': komentar,
            'id': id,
            'uporabnik': uporabnik
        },
        success: function(data) {
            console.log(data);
        },
        error: function(err) {
            console.error(err);
        }
    });
}

function prikazKomentarjev(id) {
    console.log("prikazKomentarjev");
    let url = "http://localhost:3000/komentarji/" + id;
    console.log(url);
    $.ajax({
        dataType: "json",
        type: 'GET',
        url: url,
        success: function(data) {
            console.log(data);
            preglejPot("Pot" + localStorage.getItem("trenutnaPot"));
        },
        error: function(err) {
            console.error(err);
        }
    });
}

function dodajPot() {
    let zacetnaTocka = document.forms["dodajanjePoti"]["zacetnaTocka"].value;
    let koncnaTocka = document.forms["dodajanjePoti"]["koncnaTocka"].value;
    let profil = document.forms["dodajanjePoti"]["profil"].value;
    let tip = document.forms["dodajanjePoti"]["tip"].value;
    let razdalja = document.forms["dodajanjePoti"]["razdalja"].value;
    let vzpon = document.forms["dodajanjePoti"]["vzpon"].value;
    let spust = document.forms["dodajanjePoti"]["spust"].value;
    let tezavnost = document.forms["dodajanjePoti"]["tezavnost"].value;
    let slika = document.forms["dodajanjePoti"]["slika"].value;

    let telo = {
        'zacetnaTocka': zacetnaTocka,
        'koncnaTocka': koncnaTocka,
        'tip': tip,
        'profil': profil,
        'razdalja': razdalja,
        'vzpon': vzpon,
        'spust': spust,
        'tezavnost': tezavnost,
        'img': slika,
        'fk_uporabnik': 100,
        'potrjeno': 0
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:3000/dodajPot",
        data: telo,
        async: false,
        success: function(data) {
            alert("Pot uspešno dodana")
        }
    });
}

function shraniPot(idPoti) {
    let id = idPoti.slice(idPoti.length - 1);
    localStorage.setItem("trenutnaPot", id);
    /*urediPot();*/
}

function urediPot() {
    console.log("haha");
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/urediPot/" + localStorage.getItem("trenutnaPot"),
        async: false,
        success: function(podatki) {
            let data = podatki[0];
            console.log(data);
            document.forms["urejanjePoti"]["zacetnaTocka"].value = data.zacetnaTocka;
            document.forms["urejanjePoti"]["koncnaTocka"].value = data.koncnaTocka;
            document.forms["urejanjePoti"]["profil"].value = data.profil;
            document.forms["urejanjePoti"]["tip"].value = data.tip;
            document.forms["urejanjePoti"]["razdalja"].value = data.razdalja;
            document.forms["urejanjePoti"]["vzpon"].value = data.vzpon;
            document.forms["urejanjePoti"]["spust"].value = data.spust;
            document.forms["urejanjePoti"]["tezavnost"].value = data.tezavnost;
            document.forms["urejanjePoti"]["slika"].value = data.img;
        }
    });
}

function postUrediPot() {
    let zacetnaTocka = document.forms["urejanjePoti"]["zacetnaTocka"].value;
    let koncnaTocka = document.forms["urejanjePoti"]["koncnaTocka"].value;
    let profil = document.forms["urejanjePoti"]["profil"].value;
    let tip = document.forms["urejanjePoti"]["tip"].value;
    let razdalja = document.forms["urejanjePoti"]["razdalja"].value;
    let vzpon = document.forms["urejanjePoti"]["vzpon"].value;
    let spust = document.forms["urejanjePoti"]["spust"].value;
    let tezavnost = document.forms["urejanjePoti"]["tezavnost"].value;
    let slika = document.forms["urejanjePoti"]["slika"].value;
    let idPoti = localStorage.getItem("trenutnaPot");
    console.log(idPoti)
    let telo = {
        'zacetnaTocka': zacetnaTocka,
        'koncnaTocka': koncnaTocka,
        'tip': tip,
        'profil': profil,
        'razdalja': razdalja,
        'vzpon': vzpon,
        'spust': spust,
        'tezavnost': tezavnost,
        'img': slika,
        'fk_uporabnik': 1,
        'potrjeno': 1
    }
    console.log(telo)

    $.ajax({
        type: "POST",
        url: "http://localhost:3000/urediPotSpremeni/" + idPoti,
        data: telo,
        async: false,
        success: function(data) {
            alert(data.sporocilo)
        }
    });
}

let hbsMap;

/*function initMap() {
    let id = $(".map-hbs").prop('id');
    console.log(id);
    hbsMap = new google.maps.Map(document.getElementById(id), {
        center: { lat: 46.119944, lng: 14.815333},
        zoom: 8,
    });
}*/


function initMap() {
    let id = $(".map-hbs").prop('id');
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(document.getElementById(id), {
        zoom: 8,
        center: { lat: 46.119944, lng: 14.815333 },
    });
    directionsRenderer.setMap(map);

    /*const onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    };
    document.getElementById("start").addEventListener("change", onChangeHandler);
    document.getElementById("end").addEventListener("change", onChangeHandler);*/
    calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    console.log(localStorage.getItem("trenutnaPot"));
    var zacetnaTocka;
    var koncnaTocka;
    $.ajax({
        dataType: "json",
        type: 'GET',
        url: "http://localhost:3000/pridobiEnoPot/" + localStorage.getItem("trenutnaPot"),
        async: false,
        success: function(data) {
            zacetnaTocka = data[0].zacetnaTocka;
            koncnaTocka = data[0].koncnaTocka;
        }
    });
    console.log(zacetnaTocka);
    console.log(koncnaTocka);
    directionsService.route({
            origin: zacetnaTocka,
            destination: koncnaTocka,
            travelMode: google.maps.TravelMode.DRIVING
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
}