"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactApp = function (_React$Component) {
  _inherits(ReactApp, _React$Component);

  function ReactApp(props) {
    _classCallCheck(this, ReactApp);

    var _this = _possibleConstructorReturn(this, (ReactApp.__proto__ || Object.getPrototypeOf(ReactApp)).call(this, props));

    _this.state = {
      user_email: 'hello@example.com',
      projects: [],
      project_idx: null,
      progress: 44,
      add_project: false,
      view_project: false
    };
    _this.p1_material_object = null;

    // bind callback so that 'this' works when called from different object
    _this.addProjectHandler = _this.addProjectHandler.bind(_this);

    _this.db = _this.props.firebase.database();

    return _this;
  }

  _createClass(ReactApp, [{
    key: "addProjectHandler",
    value: function addProjectHandler(project) {
      console.log("Add new ", project);
      var result = this.firebaseProjects.push(project);
      console.log("result: ", result);

      this.setState({ 'add_project': false });
      this.loadProjects();
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      // Based on this SO answer, I dediced to sign in anonymously:
      this.props.firebase.auth().signInAnonymously().catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

      this.firebaseProjects = this.db.ref('app/projects');

      this.loadProjects();
    }
  }, {
    key: "loadProjects",
    value: function loadProjects() {
      this.firebaseProjects.on('value', function (dataSnapshot) {
        var items = [];
        dataSnapshot.forEach(function (childSnapshot) {
          var item = childSnapshot.val();
          item['firebase_key'] = childSnapshot.key;
          items.push(item);
        });

        this.setState({
          projects: items
        });
      }.bind(this));
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      var user = self.props.firebase.auth().currentUser;

      if (user != null) {
        user.providerData.forEach(function (profile) {
          console.log("Sign-in provider: " + profile.providerId);
          console.log("  Provider-specific UID: " + profile.uid);
          console.log("  Name: " + profile.displayName);
          console.log("  Email: " + profile.email);
          console.log("  Photo URL: " + profile.photoURL);

          self.setState({
            user_email: profile.email
          });
        });
      } else {
        console.log('no user :(');
      }

      // After material design initializes, we save the reference
      self.p1.addEventListener('mdl-componentupgraded', function () {
        self.p1_material_object = this.MaterialProgress;
        self.p1_material_object.setProgress(self.state.progress);
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var self = this;
      if (self.p1_material_object) {
        self.p1_material_object.setProgress(self.state.progress);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var self = this;

      var projects_table = React.createElement(
        "table",
        { className: "mdl-data-table mdl-js-data-table mdl-shadow--2dp" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { className: "mdl-data-table__cell--non-numeric" },
              "Project"
            ),
            React.createElement(
              "th",
              null,
              "Start Date"
            ),
            React.createElement(
              "th",
              null,
              "End Date"
            ),
            React.createElement(
              "th",
              null,
              "Status"
            ),
            React.createElement(
              "th",
              null,
              "Description"
            ),
            React.createElement(
              "th",
              null,
              "Actions"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          self.state.projects.map(function (item, index) {
            var viewProjectHandler = function viewProjectHandler() {
              self.setState({ view_project: true, project_idx: index });
            };
            return React.createElement(
              "tr",
              { key: item.firebase_key },
              React.createElement(
                "td",
                { className: "mdl-data-table__cell--non-numeric" },
                item.name,
                " ",
                self.state.project_idx === index ? "<--" : null
              ),
              React.createElement(
                "td",
                null,
                item.start_date
              ),
              React.createElement(
                "td",
                null,
                item.end_date
              ),
              React.createElement(
                "td",
                null,
                item.status
              ),
              React.createElement(
                "td",
                null,
                item.desc
              ),
              React.createElement(
                "td",
                null,
                React.createElement(
                  "button",
                  { className: "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect",
                    onClick: viewProjectHandler
                  },
                  "View"
                ),
                "\xA0",
                React.createElement(
                  "button",
                  { className: "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" },
                  "Delete"
                ),
                React.createElement(
                  "button",
                  { className: "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" },
                  "Edit"
                )
              )
            );
          })
        )
      );

      var showFormHandler = function showFormHandler(e) {
        self.setState({ add_project: true });
      };

      var showProjectsHandler = function showProjectsHandler(e) {
        self.setState({ add_project: false });
      };

      var project = null;
      if (self.state.project_idx !== null && self.state.view_project) {
        project = self.state.projects[self.state.project_idx];
      }

      return React.createElement(
        "div",
        { className: "demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header" },
        React.createElement(TopBar, null),
        React.createElement(SideBar, { user_email: this.state.user_email }),
        React.createElement(
          "main",
          { className: "mdl-layout__content mdl-color--grey-100" },
          React.createElement(
            "div",
            { className: "demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col" },
            React.createElement(
              "div",
              { className: "mdl-cell mdl-cell--4-col" },
              React.createElement(
                "button",
                {
                  className: "mdl-button mdl-js-button mdl-button--raised",
                  onClick: showProjectsHandler
                },
                "List Projects"
              ),
              "\xA0",
              React.createElement(
                "button",
                {
                  className: "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect",
                  onClick: showFormHandler
                },
                "Add Project"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col" },
            this.state.add_project ? React.createElement(AddProjectForm, { addProjectHandler: self.addProjectHandler }) : projects_table,
            project ? React.createElement(UserStories, { project: project, db: self.db }) : React.createElement(
              "p",
              null,
              "View Project to see stories."
            ),
            React.createElement(
              "p",
              null,
              "Progress:"
            ),
            React.createElement("div", { ref: function ref(_ref) {
                return _this2.p1 = _ref;
              }, className: "mdl-progress mdl-js-progress" })
          )
        )
      );
    }
  }]);

  return ReactApp;
}(React.Component);

var TopBar = function (_React$Component2) {
  _inherits(TopBar, _React$Component2);

  function TopBar() {
    _classCallCheck(this, TopBar);

    return _possibleConstructorReturn(this, (TopBar.__proto__ || Object.getPrototypeOf(TopBar)).apply(this, arguments));
  }

  _createClass(TopBar, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "header",
        { className: "demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600" },
        React.createElement(
          "div",
          { className: "mdl-layout__header-row" },
          React.createElement(
            "span",
            { className: "mdl-layout-title" },
            "Project Management Tool"
          ),
          React.createElement("div", { className: "mdl-layout-spacer" }),
          React.createElement(
            "div",
            { className: "mdl-textfield mdl-js-textfield mdl-textfield--expandable" },
            React.createElement(
              "label",
              { className: "mdl-button mdl-js-button mdl-button--icon", htmlFor: "search" },
              React.createElement(
                "i",
                { className: "material-icons" },
                "search"
              )
            ),
            React.createElement(
              "div",
              { className: "mdl-textfield__expandable-holder" },
              React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "search" }),
              React.createElement(
                "label",
                { className: "mdl-textfield__label", htmlFor: "search" },
                "Enter your query..."
              )
            )
          ),
          React.createElement(
            "button",
            { className: "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon", id: "hdrbtn" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "more_vert"
            )
          ),
          React.createElement(
            "ul",
            { className: "mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right", htmlFor: "hdrbtn" },
            React.createElement(
              "li",
              { className: "mdl-menu__item" },
              "About"
            ),
            React.createElement(
              "li",
              { className: "mdl-menu__item" },
              "Contact"
            ),
            React.createElement(
              "li",
              { className: "mdl-menu__item" },
              "Legal information"
            )
          )
        )
      );
    }
  }]);

  return TopBar;
}(React.Component);

