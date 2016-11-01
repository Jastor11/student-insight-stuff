import React from 'react';

const TimelineNavigation = () => {
    return (
      <nav className="nav has-shadow">
        <div className="container">
          <div className="nav-left">
            <a className="nav-item is-tab is-active"><i className="fa fa-home"></i> &nbsp; Home</a>
            <a className="nav-item is-tab"><i className="fa fa-bolt"></i> &nbsp; Moments</a>
            <a className="nav-item is-tab"><i className="fa fa-bell-o"></i> &nbsp; Notifications</a>
            <a className="nav-item is-tab"><i className="fa fa-envelope"></i> &nbsp; Messages</a>
          </div>

          <div className="nav-center">
            <a className="nav-item" href="#">
              <span className="icon">
                <i className="fa fa-twitter"></i>
              </span>
            </a>
          </div>

          <span className="nav-toggle">
            <span></span>
            <span></span>
            <span></span>
          </span>

          <div className="nav-right nav-menu">
            <span className="nav-item">
              <a className="button" >
                <span className="icon">
                  <i className="fa fa-twitter"></i>
                </span>
                <span>Tweet</span>
              </a>
            </span>
          </div>
        </div>
      </nav>
  );
};

export default TimelineNavigation;
