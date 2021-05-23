async function getQuestions() {
    const response = await fetch("http://localhost:3000/questions");
    const rawData = await response.text();
    var JSONData = JSON.parse(rawData);
    console.log(JSONData);
}
getQuestions();
$(document).ready(() => {
    const url = 'http://localhost:3000/questions';
    
    $(addNewButton).click(function() {
        const title = $("#title").val();
        var question = new Object();
        question.title= title;

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