var SideBar = function (_React$Component3) {
  _inherits(SideBar, _React$Component3);

  function SideBar() {
    _classCallCheck(this, SideBar);

    return _possibleConstructorReturn(this, (SideBar.__proto__ || Object.getPrototypeOf(SideBar)).apply(this, arguments));
  }

  _createClass(SideBar, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50" },
        React.createElement(
          "header",
          { className: "demo-drawer-header" },
          React.createElement("img", { src: "/images/user.jpg", className: "demo-avatar" }),
          React.createElement(
            "div",
            { className: "demo-avatar-dropdown" },
            React.createElement(
              "span",
              null,
              this.props.user_email
            ),
            React.createElement("div", { className: "mdl-layout-spacer" }),
            React.createElement(
              "button",
              { id: "accbtn", className: "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" },
              React.createElement(
                "i",
                { className: "material-icons", role: "presentation" },
                "arrow_drop_down"
              ),
              React.createElement(
                "span",
                { className: "visuallyhidden" },
                "Accounts"
              )
            ),
            React.createElement(
              "ul",
              { className: "mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect", htmlFor: "accbtn" },
              React.createElement(
                "li",
                { className: "mdl-menu__item" },
                "hello@example.com"
              ),
              React.createElement(
                "li",
                { className: "mdl-menu__item" },
                "info@example.com"
              ),
              React.createElement(
                "li",
                { className: "mdl-menu__item" },
                React.createElement(
                  "i",
                  { className: "material-icons" },
                  "add"
                ),
                "Add another account..."
              )
            )
          )
        ),
        React.createElement(
          "nav",
          { className: "demo-navigation mdl-navigation mdl-color--blue-grey-800" },
          React.createElement(
            "a",
            { className: "mdl-navigation__link", href: "" },
            React.createElement(
              "i",
              { className: "mdl-color-text--blue-grey-400 material-icons", role: "presentation" },
              "home"
            ),
            "Home"
          ),
          React.createElement(
            "a",
            { className: "mdl-navigation__link", href: "/manage" },
            React.createElement(
              "i",
              { className: "mdl-color-text--blue-grey-400 material-icons", role: "presentation" },
              "inbox"
            ),
            "Projects"
          ),
          React.createElement(
            "a",
            { className: "mdl-navigation__link", href: "/chat" },
            React.createElement(
              "i",
              { className: "mdl-color-text--blue-grey-400 material-icons", role: "presentation" },
              "chat"
            ),
            "Chat"
          ),
          React.createElement(
            "a",
            { className: "mdl-navigation__link", href: "/issues" },
            React.createElement(
              "i",
              { className: "mdl-color-text--blue-grey-400 material-icons", role: "presentation" },
              "inbox"
            ),
            "Issues"
          ),
          React.createElement(
            "a",
            { className: "mdl-navigation__link", href: "" },
            React.createElement(
              "i",
              { className: "mdl-color-text--blue-grey-400 material-icons", role: "presentation" },
              "people"
            ),
            "Admin"
          ),
          React.createElement("div", { className: "mdl-layout-spacer" }),
          React.createElement(
            "a",
            { className: "mdl-navigation__link", href: "" },
            React.createElement(
              "i",
              { className: "mdl-color-text--blue-grey-400 material-icons", role: "presentation" },
              "help_outline"
            ),
            React.createElement(
              "span",
              { className: "visuallyhidden" },
              "Help"
            )
          )
        )
      );
    }
  }]);

  return SideBar;
}(React.Component);

