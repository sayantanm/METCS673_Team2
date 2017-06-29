
class UserStories extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      add_story: false,
      story_idx: null,
      stories: [ {"name": "story 1", "status": "completed"} ]
    };

    this.addStoryHandler= this.addStoryHandler.bind(this);
    this.showFormHandler = this.showFormHandler.bind(this);
  }

  showFormHandler(e){
    this.setState({ add_story: true });
  }

  addStoryHandler(story) {
    console.log("Add new ", story);
    var result = this.firebaseStories.push(story);
    this.loadStories();
  }

  componentWillMount() {

    this.firebaseStories = this.props.db.ref('app/stories');

    this.loadStories();
  }

  loadStories(){
    this.firebaseStories.on('value', function(dataSnapshot) {
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

    console.log(this.props);

    var body = this.state.stories.map(function(item, index){
      return (
        <tr key={index}>
          <td className="mdl-data-table__cell--non-numeric">{item.name}</td>
          <td>{item.status}</td>
        </tr>
      );
    });

    var stories_table = (
      <div>
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

        <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
        onClick={self.showFormHandler}>
          Add Story
        </button>
      </div>
    );

    if ( self.state.stories.length > 0) {
      if (self.props.project != null) { 
          var heading = <h3> { self.props.project['name'] } </h3>;
        }
    }

    return (
      <div>
        {heading}
        { this.state.add_story ? (
          <AddStoryForm
            addStoryHandler={self.addStoryHandler}
            hideForm={
              function() {
                self.setState({add_story: false});
              }
            }
          />
        ): stories_table }
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

        self.props.addStoryHandler(self.state.values);

        self.setState({add_story: false});
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
        <button 
          type="button"
          className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
          onClick={
            function(e){
              e.preventDefault();
              self.props.hideForm();
            }
          }
        >
          Cancel
        </button>
      </form>
    );
  }
}