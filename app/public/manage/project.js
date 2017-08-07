"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TopBar = function (_React$Component) {
  _inherits(TopBar, _React$Component);

  function TopBar() {
    _classCallCheck(this, TopBar);

    return _possibleConstructorReturn(this, (TopBar.__proto__ || Object.getPrototypeOf(TopBar)).apply(this, arguments));
  }

  _createClass(TopBar, [{
    key: "render",
    value: function render() {
      return (
        //  <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        //   <div className="mdl-layout__header-row">
        //    <span className="mdl-layout-title">Project Management Tool</span>
        //  <div className="mdl-layout-spacer"></div>
        //   </div>
        // </header>

        React.createElement(
          "header",
          { className: "demo-header mdl-layout__header mdl-color-text--white mdl-color--blue-grey-700" },
          React.createElement(
            "div",
            { className: "mdl-layout__header-row" },
            React.createElement(
              "h3",
              null,
              React.createElement(
                "i",
                { className: "material-icons" },
                "filter_none"
              ),
              "METCS 673 Project Management Tool"
            ),
            React.createElement("div", { className: "mdl-layout-spacer" })
          )
        )
      );
    }
  }]);

  return TopBar;
}(React.Component);

var SideBar = function (_React$Component2) {
  _inherits(SideBar, _React$Component2);

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
            { className: "mdl-navigation__link", href: "/home/index.html" },
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
            { className: "mdl-navigation__link", href: "/admin" },
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
'use strict';

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
      uid: null,
      projects: [],
      project_idx: null,
      progress: 44,
      add_project: false,
      view_project: false,
      edit_project: false
    };

    _this.p1_material_object = null;

    // bind callback so that 'this' works when called from different object
    _this.addProjectHandler = _this.addProjectHandler.bind(_this);
    _this.updateProjectHandler = _this.updateProjectHandler.bind(_this);
    return _this;
  }

  _createClass(ReactApp, [{
    key: 'addProjectHandler',
    value: function addProjectHandler(project) {
      console.log("Add new ", project);
      project['admins'] = [this.state.uid];
      project['members'] = [this.state.uid];

      var result = this.firebaseProjects.push(project);

      this.setState({ 'add_project': false });
      this.loadProjects();
    }
  }, {
    key: 'updateProjectHandler',
    value: function updateProjectHandler(project, firebase_key) {
      //get the project and merge it with the updated form values to update it.
      var updated_project = Object.assign({}, this.state.projects[this.state.project_idx], project
      //cleanup firebase key since it is redundant
      );updated_project['firebase_key'] = null;
      console.log("updated project: ", updated_project);

      var updates = {};
      updates['/app/projects/' + firebase_key] = updated_project;

      this.db.ref().update(updates);
      this.setState({ 'edit_project': false });
      this.loadProjects();
    }
  }, {
    key: 'deleteProject',
    value: function deleteProject(index) {
      var firebase_key = this.state.projects[index].firebase_key;
      var deletes = {};
      deletes['/app/projects/' + firebase_key] = null;
      console.log(deletes);

      this.db.ref().update(deletes);
      this.loadProjects();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {

      var self = this;

      this.props.firebase.auth().onAuthStateChanged(function (user) {
        if (user != null) {
          console.log("user ", user);

          user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);

            self.setState({
              user_email: profile.email, uid: user.uid
            });
          });

          self.db = self.props.firebase.database();
          self.firebaseProjects = self.db.ref('app/projects');
          self.loadProjects();
        } else {
          console.log('no user :(');
        }
      });
    }
  }, {
    key: 'loadProjects',
    value: function loadProjects() {
      var self = this;
      this.firebaseProjects.on('value', function (dataSnapshot) {
        var items = [];
        console.log("user id from load projects(): ", this.state.uid);
        dataSnapshot.forEach(function (childSnapshot) {
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

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var self = this;
      if (self.p1_material_object) {
        self.p1_material_object.setProgress(self.state.progress);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var self = this;

      var projects_table = React.createElement(
        'table',
        { className: 'mdl-data-table mdl-js-data-table mdl-shadow--2dp' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              { className: 'mdl-data-table__cell--non-numeric' },
              'Project'
            ),
            React.createElement(
              'th',
              null,
              'Start Date'
            ),
            React.createElement(
              'th',
              null,
              'End Date'
            ),
            React.createElement(
              'th',
              null,
              'Status'
            ),
            React.createElement(
              'th',
              null,
              'Description'
            ),
            React.createElement(
              'th',
              null,
              'Actions'
            )
          )
        ),
        React.createElement(
          'tbody',
          null,
          self.state.projects.map(function (item, index) {
            var viewProjectHandler = function viewProjectHandler() {
              self.setState({ view_project: true, project_idx: index });
            };
            var editProjectHandler = function editProjectHandler() {
              self.setState({ edit_project: true, project_idx: index });
            };
            var deleteProjectHandler = function deleteProjectHandler() {
              self.deleteProject(index);
            };
            return React.createElement(
              'tr',
              { key: item.firebase_key },
              React.createElement(
                'td',
                { className: 'mdl-data-table__cell--non-numeric' },
                item.name,
                ' ',
                self.state.project_idx === index ? "<--" : null
              ),
              React.createElement(
                'td',
                null,
                item.start_date
              ),
              React.createElement(
                'td',
                null,
                item.end_date
              ),
              React.createElement(
                'td',
                null,
                item.status
              ),
              React.createElement(
                'td',
                null,
                item.desc
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'button',
                  { className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect',
                    onClick: viewProjectHandler
                  },
                  'View'
                ),
                '\xA0',
                React.createElement(
                  'button',
                  { className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect',
                    onClick: deleteProjectHandler
                  },
                  'Delete'
                ),
                React.createElement(
                  'button',
                  { className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect',
                    onClick: editProjectHandler
                  },
                  'Edit'
                )
              )
            );
          })
        )
      );

      var showAddFormHandler = function showAddFormHandler(e) {
        self.setState({ add_project: true, edit_project: false });
      };

      var showProjectsHandler = function showProjectsHandler(e) {
        self.setState({ add_project: false, edit_project: false });
      };

      var project = null;
      if (self.state.project_idx !== null && self.state.projects.length > 0) {
        project = self.state.projects[self.state.project_idx];
      }

      return React.createElement(
        'div',
        { className: 'demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header' },
        React.createElement(TopBar, null),
        React.createElement(SideBar, { user_email: this.state.user_email }),
        React.createElement(
          'main',
          { className: 'mdl-layout__content mdl-color--grey-100' },
          React.createElement(
            'div',
            { className: 'demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--12-col' },
            React.createElement(
              'div',
              { className: 'mdl-cell mdl-cell--8-col' },
              React.createElement(
                'button',
                {
                  className: 'mdl-button mdl-js-button mdl-button--raised',
                  onClick: showProjectsHandler
                },
                'List Projects'
              ),
              '\xA0 \xA0',
              React.createElement(
                'button',
                {
                  className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect',
                  onClick: showAddFormHandler
                },
                'Add Project'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--12-col' },
            this.state.add_project ? React.createElement(ProjectForm, { saveProjectHandler: self.addProjectHandler }) : this.state.edit_project ? React.createElement(ProjectForm, { saveProjectHandler: self.updateProjectHandler, project: project }) : projects_table,
            project && self.state.view_project ? React.createElement(UserStories, { project: project, db: self.db }) : React.createElement(
              'p',
              null,
              'View Project to see stories.'
            )
          )
        )
      );
    }
  }]);

  return ReactApp;
}(React.Component);

var ProjectForm = function (_React$Component2) {
  _inherits(ProjectForm, _React$Component2);

  function ProjectForm(props) {
    _classCallCheck(this, ProjectForm);

    var _this2 = _possibleConstructorReturn(this, (ProjectForm.__proto__ || Object.getPrototypeOf(ProjectForm)).call(this, props));

    _this2.state = {
      errors: {},
      values: null,
      firebase_key: null
    };

    _this2.state.values = props.project ? props.project : null;
    _this2.state.firebase_key = props.project ? props.project.firebase_key : null;
    // This is to allow it to work as callback from other context
    _this2.changeHandler = _this2.changeHandler.bind(_this2);
    return _this2;
  }

  _createClass(ProjectForm, [{
    key: 'changeHandler',
    value: function changeHandler(e) {
      var form = this.formRef;
      var values = {};
      var errors = {};

      values['name'] = form.elements.namedItem("name").value;
      if (!values['name']) {
        errors['name'] = 'Name is required.';
      } else if (values['name'].length < 5) {
        errors['name'] = 'Name must be at least 5 characters.';
      }

      values['start_date'] = form.elements.namedItem("start_date").value;
      if (!values['start_date']) {
        errors['start_date'] = 'start_date is required.';
      }

      values['end_date'] = form.elements.namedItem("end_date").value;
      if (!values['end_date']) {
        errors['end_date'] = 'end_date is required.';
      }

      values['status'] = form.elements.namedItem("status").value;
      if (!values['status']) {
        errors['status'] = 'status is required.';
      }

      values['desc'] = form.elements.namedItem("desc").value;
      if (!values['desc']) {
        errors['desc'] = 'desc is required.';
      }

      this.setState({
        errors: errors, values: values
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      var value = null;

      window.componentHandler.upgradeDom();

      var picker = new MaterialDatetimePicker({
        container: this.picker_container }).on('submit', function (val) {
        value = val.format("MM/DD/YYYY");
        console.log("date value: ", value);
        _this3.setState({ 'values': Object.assign({}, _this3.state.values, { 'start_date': value })
        });
      }).on('open', function () {
        return console.log('opened');
      }).on('close', function () {
        return console.log('closed');
      });

      this.btn.addEventListener('click', function () {
        return picker.open();
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      window.componentHandler.upgradeDom();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.project != nextProps.project) {
        var state = {};
        state.values = nextProps.project ? nextProps.project : null;
        state.firebase_key = nextProps.project ? nextProps.project.firebase_key : null;

        this.setState(state);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var self = this;
      {/* Form Submit Handler */}

      var submitHandler = function submitHandler(e) {
        e.preventDefault();
        if (Object.keys(self.state.errors) == 0) {
          self.props.saveProjectHandler(self.state.values, self.state.firebase_key);
        } else {
          var text = Object.values(self.state.errors).join(" ");
          alert('form still has errors: ' + text);
        }
      };

      return React.createElement(
        'form',
        {
          onSubmit: submitHandler,

          ref: function ref(_ref5) {
            return _this4.formRef = _ref5;
          }
        },
        React.createElement(
          'div',
          { className: 'mdl-textfield mdl-js-textfield' },
          React.createElement('input', { className: 'mdl-textfield__input', type: 'text', id: 'name', name: 'name',
            value: this.state.values ? this.state.values.name : "", onChange: self.changeHandler }),
          React.createElement(
            'label',
            { className: 'mdl-textfield__label', htmlFor: 'name' },
            'Project Name ...'
          ),
          this.state.errors.name ? React.createElement(
            'span',
            { className: 'mdl-textfield__error' },
            this.state.errors.name
          ) : null
        ),
        React.createElement(
          'div',
          { className: 'mdl-textfield mdl-js-textfield' },
          React.createElement('input', { className: 'mdl-textfield__input', type: 'text', id: 'start_date', name: 'start_date',
            value: this.state.values ? this.state.values.start_date : "", onChange: self.changeHandler
          }),
          React.createElement(
            'div',
            { ref: function ref(_ref2) {
                return _this4.picker_container = _ref2;
              } },
            React.createElement(
              'a',
              { className: 'c-btn c-datepicker-btn', ref: function ref(_ref) {
                  return self.btn = _ref;
                } },
              'Open Picker'
            )
          ),
          React.createElement(
            'label',
            { className: 'mdl-textfield__label', htmlFor: 'start_date' },
            'Start Date ...'
          ),
          this.state.errors.start_date ? React.createElement(
            'span',
            { className: 'mdl-textfield__error' },
            this.state.errors.start_date
          ) : null
        ),
        React.createElement(
          'div',
          { className: 'mdl-textfield mdl-js-textfield' },
          React.createElement('input', { className: 'mdl-textfield__input', type: 'text', id: 'end_date', name: 'end_date',
            value: this.state.values ? this.state.values.end_date : "", onChange: self.changeHandler }),
          React.createElement(
            'div',
            { ref: function ref(_ref4) {
                return _this4.picker_container = _ref4;
              } },
            React.createElement(
              'a',
              { className: 'c-btn c-datepicker-btn', ref: function ref(_ref3) {
                  return self.btn = _ref3;
                } },
              'Open Picker'
            )
          ),
          React.createElement(
            'label',
            { className: 'mdl-textfield__label', htmlFor: 'end_date' },
            'End Date ...'
          ),
          this.state.errors.end_date ? React.createElement(
            'span',
            { className: 'mdl-textfield__error' },
            this.state.errors.end_date
          ) : null
        ),
        React.createElement(
          'div',
          { className: 'mdl-selectfield mdl-js-selectfield' },
          React.createElement(
            'label',
            { className: 'mdl-selectfield__label', htmlFor: 'status' },
            'Status'
          ),
          React.createElement(
            'select',
            { className: 'mdl-selectfield__select', id: 'status', name: 'status',
              value: this.state.values ? this.state.values.status : "", onChange: self.changeHandler },
            React.createElement('option', { value: '' }),
            React.createElement(
              'option',
              { value: 'Not Started' },
              'Not Started'
            ),
            React.createElement(
              'option',
              { value: 'In Progress' },
              'In Progress'
            ),
            React.createElement(
              'option',
              { value: 'Completed' },
              'Completed'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'mdl-textfield mdl-js-textfield' },
          React.createElement('input', { className: 'mdl-textfield__input', type: 'text', id: 'desc', name: 'desc',
            value: this.state.values ? this.state.values.desc : "", onChange: self.changeHandler }),
          React.createElement(
            'label',
            { className: 'mdl-textfield__label', htmlFor: 'desc' },
            'Description'
          ),
          this.state.errors.desc ? React.createElement(
            'span',
            { className: 'mdl-textfield__error' },
            this.state.errors.desc
          ) : null
        ),
        React.createElement('br', null),
        React.createElement(
          'button',
          {
            type: 'submit',
            className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'
          },
          'Save'
        )
      );
    }
  }]);

  return ProjectForm;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserStories = function (_React$Component) {
  _inherits(UserStories, _React$Component);

  function UserStories(props) {
    _classCallCheck(this, UserStories);

    var _this = _possibleConstructorReturn(this, (UserStories.__proto__ || Object.getPrototypeOf(UserStories)).call(this, props));

    _this.state = {
      add_story: false,
      story_idx: null,
      stories: []
    };

    _this.addStoryHandler = _this.addStoryHandler.bind(_this);
    _this.updateStoryHandler = _this.updateStoryHandler.bind(_this);
    _this.showFormHandler = _this.showFormHandler.bind(_this);
    return _this;
  }

  _createClass(UserStories, [{
    key: 'showFormHandler',
    value: function showFormHandler(e) {
      this.setState({ add_story: true });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.firebaseStories = this.props.db.ref('app/stories');
      this.loadStories();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.project && this.props.project.firebase_key != prevProps.project.firebase_key) {
        this.loadStories();
      }
    }
  }, {
    key: 'loadStories',
    value: function loadStories() {
      var self = this;

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
    key: 'addStoryHandler',
    value: function addStoryHandler(story) {
      console.log("Add new ", story);
      story['project_key'] = this.props.project.firebase_key;
      var result = this.firebaseStories.push(story);
      this.setState({ add_story: false });
      this.loadStories();
    }
  }, {
    key: 'updateStoryHandler',
    value: function updateStoryHandler(story, firebase_key) {
      //get the project and merge it with the updated form values to update it.
      var updated_story = Object.assign({}, this.state.stories[this.state.story_idx], story
      //cleanup firebase key since it is redundant
      //updated_project['firebase_key'] = null;
      );console.log("updated story: ", updated_story);

      var updates = {};
      updates['/app/stories/' + firebase_key] = updated_story;

      this.props.db.ref().update(updates);
      this.setState({ 'edit_story': false });
      this.loadStories();
    }
  }, {
    key: 'render',
    value: function render() {

      var self = this;

      if (this.state.stories.length > 0) {
        var body = this.state.stories.map(function (item, index) {
          var editStoryHandler = function editStoryHandler() {
            self.setState({ edit_story: true, story_idx: index });
          };

          return React.createElement(
            'tr',
            { key: item.firebase_key },
            React.createElement(
              'td',
              { className: 'mdl-data-table__cell--non-numeric' },
              item.name,
              ' ',
              self.state.story_idx === index ? "<--" : null
            ),
            React.createElement(
              'td',
              null,
              item.status
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'button',
                { className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect',
                  onClick: editStoryHandler
                },
                'Edit'
              )
            )
          );
        });

        var stories_table = React.createElement(
          'div',
          null,
          React.createElement(
            'table',
            { className: 'mdl-data-table mdl-js-data-table mdl-shadow--2dp' },
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'th',
                  { className: 'mdl-data-table__cell--non-numeric' },
                  'Name'
                ),
                React.createElement(
                  'th',
                  null,
                  'Status'
                ),
                React.createElement(
                  'th',
                  null,
                  'Action'
                )
              )
            ),
            React.createElement(
              'tbody',
              null,
              body
            )
          )
        );
      } else {
        stories_table = React.createElement(
          'p',
          null,
          'No stories'
        );
      }

      var add_story_button = React.createElement(
        'button',
        { className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect',
          onClick: self.showFormHandler },
        'Add Story'
      );

      var heading = React.createElement(
        'h3',
        null,
        ' ',
        self.props.project['name'],
        ' '
      );

      var story = null;
      if (self.state.story_idx !== null && self.state.stories.length > 0) {
        story = self.state.stories[self.state.story_idx];
      }

      return React.createElement(
        'div',
        null,
        heading,
        this.state.add_story ? React.createElement(AddStoryForm, {
          saveStoryHandler: self.addStoryHandler,
          hideForm: function hideForm() {
            self.setState({ add_story: false });
          }
        }) : this.state.edit_story ? React.createElement(AddStoryForm, { saveStoryHandler: self.updateStoryHandler,
          story: story,
          hideForm: function hideForm() {
            self.setState({ edit_story: false });
          } }) : stories_table,
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
      values: {},
      firebase_key: null
    };

    _this2.state.values = props.story ? props.story : null;
    _this2.state.firebase_key = props.story ? props.story.firebase_key : null;
    // This is to allow it to work as callback from other context
    _this2.changeHandler = _this2.changeHandler.bind(_this2);
    return _this2;
  }

  _createClass(AddStoryForm, [{
    key: 'changeHandler',
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
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.componentHandler.upgradeDom();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      window.componentHandler.upgradeDom();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var self = this;
      {/* Form Submit Handler */}

      var submitHandler = function submitHandler(e) {
        e.preventDefault();
        if (Object.keys(self.state.errors) == 0) {
          self.props.saveStoryHandler(self.state.values, self.state.firebase_key);
        } else {
          var text = Object.values(self.state.errors).join(" ");
          alert('form still has errors: ' + text);
        }
      };

      return React.createElement(
        'form',
        {
          onSubmit: submitHandler,
          ref: function ref(_ref) {
            return _this3.formRef = _ref;
          }
        },
        React.createElement(
          'div',
          { className: 'mdl-textfield mdl-js-textfield' },
          React.createElement('input', { className: 'mdl-textfield__input', type: 'text', id: 'name', name: 'name',
            value: this.state.values ? this.state.values.name : "",
            onChange: self.changeHandler }),
          React.createElement(
            'label',
            { className: 'mdl-textfield__label', htmlFor: 'name' },
            'User Story Name'
          ),
          this.state.errors.name ? React.createElement(
            'span',
            { className: 'mdl-textfield__error' },
            this.state.errors.name
          ) : null
        ),
        React.createElement(
          'div',
          { className: 'mdl-selectfield mdl-js-selectfield' },
          React.createElement(
            'label',
            { className: 'mdl-selectfield__label', htmlFor: 'status' },
            'Status'
          ),
          React.createElement(
            'select',
            { className: 'mdl-selectfield__select', id: 'status', name: 'status',
              value: this.state.values ? this.state.values.status : "",
              onChange: self.changeHandler },
            React.createElement('option', { value: '' }),
            React.createElement(
              'option',
              { value: 'Not Started' },
              'Not Started'
            ),
            React.createElement(
              'option',
              { value: 'In Progress' },
              'In Progress'
            ),
            React.createElement(
              'option',
              { value: 'Completed' },
              'Completed'
            )
          )
        ),
        React.createElement('br', null),
        React.createElement(
          'button',
          {
            type: 'submit',
            className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'
          },
          'Save'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect',
            onClick: function onClick(e) {
              e.preventDefault();
              self.props.hideForm();
            }
          },
          'Cancel'
        )
      );
    }
  }]);

  return AddStoryForm;
}(React.Component);

//# sourceMappingURL=project.js.map