var AddProjectForm = function (_React$Component4) {
  _inherits(AddProjectForm, _React$Component4);

  function AddProjectForm(props) {
    _classCallCheck(this, AddProjectForm);

    var _this5 = _possibleConstructorReturn(this, (AddProjectForm.__proto__ || Object.getPrototypeOf(AddProjectForm)).call(this, props));

    _this5.state = {
      errors: {},
      values: {}
    };

    // This is to allow it to work as callback from other context
    _this5.changeHandler = _this5.changeHandler.bind(_this5);
    return _this5;
  }

  _createClass(AddProjectForm, [{
    key: "changeHandler",
    value: function changeHandler(e) {
      var form = this.formRef;
      var new_project = {};
      var errors = {};

      new_project['name'] = form.elements.namedItem("name").value;
      if (!new_project['name']) {
        errors['name'] = 'Name is required.';
      } else if (new_project['name'].length < 5) {
        errors['name'] = 'Name must be at least 5 characters.';
      }

      new_project['start_date'] = form.elements.namedItem("start_date").value;
      if (!new_project['start_date']) {
        errors['start_date'] = 'start_date is required.';
      }

      new_project['end_date'] = form.elements.namedItem("end_date").value;
      if (!new_project['end_date']) {
        errors['end_date'] = 'end_date is required.';
      }

      new_project['desc'] = form.elements.namedItem("desc").value;
      if (!new_project['desc']) {
        errors['desc'] = 'desc is required.';
      }

      this.setState({
        errors: errors, values: new_project
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.componentHandler.upgradeDom();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      window.componentHandler.upgradeDom();
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var self = this;
      {/* Form Submit Handler */}

      var submitHandler = function submitHandler(e) {
        e.preventDefault();
        if (Object.keys(self.state.errors) == 0) {
          console.log(self.state);
          self.props.addProjectHandler(self.state.values);
        } else {
          var text = Object.values(self.state.errors).join(" ");
          alert('form still has errors: ' + text);
        }
      };

      return React.createElement(
        "form",
        {
          onSubmit: submitHandler,
          onChange: self.changeHandler,
          ref: function ref(_ref2) {
            return _this6.formRef = _ref2;
          }
        },
        React.createElement(
          "div",
          { className: "mdl-textfield mdl-js-textfield" },
          React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "name", name: "name" }),
          React.createElement(
            "label",
            { className: "mdl-textfield__label", htmlFor: "name" },
            "Project Name ..."
          ),
          this.state.errors.name ? React.createElement(
            "span",
            { className: "mdl-textfield__error" },
            this.state.errors.name
          ) : null
        ),
        React.createElement(
          "div",
          { className: "mdl-textfield mdl-js-textfield" },
          React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "start_date", name: "start_date" }),
          React.createElement(
            "label",
            { className: "mdl-textfield__label", htmlFor: "start_date" },
            "Start Date ..."
          ),
          this.state.errors.start_date ? React.createElement(
            "span",
            { className: "mdl-textfield__error" },
            this.state.errors.start_date
          ) : null
        ),
        React.createElement(
          "div",
          { className: "mdl-textfield mdl-js-textfield" },
          React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "end_date", name: "end_date" }),
          React.createElement(
            "label",
            { className: "mdl-textfield__label", htmlFor: "end_date" },
            "End Date ..."
          ),
          this.state.errors.end_date ? React.createElement(
            "span",
            { className: "mdl-textfield__error" },
            this.state.errors.end_date
          ) : null
        ),
        React.createElement(
          "div",
          { className: "mdl-textfield mdl-js-textfield" },
          React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "desc", name: "desc" }),
          React.createElement(
            "label",
            { className: "mdl-textfield__label", htmlFor: "desc" },
            "Description"
          ),
          this.state.errors.desc ? React.createElement(
            "span",
            { className: "mdl-textfield__error" },
            this.state.errors.desc
          ) : null
        ),
        React.createElement("br", null),
        React.createElement(
          "button",
          {
            type: "submit",
            className: "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
          },
          "Save"
        )
      );
    }
  }]);

  return AddProjectForm;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserStories = function (_React$Component) {
  _inherits(UserStories, _React$Component);

  function UserStories(props) {
    _classCallCheck(this, UserStories);

    var _this = _possibleConstructorReturn(this, (UserStories.__proto__ || Object.getPrototypeOf(UserStories)).call(this, props));

    console.log(props);

    _this.state = {
      add_story: false,
      story_idx: null,
      stories: []
    };

    _this.addStoryHandler = _this.addStoryHandler.bind(_this);
    _this.showFormHandler = _this.showFormHandler.bind(_this);
    return _this;
  }

  _createClass(UserStories, [{
    key: "showFormHandler",
    value: function showFormHandler(e) {
      this.setState({ add_story: true });
    }
  }, {
    key: "addStoryHandler",
    value: function addStoryHandler(story) {
      console.log("Add new ", story);
      console.log("Print Project: ", this.props.project);
      story['project_key'] = this.props.project.firebase_key;
      var result = this.firebaseStories.push(story);
      console.log('result');
      this.loadStories();
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.firebaseStories = this.props.db.ref('app/stories');
      this.loadStories();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.project && this.props.project.firebase_key != prevProps.project.firebase_key) {
        this.loadStories();
      }
    }
  }, {
    key: "loadStories",
    value: function loadStories() {
      var self = this;
      console.log(self.props.project.firebase_key);
      this.firebaseStories.orderByChild('project_key').equalTo(self.props.project.firebase_key).on('value', function (dataSnapshot) {
        var items = [];
        dataSnapshot.forEach(function (childSnapshot) {
          var item = childSnapshot.val();
          item['firebase_key'] = childSnapshot.key;
          items.push(item);
        });

        this.setState({
          stories: items
        });
      }.bind(this));
    }
  }, {
    key: "render",
    value: function render() {

      var self = this;

      console.log(this.props);

      if (this.state.stories.length > 0) {
        var body = this.state.stories.map(function (item, index) {
          return React.createElement(
            "tr",
            { key: index },
            React.createElement(
              "td",
              { className: "mdl-data-table__cell--non-numeric" },
              item.name
            ),
            React.createElement(
              "td",
              null,
              item.status
            )
          );
        });

        var stories_table = React.createElement(
          "div",
          null,
          React.createElement(
            "table",
            { className: "mdl-data-table mdl-js-data-table mdl-shadow--2dp" },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { className: "mdl-data-table__cell--non-numeric" },
                  "Name"
                ),
                React.createElement(
                  "th",
                  null,
                  "Status"
                )
              )
            ),
            React.createElement(
              "tbody",
              null,
              body
            )
          )
        );
      } else {
        stories_table = React.createElement(
          "p",
          null,
          "No stories"
        );
      }

      var add_story_button = React.createElement(
        "button",
        { className: "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect",
          onClick: self.showFormHandler },
        "Add Story"
      );

      var heading = React.createElement(
        "h3",
        null,
        " ",
        self.props.project['name'],
        " "
      );

      return React.createElement(
        "div",
        null,
        heading,
        console.log("length", self.state.stories.length),
        this.state.add_story ? React.createElement(AddStoryForm, {
          addStoryHandler: self.addStoryHandler,
          hideForm: function hideForm() {
            self.setState({ add_story: false });
          }
        }) : stories_table,
        add_story_button
      );
    }
  }]);

  return UserStories;
}(React.Component);

