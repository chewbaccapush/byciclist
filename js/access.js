if (sessionStorage.getItem("loggedIn") !== null) {

} else {
    if (window.location.href.indexOf("dodajanje_poti.html") != -1)
        document.getElementById("dodajPot").innerHTML = "<h2>Ta funkcionalnost ni na voljo za gostujoči uporabniki</h2>";
    if (window.location.href.indexOf("komentarji.html") != -1)
        document.getElementById("registracijaForm").innerHTML = "<h2>Ta funkcionalnost ni na voljo za gostujoči uporabniki</h2>";
    if (window.location.href.indexOf("forum.html") != -1) {
        document.getElementById("addNew").style.display = "none";
        document.getElementById("forma").style.display = "none";
    }
}