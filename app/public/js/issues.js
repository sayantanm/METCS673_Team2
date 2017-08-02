/*
 * Author : Sayantan Mukherjee
 * Description: The javascript to handle all the interations of the issue tracker.
 */

function userHandler ()
{
    this.auth = firebase.auth() ;
    this.auth.onAuthStateChanged( function ( user )
    {
        if ( user )
        {
            document.getElementById('span_email').innerHTML = firebase.auth().currentUser.email;
            document.getElementById('user-name').textContent = user.displayName ;
            document.getElementById('user-name').removeAttribute ( 'hidden' ) ;
            document.getElementById('sign-out').removeAttribute  ( 'hidden' ) ;
        }
        else
        {
            document.getElementById('user-name').setAttribute('hidden', 'true');
            document.getElementById('sign-out').setAttribute('hidden', 'true');
            document.getElementById('sign-in').removeAttribute('hidden');
            window.location.href = '/index.html' ;
        }
    } ) ;
}

// event listener for the logout option--returns user to landing page
document.getElementById("li_logout").addEventListener("click", function() {
    firebase.auth().signOut();
    window.location = "../index.html";
});

// A function to display the first issue within a project
function firstIssueDisplay ( issues_ref )
{
	/* Get the first issue of the project */
	issues_ref.orderByKey().limitToFirst(1).once('value').then( function ( first_issue )
	{
		$('#issue_body').show() ;
		$('#issue_cards').show() ;
		var issueObj = first_issue.val() ;
		$.each(issueObj,function( key , val )
		{
            $('#current_issue').val( key );
			var issue = val ;
            issueDisplay ( issue ) ;
		} ) ;
	} ) ;
}

/*
 * Create a tree of issues, using Open Source jstree
 */
function issueTree ( issues_ref , projectID )
{
    var pRef = firebase.database().ref ( 'app/projects/' + projectID ) ;
        pRef.once ( 'value' ).then ( function ( prSnapShot )
        {
            issues_ref.once ( 'value').then( function(snapshot) {
                var tree = $('<ul></ul>' ) ;
                var treeRoot = $('<li id=project_1>' + prSnapShot.val().name + '</li>');
                var issueTree = $('<ul id=childTree></ul>') ;
                    treeRoot.append ( issueTree ) ;
                    tree.append ( treeRoot ) ;
                $('#issue_list').append ( tree ) ;
                snapshot.forEach(function(childSnapshot) {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    issueTree.append (  '<li id="' + childKey +'" >Issue ' + childData.issue_num + '</li>' ) ;
                 } ) ;
            } ).then ( function ( )
            {
                 $('#issue_list').jstree().on('ready.jstree', function()
                    {
                        $("#issue_list").jstree("open_all");
                    } ) ;
                    $.jstree.defaults.core.check_callback = true ;
            } ) ;
       } ) ;
}

/*
 * Generic function to display issues
 */

function issueDisplay ( issue )
{
    $('#issue_num_display').empty().append( 'ISSUE-' + issue.issue_num  ) ;
    $('#issue_assigned_to').empty().append ( issue.assigned_to ) ;
    $('#issue_due_display').empty().append ( issue.due_by ) ;
    $('#issue_status_display').empty().append( issue.status ) ;
    $('#issue_severity_display').empty().append( issue.severity  ) ;
    $('#issue_priority_display').empty().append( issue.priority  ) ;
    $('#issue_type_display').empty().append( issue.issue_type  ) ;

    $('#issue_content').jqteVal( issue.description ) ;
    $('#comments').jqteVal( issue.comments ) ;
    $('#issue_summary').text( issue.summary ) ;
    $('#issue-due-by').empty().append('<h4> Issue Due By<br>' + issue.due_by + '</h4>' ) ;
    $('#issue-assigned-to').empty().append('<h4>Issue Assigned To:<br>' + issue.assigned_to + '</h4>' ) ;
}

function membersDropdown ( objID )
{
	  var usersRef = firebase.database().ref('users') ;
	  usersRef.once('value').then( function ( userSnapshot )
	  {
		  var userHash = {} ;
		  userSnapshot.forEach( function ( userDetails )
			{
				userHash [ userDetails.key ] = userDetails.val().name ;
			} ) ;

			var pACLsRef = firebase.database().ref('project_acls/pu/' + $('#project_list').val() ) ;
				pACLsRef.once ( 'value' ).then ( function ( pACLsnapshot )
				{
					$( objID ).empty() ;
					pACLsnapshot.forEach ( function ( ePACL )
					{
						$( objID ).append( '<option value="' + ePACL.key + '">' + userHash [ ePACL.key ] + '</option>' ) ;
					} );
				} ) ;
	  } ) ;
}

