async function getQuestions() {
    const response = await fetch("http://localhost:3000/questions");
    const rawData = await response.text();
    var JSONData = JSON.parse(rawData);
    var datax = [];
    for (let i = 0; i < JSONData.length; i++) {
        var newItem = { ID_vprasanja: JSONData[i].ID_vprasanja, vprasanje: JSONData[i].vprasanje, username: JSONData[i].username };
        datax.push(newItem);
    }
    if (localStorage.getItem("questionz") === null) {
        localStorage.setItem("questionz", JSON.stringify(datax));
        document.getElementById("recentItems").innerHTML = "";
        console.log(rawData);
        for (let i = 0; i < JSONData.length; i++) {
            document.getElementById("recentItems").innerHTML += '<div class="forum-item"><div class="row"><div class="col-md-9"><div class="forum-icon"> <svg class="svg-inline--fa fa-star fa-w-18" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""> <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"> </path> </svg></div> <a href="#" class="forum-item-title"><b>'+JSONData[i].username+'</b>: ' + JSONData[i].vprasanje + '</a><div id="answerList' + JSONData[i].ID_vprasanja + '"><b>'+JSONData[i].username+'</b>: ' + JSONData[i].odgovor + '</div><form class="example" id="forma" method="POST" action="" style="margin-top: 10px;"><input type="text" class="addCommentInput" name="comment" id="addComment' + JSONData[i].ID_vprasanja + '" placeholder="Dodaj odgovor"><button type="button" id="' + JSONData[i].ID_vprasanja + '" class="addNewComment">Submit</button></form></div><div class="col-md-1 forum-info"> </div></div></div></div>';
        }
    } else {
        refreshDataVprasanja();
        //access
        if (sessionStorage.getItem("loggedIn") === null) {
            var x = document.getElementsByClassName('addCommentInput').length;
            for (let i = 0; i < x; i++) {
                document.getElementsByClassName('addCommentInput')[i].style.display = "none";
                document.getElementsByClassName('addNewComment')[i].style.display = "none";
            }
        } else {
            if (sessionStorage.getItem("loggedIn") !== null && JSON.parse(sessionStorage.getItem("loggedIn")).tip == 1) {
                var x = document.getElementsByClassName('addCommentInput').length;
                for (let i = 0; i < x; i++) {
                    document.getElementsByClassName('addCommentInput')[i].style.display = "none";
                    document.getElementsByClassName('addNewComment')[i].style.display = "none";
                }
                document.getElementById("forma").style.display = "none";
            }
        }
        //access end
    }
    //dodaj odgovor
    const url2 = 'http://localhost:3000/answers';

    $(".addNewComment").click(function() {
            const id = this.id;
            const selector = "#addComment" + id;
            const title = $(selector).val();
            var answer = new Object();
            answer.title = title;
            answer.foreignID = id;
            answer.username = JSON.parse(sessionStorage.getItem("loggedIn")).username;

            let temp = localStorage.getItem("answerz");
            temp = JSON.parse(temp);
            var idCount = temp.length + 1;
            var temp2 = { ID_odgovori: idCount, odgovor: title, ID_TK_vprasanja: id, username: answer.username};
            temp.push(temp2);
            localStorage.setItem("answerz", JSON.stringify(temp));
            refreshDataVprasanja();
            refreshDataOdgovori();

            const data = JSON.stringify(answer);
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
        })
        //dodaj odgovor end
}

getQuestions();

//GET ANSWERS
async function getAnswers() {
    const response = await fetch("http://localhost:3000/answers");
    const rawData = await response.text();
    var JSONData = JSON.parse(rawData);
    var datax = [];
    for (let i = 0; i < JSONData.length; i++) {
        var newItem = { ID_odgovori: JSONData[i].ID_odgovori, odgovor: JSONData[i].odgovor, ID_TK_vprasanja: JSONData[i].ID_TK_vprasanja, username: JSONData[i].username };
        datax.push(newItem);
    }
    if (localStorage.getItem("answerz") === null) {
        localStorage.setItem("answerz", JSON.stringify(datax));
        refreshDataOdgovori();
        refreshDataVprasanja();
    } else {
        refreshDataOdgovori();
    }
}

getAnswers();

