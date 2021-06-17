if (sessionStorage.getItem("loggedIn") !== null) {
    if (window.location.href.indexOf("potrjevanje.html") != -1) {
        if(JSON.parse(sessionStorage.getItem("loggedIn")).tip != 3) {
            document.getElementById("pott").innerHTML = "<h2>Ta funkcionalnost je na voljo samo za administratorji</h2>";
        }
    }
} else {
    if (window.location.href.indexOf("dodajanje_poti.html") != -1)
        document.getElementById("dodajPot").innerHTML = "<h2>Ta funkcionalnost ni na voljo za gostujoči uporabniki</h2>";
    if (window.location.href.indexOf("komentarji.html") != -1)
        document.getElementById("registracijaForm").innerHTML = "<h2>Ta funkcionalnost ni na voljo za gostujoči uporabniki</h2>";
    if (window.location.href.indexOf("forum.html") != -1) {
        document.getElementById("addNew").style.display = "none";
        document.getElementById("forma").style.display = "none";
    }
    if (window.location.href.indexOf("potrjevanje.html") != -1) {
        document.getElementById("pott").innerHTML = "<h2>Ta funkcionalnost je na voljo samo za administratorji</h2>";
    }
    if (window.location.href.indexOf("profil.html") != -1) {
        document.getElementById("containerProfil").innerHTML = "<h2 style='color:#fff; text-align:center;margin-top:150px;margin-bottom:550px;'>Ta funkcionalnost ni na voljo za gostujoči uporabniki. <a href='register.html'>Registracija</a></h2>";
        document.getElementById("routesContainer").style.display = "none";
        document.getElementsByClassName("card-title")[0].style.display = "none";
    }
}