var AddStoryForm = function (_React$Component2) {
  _inherits(AddStoryForm, _React$Component2);

  function AddStoryForm(props) {
    _classCallCheck(this, AddStoryForm);

    var _this2 = _possibleConstructorReturn(this, (AddStoryForm.__proto__ || Object.getPrototypeOf(AddStoryForm)).call(this, props));

    _this2.state = {
      errors: {},
      values: {}
    };

    // This is to allow it to work as callback from other context
    _this2.changeHandler = _this2.changeHandler.bind(_this2);
    return _this2;
  }

  _createClass(AddStoryForm, [{
    key: "changeHandler",
    value: function changeHandler(e) {
      var form = this.formRef;
      var story = {};
      var errors = {};

      story['name'] = form.elements.namedItem("name").value;
      if (!story['name']) {
        errors['name'] = 'Name is required.';
      } else if (story['name'].length < 5) {
        errors['name'] = 'Name must be at least 5 characters.';
      }

      story['status'] = form.elements.namedItem("status").value;
      if (!story['status']) {
        errors['status'] = 'status is required.';
      }

      this.setState({
        errors: errors, values: story
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.componentHandler.upgradeDom();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      window.componentHandler.upgradeDom();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var self = this;
      {/* Form Submit Handler */}

      var submitHandler = function submitHandler(e) {
        e.preventDefault();
        if (Object.keys(self.state.errors) == 0) {

          self.props.addStoryHandler(self.state.values);

          self.setState({ add_story: false });
        } else {
          var text = Object.values(self.state.errors).join(" ");
          alert('form still has errors: ' + text);
        }
      };

      return React.createElement(
        "form",
        {
          onSubmit: submitHandler,
          onChange: self.changeHandler,
          ref: function ref(_ref) {
            return _this3.formRef = _ref;
          }
        },
        React.createElement(
          "div",
          { className: "mdl-textfield mdl-js-textfield" },
          React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "name", name: "name" }),
          React.createElement(
            "label",
            { className: "mdl-textfield__label", htmlFor: "name" },
            "User Story Name"
          ),
          this.state.errors.name ? React.createElement(
            "span",
            { className: "mdl-textfield__error" },
            this.state.errors.name
          ) : null
        ),
        React.createElement(
          "div",
          { className: "mdl-textfield mdl-js-textfield" },
          React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "status", name: "status" }),
          React.createElement(
            "label",
            { className: "mdl-textfield__label", htmlFor: "status" },
            "Status"
          ),
          this.state.errors.status ? React.createElement(
            "span",
            { className: "mdl-textfield__error" },
            this.state.errors.status
          ) : null
        ),
        React.createElement("br", null),
        React.createElement(
          "button",
          {
            type: "submit",
            className: "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
          },
          "Save"
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect",
            onClick: function onClick(e) {
              e.preventDefault();
              self.props.hideForm();
            }
          },
          "Cancel"
        )
      );
    }
  }]);

  return AddStoryForm;
}(React.Component);

//# sourceMappingURL=project.js.map