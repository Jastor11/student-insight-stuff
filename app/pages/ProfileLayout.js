import React from 'react';
import ProfileLayoutNav from '../components/ProfileLayout/ProfileLayoutNav';
import SectionProfileHeading from '../components/ProfileLayout/SectionProfileHeading';
import ProfileOptions from '../components/ProfileLayout/ProfileOptions';
import ProfileOptionsBox from '../components/ProfileLayout/ProfileOptionsBox';
import ProfileContainerLeftColumn from '../components/ProfileLayout/ProfileContainerLeftColumn';
import ProfileContainerMiddleLeftColumn from '../components/ProfileLayout/ProfileContainerMiddleLeftColumn';
import ProfileContainerMiddleRightColumn from '../components/ProfileLayout/ProfileContainerMiddleRightColumn';
import ProfileContainerRightColumn from '../components/ProfileLayout/ProfileContainerRightColumn';
// import '../styles/profile.scss';

const ProfileLayout = () => {
    return (
      <div>
          <ProfileLayoutNav />
          <div className="container profile">
            <SectionProfileHeading />
            <ProfileOptions />

            <ProfileOptionsBox />

            <div className="spacer"></div>

            <div className="columns">
              <ProfileContainerLeftColumn />
              <ProfileContainerMiddleLeftColumn />
              <ProfileContainerMiddleRightColumn />
              <ProfileContainerRightColumn />
            </div>
          </div>
      </div>
    );
};

export default ProfileLayout;
