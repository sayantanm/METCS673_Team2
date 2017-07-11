window.onload = function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCuDASMhIQI5n8B70CLYajlViOBbaDei9c",
        authDomain: "team2-dev.firebaseapp.com",
        databaseURL: "https://team2-dev.firebaseio.com",
        projectId: "team2-dev",
        storageBucket: "team2-dev.appspot.com",
        messagingSenderId: "1025264149124"
    };
    var myApp = firebase.initializeApp(config);

    // add users to the database
    function addUser(firstName, lastName, emailAddress) {
        var newUserKey = myApp.database().ref('users/' + firebase.auth().currentUser.uid);
        newUserKey.set({
            first_name: firstName,
            last_name: lastName,
            email_address: emailAddress
        });
        console.log("user added.");
    };

    // login event handler
    document.getElementById("button_login").addEventListener("click", function() {
        var email = document.getElementById("input_login_email_address").value;
        var password = document.getElementById("input_login_password").value;

        if (password < 7) {
            alert("Your password must be greater than 6 characters long");
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // handling errors for authentication
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
    });

    // join even handler
    document.getElementById("button_join").addEventListener("click", function() {
        var fname = document.getElementById("input_join_first_name").value;
        var lname = document.getElementById("input_join_last_name").value;
        var email = document.getElementById("input_join_email_address").value;
        var password = document.getElementById("input_join_password").value;
        var confirmpassword = document.getElementById("input_join_confirm_password").value;

        if (password < 7) {
            alert("Your password must be greater than 6 characters long");
            return;
        }

        // validate the the passwords match
        if (password != confirmpassword) {
            alert("Your passwords do not match");
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
            // if firebase successfully created the user, we add the user to our database
            addUser(fname,lname,email);
        }).catch(function(error) {
            // Handling Errors for user sign-up
            var errorCode = error.code;
            var errorMessage = error.message;
            
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            }
            else {
                alert(errorMessage);
            }
        });
    });

    // when users change state (i.e. logout/login), send them to the dashboard/homepage
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //console.log(firebase.auth().currentUser.uid);
            window.location = "./home/index.html";
        }
    });
};