/* 
 * Author: Sayantan Mukherjee 
 * Description: For this to work, you'll need a <input type=hidden> field with id "projects_json" in your page and "project_acls".
 *              And you'll have to wait for an event "DOMSubtreeModified" on the IDs (projects_json and project_acls) to get 
 *              values from it ( using say $('#projects_json').val() ) ; 
 *              Read more about https://developer.mozilla.org/en-US/docs/Web/Events/DOMSubtreeModified
 *              IMPORTANT!! Do not update the DOMSubtree while listening on DOMSubtreeModified event for the same subtree. 
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
                $.each( pv.members , function ( mI , mV )  // mI = members Index , mV = members Value 
                {   
                    if ( mV == null ) { return ; }  
                    var member_uid ; 
                    if ( mV.hasOwnProperty ( 'uid' ) ) 
                    {
                        member_uid = mV.uid ; 
                    } 
                    else 
                    {
                        member_uid = mV ; 
                    } 

                    if ( project_users.hasOwnProperty ( pi ) ) 
                    {  
                        project_users[pi].push ( member_uid ) ; 
                    } 
                    else 
                    {
                        project_users[pi] = []  ; 
                        project_users[pi].push ( member_uid ) ; 
                    }

                    if ( user_projects.hasOwnProperty ( member_uid ) ) 
                    {
                        user_projects[member_uid].push ( pi ) ; 
                    } 
                    else 
                    {
                        user_projects[member_uid] = [] ; 
                        user_projects[member_uid].push ( pi ) ; 
                    }
                }) ; 
            } ) ; 
            $('#project_acls').val( JSON.stringify ( { pu : project_users , up: user_projects } ) ) ; 
            
            /* 
             * Probably a good idea for this to be stored in firebase-db 
             */ 
            var pACLs = firebase.database().ref( 'project_acls' ) ; 
                var sUp = {} ; 
                var pPu = {} ; 
                $.each ( project_users, function ( project , members ) 
                {
                    pPu[project] = {} ; 
                    $.each ( members , function ( i , v ) 
                    {
                        pPu[project][v] = true ; 
                    } ) ; 
                } ) ; 

                $.each ( user_projects , function ( user , projects ) 
                {
                    sUp[user] = {} ; 
                    $.each ( projects , function ( i , v ) 
                    {
                        sUp[user][v] = true ; 
                    } ) ; 
                } ) ; 

                pACLs.set ( { pu : pPu , up: sUp } ).then(function() { console.log ( 'Set Success' ) ; } ) ; 
        }) ; 
    }
}
