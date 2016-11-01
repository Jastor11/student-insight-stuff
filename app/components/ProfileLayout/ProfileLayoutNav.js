import React from 'react';

const ProfileLayoutNav = () => {
    return (
          <nav className="nav has-shadow" id="top">
            <div className="container">
              <div className="nav-left">
                <a className="nav-item" href="../index.html">
                  <img src="../images/bulma.png" alt="Description" />
                </a>
              </div>
              <span className="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <div className="nav-right nav-menu">
                <a className="nav-item is-tab is-active">
                  Home
                </a>
                <a className="nav-item is-tab">
                  Features
                </a>
                <a className="nav-item is-tab">
                  Team
                </a>
                <a className="nav-item is-tab">
                  Help
                </a>
                <span className="nav-item">
                  <a className="button">
                    Log in
                  </a>
                  <a className="button is-info">
                    Sign up
                  </a>
                </span>
              </div>
            </div>
          </nav>
    );
};

export default ProfileLayoutNav;
