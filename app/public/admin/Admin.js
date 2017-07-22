$(document).ready(function(){
  //Populates the project list drop down menu:
  var projects = firebase.database().ref('app/projects');
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


//creates a user name/uid table:
//*****Prob want to restructure this as an alert on add/change*****//
  var candidateName, key;
  var userTable = {};
  users.once('value')
  .then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      candidateName = childSnapshot.val().name;
      key = childSnapshot.key;
      userTable[key] = candidateName;
    });
  });


  //Populates the 'Current project team members' table to the right:
  function showMembers(){
    //clears previous lists that might be on screen:
    $('#memberList').empty();
    $('tr').remove();
    $('#rmvBtn').empty();
    $(":checkbox");

    var memberTable = "<table class='mdl-data-table mdl-js-data-table table mytable'>" +
    "<thead><tr><th type ='checkbox' class='team'></th><th class='mdl-data-table__cell--non-numeric team'><span id ='hdrName'>Name</span></th>"+
     "<th class='mdl-data-table__cell--non-numeric team'></th></tr></thead><tbody>";

    var memberRows = "";
    var project = document.getElementById("projects_container");
    var selected = project.options[project.selectedIndex].value;

    if(selected == "Please select a project"){
      return;
    }
    var key = hashFinder(selected);

    var selectProj = firebase.database().ref('app/projects/' + key + '/members');

    selectProj.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        memberUID = childSnapshot.val().uid;
        memberName = userTable[memberUID];

        //put in button to delete and make admin here...
        memberRows  += ("<tr><td class = 'team'><input type='checkbox' class='checker'></input></td><td class='mdl-data-table__cell--non-numeric team'><nameArea>" +
          memberName + "</nameArea></td><td class='mdl-data-table__cell--non-numeric team'>"+
          "<button class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'>Make Admin</button></td></tr></tbody>");

      });
      memberTable += memberRows;
      $('#memberList').append(memberTable).html();
    });

    $('#rmvBtn').append("<button class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored rmvBtn' "+
    "id = 'rmvBtn'>Remove Selected From Project</button>")
  }


  //Dicates the actions for when the 'add' button is clicked:
  addButton.onclick = function(list) {
    var project = document.getElementById("projects_container");
    var selected = project.options[project.selectedIndex].value;

    //check to make sure a project was actually selected:
    if(selected == "Please select a project"){
      alert("Please select a project first");
      return;
    }

    var user = document.getElementById("existingUsers");
    var userSel = user.options[user.selectedIndex].value;
    var userUID;
    for (key in userTable){
      if (userTable[key] == userSel){
        userUID = key;
        console.log("Found userUID");
      }
    }

    console.log("userUID: " + userUID);

    //Check to make sure  a user has been picked:
    if(userSel == "Existing Users"){
      alert("Please select a member to add");
      return;
    }

    //Verifying the current user is authorized as an Admin to add people to project:
    var admin = firebase.auth().currentUser;
    var adminUid = admin.uid;
    var key = hashFinder(selected);

    if (authorized(key, adminUid)){

      var project = firebase.database().ref('app/projects/' + key + '/members');
      project.once('value', function(snapshot){
       snapshot.forEach(function(childSnapshot){
            //checks against duplicate entries:
            if (userUID == childSnapshot.val().uid){
              alert("This user is already a member of the project selected");
              return;
            }
        });
      });

      //Use this for making Admins:.....
      //var confirm = confirm("Please confirm that you wish to add this user as an admininstrator:");
      //if (confirm == true){
      //  if(alreadyAdded == false){
        //var set = user.then(function(keyfinder){
      var mem = project.push();
      mem.set({
        'uid' : userUID
      });

      addAlert(userSel);
      location.reload(true);
      return;
    }

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

  rmvBtn.onclick = function(){
    //var checkedValue = $('#table').find('td[type="checkbox"]:checked')
    var checkedNames = [];
    $('.mytable').find('tr').each(function () {
        var row = $(this);
        var name = row.find('nameArea');
        if (row.find('input[type="checkbox"]').is(':checked')){
          checkedNames.push(row.find('td:eq(1)').text());
        }
    });
    console.log(checkedNames);
    //alert(checkedNames);
    var project = document.getElementById("projects_container");
    var selected = project.options[project.selectedIndex].value;

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


  function addAlert(name){
    alert(name + " added successfully");
  }


  function getUID(name){
    var db = firebase.database().ref("users");
    return (db.once('value').then(userHashFinder(name)));
  }


  function userHashFinder(name){
    //var def = $.Deferred();
    var candidateName, key;
    var table = {};
    var keyFinder = firebase.database().ref('users');
    keyFinder.once('value')
    .then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        //if (childSnapshot.val().name == this.name){
        candidateName = childSnapshot.val().name;
        if (candidateName == name){
          key = childSnapshot.key;
          return key;
        }
        //console.log("candidateName: " + candidateName);
        //key = childSnapshot.key;
        //console.log("Key: " + key);
        //table[key] = candidateName;
        //console.log("table[key]: " + table[key]);
          //return keyfinder;
          //def.resolve(key);
          //console.log("child key: " + childSnapshot.key);
          //console.log("key: " + def.key);
        //}
      })
    })
    /*.then(function(table){
      for (var key in table){
        if (table.hasOwnProperty(key)){
          if (table[key] == name){
            console.log("key: " + key);
            console.log("table[key]:" + table[key])
            return key;
          }
        }
      };
      //console.error("Something went wrong");
      //console.log("key: ": + key);
      //return key;
    });*/

    //console.log("Key before return: " + key);
    //return key;
    //console.log("def: " + def);
    //console.log("def.key: " + def.key);
    //return ok;
  }

  /*function userHashFinder(name){
      var key = "";

      var keyFinder = firebase.database().ref('users');
      var oK  = keyFinder.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          if (childSnapshot.val().name == name){
            oK.nKey = childSnapshot.key;
          }
        });
      });
      console.log("oK: " + oK);
      console.log("oK.nKey: " + oK.nKey);
      return (oK);
    }*/
});
