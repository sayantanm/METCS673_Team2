window.onload = function() {
// Initialize Firebase if it isn't already (for local dev only) 
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

        // I'm using this to create a project 
        var projectMembersCountTable = [];

        snapshot.forEach(function(childSnapshot) {
            var projectName = '';
            var projectStartDate ='';
            var projectEndDate = '';
            var projectStatus = '' ;
            var myProject = false;
            var projectMembersCount = 0;
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
                    value.forEach(function(greatGrandChildSnapshot) {
                        if (firebase.auth().currentUser.uid === greatGrandChildSnapshot) {
                            // this tells the code below to push the project information captured above.
                            myProject = true;
                            
                            // not sure whether or not I need this, but this gives me an array of projects the logged in user is a member of
                            projectIDsArray.push(childSnapshot.key);
                        }
                        if (greatGrandChildSnapshot) {
                            projectMembersCount++;
                        }
                    });
                }
            });
            // myProject is set to true when uid is found as a member of a project
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
                projectMembersCountTable.push([projectName,projectMembersCount]);
            }
        });

        // now that we have a list of projects the logged in user is a member of, we need to find their issues
        var issueCount = 0;
        var issueTaskCount = 0;
        var issueBugCount = 0;
        var issuePastDueCount = 0;
        var issueStatusNew = 0;
        var issueStatusOnHold = 0;
        var issueStatusOpen = 0;
        var issueStatusInProgress = 0;
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
                    var loggedInUser = firebase.auth().currentUser.uid
                    var isMyIssue = 0;
                    // get a count of issues
                    if (projectIssues['assigned_uid'] == loggedInUser) {
                        issueCount++;
                        isMyIssue = 1;
                    }

                    // get issue status count (open issues)
                    var isIssueOpen = 0;
                    if (projectIssues['status'] == 'New' && isMyIssue) {
                        issueStatusNew++;
                        isIssueOpen = 1
                    }
                    else if (projectIssues['status'] == 'Open' && isMyIssue) {
                        issueStatusOpen++;
                        isIssueOpen = 1;
                    }
                    else if (projectIssues['status'] == 'On Hold' && isMyIssue) {
                        issueStatusOnHold++;
                        isIssueOpen = 1;
                    }
                    else if (projectIssues['status'] == 'In Progress' && isMyIssue) {
                        issueStatusInProgress++;
                        isIssueOpen = 1
                    }

                    // get the count for issue severity
                    if (projectIssues['severity'] == 'Critical' && isMyIssue && isIssueOpen) {
                        issueSeverityCritical++;
                    }
                    else if (projectIssues['severity'] == 'Major' && isMyIssue && isIssueOpen) {
                        issueSeverityMajor++;
                    }
                    else if (projectIssues['severity'] == 'Minor' && isMyIssue && isIssueOpen) {
                        issueSeverityMinor++;
                    }
                    else if (projectIssues['severity'] == 'Trivial' && isMyIssue && isIssueOpen) {
                        issueSeverityTrivial++;
                    }

                    // get the count for issue priority
                    if (projectIssues['priority'] == 'Immediate' && isMyIssue && isIssueOpen) {
                        issuePriorityImmediate++;
                    }
                    else if (projectIssues['priority'] == 'High' && isMyIssue && isIssueOpen) {
                        issuePriorityHigh++;
                    }
                    else if (projectIssues['priority'] == 'Medium' && isMyIssue && isIssueOpen) {
                        issuePriorityMedium++;
                    }
                    else if (projectIssues['priority'] == 'Low' && isMyIssue && isIssueOpen) {
                        issuePriorityLow++;
                    }

                     // get the count for issue type
                    if (projectIssues['issue_type'] == 'Bug' && isMyIssue && isIssueOpen) {
                        issueBugCount++;

                        // this is used for the stacked bar chart which shows the number of issues for a project
                        projectBugs[projectIssues['project_id']]++;
                    }
                    else if (projectIssues['issue_type'] == 'Task' && isMyIssue && isIssueOpen) {
                        issueTaskCount++;

                        // this is used for the stacked bar chart which shows the number of issues for a project
                        projectTasks[projectIssues['project_id']]++;
                    }

                    if (isMyIssue) {
                        var tempIssueArray = [projectIssues['issue_num'],projectIssues['status'],projectIssues['severity'],projectIssues['issue_type'],projectIssues['summary']];
                        issueTableArray.push(tempIssueArray);
                    }
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
            function drawColumnChart() {

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Issue Type');
                data.addColumn('number', 'Number of Issues');

                data.addRows([
                    ['New',issueStatusNew],
                    ['Open',issueStatusOpen],
                    ['In Progress',issueStatusInProgress],
                    ['On Hold',issueStatusOnHold],
                ]);

                var options = {
                    title: 'Issue Status Distribution',
                    vAxis: {
                        title: 'Number of Issues'
                    },
                    legend: {
                        position: 'none'
                    },
                    chartArea: {width: "87%"},
                    colors:['#1e88e5']
                };

                var chart = new google.visualization.ColumnChart(document.getElementById('div-bar-issues'));
                chart.draw(data, options);
            }

            // Project members column chart (middle row 1st chart)
            // don't attempt to draw the chart if the logged in user is not a member of any project
            if (projectTableArray.length) {
                google.charts.load('current', {packages: ['corechart', 'bar']});
                google.charts.setOnLoadCallback(drawMemberColumnChart);
            }
            else {
                document.getElementById('div-bar-project-members').innerHTML = "You are not a member of any Projects";
            }
            function drawMemberColumnChart() {

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Issue Type');
                data.addColumn('number', 'Number of Members');

                data.addRows(projectMembersCountTable);

                var options = {
                    title: 'Members per Project',
                    vAxis: {
                        title: '# of Team Members'
                    },
                    legend: {
                        position: 'none'
                    },
                    colors:['#00897b'],
                    chartArea: {width: "87%"}
                };

                var chart = new google.visualization.ColumnChart(document.getElementById('div-bar-project-members'));
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
                    colors: ['#90caf9', '#42a5f5', '#1e88e5'],
                    chartArea: {width: "87%"}
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
                    pieHole: 0.3,
                    colors: ['#90caf9', '#42a5f5', '#1e88e5', '#1565c0'],
                    chartArea: {width: "87%"}
                };

                var chart = new google.visualization.PieChart(document.getElementById('div-chart-issues-priority'));
                chart.draw(data, options);
            }

            document.getElementById('div-header-issues-tasks').innerHTML += issueTaskCount;
            document.getElementById('div-header-issues-bugs').innerHTML += issueBugCount; 
            document.getElementById('div-header-issues-pastdue').innerHTML += issuePastDueCount; 

            // the issues data table (bottom right)
            // don't attempt to draw the table if the logged in user does not have any assigned issues
            if (issueTableArray.length) {
                google.charts.load('current', {'packages':['table']});
                google.charts.setOnLoadCallback(drawIssuesTable);
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

                var tableClassNames = {
                    'headerRow':'issue-table-header-tr'
                };

                table.draw(data, {
                    showRowNumber: false, 
                    width: '100%', 
                    height: '100%',
                    cssClassNames: tableClassNames
                });
            }

            // the project-issues stacked bar chart (top left)
            var stackedBarChartArray = [];
            // build the data array
            stackedBarChartArray.push(['Project', 'Tasks', 'Bugs',{role:'annotation'}]);
            for (var i=0; i<projectIDsArray.length; i++) {
                stackedBarChartArray.push([projectNameMap[projectIDsArray[i]],projectTasks[projectIDsArray[i]],projectBugs[projectIDsArray[i]],projectNameMap[projectIDsArray[i]]]);
            }

            // don't attempt to draw the chart if the logged in user is not a member of any project
            if (projectIDsArray.length) {
                google.charts.load("current", {packages:["corechart"]});
                google.charts.setOnLoadCallback(drawStackedBarChart);
            }
            function drawStackedBarChart() {
                var data = google.visualization.arrayToDataTable(stackedBarChartArray);

                var options = {
                    title: 'Project Issues',
                    legend: { position: 'bottom', maxLines: 1 },
                    bar: { groupWidth: '75%' },
                    colors:['#80cbc4','#26a69a'],
                    chartArea: {left:17, width: "93%"},
                    isStacked: 'percent',
                    hAxis: {
                    minValue: 0,
                        ticks: [0, .25, .50, .75, 1]
                    },
                    vAxis: {
                        textPosition: 'none'
                    }
                };
                var chart = new google.visualization.BarChart(document.getElementById("div-bar-projects"));
                chart.draw(data, options);
            }
        });

        // the projects data table (bottom left)
        // don't attempt to draw the chart if the logged in user is not a member of any project
        if (projectTableArray.length) {
            google.charts.load('current', {'packages':['table']});
            google.charts.setOnLoadCallback(drawProjectsTable);
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
            var tableClassNames = {
                'headerRow':'project-table-header-tr'
            };
            var table = new google.visualization.Table(document.getElementById('div-content-projects'));

            table.draw(dataTable, {
                showRowNumber: false, 
                width: '100%', 
                height: '100%',
                cssClassNames: tableClassNames
            });
        }

        //  Projects: Set the status counters  
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
                pieHole: 0,
                colors: ['#80cbc4','#26a69a'],
                chartArea: {width: "87%"}
            };

            var chart = new google.visualization.PieChart(document.getElementById('div-donut-project-status'));
            chart.draw(data, options);
        }
    });

    firebase.auth().onAuthStateChanged(function(user) {
        var isVerified = firebase.auth().currentUser.emailVerified;
        if (user && isVerified) {
            // display the users email address in the menu pane once they're authenticated
            document.getElementById('span_email').innerHTML = firebase.auth().currentUser.email;
        }
        else {
            window.location = "../index.html";
        }
    });
}