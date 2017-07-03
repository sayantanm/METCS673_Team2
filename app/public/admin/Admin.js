$(document).ready (function()
{
var projects = firebase.database().ref('projects');

//Populates the project list drop down menu:
projects.once('value', function(snapshot) {
        var projects_display = ('<option id=choose selected>Please select a project</option>') ;
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val().name;
          projects_display = projects_display + ('<option>' + childData + '</option>');
        });
    $('#projects_container').append(projects_display).html();
});

//Triggers the change in the members list when a project is selected:
document.getElementById("projects_container").addEventListener("change", showMembers);


function showMembers(){
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
      console.log("Name:" + memberName);
      memberRole = childSnapshot.val();
      console.log("memberRole:" + memberRole);
      memberRows = ('<tr><td class="mdl-data-table__cell--non-numeric team">' +
        memberName + '</td><td class="mdl-data-table__cell--non-numeric team" >' + memberRole +
        '</td></tr>');
      $('#memberList').append(memberRows).html();
    });
  });

    }


  /*selectProj.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot) {
        var userName = childSnapshot.key;
        //console.log(userName);
        users.once('value').then(function(snapshot){

            memberName = childSnapshot.val().name
            console.log(memberName);
          });
        });
        var memberRole = childSnapshot.val();
        console.log(memberName);
        //console.log(memberRole);
        //console.log(memberName);

  }*/



addButton.onclick = function() {
  let project = document.getElementById("projects_container");
  let selected = project.options[project.selectedIndex].value;

  if(selected == "Please select a project"){
    alert("Please select a project first");
    return;
  }

  //try{

//  }
  //catch(e){
  //  alert("Please select a project first");
  //  return;
//  }

  var teamMember = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    role: document.getElementById("role").value
    };

  switch(selected){
    case("project1"):
      // TODO: insert test to see if member already assigned to this project
      project1.push(teamMember);
      addAlert();
      break;

    case("project2"):
      project2.push(teamMember);
      addAlert();
      break;

    case("project3"):
      project3.push(teamMember);
      addAlert();
      break;

    case("project4"):
      project4.push(teamMember);
      addAlert();
      break;

    case("project5"):
      project5.push(teamMember);
      addAlert();
      break;
  }
  showMembers();
}

function addAlert(){
  alert("New member added successfully");
}

function changeProfilePic(userID, name, email, imageUrl) {
  firebase.database().ref('users/' + userID).set({
    name: name,
    email: email,
    userIcon : imageUrl
  });
}


}) ;
