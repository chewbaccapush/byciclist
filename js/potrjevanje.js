(function($) {
    "use strict";

    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').on('click', function() {
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
    $(".js-scroll-trigger").click(function() {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: 100,
    });

    // Collapse Navbar
    var navbarCollapse = function() {
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
    console.log(JSON.stringify(JSONData));
    const tabela = document.getElementById("tabela-hoteli");
    for (const poti of JSONData) {
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
getRoutes();
//CONFIRM ROUTE
function potrdiPot(id) {
    var pot = new Object();
    pot.id = id;
    const url2 = 'http://localhost:3000/potrjevanje';
    const data = JSON.stringify(pot);
    console.log(data);

    $.ajax({
        contentType: 'application/json',
        url: url2,
        data: data,
        type: 'POST',
        success: function(data) {
            console.log(JSON.stringify(data));
        }
    });
    location.reload();
}