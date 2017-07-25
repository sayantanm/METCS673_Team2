window.onload = function() {

    if (!firebase.apps.length) {
        // Initialize Firebase if it isn't already 
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

    // event listener for the logout option
    document.getElementById("li_logout").addEventListener("click", function() {
        firebase.auth().signOut();
        window.location = "../index.html";
    });

    firebase.database().ref('app/projects/').once('value').then(function(snapshot){
        // the arrays are used to load data into Google charts
        var projectTimelineArray = [];
        var projectTableArray = [];

        // counters for project status
        var projectStatusCounterNS = 0;
        var projectStatusCounterIP = 0;
        var projectStatusCounterC = 0;

        // since issues are directly associated to projects, we need to keep track of all projects a user is a member of
        var projectIDsArray = [];

        // I'm using this to create a project ID:project Name map
        // It's used to build the project issues stacked bar chart
        var projectNameMap = {};

        snapshot.forEach(function(childSnapshot) {
            var projectName = '';
            var projectStartDate ='';
            var projectEndDate = '';
            var projectStatus = '' ;
            var myProject = false;
            childSnapshot.forEach(function(grandchildSnapshot) {
                // since I'm looping through each project, I might as well gather the information I need in case the logged in user belongs to it.
                // capture the project name
                if (grandchildSnapshot.key == 'name') {
                    projectName = grandchildSnapshot.val();
                    projectNameMap[childSnapshot.key] = projectName;
                }
                // capture the start date of the project
                else if (grandchildSnapshot.key === 'start_date') {
                    projectStartDate = grandchildSnapshot.val();
                }
                // capture the end date of the project
                else if (grandchildSnapshot.key === 'end_date') {
                    projectEndDate = grandchildSnapshot.val();
                }
                // capture the status of the project
                else if (grandchildSnapshot.key === 'status') {
                    projectStatus = grandchildSnapshot.val();
                }
                // this object will have what we want
                // if the logged in user is member of the project, their uid will be listed here
                else if (grandchildSnapshot.key === 'members') {
                    var value = grandchildSnapshot.val();
                    for (var key in value) {
                        for (var member in value[key]) {
                            if (firebase.auth().currentUser.uid === value[key][member]) {
                                // this tells the code below to push the project information captured above.
                                myProject = true;

                                // not sure whether or not I need this, but this gives me an array of projects the logged in user is a member of
                                projectIDsArray.push(childSnapshot.key);
                            }
                        }
                    }
                }
            });
            if (myProject) { 
                // push data for the timeline
                var tempTimelineArray = [];
                var dtProjectStartDate = new Date(projectStartDate.replace(/(\d+)(?:st|nd|rd|th)/, "$1"));
                var dtProjectEndDate = new Date(projectEndDate.replace(/(\d+)(?:st|nd|rd|th)/, "$1"));
                tempTimelineArray.push(projectName);
                tempTimelineArray.push(dtProjectStartDate);
                tempTimelineArray.push(dtProjectEndDate);
                projectTimelineArray.push(tempTimelineArray);

                // push data for the table
                var tempTableArray = [];
                tempTableArray.push(projectName);
                tempTableArray.push(projectStatus);
                tempTableArray.push(dtProjectStartDate);
                tempTableArray.push(dtProjectEndDate);
                projectTableArray.push(tempTableArray);
                
                // update the project status counter
                if (projectStatus === 'Not Started') {
                    projectStatusCounterNS++;
                }
                else if (projectStatus === 'In Progress') {
                    projectStatusCounterIP++;
                }
                else if (projectStatus === 'Completed') {
                    projectStatusCounterC++;
                }     
            }
        });

        // now that we have a list of projects the logged in user is a member of, we need to find their issues
        var issueCount = 0;
        var issueTaskCount = 0;
        var issueBugCount = 0;
        var issuePastDueCount = 0;
        var issueSeverityCritical = 0;
        var issueSeverityMajor = 0;
        var issueSeverityMinor = 0
        var issueSeverityTrivial = 0;
        var issuePriorityImmediate = 0;
        var issuePriorityHigh = 0;
        var issuePriorityMedium = 0;
        var issuePriorityLow = 0;
        var promises = [];
        var issueTableArray = [];        
        var projectBugs = {};
        var projectTasks = {};
        for (var i=0; i<projectIDsArray.length; i++) {      
            projectBugs[projectIDsArray[i]] = 0;
            projectTasks[projectIDsArray[i]] = 0;
        }
        for (var i=0; i<projectIDsArray.length; i++) {
            promises.push(firebase.database().ref('issues' + projectIDsArray[i] + '/').once('value').then(function(issuesnapshot) {
                issuesnapshot.forEach(function(childIssueSnapshot) {
                    var projectIssues = childIssueSnapshot.val();
                    // get a count of issues
                    if (projectIssues['assigned_uid'] == firebase.auth().currentUser.uid) {
                        issueCount++;
                    }

                    // get the count for issue type
                    if (projectIssues['issue_type'] == 'Bug') {
                        issueBugCount++;

                        // this is used for the stacked bar chart which shows the number of issues for a project
                        projectBugs[projectIssues['project_id']]++;
                    }
                    else if (projectIssues['issue_type'] == 'Task') {
                        issueTaskCount++;

                        // this is used for the stacked bar chart which shows the number of issues for a project
                        projectTasks[projectIssues['project_id']]++;
                    }

                    // get the count for issue severity
                    if (projectIssues['severity'] == 'Critical') {
                        issueSeverityCritical++;
                    }
                    else if (projectIssues['severity'] == 'Major') {
                        issueSeverityMajor++;
                    }
                    else if (projectIssues['severity'] == 'Minor') {
                        issueSeverityMinor++;
                    }
                    else if (projectIssues['severity'] == 'Trivial') {
                        issueSeverityTrivial++;
                    }

                    // get the count for issue priority
                    if (projectIssues['priority'] == 'Immediate') {
                        issuePriorityImmediate++;
                    }
                    else if (projectIssues['priority'] == 'High') {
                        issuePriorityHigh++;
                    }
                    else if (projectIssues['priority'] == 'Medium') {
                        issuePriorityMedium++;
                    }
                    else if (projectIssues['priority'] == 'Low') {
                        issuePriorityLow++;
                    }
                    var tempIssueArray = [projectIssues['issue_num'],projectIssues['status'],projectIssues['severity'],projectIssues['issue_type'],projectIssues['summary']];
                    issueTableArray.push(tempIssueArray);
                });
            }));
        }

        Promise.all(promises).then(function() {
            // Issues column chart (top right)
            // don't attempt to draw the chart if the logged in user does not have any assigned issues
            if (issuePriorityImmediate || issuePriorityHigh || issuePriorityMedium || issuePriorityLow) {
                google.charts.load('current', {packages: ['corechart', 'bar']});
                google.charts.setOnLoadCallback(drawColumnChart);
            }
            else {
                document.getElementById('div-bar-issues').innerHTML = "You do not have any assigned Issues";
            }
            function drawColumnChart() {

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Issue Type');
                data.addColumn('number', 'Number of Issues');

                data.addRows([
                    ['Task',issueTaskCount],
                    ['Bug',issueBugCount],
                    ['Past Due',issuePastDueCount],
                ]);

                var options = {
                    title: 'Issue Distribution',
                    vAxis: {
                        title: 'Number of Issues'
                    },
                    legend: {
                        position: 'none'
                    },
                    chartArea: {width: "87%"}
                };

                var chart = new google.visualization.ColumnChart(document.getElementById('div-bar-issues'));
                chart.draw(data, options);
            }

            // the issues severity donut (middle row 3rd donut)
            // don't attempt to draw the chart if the logged in user does not have any assigned issues
            if (issuePriorityImmediate || issuePriorityHigh || issuePriorityMedium || issuePriorityLow) {
                google.charts.load('current', {'packages':["corechart"]});
                google.charts.setOnLoadCallback(drawIssuesSeverityDonut);
            }
            else {
                document.getElementById('div-chart-issues-severity').innerHTML = "You do not have any assigned Issues";
            }
            function drawIssuesSeverityDonut() {
                var data = google.visualization.arrayToDataTable([
                    ['Severity', '# of Issues'],
                    ['Critical', issueSeverityCritical],
                    ['Major', issueSeverityMajor],
                    ['Minor', issueSeverityMinor],
                    ['Trivial', issueSeverityTrivial]
                ]);

                var options = {
                    title: 'Issues Severity',
                    pieHole: 0.3,
                    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f']
                };

                var chart = new google.visualization.PieChart(document.getElementById('div-chart-issues-severity'));
                chart.draw(data, options);
            }

            // the issues priority donut (middle row 4th column)
            // don't attempt to draw the chart if the logged in user does not have any assigned issues
            if (issuePriorityImmediate || issuePriorityHigh || issuePriorityMedium || issuePriorityLow) {
                google.charts.load('current', {'packages':["corechart"]});
                google.charts.setOnLoadCallback(drawIssuesPriorityDonut);
            }
            else {
                document.getElementById('div-chart-issues-priority').innerHTML = "You do not have any assigned Issues";
            }
            function drawIssuesPriorityDonut() {
                var data = google.visualization.arrayToDataTable([
                    ['Severity', '# of Issues'],
                    ['Immediate', issuePriorityImmediate],
                    ['High', issuePriorityHigh],
                    ['Medium', issuePriorityMedium],
                    ['Low', issuePriorityLow]
                ]);

                var options = {
                    title: 'Issues Priority',
                    pieHole: 0.4,
                };

                var chart = new google.visualization.PieChart(document.getElementById('div-chart-issues-priority'));
                chart.draw(data, options);
            }

            document.getElementById('div-header-issues-tasks').innerHTML += issueTaskCount;
            document.getElementById('div-header-issues-bugs').innerHTML += issueBugCount; 
            document.getElementById('div-header-issues-pastdue').innerHTML += issuePastDueCount; 

            // the issues data table
            // don't attempt to draw the table if the logged in user does not have any assigned issues
            if (issueTableArray.length) {
                google.charts.load('current', {'packages':['table']});
                google.charts.setOnLoadCallback(drawIssuesTable);
            }
            else {
                document.getElementById('div-content-issues').innerHTML = "You do not have any assigned Issues";
            }
            function drawIssuesTable() {
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'Issue #');
                data.addColumn('string', 'Status');
                data.addColumn('string', 'Severity');
                data.addColumn('string', 'Type');
                data.addColumn('string', 'Abstract');
                data.addRows(issueTableArray);
                var table = new google.visualization.Table(document.getElementById('div-content-issues'));

                table.draw(data, {showRowNumber: false, width: '100%', height: '100%'});
            }

            // the project-issues stacked bar chart
            var stackedBarChartArray = [];
            // build the data array
            stackedBarChartArray.push(['Project', 'Tasks', 'Bugs']);
            for (var i=0; i<projectIDsArray.length; i++) {
                stackedBarChartArray.push([projectNameMap[projectIDsArray[i]],projectTasks[projectIDsArray[i]],projectBugs[projectIDsArray[i]]]);
            }

            // don't attempt to draw the chart if the logged in user is not a member of any project
            if (projectIDsArray.length) {
                google.charts.load("current", {packages:["corechart"]});
                google.charts.setOnLoadCallback(drawStackedBarChart);
            }
            else {
                document.getElementById("div-bar-projects").innerHTML = "You are not a member of any Projects";
            }
            function drawStackedBarChart() {
                var data = google.visualization.arrayToDataTable(stackedBarChartArray);

                var options = {
                    legend: { position: 'top', maxLines: 3 },
                    bar: { groupWidth: '75%' },
                    isStacked: true
                };
                var chart = new google.visualization.BarChart(document.getElementById("div-bar-projects"));
                chart.draw(data, options);
            }
        });

        // don't attempt to draw the chart if the logged in user is not a member of any project
        if (projectTableArray.length) {
            /*  Projects: Draw the Google Data Table  */
            google.charts.load('current', {'packages':['table']});
            google.charts.setOnLoadCallback(drawProjectsTable);
        }
            else {
                document.getElementById("div-content-projects").innerHTML = "You are not a member of any Projects";
            }
        function drawProjectsTable() {
            var dataTable = new google.visualization.DataTable();      
            dataTable.addColumn('string', 'Project Name');
            dataTable.addColumn('string', 'Status');
            dataTable.addColumn('date', 'Start Date');
            dataTable.addColumn('date', 'End Date');
            if (projectTableArray.length) {
                dataTable.addRows(projectTableArray);
            }

            var table = new google.visualization.Table(document.getElementById('div-content-projects'));

            table.draw(dataTable, {showRowNumber: false, width: '100%', height: '100%'});
        }

        /*  Projects: Set the status counters  */
        document.getElementById('div-header-projects-completed').innerHTML += projectStatusCounterC;
        document.getElementById('div-header-projects-inprogress').innerHTML += projectStatusCounterIP;
        document.getElementById('div-header-projects-notstarted').innerHTML += projectStatusCounterNS;

        // the projects status donut (middle row 2nd donut)
        // don't attempt to draw the chart if the logged in user does not have any assigned issues
        if (projectTableArray.length) {
            google.charts.load('current', {'packages':["corechart"]});
            google.charts.setOnLoadCallback(drawIssuesSeverityDonut);
        }
        else {
            document.getElementById("div-donut-project-status").innerHTML = "You are not a member of any Projects";
        }
        function drawIssuesSeverityDonut() {
            var data = google.visualization.arrayToDataTable([
                ['Status', '# of Projects'],
                ['Complete', projectStatusCounterC],
                ['In Progress', projectStatusCounterIP],
                ['Not Started', projectStatusCounterNS]
            ]);

            var options = {
                title: 'Project Status',
                pieHole: 0
            };

            var chart = new google.visualization.PieChart(document.getElementById('div-donut-project-status'));
            chart.draw(data, options);
        }
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            document.getElementById('span_email').innerHTML = firebase.auth().currentUser.email;
        }
        else {
            console.log('Not logged in');
        }
    });


}