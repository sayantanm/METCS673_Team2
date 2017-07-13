$(document).ready(function(){
  var projects = firebase.database().ref('app/projects');

  //Populates the project list drop down menu:
  projects.on('value', function(snapshot) {
    var projects_display = ('<option id=choose selected>Please select a project</option>') ;
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val().name;
      projects_display = projects_display + ('<option>' + childData + '</option>');
    });
    $('#projects_container').html(projects_display);
  });

  //Triggers the change in the members list when a project is selected:
  document.getElementById("projects_container").addEventListener("change", showMembers);

  //This section populates the existing users dropdown menu:
  var users = firebase.database().ref('users');

  users.once('value', function(snapshot){
    var member_display = ('<option id=choose2 >Existing Users</option>') ;
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val().name;
      member_display = member_display + ('<option>' + childData + '</option>');
    });
  $('#existingUsers').append(member_display).html();
  });


  //Populates the 'Current project team members' table to the right:
  function showMembers(){
    //clears previous lists that might be on screen:
    var memberRows = "";
    $('#table tbody tr').remove();

    var project = document.getElementById("projects_container");
    var selected = project.options[project.selectedIndex].value;

    if(selected == "Please select a project"){
      return;
    }
    var key = hashFinder(selected);

    var selectProj = firebase.database().ref('app/projects/' + key + '/members');

    selectProj.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        memberName = childSnapshot.val().name;
        //put in button to delete and make admin here...
        memberRows = ('<tr><td></td><td class="mdl-data-table__cell--non-numeric team">' +
          memberName + '</td><td class="mdl-data-table__cell--non-numeric team">'+
          '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">Make Admin</button></td></tr>');
        $('#memberList').append(memberRows).html();
      });
    });
  }


  //Dicates the actions for when the 'add' button is clicked:
  addButton.onclick = function() {
    var project = document.getElementById("projects_container");
    var selected = project.options[project.selectedIndex].value;

    //checks to make sure a project was actually selected:
    if(selected == "Please select a project"){
      alert("Please select a project first");
      return;
    }

    var user = document.getElementById("existingUsers");
    var userSel = user.options[user.selectedIndex].value;

    //Actions if adding a new user (if any user selected in existing user field
    //any items written into text field will be ignored):
    if(userSel == "Existing Users"){
      alert("Please select a member to add");
      return;
    }

    //Verifying the current user is authorized as an Admin to add people to project:
    var admin = firebase.auth().currentUser;
    var adminUid = admin.uid;
    var key = hashFinder(selected);

    if (authorized(key, adminUid)){
      //None of this works correctly...
      var userKey = userHashFinder(userSel);
      //console.log(userKey);
      //console.log("userKey.nKey " + userKey.nKey);
      var addingKey = userKey.nKey;
      //console.log(addingKey);
      //var addingUid;
      console.log('users/' + addingKey);
      var userDB = firebase.database().ref('users/' + addingKey);
      //userDB.once('value', function(snapshot){
      //      userUid = snapshot.val().uid;
      //});

      //alert (addingUid);
      //console.log("addingUid " + addingUid);
      //var alreadyAdded = false;
      //var project = firebase.database().ref('app/projects/' + key + '/members');
      //project.once('value', function(snapshot){
       //snapshot.forEach(function(childSnapshot){
            //checks against duplicate entries:
            //if (addingUid == childSnapshot.val().uid){
            //  alert("This user is already a member of the project selected");
              //alreadyAdded = true;
            //}
      //  });
      //});

      //Use this for making Admins:.....
      //var confirm = confirm("Please confirm that you wish to add this user as an admininstrator:");
      //if (confirm == true){
      //if(alreadyAdded == false){
      var project = firebase.database().ref('/app/projects/' + key + '/members');
        var mem = project.push();
        mem.set({
          'name' : userSel ,
        //  'uid' : addingUid
        });
        addAlert(userSel);
        location.reload(true);
    //  }
        return;
    }
    //    alert("No changes made");
    //    return;

    else {
      alert ("You are not authorized to make changes to this project");
      return;
    }


      //var name =  document.getElementById("name").value;
      //name input validation:
      //if (name == ""){
        //alert("Please enter a name");
      //  return;
    //  }
      //I'm not checking to see if there are only characters, as the user could want to use some sort of
      //usernames for their naming convention--only length is checked here:
    //  if (name.length > 20){
      //  alert("Name must not be greater than 20 characters. Please try again.");
      //  return;
    //  }

      //email input validation:
      //var email = document.getElementById("email").value;
      //if (email == ""){
      //  alert("Please enter an email address");
      //  return;
      //}
      //var pattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$");
      //var validation = pattern.test(email);
      //if (!validation){
      //  alert("Please enter a valid email address");
      //  return;
      //}

      //newUser(name, email, selected);
    //  location.reload(true);
    //  return;
    //}

    //This will add an existing member to the project:
    //var temp = userHashFinder(String(userSel));
    //alert(temp);
    //var email = temp.nKey;
    //alert (email);
    //addToProject(userSel, email, selected);

  }


  function hashFinder(projName){
    var key = "";
    var keyFinder = firebase.database().ref('app/projects');
    keyFinder.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if (childSnapshot.val().name == projName){
          key = childSnapshot.key;
        }
      });
    });
    return (key);
  }


  function authorized(key, uid){
    var auth = false;
    var project = firebase.database().ref('app/projects/' + key + '/admins');
    project.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
          if (uid == childSnapshot.val().uid){
            auth = true;
          }
      });
    });
    return auth;
  }

