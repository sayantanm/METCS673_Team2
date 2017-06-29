class ReactApp extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user_email: 'hello@example.com',
      projects: [],
      project_idx: null,
      progress: 44,
      add_project: false,
      view_project: false
    };
    this.p1_material_object = null;

    // bind callback so that 'this' works when called from different object
    this.addProjectHandler= this.addProjectHandler.bind(this);

    this.db = this.props.firebase.database();

  }

  addProjectHandler(project) {
    console.log("Add new ", project);
    var result = this.firebaseProjects.push(project);
    console.log("result: ", result);
    
    this.setState({'add_project': false});
    this.loadProjects();
  }


  componentWillMount() {
    // Based on this SO answer, I dediced to sign in anonymously:
    this.props.firebase.auth().signInAnonymously().catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

    this.firebaseProjects = this.db.ref('app/projects');

    this.loadProjects();
  }


  loadProjects(){
    this.firebaseProjects.on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['firebase_key'] = childSnapshot.key;
        items.push(item);
      });

      this.setState({
        projects: items
      });
     }.bind(this));
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

  }


  componentDidUpdate(prevProps, prevState){
      var self = this;
      if(self.p1_material_object){
        self.p1_material_object.setProgress(self.state.progress);
      }
    }


  render(){

    console.log(this.state.projects);

    var self = this;

    var viewProjectHandler = function(e, idx){
      console.log(idx);
      self.setState({ view_project: true , project_idx: idx});
    }

    var projects_table = (
      <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th className="mdl-data-table__cell--non-numeric">Project</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
         </thead>
        <tbody>
        {
          self.state.projects.map(function(item, index){
            return (
              <tr key={index}>
                <td className="mdl-data-table__cell--non-numeric">
                  {item.name} {(self.state.project_idx === index) ? "<--" : null}
                </td>
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>{item.status}</td>
                <td>
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  onClick={function(e){ viewProjectHandler(event, index)}}
                  >
                  View</button>
                  &nbsp;
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                  Delete
                  </button>
                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                  Edit
                  </button>
                </td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    );

    var showFormHandler = function(e){
      self.setState({ add_project: true });
    }

    var showProjectsHandler = function(e){
      self.setState({ add_project: false });
    }

    var project = null;
    if(this.state.project_idx ==! null && this.state.view_project){
      project = self.state.projects[self.state.project_idx];
    }

    return (
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
        <TopBar/>
        <SideBar user_email= { this.state.user_email } />
        <main className="mdl-layout__content mdl-color--grey-100">
          <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">
            <div className="mdl-cell mdl-cell--4-col">
              <button
                className="mdl-button mdl-js-button mdl-button--raised"
                onClick={showProjectsHandler}
              >
                List Projects
              </button>
              &nbsp;
              <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                onClick={showFormHandler}
              >
                Add Project
              </button>
            </div>
          </div>
          <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">

            { this.state.add_project ? (<AddProjectForm addProjectHandler={self.addProjectHandler} />): projects_table }

            {/* If view is clicked, then display user stories table */}
            <UserStories project={self.result} db={self.db} />
     
            <p>Progress:</p>
            <div ref={(ref)=>this.p1 = ref} className="mdl-progress mdl-js-progress"></div>
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

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      values: {},
    };

    // This is to allow it to work as callback from other context
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e){
    var form = this.formRef;
    var new_project = {};
    var errors = {};

    new_project['name'] = form.elements.namedItem("name").value;
    if (!new_project['name']){
      errors['name'] = 'Name is required.';
    }else if (new_project['name'].length < 5){
      errors['name'] = 'Name must be at least 5 characters.';
    }

    new_project['start_date'] = form.elements.namedItem("start_date").value;
    if (!new_project['start_date']){
      errors['start_date'] = 'start_date is required.';
    }

    new_project['end_date'] = form.elements.namedItem("end_date").value;
    if (!new_project['end_date']){
      errors['end_date'] = 'end_date is required.';
    }


    this.setState({
      errors: errors, values: new_project
    });
  }


  componentDidMount(){
    window.componentHandler.upgradeDom();
  }
  componentDidUpdate(prevProps, prevState){
    window.componentHandler.upgradeDom();
  }

  render() {
    var self = this;
    { /* Form Submit Handler */ }

    var submitHandler = function(e){
      e.preventDefault();
      if (Object.keys(self.state.errors) == 0){
        console.log(self.state);
        self.props.addProjectHandler(self.state.values);
      }else{
        var text = Object.values(self.state.errors).join(" ");
        alert('form still has errors: ' + text);
      }
    };

  return (
      <form
        onSubmit={submitHandler}
        onChange={self.changeHandler}
        ref={(ref)=>this.formRef = ref}
        >

        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="name" name="name" />
          <label className="mdl-textfield__label" htmlFor="name">Project Name ...</label>
          {this.state.errors.name ? (
            <span className="mdl-textfield__error">{this.state.errors.name}</span>
          ): null}
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="start_date" name="start_date" />
          <label className="mdl-textfield__label" htmlFor="start_date">Start Date ...</label>
          {this.state.errors.start_date ? (
            <span className="mdl-textfield__error">{this.state.errors.start_date}</span>
          ): null}
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="end_date" name="end_date" />
          <label className="mdl-textfield__label" htmlFor="end_date">End Date ...</label>
          {this.state.errors.end_date ? (
            <span className="mdl-textfield__error">{this.state.errors.end_date}</span>
          ): null}
        </div>

        { /* Add Project Button */ }
        <br/>
        <button
          type="submit"
          className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
          >
          Save
        </button>
      </form>
    );
  }
}

