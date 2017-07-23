/* 
 * Author: Sayantan Mukherjee 
 * Description: For this to work, you'll need a <input type=hidden> field with id "projects_json" in your page and "project_acls".
 */
var common = { 
    
    // 
    // Get ALL projects from firebase, convert it into a json string, store it in a hidden input of the page. 
    //
    getAllProjects : function () 
    {
        var projectsRef = firebase.database().ref('app/projects'); 
        var projects  ; 
        var fui = projectsRef.once ( 'value' ).then ( function ( snapshot ) 
            { 
                $('#projects_json').val( JSON.stringify ( snapshot.val() ) ) ; //Do I need to do something sophisticated for this later?
            }); 
    } ,
    
    // 
    // Get a "map" of projects->users and users->projects based on who is member of what.
    //
    userProjectMap : function () 
    {
        var project_users = {} ; 
        var user_projects = {} ; 
        this.getAllProjects() ; 
        var eu = $('#projects_json').on( 'DOMSubtreeModified' , function() 
        {
            var projects = JSON.parse ( $('#projects_json').val() ) ; 
            // Loop through each project to find a list of members 
            $.each ( projects , function ( pi , pv ) { // pi = project index (key) pv = project value
                // console.log ( pi ) ; 
                // console.log ( pv.members ) ; 
                $.each( pv.members , function ( mI , mV ) 
                {   
                    if ( project_users.hasOwnProperty ( pi ) ) 
                    {  
                        project_users[pi].push ( mV.uid ) ; 
                    } 
                    else 
                    {
                        project_users[pi] = []  ; 
                        project_users[pi].push ( mV ) ; 
                    }

                    if ( user_projects.hasOwnProperty ( mV.uid ) ) 
                    {
                        user_projects[mV.uid].push ( pi ) ; 
                    } 
                    else 
                    {
                        user_projects[mV.uid] = [] ; 
                        user_projects[mV.uid].push ( pi ) ; 
                    }
                }) ; 
            } ) ; 
            $('#project_acls').val( JSON.stringify ( { pu : project_users , up: user_projects } ) ) ; 
        }) ; 
    }
}
