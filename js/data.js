async function getQuestions() {
    const response = await fetch("http://localhost:3000/questions");
    const rawData = await response.text();
    var JSONData = JSON.parse(rawData);
    document.getElementById("recentItems").innerHTML = "";
    console.log(rawData);
    for(let i = 0; i < JSONData.length; i++) {
    document.getElementById("recentItems").innerHTML += '<div class="forum-item"><div class="row"><div class="col-md-9"><div class="forum-icon"> <svg class="svg-inline--fa fa-star fa-w-18" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""> <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"> </path> </svg></div> <a href="#" class="forum-item-title">'+JSONData[i].vprasanje+'</a><div class="forum-sub-title">Description for the topic/question</div></div><div class="col-md-1 forum-info"> <span class="views-number"> 1450 </span><div> <small>Views</small></div></div><div class="col-md-1 forum-info"> <span class="views-number"> 572 </span><div> <small>Posts</small></div></div></div></div>';
    }
}
getQuestions();

$(document).ready(() => {
    const url = 'http://localhost:3000/questions';
    
    $(addNewButton).click(function() {
        getQuestions();
        const title = $("#title").val();
        var question = new Object();
        question.title = title;

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
    })
});