document.getElementById('divRating').addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() != 'span') return;

    if (event.target.classList.contains('rated')) {
        event.target.classList.remove('rated');
    } else {
        Array.prototype.forEach.call(document.getElementsByClassName('rated'), function(el) {
            el.classList.remove('rated');
        });
        event.target.classList.add('rated');
    }
});

// Funkcija za favorite button
$('#i').on('click', function() {
    console.log("Danes je čaga");
});