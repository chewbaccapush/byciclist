/*!
* Start Bootstrap - Grayscale v6.0.4 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
(function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using anime.js
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').on('click', function () {
        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ?
                target :
                $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                anime({
                    targets: 'html, body',
                    scrollTop: target.offset().top - 72,
                    duration: 1000,
                    easing: 'easeInOutExpo'
                });
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: 100,
    });

    // Collapse Navbar
    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
})(jQuery); // End of use strict


//GET ROUTES
async function getRoutes() {
    const response = await fetch("http://localhost:3000/potrjevanje");
    const rawData = await response.text();
    var JSONData = JSON.parse(rawData);
    var datax = [];
    for (let i = 0; i < JSONData.length; i++) {
        var newItem = { id: JSONData[i].id, zacetnaTocka: JSONData[i].zacetnaTocka, koncnaTocka: JSONData[i].koncnaTocka, tip: JSONData[i].tip, profil: JSONData[i].profil, razdalja: JSONData[i].razdalja, tezavnost: JSONData[i].tezavnost };
        datax.push(newItem);
    }
    if (localStorage.getItem("nepotrjenePoti") === null) {
        localStorage.setItem("nepotrjenePoti", JSON.stringify(datax));
    } else {
        refreshPotrjevanje();
    }
}

function refreshPotrjevanje() {
    var nepotrjenePoti = localStorage.getItem("nepotrjenePoti");
    nepotrjenePoti = JSON.parse(nepotrjenePoti);
    const tabela = document.getElementById("tabela-hoteli");
    for (const poti of nepotrjenePoti) {
        let vrstica = tabela.insertRow(-1);
        let id = vrstica.insertCell(-1);
        id.innerHTML = poti.id;
        let naziv = vrstica.insertCell(-1);
        naziv.innerHTML = poti.zacetnaTocka;
        let naslov = vrstica.insertCell(-1);
        naslov.innerHTML = poti.koncnaTocka;
        let email = vrstica.insertCell(-1);
        email.innerHTML = poti.tip;
        let telefon = vrstica.insertCell(-1);
        telefon.innerHTML = poti.profil;
        let razdalja = vrstica.insertCell(-1);
        razdalja.innerHTML = poti.razdalja;
        let tezavnost = vrstica.insertCell(-1);
        tezavnost.innerHTML = poti.tezavnost;
        let potrdi = vrstica.insertCell(-1);
        potrdi.innerHTML = "<button style='border:1px solid black;' onclick='potrdiPot(this.id)' type='button' id='" + poti.id + "'>Potrdi</button>";
    }
}

//CONFIRM ROUTE
function potrdiPot(id) {
    var pot = new Object();
    pot.id = id;
    const url2 = 'http://localhost:3000/potrjevanje';
    const data = JSON.stringify(pot);
    console.log(data);

    var nepotrjenePoti = localStorage.getItem("nepotrjenePoti");
    nepotrjenePoti = JSON.parse(nepotrjenePoti);
    for (let i = 0; i < nepotrjenePoti.length; i++) {
        if (nepotrjenePoti[i].id == id) {
            nepotrjenePoti.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("nepotrjenePoti", JSON.stringify(nepotrjenePoti));

    $.ajax({
        contentType: 'application/json',
        url: url2,
        data: data,
        type: 'POST',
        success: function (data) {
            console.log(JSON.stringify(data));
        }
    });
    location.reload();
}