async function getNasveti() {
    const response = await fetch("http://localhost:3000/nasveti");
    const rawData = await response.text();
    var JSONData = JSON.parse(rawData);
    var datax = [];
    for (let i = 0; i < JSONData.length; i++) {
        var newItem = { naslovNasveta: JSONData[i].naslovNasveta, desc: JSONData[i].nasvet };
        datax.push(newItem);
    }
    if (localStorage.getItem("nasveti") === null) {
        localStorage.setItem("nasveti", JSON.stringify(datax));
        document.getElementById("faqItems").innerHTML = "";
        console.log(rawData);
        for (let i = 0; i < JSONData.length; i++) {
            document.getElementById("faqItems").innerHTML += '<div class="forum-item"><div class="row"><div class="col-md-9"><div class="forum-icon"> <svg class="svg-inline--fa fa-star fa-w-18" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""> <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"> </path> </svg></div> <a href="#" class="forum-item-title">' + JSONData[i].naslovNasveta + '</a><div class="forum-sub-title" id="desc">'+JSONData[i].nasvet+'</div></div></div></div>';
        }
    } else {
        refreshDataNasveti();
    }
}

getNasveti();

function refreshDataVprasanja() {
    let data2 = localStorage.getItem("questionz");
    data2 = JSON.parse(data2);
    let data3 = localStorage.getItem("answerz");
    data3 = JSON.parse(data3);
    document.getElementById("recentItems").innerHTML = "";
    for (let i = 0; i < data2.length; i++) {
        var answerList = "answerList" + (i + 1);
        document.getElementById("recentItems").innerHTML += '<div class="forum-item"><div class="row"><div class="col-md-9"><div class="forum-icon"> <svg class="svg-inline--fa fa-star fa-w-18" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""> <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"> </path> </svg></div> <a href="#" class="forum-item-title"><b>'+data2[i].username+'</b>: ' + data2[i].vprasanje + '</a><div id="answerList' + data2[i].ID_vprasanja + '"></div><form class="example" id="forma" method="POST" action="" style="margin-top: 10px;"><input type="text" class="addCommentInput" name="comment" id="addComment' + data2[i].ID_vprasanja + '" placeholder="Dodaj odgovor"><button type="button" id="' + data2[i].ID_vprasanja + '" class="addNewComment">Submit</button></form></div><div class="col-md-1 forum-info"></div></div></div></div></div>';
        document.getElementById(answerList).innerHTML = "";
        for (let j = 0; j < data3.length; j++)
            if (data3[j].ID_TK_vprasanja == data2[i].ID_vprasanja)
                document.getElementById(answerList).innerHTML += "<div><b>"+data3[j].username+"</b>: " + data3[j].odgovor + "</div>";
    }
}

function refreshDataOdgovori() {
    let data2 = localStorage.getItem("answerz");
    data2 = JSON.parse(data2);
}

function refreshDataNasveti() {
    let data2 = localStorage.getItem("nasveti");
    data2 = JSON.parse(data2);
    document.getElementById("faqItems").innerHTML = "";
    for (let i = 0; i < data2.length; i++) {
        document.getElementById("faqItems").innerHTML += '<div class="forum-item"><div class="row"><div class="col-md-9"><div class="forum-icon"> <svg class="svg-inline--fa fa-star fa-w-18" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""> <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"> </path> </svg></div> <a href="#" class="forum-item-title">' + data2[i].naslovNasveta + '</a><div class="forum-sub-title" id="desc">'+data2[i].desc+'</div></div><div class="col-md-1 forum-info"></div></div></div></div>';
    }
}

$(document).ready(() => {
    //dodaj vprasanje
    const url = 'http://localhost:3000/questions';

    $(addNewButton).click(function() {
            const title = $("#title").val();
            var question = new Object();
            question.title = title;
            question.username = JSON.parse(sessionStorage.getItem("loggedIn")).username;
            let temp = localStorage.getItem("questionz");
            temp = JSON.parse(temp);
            var idCount = temp.length + 1;
            var temp2 = { ID_vprasanja: idCount, vprasanje: title, username: question.username};
            temp.push(temp2);
            localStorage.setItem("questionz", JSON.stringify(temp));
            refreshDataVprasanja();

            const data = JSON.stringify(question);
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
            location.reload();
        })
        //dodaj vprasanje end

    $(dodajNasvet).click(function() {
        const vnos = $("#oknoNasvet").val();
        const vnosN = $("#oknoNasvet2").val();
        var nasvet = new Object();
        nasvet.naslovNasveta = vnos;
        nasvet.desc = vnosN;
        console.log(nasvet);
        let temp = localStorage.getItem("nasveti") || [];
        temp = JSON.parse(temp);
        temp.push(nasvet);
        localStorage.setItem("nasveti", JSON.stringify(temp));
        refreshDataNasveti();

        const data = JSON.stringify(nasvet);
        console.log(nasvet);

        $.ajax({
            contentType: 'application/json',
            url: "http://localhost:3000/nasveti",
            data: data,
            type: 'POST',
            success: function(data) {
                console.log(data);
            }
        });
    })
});