/*
  adminBtn.onclick() = function(){
    alert("hello world");
    var project = document.getElementById("projects_container");
    var selected = project.options[project.selectedIndex].value;

    var user = firebase.auth().currentUser;
    var uid = user.uid;
    var key = hashFinder(selected);

    if (authorized(key, uid)){
      var admin = firebase.database().ref('app/projects/' + key + '/admins');
      admin.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
            //checks against duplicate entries:
            if (uid == childSnapshot.val().uid){
              alert("This user is already an admin of the project selected");
              return
            }
        });
      });
      var userUid = getUid();//*********insert some function that actually works here******
      var mem = admin.push();
      mem.set({

        'uid' : userUid
      });
      addAlert(name);
      location.reload(true);
    }
    else {
      alert ("You are not authorized to make changes to this project");
      return;
    }
  }*/

  //function getUid(userName, key){
  //  var uid = "";

  //  var users = firebase.database().ref('users/' + key);
  //  users.once('value', function(snapshot){
  //        uid = snapshot.val().uid;
  //  });
  //  return uid;
  //}

  //function addToProject(name, email, projName){
  //  var key = hashFinder(projName);

    //var project = firebase.database().ref('app/projects/' + key + '/members');
  //  project.once('value', function(snapshot){
    //  snapshot.forEach(function(childSnapshot){

    //  });
  //  });
  //  var mem = project.push();
  //  mem.set({
  //    'name' : name ,
  //    'email' : email
  //  });
  //  addAlert(name);
  //}


  function addAlert(name){
    alert(name + " added successfully");
  }


  //function newUser(name, email, selected){
    //checks to see if user already registered:
    //var temp = getEmail(name);
    //var emailCheck = temp.nKey;
    //if (emailCheck == email){
    //  alert(name + " is an existing user.  Select them from the dropdown menu above.");
    //  return;
    //}

  //  var mref = firebase.database().ref('users') ;
  //  var iref = mref.push() ;
  //  iref.set({
  //    'name' : name ,
  //    'email' : email
  //  });
  //  addToProject(name, email, selected);
  //}

  function userHashFinder(name){
      var key = "";
      var c = 0 ;
      var keyFinder = firebase.database().ref('users');
      var oK  = keyFinder.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          if (childSnapshot.val().name == name){
            oK.nKey = childSnapshot.key;
            c+=1;
          }
        });
      });
      return (oK);
    }


  //function getEmail(name){
  //    var temp = userHashFinder(name);
  //    var key = temp.nKey;
  //    var userDB = firebase.database().ref('users/' + key);
  //    var ok  = userDB.once('value', function(snapshot){
  //      console.log(snapshot.val().email);
  //      ok.email = snapshot.val().email;
//

  //    });
      //console.log(ok.nKey);
    //  return (ok);
  //  }

});
