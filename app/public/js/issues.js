$(document).ready ( function() 
{
    $('.editor').css('min-height','400px').jqte() ; 

   // $('.jqte_source').css('min-height','330px'); 

   var dialog = document.querySelector('#first_dialog');
    var showDialogButton = document.querySelector('#issue_assign');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function() {
      dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });

    var ic_dialog = document.querySelector('#issue_create_dialog');
    var ic_b = document.querySelector('#issue_create');
    if (! ic_dialog.showModal) {
      dialogPolyfill.registerDialog(ic_dialog);
    }
      ic_b.addEventListener('click', function() {
      ic_dialog.showModal();
    });
      ic_dialog.querySelector('.close').addEventListener('click', function() {
      ic_dialog.close();
    });


    var projects = firebase.database().ref('app/projects') ; 
    projects.once('value', function(snapshot) {
            var projects_display = $('<select id=project_list></select>') ; 
        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key; 
            var childData = childSnapshot.val(); 
				projects_display.append ('<option>' + childData.name + '</option>' ) ; 
         });
        $('#project_list').chosen() ; 
        $('#projects_container').append ( projects_display ) ; 
    });

    $('#issue_create_submit').click( function() 
    {
        var issue_status= $('#istatus_input').val() ; 
        var issue_type  = $('#itype_input').val() ; 
        var assigned_to = $('#uname_input').val() ; 
        var due_by      = $('#due_input').val() ; 
        var project_nm  = $('#pname_input').val() ; 
        var summary     = $('#summary_input').val() ; 
        var descr       = $('#desc_input').val() ; 

	    var issues_ref = firebase.database().ref('issues') ; 
		var iref = issues_ref.push() ; 
			iref.set ( { 
   				'issue_type'  : issue_type , 
                'assigned_to' : assigned_to , 
                'due_by'      : due_by , 
                'project_name': project_nm , 
                'summary'     : summary,
                'description' : descr ,
                'status'      : issue_status 
			} ) ;  
        ic_dialog.close() ; 
    } ) ; 
}) ;

$(window).on('load',function() { 
    console.log ( 'this worked!' ) ; 
    $('#project_list').chosen() ; 
}) ; 
