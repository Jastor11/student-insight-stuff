import React from 'react';
import TimelineNavigation from '../components/TimelineLayout/TimelineNavigation';
import TimelineMainContent from '../components/TimelineLayout/TimelineMainContent';


const TimelineLayout = () => {
    return (
      <div>
        <TimelineNavigation />
        <TimelineMainContent />
      </div>
    );
};

export default TimelineLayout;
