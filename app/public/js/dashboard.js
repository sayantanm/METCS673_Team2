window.onload = function() {
google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {

      var data = new google.visualization.DataTable();
      data.addColumn('timeofday', 'Time of Day');
      data.addColumn('number', 'Motivation Level');

      data.addRows([
        [{v: [8, 0, 0], f: '8 am'}, 1],
        [{v: [9, 0, 0], f: '9 am'}, 2],
        [{v: [10, 0, 0], f:'10 am'}, 3],
        [{v: [11, 0, 0], f: '11 am'}, 4],
        [{v: [12, 0, 0], f: '12 pm'}, 5],
        [{v: [13, 0, 0], f: '1 pm'}, 6],
        [{v: [14, 0, 0], f: '2 pm'}, 7],
        [{v: [15, 0, 0], f: '3 pm'}, 8],
        [{v: [16, 0, 0], f: '4 pm'}, 9],
        [{v: [17, 0, 0], f: '5 pm'}, 10],
      ]);

      var options = {
        title: 'Motivation Level Throughout the Day',
        hAxis: {
          title: 'Time of Day',
          format: 'h:mm a',
          viewWindow: {
            min: [7, 30, 0],
            max: [17, 30, 0]
          }
        },
        vAxis: {
          title: 'Rating (scale of 1-10)'
        }
      };

      var chart = new google.visualization.ColumnChart(
        document.getElementById('div-chart-projects'));

      chart.draw(data, options);
    }
    // the issues donut chart
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawIssuesDonut);
    function drawIssuesDonut() {
        var data = google.visualization.arrayToDataTable([
            ['Severity', '# of Issues'],
            ['Critical',     5],
            ['High',      2],
            ['Medium',  5],
            ['Low', 2]
        ]);

        var options = {
            title: 'Issues Severity',
            pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('div-chart-issues'));
        chart.draw(data, options);
    }

    // the projects data table
    google.charts.load('current', {'packages':['table']});
    google.charts.setOnLoadCallback(drawProjectsTable);
    function drawProjectsTable() {
        var data = new google.visualization.DataTable();      
        data.addColumn('string', 'Project Name');
        data.addColumn('string', 'Status');
        data.addColumn('date', 'Start Date');
        data.addColumn('date', 'End Date');
        data.addRows([
            ['Project Management Tool','Green',new Date(2017,06,01),new Date(2017,08,01)],
            ['OS Upgrade','Yellow',new Date(2017,05,01),new Date(2017,12,01)],
            ['Informational Website','Green',new Date(2017,00,01),new Date(2018,00,01)],
            ['Analytics Tool','Green',new Date(2017,02,01),new Date(2017,11,01)],
            ['Firebase Application','Red',new Date(2017,07,01),new Date(2017,08,01)]
        ]);

        var table = new google.visualization.Table(document.getElementById('div-content-projects'));

        table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
    }

    // the issues data table
    google.charts.load('current', {'packages':['table']});
    google.charts.setOnLoadCallback(drawIssuesTable);
    function drawIssuesTable() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Issue #');
        data.addColumn('string', 'Status');
        data.addColumn('string', 'Severity');
        data.addColumn('string', 'Type');
        data.addColumn('number', 'Age');
        data.addColumn('string', 'Abstract');
        data.addRows([
            ['CS-001','Assigned','High','Task',2,'Wireframe for Issues Tracker'],
            ['CS-002','In Progress','Critical','Bug',1,'Database Down!'],
            ['CS-003','On Hold','Low','Task',5,'Wireframe for Issues Tracker'],
            ['CS-004','Assigned','Medium','Epic',1,'Project Management'],
            ['CS-005','Assigned','Low','Story',6,'Add projects'],
            ['CS-006','In Progress','High','Bug',3,'Database keeps crashing.'],
        ]);

        var table = new google.visualization.Table(document.getElementById('div-content-issues'));

        table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
    }

}