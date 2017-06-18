class ReactApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user_email: 'hello@example.com',
      projects: [],
      progress: 44,
      add_project: false
    };
    self.p1_material_object = null;
  }
  componentDidMount(){
    var self = this;
    var user = self.props.firebase.auth().currentUser;
    if (user != null) {
      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: "+profile.providerId);
        console.log("  Provider-specific UID: "+profile.uid);
        console.log("  Name: "+profile.displayName);
        console.log("  Email: "+profile.email);
        console.log("  Photo URL: "+profile.photoURL);

        self.setState({
          user_email: profile.email
        })
      });
    }else{
      console.log('no user :(');
    }

    // After material design initializes, we save the reference
    self.p1.addEventListener('mdl-componentupgraded', function() {
        self.p1_material_object = this.MaterialProgress;
        self.p1_material_object.setProgress(self.state.progress);
    });

    var projects = [
      {
        "name": "Project 1",
        "start_date": "tbd",
        "end_date": "tbd",
        "status": "Not Started",
        "progress": "10%",
      }, {
        "name": "Project 2",
        "start_date": "1/1/2017",
        "end_date": "tbd",
        "status": "Not Started",
        "progress": "tbd",
      }, {
        "name": "Project 3",
        "start_date": "2/1/2017",
        "end_date": "tbd",
        "status": "Not Started",
        "progress": "tbd",
      }, {
        "name": "Project 4",
        "start_date": "tbd",
        "end_date": "tbd",
        "status": "Not Started",
        "progress": "tbd"
     },   
    ];

    self.setState({'projects': projects});

  }


  componentDidUpdate(prevProps, prevState){
      var self = this;
      if(self.p1_material_object){
        self.p1_material_object.setProgress(self.state.progress);
      }
    }


  render(){
    var self = this;

    var projects_table = (
      <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
        <thead>
          <tr>
            <th className="mdl-data-table__cell--non-numeric">Project</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Progress</th>
          </tr>
         </thead>
        <tbody>
        {
          this.state.projects.map(function(item, index){
            return (
              <tr key={index}>
                <td className="mdl-data-table__cell--non-numeric">{item.name}</td>
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>{item.status}</td>
                <td>{item.progress}</td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    );

    var addProjectHandler = function(e){

      self.setState({ add_projects: true });
    }

    return (
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
        <TopBar/>
        <SideBar user_email= { this.state.user_email } />
        <main className="mdl-layout__content mdl-color--grey-100">
          <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">
            <button 
              className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
              onClick={addProjectHandler}
            >
              Add Project
            </button>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">Delete Project
            </button>
            <br/>
            { this.state.add_projects ? (<AddProjectForm/>): projects_table }

            {/* Start Task Table */}
            <h4>
              Project 1
            </h4>
            <p>Progress:</p>
            <div ref={(ref)=>this.p1 = ref} className="mdl-progress mdl-js-progress"></div>
            <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
              <thead>
                <tr>
                <th className="mdl-data-table__cell--non-numeric">Task</th>
                <th>Status</th>
              </tr>
             </thead>
              <tbody>
              <tr>
                <td className="mdl-data-table__cell--non-numeric">Create UI</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td className="mdl-data-table__cell--non-numeric">Write Code</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td className="mdl-data-table__cell--non-numeric">User Testing</td>
                <td>Not Started</td>
              </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }
}

class TopBar extends React.Component {

  render() {
    return (
      <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">Project Management Tool</span>
          <div className="mdl-layout-spacer"></div>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
            <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
              <i className="material-icons">search</i>
            </label>
            <div className="mdl-textfield__expandable-holder">
              <input className="mdl-textfield__input" type="text" id="search"/>
              <label className="mdl-textfield__label" htmlFor="search">Enter your query...</label>
            </div>
          </div>
          <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
            <i className="material-icons">more_vert</i>
          </button>
          <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
            <li className="mdl-menu__item">About</li>
            <li className="mdl-menu__item">Contact</li>
            <li className="mdl-menu__item">Legal information</li>
          </ul>
        </div>
      </header>
    );
  }

}

class SideBar extends React.Component {
  render(){
    return (
      <div className="demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
        <header className="demo-drawer-header">
          <img src="/images/user.jpg" className="demo-avatar"/>
          <div className="demo-avatar-dropdown">
            <span>{this.props.user_email}</span>
            <div className="mdl-layout-spacer"></div>
            <button id="accbtn" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
              <i className="material-icons" role="presentation">arrow_drop_down</i>
              <span className="visuallyhidden">Accounts</span>
            </button>
            <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="accbtn">
              <li className="mdl-menu__item">hello@example.com</li>
              <li className="mdl-menu__item">info@example.com</li>
              <li className="mdl-menu__item"><i className="material-icons">add</i>Add another account...</li>
            </ul>
          </div>
        </header>
        <nav className="demo-navigation mdl-navigation mdl-color--blue-grey-800">
          <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>Home</a>
          <a className="mdl-navigation__link" href="/manage"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">inbox</i>Projects</a>
          <a className="mdl-navigation__link" href="/chat"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">chat</i>Chat</a>
          <a className="mdl-navigation__link" href="/issues"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">inbox</i>Issues</a>
          <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Admin</a>
          <div className="mdl-layout-spacer"></div>
          <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">help_outline</i><span className="visuallyhidden">Help</span></a>
        </nav>
      </div>
    );
  }
}

class AddProjectForm extends React.Component {
  render() {

    var formSaveHandler = function(e){
      console.log("pass");
      e.stopPropagation();
      return false;
    }

    return (
      <form action="#">
        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="name" name="name" />
          <label className="mdl-textfield__label" htmlFor="name">Project Name ...</label>
        </div>
        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="start_date" name="start_date" />
          <label className="mdl-textfield__label" htmlFor="start_date">Start Date ...</label>
        </div>
        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="end_date" name="end_date" />
          <label className="mdl-textfield__label" htmlFor="end_date">End Date ...</label>
        </div>

           { /* Save Button */ }
        <br/>
        <button 
          className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
          onClick={formSaveHandler}
          >
          Save
        </button>
      </form>

   
    );

  }
}



