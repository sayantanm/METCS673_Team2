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
    //var newID = [];
    selectProj.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        memberUID = childSnapshot.val();
        memberName = userTable[memberUID];

        //newID.push("adminBtn" + count);
        memberRows  += ("<tr id='row" + count +"'><td class = 'team'><input type='checkbox' class='checker'></input></td><td class='mdl-data-table__cell--non-numeric team'><nameArea>" +
          memberName + "<td class='mdl-data-table__cell--non-numeric team'>"+
          "<button class='dynamic-link mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect adminBtn'>Make Admin</button></td>" +
          "</nameArea></td></tr></tbody>");
        count += 1;
      });
      //console.log(memberRows);
      memberTable += memberRows;

      $('#memberList').append(memberTable).html();

      $('.mytable').find('button').each(function (i) {
        $(this).attr('id', 'admin_' + i);
        //console.log(this.id);
        $(this).on("click", {id: $(this).attr('id')}, adminAdd);
      });
    });

    $('#rmvBtn').append("<button class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored rmvBtn' "+
    "id = 'rmvBtn'>Remove Selected From Project</button>")




    //for (i in 1:newID.length){

    //  document.getElementById('adminBtn').addEventListener("click", adminAdd);
  //  }
    //document.getElementById("adminBtn").addEventListener("click", adminAdd);
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
  }

rmvBtn.onclick = function(){
    var checkedNames = [];
    $('.mytable').find('tr').each(function () {
        var row = $(this);
        var name = row.find('nameArea');
        if (row.find('input[type="checkbox"]').is(':checked')){
          checkedNames.push(row.find('td:eq(1)').text());
        }
    });
    var userUID = [];
    var project = document.getElementById("projects_container");
    var selected = project.options[project.selectedIndex].value;
    for (var i in checkedNames){
      for (k in userTable){
        if (userTable[k] == checkedNames[i]){
          userUID.push(k);
          break;
        }
      }
    };
    var key = hashFinder(selected);
    var project = firebase.database().ref('app/projects/' + key +'/members');
    for (j in userUID){
      var memSet = [];
      project.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          if (userUID[j] == childSnapshot.val()){
            childSnapshot.ref.remove();
            alert(checkedNames[j] + " removed from " + selected);
          }
        });
      });
    }

    //resets the indexing of the member list:
    var memSet = [];
    project.once('value', function(snapshot){
      memSet = (snapshot.val());
      if (memSet.hasOwnProperty.length == 1){
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
          if (uid == childSnapshot.val()){
            auth = true;
          }
      });
    });
    return auth;
  }


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


function adminAdd(btnID){
    var project = document.getElementById("projects_container");
    var selected = project.options[project.selectedIndex].value;
    var adminAdd = "";
    //console.log(btnID.data.id);
    $('.mytable').find('tr').each(function () {
      var row = $(this);
      //if (row.find('td:eq(2)') == btnID.data.id){
      var button = row.find('button')
      if (button.attr('id') == btnID.data.id){
        console.log(row.find('nameArea').text());
      //  var name = row.find('nameArea');
        adminAdd = row.find('nameArea').text();
      }

    });

    console.log("adminAdd: " + adminAdd);
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


  function addAlert(name){
    alert(name + " added successfully");
  }

});