$(document).ready ( function()
{
    var fbAuth = firebase.auth() ;
    fbAuth.onAuthStateChanged ( function ( user )
    {
        common.userProjectMap() ;
        $('.editor').jqte() ;

        /* Open issue assign dialog */
        var dialog = document.querySelector('#first_dialog');
        if (! dialog.showModal) {
          dialogPolyfill.registerDialog(dialog);
        }
        dialog.querySelector('.close').addEventListener('click', function() {
          dialog.close();
        });
        var showDialogButton = document.querySelector('#issue_assign');
        showDialogButton.addEventListener('click', function()
		{
              membersDropdown ( '#reassign' ) ;
              dialog.showModal();
              $(dialog).css ( { 'width' : '350px' } ) ;
        });


        /*
         * Open change issue status dialog
         */
        var chsDialog = document.querySelector('#change_status') ;
        if ( ! chsDialog.showModal )
        {
            dialogPolyfill.registerDialog ( chsDialog ) ;
        }
        var chsBtnOpen = document.querySelector('#issue_chstatus') ;
        chsBtnOpen.addEventListener ( 'click' , function()
        {
            var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
            ref.once ( 'value' ).then ( function ( issueSnapshot )
            {
                $('#change_status .chs_issue_id').empty().append ( 'ISSUE-' + issueSnapshot.val().issue_num ) ;
                chsDialog.showModal () ;
                $(chsDialog).css ( { 'width' : '350px' } ) ;
            });
        });
        chsDialog.querySelector('.close').addEventListener('click', function() { chsDialog.close(); } );

        /*
         * Open change priority dialog
         */
        var chPriDialog = document.querySelector ( '#change_priority' ) ;
        if ( ! chPriDialog.showModal )
        {
            dialogPolyfill.registerDialog ( chPriDialog ) ;
        }
        var chPriBtn = document.querySelector('#issue_reprioritize') ;
        chPriBtn.addEventListener ( 'click' , function()
        {
            var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
            ref.once ( 'value' ).then ( function ( issueSnapshot )
            {
                $('#change_priority .chs_issue_id').empty().append ( 'ISSUE-' + issueSnapshot.val().issue_num ) ;
                chPriDialog.showModal() ;
                $(chPriDialog).css ( { 'width' : '350px' } ) ;
            });
        });
        chPriDialog.querySelector('.close').addEventListener('click', function() { chPriDialog.close(); } );

        /*
         * Open change serverity dialog
         */
        var chSevDialog = document.querySelector ( '#change_severity' ) ;
        if ( ! chSevDialog.showModal )
        {
            dialogPolyfill.registerDialog ( chSevDialog ) ;
        }
        var chSevBtn = document.querySelector('#issue_chg_sev') ;
        chSevBtn.addEventListener ( 'click' , function()
        {
            var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
            ref.once('value').then ( function ( issueSnapshot )
            {
                $('#change_severity .chs_issue_id').empty().append ( 'ISSUE-' + issueSnapshot.val().issue_num ) ;
                chSevDialog.showModal() ;
                $(chSevDialog).css ( { 'width' : '350px' } ) ;
            });
        });
        chSevDialog.querySelector('.close').addEventListener('click', function() { chSevDialog.close(); } );



        /*
         * Issue Creator Dialog Box
         * Open the create issue dialog
         * */
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
		      membersDropdown('#uname_input');
              ic_dialog.show();
              $(ic_dialog).css ( { 'margin-left' :'3%' , 'margin-top' : '-50%' , 'width' : '350px' } ) ;
              $('.date_picker_due_date').datepicker( { onClose : function() { $('label[for=due_input]').html('') ; } } ) ;
              $(ic_dialog).draggable();
        });
          ic_dialog.querySelector('.close').addEventListener('click', function() {
          ic_dialog.close();
        });

        /* jQuery UI Datepicker is behaving differently so this workaround is needed */



        // Load project ACLs as defined by admin of the project
        $('#project_acls').on ( 'DOMSubtreeModified' , function ()
        {
            var pACLs = JSON.parse ( $('#project_acls').val() ) ;
            var user_projects = {} ;
            $.each ( pACLs.up[user.uid] , function ( i , v ) { user_projects[v] = 1 } ) ;
            var projects_display = $('<select class="mdl-textfield__input" id=project_list ></select>') ;
            var projects = firebase.database().ref('app/projects') ;
            projects.once('value', function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var childKey = childSnapshot.key;
                        var childData = childSnapshot.val();
                            // Only show projects that the user is a member of.
                            if ( user_projects [ childKey ] )
                            {
                                projects_display.append ('<option class="mdl-color-text--white mdl-color--blue-grey-700" value="' + childKey + '" ><b>' + childData.name + '</b></option>' ) ;
                            }
                     });
                $('#projects_container').append ( projects_display ) ;
            });
        } ) ;

        /*
         * When a project list is selected or on a page is first arrived at.
         */
        $('#projects_container').on ( 'DOMSubtreeModified' , function () {

            // Populate the list of issues.
            $('#issue_list').find('div.demo-card-square').remove() ;
            $('#issue_list').show() ;
            $.jstree.destroy() ;
            var issues_ref = firebase.database().ref('issues' + $('#project_list').val() ) ;

				firstIssueDisplay ( issues_ref , $('#project_list').val() ) ;
			    issueTree( issues_ref , $('#project_list').val() ) ;
                $.jstree.defaults.core.check_callback = true ;

                // When a project is selected from the list...
                $('#project_list').on('change',function()
                {
                    $('#issue_list').empty() ;
					$.jstree.destroy() ;
                    var issues_ref = firebase.database().ref('issues' + $('#project_list').val() ) ;
						firstIssueDisplay ( issues_ref ) ;
						issueTree( issues_ref , $('#project_list').val() ) ;
                        $.jstree.defaults.core.check_callback = true ;
                } ) ;
            } ) ;


         $('#issue_list').on ( 'DOMSubtreeModified' , function () {

			/* Trigger on issue list population and wait on an issue button to be clicked */
			 $('#issue_list').on('select_node.jstree', function ( e , data )
			 {
                $('#current_issue').val( data.node.id ) ;
				var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + data.node.id ) ;
					ref.once ( 'value' ).then( function(snapshot)
					{
						var issue = snapshot.val() ;
						issueDisplay ( issue ) ;
					} ) ;

			 } ) ;

            $('.update-desc-button').on('click',function(){
                var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
                    ref.update ( { 'description' : $('#issue_content').val() } ) ;
                    console.log ( 'Update ' + $('#current_issue').val() + ' ' + $('#issue_content').val() );
             } ) ;


             $('#reassign_issue_button').on('click',function(){
                 var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
                 ref.update ( { 'assigned_to' : $('#reassign :selected').text() } ) ;
				 ref.update ( { 'assigned_uid' : $('#reassign').val() } ) ;
				 dialog.close() ;
                 $('#issue-assigned-to').empty().append('<h4>Issue Assigned To:<br>' + $('#reassign :selected').text() + '</h4>' ) ;
             } );

             $('.update-comments-button').on ( 'click' , function () {
                var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
                    ref.update ( { 'comments' : $('#comments').val() } );
                } ) ;


             $('#issue_resolve').on('click',function(){
                var ref = firebase.database().ref('issues' + $('#project_list').val() + '/' + $('#current_issue').val() ) ;
                    ref.update ( { 'status' : 'Resolved' } ) ;
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
                        'assigned_to' : $('#uname_input :selected').text() ,
                        'assigned_uid': $('#uname_input').val() ,
                        'due_by'      : due_by ,
                        'project_id'  : $('#project_list').val() ,
                        'summary'     : summary,
                        'description' : descr ,
                        'status'      : issue_status ,
                        'severity'    : sev ,
                        'priority'    : priority ,
                        'comments'    : ''
                    } ).then ( function ( ) {
                        iref.once ( 'value' ).then ( function ( irefData )
                            {
                                console.log ( 'What is happenning!' ) ;
                                $('#issue_list').jstree().create_node('project_1',{ id : irefData.key , text: 'Issue ' + irefData.val().issue_num } , 'last' , false , false ) ;
                                $('#issue_list').jstree(true).select_node( irefData.key ) ;
                                $('#current_issue').val ( irefData.key ) ;
                            } );
                    } ) ;
                } ) ;
            ic_dialog.close() ;
        } ) ;
    } ) ;
}) ;

$(window).on('load',function() {
   userHandler() ;
}) ;
