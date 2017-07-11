$(document).ready(function()
{
//function showProjects(){
var projects = firebase.database().ref('app/projects');

//Populates the project list drop down menu:
projects.on('value', function(snapshot) {
  var projects_display = ('<option id=choose>Please select your project</option>') ;
  console.log(projects_display);
  snapshot.forEach(function(childSnapshot) {
    var childData = childSnapshot.val().name;
    projects_display = projects_display + ('<option>' + childData + '</option>');
    console.log(projects_display);
  });
  $('#projects_container').html(projects_display);
  console.log(projects_display);
});
//}
showProjects();

//Triggers the change in the members list when a project is selected:
//document.getElementById("projects_container").addEventListener("change", showMembers);


//This section populates the existing users dropdown menu:
//var users = firebase.database().ref('users');
/*
users.once('value', function(snapshot){
  var member_display = ('<option id=choose2 >Existing Users</option>') ;
  snapshot.forEach(function(childSnapshot) {
    var childData = childSnapshot.val().name;
    member_display = member_display + ('<option>' + childData + '</option>');
  });
$('#existingUsers').append(member_display).html();
});


//Populates the 'Current project team members' table to the right:
/*function showMembers(){
  //clears previous lists that might be on screen:
  let memberRows = "";
  $('#table tbody tr').remove();

  let project = document.getElementById("projects_container");
  let selected = project.options[project.selectedIndex].value;

  if(selected == "Please select a project"){
    return;
  }

  let db = firebase.database().ref();
  let selectProj = db.child('projects/' + selected + '/members');

  selectProj.once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      memberName = childSnapshot.key;
      memberRole = childSnapshot.val();
      memberRows = ('<tr><td class="mdl-data-table__cell--non-numeric team">' +
        memberName + '</td><td class="mdl-data-table__cell--non-numeric team" >' + memberRole +
        '</td></tr>');
      $('#memberList').append(memberRows).html();
    });
  });
}
*/

//Dicates the actions for when the 'add' button is clicked:
addButton.onclick = function() {
  let project = document.getElementById("projects_container");
  let selected = project.options[project.selectedIndex].value;
  let role = document.getElementById("role").value; //need to throw a check on this

  //checks to make sure a project was actually selected:
  if(selected == "Please select a project"){
    alert("Please select a project first");
    return;
  }

  let user = document.getElementById("existingUsers");
  let userSel = user.options[user.selectedIndex].value;

  //Actions if adding a new user (if any user selected in existing user field
  //any items written into text field will be ignored):
  if(userSel == "Existing Users"){
    let name =  document.getElementById("name").value; //TODO: add check of elements here...
    //TODO: also need to check and see if this will be a duplicate entry...
    let email = document.getElementById("email").value;


    //----This section not working correctly----//
    var projects = getProjectList();
    var userProjects = "{";
    for (i = 0; i < projects.length -1; i++){
      if (projects[i] == selected){
        userProjects =  userProjects + projects[i] + " : " + true + ", ";
      }
      else {
        userProjects = userProjects + projects[i] + " : " + false + ", ";
      }
    }
    if (projects[projects.length] == selected){
      userProjects =  userProjects + projects[i] + " : " + true;
    }
    else{
      userProjects = userProjects + projects[i] + " : " + false;
    }
    userProjects = userProjects + "}";
    console.log(userProjects);
    //-----------//

    let setNewUser = firebase.database().ref('users/' + name);
    let newUser = setNewUser.push();
    newUser.set({
      'email' : email,
      'name' : name,
      'userIcon' : "NULL"
    });
    var listing = name + " : " + role;
    var key = firebase.database().ref('projects/' + selected).child('members').push(name);
    var updates = {};
    updates['projects/' + selected + '/members'] = name
    firebase.database().ref().update(updates);
    addAlert(name);
  }




  showMembers();
}


function addAlert(name){
  alert(name + " added successfully");
}


function changeProfilePic(name, email, imageUrl) {
  firebase.database().ref('users/' + name).set({
    name: name,
    email: email,
    userIcon : imageUrl
  });
}


}) ;
