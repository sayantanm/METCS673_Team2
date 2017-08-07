$(document).ready(function(){
  // event listener for the logout option--returns user to landing page
  document.getElementById("li_logout").addEventListener("click", function() {
      firebase.auth().signOut();
      window.location = "../index.html";
  });

  //Populates the project list drop down menu:
  var projects = firebase.database().ref('app/projects');
  projects.on('value', function(snapshot) {
    var projects_display = ('<option id=choose selected>Please select a project</option>') ;
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val().name;
      var projKey = hashFinder(childData);
      var userProfile = firebase.auth().currentUser;
      var userID = userProfile.uid;
      if (authorized(projKey, userID)){
        projects_display = projects_display + ('<option>' + childData + '</option>');
      }

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
      var email = childSnapshot.val().email;
      member_display = member_display + ('<option>' + childData + " (" + email + ")" + '</option>');
    });
  $('#existingUsers').append(member_display).html();
  });

  //creates a user name/uid table:
  var candidateName, key, email;
  var userTable = {};
  users.once('value', function(snapshot){
    snapshot.forEach(function(childSnapshot){
      candidateName = childSnapshot.val().name;
      email = childSnapshot.val().email;
      key = childSnapshot.key;
      userTable[key] = candidateName + " (" + email + ")";
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
    var count = 0;
    selectProj.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        memberUID = childSnapshot.val();
        memberName = userTable[memberUID];

        memberRows  += ("<tr id='row" + count +" class='row'><td class = 'team'><input type='checkbox' class='checker'></input></td><td class='mdl-data-table__cell--non-numeric team'><nameArea>" +
          memberName + "<td class='mdl-data-table__cell--non-numeric team'>"+
          "<button class='dynamic-link mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect adminBtn'>Make Admin</button></td>" +
          "</nameArea></td></tr></tbody>");
        count += 1;
      });
      memberTable += memberRows;

      $('#memberList').append(memberTable).html();

      $('.mytable').find('tr').each(function (i) {
        var row = $(this);
        var button1 = row.find('button')
        button1.attr('id', 'admin_' + i);
        var btnName = row.find('nameArea').text();
        var btnUID = "";
        for (var userKey in userTable){
          if (userTable[userKey] == btnName){
            btnUID = userKey;
          }
        }

        if (authorized(key, btnUID)){
          button1.prop('disabled', true);
          button1.html("Project Admin");
        }
        button1.on("click", {id: button1.attr('id')}, adminAdd);
      });
    });
    $('#rmvBtn').append("<button class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored rmvBtn' "+
    "id = 'rmvBtn'>Remove Selected From Project</button>")
  }


  //Dicates the actions for when the 'add' button is clicked:
  addButton.onclick = function() {
    var projectList = document.getElementById("projects_container");
    var selected = projectList.options[projectList.selectedIndex].value;

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
      }
    }

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
      var memSet = [];
      var project = firebase.database().ref('app/projects/' + key + '/members');

      //checks to makes sure user isn't already a member:
      if (!dupEntry(key, userUID)){
        project.once('value', function(snapshot){
          memSet = (snapshot.val());
          memSet.push(userUID);
          memSet = memSet.filter(val => val);
          project.set(memSet);
        });

        addAlert(userSel);
        location.reload(true);
        return;
      }
      else{
        alert("This user is already a member of this project");
      }
    }
    else {
      alert ("You are not authorized to make changes to this project");
      return;
    }
  }


  //Removes members from selected project:
  rmvBtn.onclick = function(){
    var checkedNames = [];
    $('.mytable').find('tr').each(function () {
        var row = $(this);
        var name = row.find('nameArea');
        if (row.find('input[type="checkbox"]').is(':checked')){
          checkedNames.push(row.find('td:eq(1)').text());
        }
    });
    var userUIDremove = [];
    var projectSel = document.getElementById("projects_container");
    var selected = projectSel.options[projectSel.selectedIndex].value;
    for (var i in checkedNames){
      for (k in userTable){
        if (userTable[k] == checkedNames[i]){
          userUIDremove.push(k);
          break;
        }
      }
    };
    var key = hashFinder(selected);
    var admin = firebase.auth().currentUser;
    var adminUid = admin.uid;
    var project = firebase.database().ref('app/projects/' + key +'/members');

    if (authorized(key, adminUid)){
      for (j in userUIDremove){
        var memSet = [];
        project.once('value', function(snapshot){
          snapshot.forEach(function(childSnapshot){
            if (userUIDremove[j] == childSnapshot.val()){
              childSnapshot.ref.remove();
              alert(checkedNames[j] + " removed from " + selected);

              //checks if an admin (will be on the authorized list) and removes them from it:
              if (authorized(key, userUIDremove[j])){
                removeAdmin(userUIDremove[j], key);
                alert(checkedNames[j] + " also removed as admininstrator");
              }
            }
          });
        });
      }

      //resets the indexing of the member list:
      var memSet = [];
      project.once('value', function(snapshot){
        memSet = (snapshot.val());
        if (memSet.length == 1){
          snapshot.forEach(function(childSnapshot){
            memSet = [];
            memSet[0] = childSnapshot.val();
            project.set(memSet);
          });
          return true;
        }
        memSet = memSet.filter(val => val);
        project.set(memSet);
      });

      location.reload(true);
      return;
    }
    else{
      alert ("You are not authorized to make changes to this project");
      return;
    }
  }


  //Returns the project UID for the project named:
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


  //Determines if the user is an admin of the given project:
  function authorized(key, uid){
    var auth = false;
    var project = firebase.database().ref('app/projects/' + key + '/admins');
    project.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
          if (uid == childSnapshot.val()){
            auth = true;
          }
      });
    });
    return auth;
  }


  //Determines if the selected user is already a member of the project:
  function dupEntry(key, uid){
    var duplicate = false;
    var project = firebase.database().ref('app/projects/' + key + '/members');
    project.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
          if (uid == childSnapshot.val()){
            duplicate = true;
          }
      });
    });
    return duplicate;
  }


  //Function to add project member as an admin when "Make Admin" button clicked:
  function adminAdd(btnID){
    var project = document.getElementById("projects_container");
    var selected = project.options[project.selectedIndex].value;
    var adminAdd;
    $('.mytable').find('tr').each(function () {
      var row = $(this);
      var button = row.find('button');
      if(!(button.prop('disabled'))){
        if (button.attr('id') == btnID.data.id){
          adminAdd = row.find('nameArea').text();
        }
      }
    });

    var adminCheck = firebase.auth().currentUser;
    var adminCheckUid = adminCheck.uid;
    var key = hashFinder(selected);

    if (authorized(key, adminCheckUid)){
      var uidToBeAdded = "";
      for (k in userTable){
        if (userTable[k] == adminAdd){
          uidToBeAdded = k;
          break;
        }
      }

      var projAdmin = firebase.database().ref('app/projects/' + key +'/admins');
      var dup = false;
      projAdmin.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
            //checks against duplicate entries:
            if (uidToBeAdded == childSnapshot.val()){
              alert("This user is already an admin of the project selected");
              dup = true;
              return;
            }
        });
      });
      if (dup == false){
        if (confirm("Please confirm that you wish to add " + adminAdd + " as an admininstrator:")){
          var adminSet = [];
          projAdmin.once('value', function(snapshot){
              adminSet = snapshot.val();
              adminSet.push(uidToBeAdded);
            });
            projAdmin.set(adminSet);

            alert(adminAdd + " added as administrator for " + selected);
            location.reload(true);
            return;
        }
        else{
          alert("No changes made");
          return;
        }
      }
      return;
    }
    else {
      alert ("You are not authorized to make changes to this project");
      return;
    }
  }


  //Private function that will remove the user as an admin if another admin removes them as a member of the project:
  function removeAdmin(uid, key){
    var projAdmin = firebase.database().ref('app/projects/' + key +'/admins');
    projAdmin.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
          //checks against duplicate entries:
          if (uid == childSnapshot.val()){
            childSnapshot.ref.remove();
            return;
          }
      });
    });
    //resets the indexing of the member list:
    var memSet = [];
    projAdmin.once('value', function(snapshot){
      memSet = (snapshot.val());
      if (memSet.length == 1){
        snapshot.forEach(function(childSnapshot){
          memSet = [];
          memSet[0] = childSnapshot.val();
          projAdmin.set(memSet);
        });
        return true;
      }
      memSet = memSet.filter(val => val);
      projAdmin.set(memSet);
    });
    return;
  }


  //Function that sends an alert when a member is added:
  function addAlert(name){
    alert(name + " added successfully");
  }


  //Event listener that determines if the user is logged in properly:
  firebase.auth().onAuthStateChanged(function(user){
    var isVerified = firebase.auth().currentUser.emailVerified;
      if (user && isVerified) {
          // display the users email address in the menu pane once they're authenticated
          document.getElementById('span_email').innerHTML = firebase.auth().currentUser.email;
      }
      else {
          console.log('Not logged in');
          window.location = "../index.html";
      }
  });
});
