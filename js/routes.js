function prikazPoti() {
    var poti;
    $.ajax({
        dataType: "json",
        url: "./poti.json",
        async: false,
        success: function (data) {
            poti = data;
        }
    });

    localStorage.setItem("poti", JSON.stringify(poti));
    for (let i = 0; i < poti.length; i++) {
        prikazJson(poti[i]);
    }

}

function prikazJson(poti) {
    var telo = document.getElementById("routesContainer");
    var potElement = `
                    <div class="row potMain">
                        <div class="col-lg-12">
                           <div class="wrapper forumMain wrapper-content animated fadeInRight">
                               <div class="ibox-content m-b-sm border-bottom">
                                   <div class="p-xs">
                                        <div class="pull-left m-r-md">
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4 naslov">
                                                <h2>${poti.zacetnaTocka} - ${poti.koncnaTocka}</h2>
                                            </div>
                                            <div class="col-md-4 profil">
                                                ${poti.profil} profil
                                            </div>
                                            <div class="col-md-4 tip">
                                                ${poti.tip} 
                                            </div>
                                        </div>                                      
                                        <div class="row">
                                            <div class="col-sm-4 razdalja">
                                                Razdalja 
                                                <p class="cifra">${poti.razdalja}</p>
                                            </div>                                    
                                            <div class="col-sm-4 vzpon">
                                                Vzpon
                                                <p class="cifra">${poti.vzpon}</p>
                                            </div>                                                                               
                                            <div class="col-sm-4 spust">
                                                Spust
                                                <p class="cifra">${poti.spust}</p>
                                            </div>
                                        </div>
                                        
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>
        `;
    $(telo).append(potElement);
}

function preisciIme() {
    $("div.potMain").remove();
    var a = document.getElementById("isciPot").value;
    a = a.toUpperCase();
    let tip = document.getElementById("tipSearch").value;
    let profil = document.getElementById("profilSearch").value;

    var json = JSON.parse(localStorage.getItem("poti"));
    //console.log(json);
    if (tip == "vse" && profil == "vse") {
        for (let i = 0; i < json.length; i++) {
            if (json[i].zacetnaTocka.toUpperCase().includes(a) || json[i].koncnaTocka.toUpperCase().includes(a)) {
                prikazJson(json[i]);
            }
        }
    } else if (tip == "vse" && profil != "vse") {
        for (let i = 0; i < json.length; i++) {
            if ((json[i].zacetnaTocka.toUpperCase().includes(a) || json[i].koncnaTocka.toUpperCase().includes(a)) &&
                json[i].profil == profil) {
                prikazJson(json[i]);
            }
        }
    } else if (tip != "vse" && profil == "vse") {
        for (let i = 0; i < json.length; i++) {
            if ((json[i].zacetnaTocka.toUpperCase().includes(a) || json[i].koncnaTocka.toUpperCase().includes(a)) &&
                json[i].tip == tip) {
                prikazJson(json[i]);
            }
        }
    } else {
        for (let i = 0; i < json.length; i++) {
            if ((json[i].zacetnaTocka.toUpperCase().includes(a) || json[i].koncnaTocka.toUpperCase().includes(a)) &&
                json[i].tip == tip && json[i].profil == profil) {
                prikazJson(json[i]);
            }
        }
    }
}

function preisciProfil() {
    $('#isciPot').val('');
    $("div.potMain").remove();
    let a = document.getElementById("profilSearch").value;
    let tip = document.getElementById("tipSearch").value;

    var json = JSON.parse(localStorage.getItem("poti"));

    if (a == "vse" && tip == "vse") {
        for (let i = 0; i < json.length; i++) {
            prikazJson(json[i]);
        }
    } else if (a == "vse" && tip != "vse") {
        for (let i = 0; i < json.length; i++) {
            if (json[i].tip == tip) {
                prikazJson(json[i]);
            }
        }
    } else if (a != "vse"){
        if (tip == "vse") {
            for (let i = 0; i < json.length; i++) {
                if (json[i].profil == a) {
                    prikazJson(json[i]);
                }
            }
        } else {
            for (let i = 0; i < json.length; i++) {
                if (json[i].profil == a && json[i].tip == tip) {
                    prikazJson(json[i]);
                }
            }
        }
    }
}

function preisciTip() {
    $('#isciPot').val('');
    $("div.potMain").remove();
    let a = document.getElementById("tipSearch").value;
    let profil = document.getElementById("profilSearch").value;

    var json = JSON.parse(localStorage.getItem("poti"));

    if (a == "vse" && profil == "vse") {
        for (let i = 0; i < json.length; i++) {
            console.log(json);
            prikazJson(json[i]);
        }
    } else if (a == "vse" && profil != "vse") {
        for (let i = 0; i < json.length; i++) {
            if (json[i].profil == profil) {
                prikazJson(json[i]);
            }
        }
    } else if (a != "vse") {
        if (profil == "vse") {
            for (let i = 0; i < json.length; i++) {
                if (json[i].tip == a) {
                    prikazJson(json[i]);
                }
            }
        } else {
            for (let i = 0; i < json.length; i++) {
                if (json[i].profil == profil && json[i].tip == a) {
                    prikazJson(json[i]);
                }
            }
        }
    }
}
