
class UserStories extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stories: [ {"name": "story 1", "status": "completed"} ]
    };
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

      <div>
        {heading}

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
      </div>
    );

  }

}