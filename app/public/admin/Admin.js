
var user = document.getElementById("user");
var userPic = document.getElementById("userPic");
var name = document.getElementById("name");
var role = document.getElementById("role");
var email = document.getElementById("email");
var addButton = document.getElementById("addButton");
//var pulldown = document.getElementById("projectList").addEventListener("click", showMembers;

var project1 = [];
var project2 = [];
var project3 = [];
var project4 = [];
var project5 = [];
var projList = [project1, project2, project3, project4, project5];


//This is just an example of how I will build the project name list when its available:
/*var x = document.getElementById("mySelect");
var c = document.createElement("option");
c.text = "Kiwi";
x.options.add(c, 1);

var x = document.getElementById("mySelect");
x.options.remove(1);*/


function showMembers(){
  var projects = document.getElementById("projectList");
  selected = projects.options[projects.selectedIndex].value;

  for (i = 0; i <7; i++){
    var name = "" + i + ".name";
    document.getElementById(name).innerHTML= "";
    var j = "" + i + ".role";
    document.getElementById(j).innerHTML= "";
  }

  if(selected == "project1"){
    for (i = 0; i < project1.length; i++){
      var name = "" + i + ".name";
      document.getElementById(name).innerHTML= project1[i].name;
      var j = "" + i + ".role";
      document.getElementById(j).innerHTML= project1[i].role;
    }
  }

  if (selected == "project2") {
    for (i = 0; i < project2.length; i++){
      var name = "" + i + ".name";
      document.getElementById(name).innerHTML= project2[i].name;
      var j = "" + i+ ".role";
      document.getElementById(j).innerHTML= project2[i].role;
    }
  }

  if (selected == "project3") {
    for (i = 0; i < project3.length; i++){
      var name = "" + i + ".name";
      document.getElementById(name).innerHTML= project3[i].name;
      var j = "" + i+ ".role";
      document.getElementById(j).innerHTML= project3[i].role;
    }
  }

  if (selected == "project4") {
    for (i = 0; i < project4.length; i++){
      var name = "" + i + ".name";
      document.getElementById(name).innerHTML= project4[i].name;
      var j = "" + i+ ".role";
      document.getElementById(j).innerHTML= project4[i].role;
    }
  }

  if (selected == "project5") {
    for (i = 0; i < project5.length; i++){
      var name = "" + i + ".name";
      document.getElementById(name).innerHTML= project5[i].name;
      var j = "" + i+ ".role";
      document.getElementById(j).innerHTML= project5[i].role;
    }
  }
}

addButton.onclick = function() {
  projects = document.getElementById("projectList");
  selected = projects.options[projects.selectedIndex].value;

  if (selected == "choose"){
    alert("Please select a project first");
  }

  var teamMember = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    role: document.getElementById("role").value
    };

  if (selected == "project1"){
    // TODO: insert test to see if member already assigned to this project
    project1.push(teamMember);
    addAlert();
  }

  if (selected == "project2") {
    project2.push(teamMember);
    addAlert();
  }

  if (selected == "project3") {
    project3.push(teamMember);
    addAlert();
  }

  if (selected == "project4") {
    project4.push(teamMember);
    addAlert();
  }

  if (selected == "project5") {
    project5.push(teamMember);
    addAlert();
  }
  showMembers();
}

function addAlert(){
  alert("New member added successfully");
}
