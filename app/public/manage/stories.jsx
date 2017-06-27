
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