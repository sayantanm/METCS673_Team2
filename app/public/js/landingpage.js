window.onload = function() {
    // I'm using this to keep track of all the promises I need resolved before I 
    var promises = [];

    // Initialize Firebase if it isn't already initialized
    if (!firebase.apps.length) {
        var config = {               
            apiKey: "AIzaSyBPj1-RVUplL_9hJniAIEXpw92vI7L2k44",
            authDomain: "metcs673-acac6.firebaseapp.com",
            databaseURL: "https://metcs673-acac6.firebaseio.com",
            projectId: "metcs673-acac6",
            storageBucket: "metcs673-acac6.appspot.com",
            messagingSenderId: "967664299479"
        };
        firebase.initializeApp(config);
    }

    // add users to the database
    function addUser(fullname, emailAddress) {
        // i'm referencing currentUser twice, so I might as well create a reference to it
        var user = firebase.auth().currentUser;
        promises.push(user.updateProfile({
            displayName: fullname,
            photoURL: "./images/avatar.jpg"
        }));
        
        promises.push(firebase.database().ref('users/' + user.uid).set({
            name: fullname,
            email: emailAddress
        }));
    };

    // email address/password sign-in -  event handler
    document.getElementById("button_login").addEventListener("click", function() {
        document.getElementById('div_login_error').innerHTML = '';
        var email = document.getElementById("input_login_email_address").value;
        var password = document.getElementById("input_login_password").value;

        promises.push(firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            if (!firebase.auth().currentUser.emailVerified) {
                document.getElementById('div_login_error').innerHTML = 'Verify your email before logging-in.  <a id="resend_verification" href="#">Resend</a> link.';
                document.getElementById('div_login_error').addEventListener('click',function() {
                    firebase.auth().currentUser.sendEmailVerification().then(function() {
                        document.getElementById('div_login_error').innerHTML = 'Verification email sent.  <a id="resend_verification" href="#">Resend</a> link.';
                    });
                });
            }
            else {
                window.location = "./home/index.html"; 
            }
        }).catch(function(error) {
            // handling errors for authentication
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        }));
    });

    // google sign-in - event handler
    document.getElementById("img_google_logo").addEventListener("click", function() {
        document.getElementById('div_login_error').innerHTML = '';
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        provider.addScope('email');
        provider.addScope('https://www.googleapis.com/auth/plus.me');
        promises.push(firebase.auth().signInWithPopup(provider).then(function(result) {
            var userEmail = result.user.email;
            var userName = result.additionalUserInfo.profile.name;
            var userId = result.user.uid;

            promises.push(firebase.database().ref('users').child(userId).once('value', function(snapshot) {
                if (snapshot.val() === null) {
                    addUser(userName,userEmail);
                }
            })); 
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error: " + errorCode);
            console.log("Error Message: " + errorMessage);
        }));
    });

    // join - even handler
    document.getElementById("button_join").addEventListener("click", function() {
        // remove the require field indicators
        if (document.getElementById("input_join_first_name").classList.contains('input_required')) {
            document.getElementById("input_join_first_name").classList.remove('input_required');
        }
        if (document.getElementById("input_join_last_name").classList.contains('input_required')) {
            document.getElementById("input_join_last_name").classList.remove('input_required');
        }

        document.getElementById('div_login_error').innerHTML = '';
        var fname = document.getElementById("input_join_first_name").value;
        var lname = document.getElementById("input_join_last_name").value;
        var email = document.getElementById("input_join_email_address").value;
        var password = document.getElementById("input_join_password").value;
        var confirmpassword = document.getElementById("input_join_confirm_password").value;

        // add required field indicators
        if (fname.length == 0 || lname.length == 0) {
            if (fname.length == 0) {
                if (!document.getElementById("input_join_first_name").classList.contains('input_required')) {
                    document.getElementById("input_join_first_name").classList.add('input_required');
                }
            }
            if (lname.length == 0) {
                if (!document.getElementById("input_join_last_name").classList.contains('input_required')) {
                    document.getElementById("input_join_last_name").classList.add('input_required');
                }
            }
            return;
        }
        if (password < 7) {
            alert("Your password must be greater than 6 characters long");
            return;
        }

        // validate the the passwords match
        if (password != confirmpassword) {
            alert("Your passwords do not match");
            return;
        }

        promises.push(firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
            addUser(fname + ' ' + lname,email);
            resetJoinText();
            promises.push(firebase.auth().currentUser.sendEmailVerification().then(function() {
                document.getElementById('div_login_error').innerHTML = 'Check your email, verification is needed.  <a id="resend_verification" href="#">Resend</a> link.';
            }));
        }).catch(function(error) {
            alert(error.message);
        }));
    });

    // forgot password link
    document.getElementById("forgot_password_link").addEventListener("click", function() {
        var email = document.getElementById("input_login_email_address").value;
        if (email) {
            promises.push(firebase.auth().sendPasswordResetEmail(email).then(function() {
                document.getElementById('div_login_error').innerHTML = "Email sent to " + email;
            }));
        }
        else {
            document.getElementById('div_login_error').innerHTML = "Please enter your email address";
        }
    });

    function resetJoinText() {
        document.getElementById("input_join_first_name").value = "";
        document.getElementById("input_join_first_name").parentNode.classList.remove("is-dirty");
        document.getElementById("input_join_last_name").value = "";
        document.getElementById("input_join_last_name").parentNode.classList.remove("is-dirty");
        document.getElementById("input_join_email_address").value = "";
        document.getElementById("input_join_email_address").parentNode.classList.remove("is-dirty");
        document.getElementById("input_join_password").value = "";
        document.getElementById("input_join_password").parentNode.classList.remove("is-dirty");
        document.getElementById("input_join_confirm_password").value = "";
        document.getElementById("input_join_confirm_password").parentNode.classList.remove("is-dirty");
    }
    // reset button
    document.getElementById("button_join_reset").addEventListener("click", function() {
        resetJoinText();
    });

    // when a user signs-in, send them to the dashboard/homepage
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Promise.all(promises).then(function() {
                if (firebase.auth().currentUser.emailVerified) {
                    document.getElementById('div_login_error').innerHTML = '';
                    window.location = "./home/index.html"; 
                }
                else {
                    document.getElementById('input_login_email_address').value = user.email;
                    document.getElementById('input_login_email_address').parentNode.classList.add("is-dirty");
                    document.getElementById('div_login_error').innerHTML = 'Verify your email before logging-in.  <a id="resend_verification" href="#">Resend</a> link.';
                    document.getElementById('div_login_error').addEventListener('click',function() {
                        firebase.auth().currentUser.sendEmailVerification().then(function() {
                            document.getElementById('div_login_error').innerHTML = 'Verification email sent.  <a id="resend_verification" href="#">Resend</a> link.';
                        });
                    });
                }
            });
        }
    });
};