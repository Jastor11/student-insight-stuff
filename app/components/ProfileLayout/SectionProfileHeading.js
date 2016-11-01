import React from 'react';

const SectionProfileHeading = () => {
    return (
      <div className="section profile-heading">
        <div className="columns">
          <div className="column is-2">
            <div className="image is-128x128 avatar">
              <img src="https://placehold.it/256x256" />
            </div>
          </div>
          <div className="column is-4 name">
            <p>
              <span className="title is-bold">John Smith</span>
              <span className="button is-primary is-outlined follow">Follow</span>
            </p>
            <p className="tagline">The users profile bio would go here, of course. It could be two lines</p>
          </div>
          <div className="column is-2 followers has-text-centered">
            <p className="stat-val">129k</p>
            <p className="stat-key">followers</p>
          </div>
          <div className="column is-2 following has-text-centered">
            <p className="stat-val">2k</p>
            <p className="stat-key">following</p>
          </div>
          <div className="column is-2 likes has-text-centered">
            <p className="stat-val">29</p>
            <p className="stat-key">likes</p>
          </div>
        </div>
      </div>
    );
};

export default SectionProfileHeading;
