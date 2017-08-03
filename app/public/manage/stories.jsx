
class UserStories extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      add_story: false,
      story_idx: null,
      stories: []
    };

    this.addStoryHandler= this.addStoryHandler.bind(this);
    this.updateStoryHandler= this.updateStoryHandler.bind(this);
    this.showFormHandler = this.showFormHandler.bind(this);
  }

  showFormHandler(e){
    this.setState({ add_story: true });
  }


  componentWillMount() {
    this.firebaseStories = this.props.db.ref('app/stories');
    this.loadStories();
  }

  componentDidUpdate(prevProps, prevState){
    if (
      this.props.project && (
        this.props.project.firebase_key != prevProps.project.firebase_key
      )
    ){
      this.loadStories();
    }
  }

  loadStories(){
    var self = this;

    this.firebaseStories.orderByChild('project_key').equalTo(
      self.props.project.firebase_key
    ).on('value', function(dataSnapshot) {
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

  addStoryHandler(story) {
    console.log("Add new ", story);
    story['project_key'] = this.props.project.firebase_key;
    var result = this.firebaseStories.push(story);
    this.setState({add_story: false});
    this.loadStories();
  }

  updateStoryHandler(story, firebase_key) {
    //get the project and merge it with the updated form values to update it.
    var updated_story = Object.assign({}, this.state.stories[this.state.story_idx], story)
    //cleanup firebase key since it is redundant
    //updated_project['firebase_key'] = null;
    console.log("updated story: ", updated_story)

    var updates = {};
    updates['/app/stories/' + firebase_key] = updated_story;

    this.props.db.ref().update(updates);
    this.setState({'edit_story': false});
    this.loadStories();
  }


  render() {

    var self = this;


    if (this.state.stories.length > 0){
      var body = this.state.stories.map(function(item, index){
        var editStoryHandler = function(){
          self.setState({ edit_story: true , story_idx: index});
        }

        return (
          <tr key={item.firebase_key}>
            <td className="mdl-data-table__cell--non-numeric">
              {item.name} {(self.state.story_idx === index) ? "<--" : null}
            </td>
            <td>{item.status}</td>
            <td>       
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                onClick={editStoryHandler}
                >
                Edit
              </button> 
            </td>
          </tr>
        );
      });

      var stories_table = (
        <div>
          <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
            <thead>
              <tr>
              <th className="mdl-data-table__cell--non-numeric">Name</th>
              <th>Status</th>
              <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                body
              }
            </tbody>
          </table>
        </div>
      );
    } else {
      stories_table = <p>No stories</p>;
    }

    var add_story_button = (
      <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
      onClick={self.showFormHandler}>
        Add Story
      </button>
    );

    var heading = <h3> { self.props.project['name'] } </h3>;

    var story = null;
      if((self.state.story_idx !== null) && self.state.stories.length > 0 ){
         story = self.state.stories[self.state.story_idx];
    }

    return (
      <div>
        {heading}
        { this.state.add_story ? (
          <AddStoryForm
            saveStoryHandler={self.addStoryHandler}
            hideForm={
              function() {
                self.setState({add_story: false});
              }
            }
          />
        ): (this.state.edit_story ? (
          <AddStoryForm saveStoryHandler={self.updateStoryHandler}
           story={story}
           hideForm={
             function() {
               self.setState({ edit_story: false });
             }
           } />): stories_table )
        }

        {add_story_button}
    
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
      firebase_key: null
    };

    this.state.values = props.story ? props.story: null;
    this.state.firebase_key = props.story ? props.story.firebase_key : null;
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
        self.props.saveStoryHandler(self.state.values, self.state.firebase_key);

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
          value={this.state.values ? this.state.values.name : "" }
          onChange={self.changeHandler}/>
          <label className="mdl-textfield__label" htmlFor="name">User Story Name</label>
          {this.state.errors.name ? (
            <span className="mdl-textfield__error">{this.state.errors.name}</span>
          ): null}
        </div>

        <div className="mdl-selectfield mdl-js-selectfield">
          <label className="mdl-selectfield__label" htmlFor="status">Status</label>
          <select className="mdl-selectfield__select" id="status" name="status" 
          value={this.state.values ? this.state.values.status : "" }
          onChange={self.changeHandler}>
            <option value=""></option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

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
