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
          memberName + '</td><td class="mdl-data-table__cell--non-numeric team" >' +
          '</td></tr>');
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
      var name =  document.getElementById("name").value;
      //name input validation:
      if (name == ""){
        alert("Please enter a name");
        return;
      }
      //I'm not checking to see if there are only characters, as the user could want to use some sort of
      //usernames for their naming convention--only length is checked here:
      if (name.length > 20){
        alert("Name must not be greater than 20 characters. Please try again.");
        return;
      }

      //email input validation:
      var email = document.getElementById("email").value;
      if (email == ""){
        alert("Please enter an email address");
        return;
      }
      var pattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$");
      var validation = pattern.test(email);
      if (!validation){
        alert("Please enter a valid email address");
        return;
      }

      newUser(name, email, selected);
      location.reload(true);
      return;
    }

    //This will add an existing member to the project:
    var email = getEmail(userSel);
    addToProject(userSel, email, selected);
    location.reload(true);
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


  function addToProject(name, email, projName){
    var key = hashFinder(projName);

    var project = firebase.database().ref('app/projects/' + key + '/members');
    var mem = project.push();
    mem.set({
      'name' : name ,
      'email' : email
    });
    addAlert(name);
  }


  function addAlert(name){
    alert(name + " added successfully");
  }


  function newUser(name, email, selected){
    //checks to see if user already registered:
    if (getEmail(name) == email){
      alert(name + " is an existing user.  Select them from the dropdown menu above.");
      return;
    }

    var mref = firebase.database().ref('users') ;
    var iref = mref.push() ;
    iref.set({
      'name' : name ,
      'email' : email
    });
    addToProject(name, email, selected);
  }


  function getEmail(name){
    var key = "";
    var keyFinder = firebase.database().ref('users');
    keyFinder.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if (childSnapshot.val().name == name){
          key = childSnapshot.key;
        }
      });
    });
    var userEmail;
    var users = firebase.database().ref('users/' + key);
    users.once('value', function(snapshot){
      userEmail = snapshot.val().email;
    });
    return userEmail;
  }


});
