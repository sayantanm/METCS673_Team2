class ReactApp extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user_email: 'hello@example.com',
      uid: null,
      projects: [],
      project_idx: null,
      progress: 44,
      add_project: false,
      view_project: false,
      edit_project: false
    };

    this.p1_material_object = null;

    // bind callback so that 'this' works when called from different object
    this.addProjectHandler= this.addProjectHandler.bind(this);
    this.updateProjectHandler= this.updateProjectHandler.bind(this);
  }

  addProjectHandler(project) {
    console.log("Add new ", project);
    project['admins'] = [this.state.uid];
    project['members'] = [this.state.uid];
    
    var result = this.firebaseProjects.push(project);

    this.setState({'add_project': false});
    this.loadProjects();
  }

  updateProjectHandler(project, firebase_key) {
    //get the project and merge it with the updated form values to update it.
    var updated_project = Object.assign({}, this.state.projects[this.state.project_idx], project)
    //cleanup firebase key since it is redundant
    updated_project['firebase_key'] = null;
    console.log("updated project: ", updated_project)

    var updates = {};
    updates['/app/projects/' + firebase_key] = updated_project;

    this.db.ref().update(updates);
    this.setState({'edit_project': false});
    this.loadProjects();
  }

  deleteProject(index) {
    var firebase_key = this.state.projects[index].firebase_key;
    var deletes = {};
    deletes['/app/projects/' + firebase_key] = null;
    console.log(deletes);

    this.db.ref().update(deletes);
    this.loadProjects();
  }

  componentWillMount() {

    var self = this;

    this.props.firebase.auth().onAuthStateChanged(function(user) {
      if (user != null) {
        console.log("user ", user);

        user.providerData.forEach(function (profile) {
          console.log("Sign-in provider: "+profile.providerId);
          console.log("  Provider-specific UID: "+profile.uid);
          console.log("  Name: "+profile.displayName);
          console.log("  Email: "+profile.email);
          console.log("  Photo URL: "+profile.photoURL);

          self.setState({
            user_email: profile.email, uid: user.uid
          });
        
        });

        self.db = self.props.firebase.database();
        self.firebaseProjects = self.db.ref('app/projects');
        self.loadProjects();

      }else{
        console.log('no user :(');
      }
    });
  }


  loadProjects(){
    var self = this;
    this.firebaseProjects.on('value', function(dataSnapshot) {
      var items = [];
      console.log("user id from load projects(): ", this.state.uid);
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['firebase_key'] = childSnapshot.key;

        //for each project, check if the current user is in the list of members 
        if (item.members) {
          var members = Object.values(item['members']);

          if (members.indexOf(self.state.uid) > -1) {
            items.push(item);
          }
         
        }
      
      });

      this.setState({
        projects: items,
        project_idx: null
      });
     }.bind(this));
  }

 /* componentDidMount(){
   

    // After material design initializes, we save the reference
    //self.p1.addEventListener('mdl-componentupgraded', function() {
       //self.p1_material_object = this.MaterialProgress;
        //self.p1_material_object.setProgress(self.state.progress);
    //});

  }*/


  componentDidUpdate(prevProps, prevState){
      var self = this;
      if(self.p1_material_object){
        self.p1_material_object.setProgress(self.state.progress);
      }
    }


  render(){
    var self = this;

    var projects_table = (
      <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th className="mdl-data-table__cell--non-numeric">Project</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
         </thead>
        <tbody>
        {
          self.state.projects.map(function(item, index){
            var viewProjectHandler = function(){
              self.setState({ view_project: true , project_idx: index});
            }
            var editProjectHandler = function(){
              self.setState({ edit_project: true , project_idx: index});
            }
            var deleteProjectHandler = function() {
              self.deleteProject(index);
            }
            return (
              <tr key={item.firebase_key}>
                <td className="mdl-data-table__cell--non-numeric">
                  {item.name} {(self.state.project_idx === index) ? "<--" : null}
                </td>
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>{item.status}</td>
                <td>{item.desc}</td>
                <td>
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  onClick={viewProjectHandler}
                  >
                  View</button>
                  &nbsp;
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  onClick={deleteProjectHandler}
                  >
                  Delete
                  </button>
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  onClick={editProjectHandler}
                  >
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

    var showAddFormHandler = function(e){
      self.setState({ add_project: true, edit_project: false});
    }

    var showProjectsHandler = function(e){
      self.setState({ add_project: false, edit_project: false});
    }

    var project = null;
    if((self.state.project_idx !== null) && self.state.projects.length > 0 ){
      project = self.state.projects[self.state.project_idx];
    }

    return (
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
        <TopBar/>
        <SideBar user_email= { this.state.user_email } />
        <main className="mdl-layout__content mdl-color--grey-100">
          <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--12-col">
            <div className="mdl-cell mdl-cell--8-col">
              <button
                className="mdl-button mdl-js-button mdl-button--raised"
                onClick={showProjectsHandler}
              >
                List Projects
              </button>
              &nbsp; &nbsp;
              <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                onClick={showAddFormHandler}
              >
                Add Project
              </button>
            </div>
          </div>    
          <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--12-col">
            { this.state.add_project ? (<ProjectForm saveProjectHandler={self.addProjectHandler} />):
               (this.state.edit_project ? (<ProjectForm saveProjectHandler={self.updateProjectHandler} project={project} />): projects_table)
            }

            {/* If view is clicked, then display user stories table */}
            {
              (project && self.state.view_project) ?
              <UserStories project={project} db={self.db}/>
              : <p>View Project to see stories.</p>}
            {/* <p>Progress:</p> */}
            {/*  <div ref={(ref)=>this.p1 = ref} className="mdl-progress mdl-js-progress"></div> */ }
          </div>
        </main>
      </div>
    );
  }
}


class ProjectForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      values: null,
      firebase_key: null
    };

    this.state.values = props.project ? props.project: null;
    this.state.firebase_key = props.project ? props.project.firebase_key : null;
    // This is to allow it to work as callback from other context
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e){
    var form = this.formRef;
    var values = {};
    var errors = {};

    values['name'] = form.elements.namedItem("name").value;
    if (!values['name']){
      errors['name'] = 'Name is required.';
    }else if (values['name'].length < 5){
      errors['name'] = 'Name must be at least 5 characters.';
    }

    values['start_date'] = form.elements.namedItem("start_date").value;
    if (!values['start_date']){
      errors['start_date'] = 'start_date is required.';
    }

    values['end_date'] = form.elements.namedItem("end_date").value;
    if (!values['end_date']){
      errors['end_date'] = 'end_date is required.';
    }

    values['status'] = form.elements.namedItem("status").value;
    if (!values['status']){
      errors['status'] = 'status is required.';
    }

    values['desc'] = form.elements.namedItem("desc").value;
    if (!values['desc']){
      errors['desc'] = 'desc is required.';
    }

    this.setState({
      errors: errors, values: values
    });
  }


  componentDidMount(){
    var value = null;

    window.componentHandler.upgradeDom();

    var picker = new MaterialDatetimePicker({
     container: this.picker_container})
     .on('submit', (val) => {
      value = val.format("MM/DD/YYYY");
      console.log("date value: ", value);
      this.setState({'values': Object.assign({}, this.state.values, {'start_date': value})
      });
     })

    .on('open', () => console.log('opened'))
    .on('close', () => console.log('closed'));

    this.btn.addEventListener('click', () => picker.open()); 
  }

  componentDidUpdate(prevProps, prevState){
    window.componentHandler.upgradeDom();
  }

  componentWillReceiveProps(nextProps){
    if (this.props.project != nextProps.project) {
      var state = {};
      state.values = nextProps.project ? nextProps.project: null;
      state.firebase_key = nextProps.project ? nextProps.project.firebase_key : null;

      this.setState(state);
    }

  }

  render() {
    var self = this;
    { /* Form Submit Handler */ }

    var submitHandler = function(e){
      e.preventDefault();
      if (Object.keys(self.state.errors) == 0){
        self.props.saveProjectHandler(self.state.values, self.state.firebase_key);
      }else{
        var text = Object.values(self.state.errors).join(" ");
        alert('form still has errors: ' + text);
      }
    };

    return (
      <form
        onSubmit={submitHandler}
        
        ref={(ref)=>this.formRef = ref}
        >

        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="name" name="name" 
          value={this.state.values ? this.state.values.name : "" } onChange={self.changeHandler}/>
          <label className="mdl-textfield__label" htmlFor="name">Project Name ...</label>
          {this.state.errors.name ? (
            <span className="mdl-textfield__error">{this.state.errors.name}</span>
          ): null}
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="start_date" name="start_date" 
            value={this.state.values ? this.state.values.start_date : ""} onChange={self.changeHandler}
          />
          <div ref={(ref)=>this.picker_container = ref}>
            <a className="c-btn c-datepicker-btn" ref={(ref)=>self.btn = ref}>Open Picker</a>
          </div>
      
          <label className="mdl-textfield__label" htmlFor="start_date">Start Date ...</label>
          {this.state.errors.start_date ? (
            <span className="mdl-textfield__error">{this.state.errors.start_date}</span>
          ): null}
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="end_date" name="end_date" 
          value={this.state.values ? this.state.values.end_date : ""} onChange={self.changeHandler}/>
          <div ref={(ref)=>this.picker_container = ref}>
            <a className="c-btn c-datepicker-btn" ref={(ref)=>self.btn = ref}>Open Picker</a>
          </div>
          <label className="mdl-textfield__label" htmlFor="end_date">End Date ...</label>
          {this.state.errors.end_date ? (
            <span className="mdl-textfield__error">{this.state.errors.end_date}</span>
          ): null}
        </div>

        <div className="mdl-selectfield mdl-js-selectfield">
          <label className="mdl-selectfield__label" htmlFor="status">Status</label>
          <select className="mdl-selectfield__select" id="status" name="status" 
          value={this.state.values ? this.state.values.status : ""} onChange={self.changeHandler}>
            <option value= ""></option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="desc" name="desc" 
          value={this.state.values ? this.state.values.desc : ""} onChange={self.changeHandler}/>
          <label className="mdl-textfield__label" htmlFor="desc">Description</label>
          {this.state.errors.desc ? (
            <span className="mdl-textfield__error">{this.state.errors.desc}</span>
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

