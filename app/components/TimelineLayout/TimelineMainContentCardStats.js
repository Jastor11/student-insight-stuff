import React from 'react';

const TimelineMainContentCardStats = () => {
    return (
      <div className="card-stats">
        <ul className="card-stats-list">
          <li className="card-stats-item">
            <a href="#" title="9.840 Tweet">
              <span className="card-stats-key">Tweets</span>
              <span className="card-stats-val">1</span>
            </a>
          </li>
          <li className="card-stats-item">
            <a href="#/following" title="885 Following">
              <span className="card-stats-key">Following</span>
              <span className="card-stats-val">0</span>
            </a>
          </li>
          <li className="card-stats-item">
            <a href="#">
              <span className="card-stats-key">Followers</span>
              <span className="card-stats-val">0</span>
            </a>
          </li>
        </ul>
      </div>
    );
};

export default TimelineMainContentCardStats;
