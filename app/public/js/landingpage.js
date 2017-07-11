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

    // add data to the issue object
    function submitData() {
        var newIssueKey = myApp.database().ref().child('issues/' + firebase.auth().currentUser.uid).push();

        var type = document.getElementById('type').value;
        var description = document.getElementById('description').value;
        newIssueKey.set({
            type: type,
            description: description
        });
    };

    function clearTextFields() {
        document.getElementById('type').value = '';
        document.getElementById('description').value = '';
    }
/*
    myApp.database().ref('issues').on('value', function(snapshot) {
        var list = document.getElementById('ul_issues');
        snapshot.forEach(function(childSnapshot) {
            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(childSnapshot.val().title));
            list.appendChild(entry);
        });
    });
*/

    // sign-up/login event handler
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

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(firebase.auth().currentUser.uid);
            window.location = "./home/index.html";
        }
    });
};