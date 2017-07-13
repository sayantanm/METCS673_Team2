
function userHandler () 
{
    this.auth = firebase.auth() ; 
    this.auth.onAuthStateChanged( function ( user ) 
    {
        if ( user ) 
        {
            document.getElementById('user-name').textContent = user.displayName ; 
            document.getElementById('user-name').removeAttribute ( 'hidden' ) ; 
            document.getElementById('sign-out').removeAttribute  ( 'hidden' ) ; 
        }
        else 
        {
            document.getElementById('user-name').setAttribute('hidden', 'true');
            document.getElementById('sign-out').setAttribute('hidden', 'true');
            document.getElementById('sign-in').removeAttribute('hidden');
        }
    } ) ; 
}



$(document).ready ( function() 
{
    $('.editor').jqte() ; 
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
          $(ic_dialog).find('input.mdl-textfield__input').each(function()
          {
            if ( $(this).val() != '' ) 
            {
                $(this).attr('placeholder' , 
                    $('label[for="' + $(this).attr('id').replace('#','') + '"]' ).html() ) ; 
            } 
            $(this).val('') ; 
          } ); 
          $(ic_dialog).find('textarea.mdl-textfield__input').each(function()
          { 
            if ( $(this).val() != '' ) 
            {
                $(this).attr('placeholder' , 
                    $('label[for="' + $(this).attr('id').replace('#','') + '"]' ).html() ) ; 
            } 
            $(this).val('') ; 
          }) ; 
          ic_dialog.showModal();
    });
      ic_dialog.querySelector('.close').addEventListener('click', function() {
      ic_dialog.close();
    });

   var projects_display = $('<select class="mdl-textfield__input" id=project_list ></select>') ;
    var projects = firebase.database().ref('app/projects') ;
    projects.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                    projects_display.append ('<option class="mdl-color-text--white mdl-color--blue-grey-700" value="' + childKey + '" ><b>' + childData.name + '</b></option>' ) ;
             });
        $('#projects_container').append ( projects_display ) ;
    });
    
    $('#projects_container').on ( 'DOMSubtreeModified' , function () { 
        $('#issue_list').find('div.demo-card-square').remove() ; 
        var issues_ref = firebase.database().ref('issues' + $('#project_list').val() ) ; 
            issues_ref.once ( 'value').then( function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    $('#issue_list').append (  '<div style="min-height:30px;width:120px;" class="demo-card-square mdl-card mdl-shadow--2dp">' 
                                                + '<a id="' + childKey + '" class="issue-buttons mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">' 
                                                + 'Issue ' + childData.issue_num 
                                                + '</a>' 
                                                + '</div>' ) ; 
                 } ) ; 
            } ) ; 

            $('#project_list').on('change',function() 
            {
				$('#issue_list').find('div.demo-card-square').remove() ;
				var issues_ref = firebase.database().ref('issues' + $('#project_list').val() ) ;
					issues_ref.once ( 'value').then( function(snapshot) {
						snapshot.forEach(function(childSnapshot) {
							var childKey = childSnapshot.key;
							var childData = childSnapshot.val();
							$('#issue_list').append (  '<div style="min-height:30px;width:120px;" class="demo-card-square mdl-card mdl-shadow--2dp">'
														+ '<a id="' + childKey + '" class="issue-buttons mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">'
														+ 'Issue ' + childData.issue_num
														+ '</a>'
														+ '</div>' ) ;
						 } ) ;
					} ) ;
			} ) ;
        } ) ; 

    
     $('#issue_list').on ( 'DOMSubtreeModified' , function () { 
        $('.issue-buttons').on('click',function(){ 
            $('#current_issue').val( $(this).attr('id') ); 
            console.log ( $('#project_list').val() + ' of ' + $('#current_issue').val() ) ; 
            var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ; 
                ref.once ( 'value' ).then( function(snapshot)
                {
                    var issue = snapshot.val() ; 
                    $('#issue_content').jqteVal( issue.description ) ; 
                    $('#comments').jqteVal( issue.comments ) ; 
					$('#issue_summary').text( issue.summary ) ; 
                    $('#issue-due-by').empty().append('<h4> Issue Due By<br>' + issue.due_by + '</h4>' ) ; 
                    $('#issue-assigned-to').empty().append('<h4>Issue Assigned To:<br>' + issue.assigned_to + '</h4>' ) ; 
                } ) ; 
            } ) ; 

		$('.update-desc-button').on('click',function(){
            var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
                ref.update ( { 'description' : $('#issue_content').val() } ) ; 
                console.log ( 'Update ' + $('#current_issue').val() + ' ' + $('#issue_content').val() ); 
		 } ) ; 


         $('#reassign_issue_button').on('click',function(){ 
             var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
             ref.update ( { 'assigned_to' : $('#reassign').val() } ) ; 
             $('#issue-assigned-to').empty().append('<h4>Issue Assigned To:<br>' + $('#reassign').val() + '</h4>' ) ; 
             dialog.close() ; 
         } ); 

         $('.update-comments-button').on ( 'click' , function () { 
            var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
                ref.update ( { 'comments' : $('#comments').val() } ) ; 
            } ) ; 

         $('#issue_start_progress').on('click',function() { 
            var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
                ref.update ( { 'status' : 'In Progress' } ) ; 
           } ) ; 

         $('#issue_resolve').on('click',function(){
            var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
                ref.update ( { 'status' : 'Resolved' } ) ; 
           } ) ; 

         $('#issue_on_hold').on('click',function(){
            var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
                ref.update ( { 'status' : 'On Hold' } ) ; 
           } ) ; 

     } ) ; 
  
    $('#issue_create_submit').click( function() 
    {
        var issue_status= $('#istatus_input').val() ; 
        var issue_type  = $('#itype_input').val() ; 
        var assigned_to = $('#uname_input').val() ; 
        var due_by      = $('#due_input').val() ; 
        var summary     = $('#summary_input').val() ; 
        var descr       = $('#desc_input').val() ; 
        var sev         = $('#iseverity_input').val() ; 
        var priority    = $('#ipriority_input').val() ; 

        if ( $.trim(due_by) == '' ) 
        {
            alert ( 'Needs Due By' ) ; 
            return ; 
        } 

        if ( $.trim(summary) == '' ) 
        {
            alert ( 'Needs Summary' ) ; 
            return ; 
        } 

        if ( $.trim(descr) == '' ) 
        {
            alert ( 'Needs Description' ) ; 
            return ; 
        } 

	    var issues_ref = firebase.database().ref('issues' + $('#project_list').val() ) ; 
		var iref = issues_ref.push() ; 

            issues_ref.once ( 'value' ). then(function(snapshot) 
            {
                iref.set ( { 
                    'issue_num'   : Math.round(isNaN(snapshot.numChildren())?0:snapshot.numChildren()+1 ) , 
                    'issue_type'  : issue_type , 
                    'assigned_to' : assigned_to , 
                    'due_by'      : due_by , 
                    'project_id'  : $('#project_list').val() , 
                    'summary'     : summary,
                    'description' : descr ,
                    'status'      : issue_status , 
                    'severity'    : sev , 
                    'priority'    : priority , 
                    'comments'    : '' 
                } ) ;  
            } ) ; 
        ic_dialog.close() ; 
    } ) ; 
}) ;

$(window).on('load',function() { 
   userHandler() ; 
}) ; 


/* 
$(document).change('#project_list' , function() { 
        $('#issue_list').find('div.demo-card-square').remove() ; 
        var issues_ref = firebase.database().ref('issues' + $('#project_list').val() ) ; 
            issues_ref.once ( 'value' ).then( function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    $('#issue_list').append (  '<div style="min-height:30px;width:120px;" class="demo-card-square mdl-card mdl-shadow--2dp">' 
                                                + '<a id="' + childKey + '" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">' 
                                                + 'Issue ' + childData.issue_num 
                                                + '</a>' 
                                                + '</div>' ) ; 
                 } ) ; 
            } ) ; 

    } ) ;
*/ 
