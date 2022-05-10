$(document).ready(() => {
    //check login on load
    if (sessionStorage.getItem("loggedIn") !== null) {
        var data = sessionStorage.getItem("loggedIn");
        var data = JSON.parse(data);
        $("#loginForm").html("");
        $("#loggedInUser").html(data.username + '<button type="button" id="logoutButton">Logout</button>');
    }
    //check login on load end

    //CHECK LOGIN INFO
    $("#logginButton").click(function() {
            const url3 = 'http://localhost:3000/checkCreds';
            var username = $("input[name=username]").val();
            var password = $("input[name=password]").val();
            if (username.length > 0 && password.length > 0) {
                var creds = new Object();
                creds.username = username;
                creds.password = password;
                const data = JSON.stringify(creds);
                console.log(data);

                $.ajax({
                    contentType: 'application/json',
                    url: url3,
                    data: data,
                    type: 'POST',
                    success: function(data) {
                        if (data.error == 1) {
                            /*var newItem = {ID: 0, username: 0, tip: 0};
                            sessionStorage.setItem("loggedIn", JSON.stringify(newItem));*/
                            alert("Invalid username or password. Please try again!");
                        } else {
                            var newItem = { ID: data[0].id, username: data[0].uporabnisko_ime, tip: data[0].tip };
                            sessionStorage.setItem("loggedIn", JSON.stringify(newItem));
                            location.reload();
                        }
                    }
                });
            } else {
                alert("Username or password empty!");
            }
        })
        //CHECK LOGIN INFO END


    $("#logoutButton").click(function() {
        $("#loginForm").html('<input type="text" placeholder="Username" name="username"><input type="password" name="password" placeholder="Password"><button type="button" id="logginButton">Login</button>');
        $("#loggedInUser").html("");
        sessionStorage.removeItem("loggedIn");
        location.reload();
    })
});