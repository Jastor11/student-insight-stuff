import React from 'react';

const ProfileOptionsBox = () => {
    return (
        <div className="box">
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <p className="subtitle is-5">
                  <strong>123</strong> posts
                </p>
              </div>
              <div className="level-item">
                <p className="control has-addons">
                  <input className="input" type="text" placeholder="Find a post" />
                  <button className="button">
                    Search
                  </button>
                </p>
              </div>
            </div>

            <div className="level-right">
              <p className="level-item"><strong>All</strong></p>
              <p className="level-item"><a>Published</a></p>
              <p className="level-item"><a>Drafts</a></p>
              <p className="level-item"><a>Deleted</a></p>
              <p className="level-item"><a className="button is-success">New</a></p>
            </div>
          </nav>
        </div>
    );
};

export default ProfileOptionsBox;
