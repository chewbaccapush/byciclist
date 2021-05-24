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

async function pridobiHotele() {
    const odgovor = await fetch("hoteli.json");
    var rawPodatki = await odgovor.text();
    localStorage.setItem("hoteli", rawPodatki)
    rawPodatki = JSON.parse(rawPodatki)
    const tabela = document.getElementById("tabela-hoteli");
    for (const hoteli of rawPodatki) {
        let vrstica = tabela.insertRow(-1);
        let id = vrstica.insertCell(-1);
        id.innerHTML = hoteli.id;
        let naziv = vrstica.insertCell(-1);
        naziv.innerHTML = hoteli.naziv;
        let naslov = vrstica.insertCell(-1);
        naslov.innerHTML = hoteli.naslov;
        let email = vrstica.insertCell(-1);
        email.innerHTML = hoteli.email;
        let telefon = vrstica.insertCell(-1);
        telefon.innerHTML = hoteli.telefon;
        console.log(hoteli)
    }
}