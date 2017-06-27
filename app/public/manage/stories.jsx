
class UserStories extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      add_story: false,
      story_idx: null,
      stories: [ {"name": "story 1", "status": "completed"} ]
    };

    this.addStoryHandler= this.addStoryHandler.bind(this);
  }

  addStoryHandler(story) {
    console.log("Add new ", story);
    var result = this.firebaseProjects.push(story);
    this.loadStories();
  }

  componentWillMount() {
    // Based on this SO answer, I dediced to sign in anonymously:
    this.props.firebase.auth().signInAnonymously().catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

    this.firebaseStories = this.db.ref('app/stories');

    this.loadStories();
  }

  loadStories(){
    this.firebaseProjects.on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['firebase_key'] = childSnapshot.key;
        items.push(item);
      });

      this.setState({
        stories: items
      });
     }.bind(this));
  }

  render() {

    var self = this;

    var body = this.state.stories.map(function(item, index){
      return (
        <tr key={index}>
          <td className="mdl-data-table__cell--non-numeric">{item.name}</td>
          <td>{item.status}</td>
        </tr>
      );
    });


    if ( self.state.stories.length > 0) {
      if (this.props.project != null) { 
          var heading = <h3> { this.props.project['name'] } </h3>;
        }
    }

    return (

      //{ this.state.add_story ? (<AddStoryForm addStoryHandler={self.addStoryHandler} />): stories_table }
    
      <div>
        {heading}

        <AddStoryForm addStoryHandler= {self.addStoryHandler} />
       
        <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
          <thead>
            <tr>
            <th className="mdl-data-table__cell--non-numeric">Name</th>
            <th>Status</th>
          </tr>
         </thead>
          <tbody>
          {
            body
          }
          </tbody>
        </table>
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
          Add Story
        </button>
      </div>
    );

  }

}

class AddStoryForm extends React.Component {

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
    var story = {};
    var errors = {};

    story['name'] = form.elements.namedItem("name").value;
    if (!story['name']){
      errors['name'] = 'Name is required.';
    }else if (story['name'].length < 5){
      errors['name'] = 'Name must be at least 5 characters.';
    }

    story['status'] = form.elements.namedItem("status").value;
    if (!story['status']){
      errors['status'] = 'status is required.';
    }

    this.setState({
      errors: errors, values: story
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
        self.props.addStoryHandler(self.state.values);
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
          <label className="mdl-textfield__label" htmlFor="name">User Story Name</label>
          {this.state.errors.name ? (
            <span className="mdl-textfield__error">{this.state.errors.name}</span>
          ): null}
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id="status" name="status" />
          <label className="mdl-textfield__label" htmlFor="status">Status</label>
          {this.state.errors.status ? (
            <span className="mdl-textfield__error">{this.state.errors.status}</span>
          ): null}
        </div>

        { /* Add Story Button */ }
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
