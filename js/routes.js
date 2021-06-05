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
<br>
<div style="color:#fff" class="rateClass">Rate this route :) </div>
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
            <div style="width: 30%; height: 100%;">
             <iframe
                src=${poti.mapa}
                width="97%" height="100%" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false"
                tabindex="0">
        </iframe></div><!--TU SLIKA-->
          </div>
        <div class="potBrisi media align-items-lg-center flex-column flex-lg-row pr-3 border-bottom roundedt" style="background-color: rgba(255, 255, 255, 0.7)">
        <button class="btn btn-danger brisiPotGumb" id="brisiPot${poti.id}" onclick="brisiPot(this.id)">Izbriši</button>
        <button class="btn btn-success urediPotGumb">Uredi</button>
        </div>
    `
    $(telo).append(potElement);
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
            var tabPoti = window.open();
            tabPoti.document.write(res);
        }
    })


}

$(document).ready(() => {

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
});

function prikazPriljubljenih() {

    $.ajax({
        dataType: "json",
        type: 'GET',
        url: "http://localhost:3000/priljubljeni/" + 1,
        success: function(data) {
            for (let i = 0; i < data.length; i++) {
                prikazJson(data[i]);
            }
        }
    });




}