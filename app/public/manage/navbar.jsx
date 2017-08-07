
class TopBar extends React.Component {

  render() {
    return (
    //  <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
     //   <div className="mdl-layout__header-row">
      //    <span className="mdl-layout-title">Project Management Tool</span>
        //  <div className="mdl-layout-spacer"></div>
     //   </div>
     // </header>

      <header className="demo-header mdl-layout__header mdl-color-text--white mdl-color--blue-grey-700">
        <div className="mdl-layout__header-row">
          <h3>
          <i className="material-icons">filter_none</i>
          METCS 673 Project Management Tool
          </h3>
          <div className="mdl-layout-spacer"></div>
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
          <a className="mdl-navigation__link" href="/home/index.html"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>Home</a>
          <a className="mdl-navigation__link" href="/manage"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">inbox</i>Projects</a>
          <a className="mdl-navigation__link" href="/chat"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">chat</i>Chat</a>
          <a className="mdl-navigation__link" href="/issues"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">inbox</i>Issues</a>
          <a className="mdl-navigation__link" href="/admin"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Admin</a>
          <div className="mdl-layout-spacer"></div>
          <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">help_outline</i><span className="visuallyhidden">Help</span></a>
        </nav>
      </div>
    );
  }
}