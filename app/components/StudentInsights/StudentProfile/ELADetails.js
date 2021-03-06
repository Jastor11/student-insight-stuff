import React from 'react';
import merge from '../../../utils/Merge';

import ProfileChart from './ProfileChart';
import ProfileChartSettings from './ProfileChartSettings';

const styles = {
  title: {
    color: 'black',
    paddingBottom: 20,
    fontSize: 24
  },
  container: {
    width: '100%',
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    border: '1px solid #ccc',
    padding: '30px 30px 30px 30px',
    position: 'relative'
  },
  secHead: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #333',
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30
  },
  navBar: {
    fontSize: 18
  },
  navTop: {
    textAlign: 'right',
    verticalAlign: 'text-top'
  }
};

  /*
  This renders details about ELA performance and growth in the student profile page.
  It's mostly historical charts.
  On charts, we could filter out older values, since they're drawn outside of the visible projection
  area, and Highcharts hovers look a little strange because of that.  It shows a bit more
  historical context though, so we'll keep all data points, even those outside of the visible
  range since interpolation lines will still be visible.
  */

const ELADetails  = ({chartData, student}) => {
  
  const renderNavBar = () => {
    return (
      <div style={styles.navBar}>
        <a style={styles.navBar} href="#Star">
          Star Reading Chart | 
        </a>
        <a style={styles.navBar} href="#Scores">
          MCAS ELA Scores Chart | 
        </a>
        <a style={styles.navBar} href="#SGPs">
          MCAS ELA SGPs Chart | 
        </a>    
      </div>
    )
  };
  
  const renderHeader = (title) => {
    return (
      <div style={styles.secHead}>
        <h4 style={styles.title}>{title}</h4>
        <span style={styles.navTop}>
          <a href="#">Back to top</a>
        </span>
      </div>
    )
  };
  
  const renderStarReading = () => {    
    return (
      <div id="Star" style={styles.container}>
        {renderHeader('STAR Reading, last 4 years')}
        <ProfileChart 
          quadSeries: [{
            name: 'Percentile rank',
            data: chartData.star_series_reading_percentile
          }],
          titleText: '',
          student: student,
          yAxis: merge(percentileYAxis, {title: {text: 'Percentile rank'}}) />
      </div>
    );
  };

  const renderMCASELAScores = () => {
    return (
      <div id='Scores' style={styles.container}>
        {renderHeader('MCAS ELA Scores, last 4 years')}
        <ProfileChart 
          quadSeries: [{
            name: 'Scaled score',
            data: chartData.mcas_series_ela_scaled
          }],
          titleText: '',
          student: student,
          yAxis: merge(ProfileChartSettings.default_mcas_score_yaxis,{
            plotLines: ProfileChartSettings.mcas_level_bands,
            title: { text: 'Scaled score' }
          }) />  
      </div>
    );
  };

  const renderMCASELAGrowth = () => {
    return (
      <div id="SGPs" style={styles.container}>
        {renderHeader('Student growth percentile (SGP), last 4 years')}
        <ProfileChart 
          quadSeries: [{
            name: '',
            data: chartData.mcas_series_ela_growth
          }],
          titleText: 'MCAS ELA SGPs, last 4 years',
          student: student,
          yAxis: merge(percentileYAxis, {
            title: { text: 'Student growth percentile (SGP)' }
          }) />        
      </div>
    )
  }

  const percentileYAxis = () => {
    return merge(ProfileChartSettings.percentile_yaxis, {
      plotLines: [{
        color: '#666',
        width: 1,
        zIndex: 3,
        value: 50,
        label: {
          text: '50th percentile',
          align: 'center',
          style: {
            color: '#999999'
          }
        }
      }]      
    })
  }
  
  return (
    <div className="ELADetails">
        {renderNavBar}
        {renderStarReading}
        {renderMCASELAScores}
        {renderMCASELAGrowth}    
    </div>
  );
};

ELADetails.propTypes = {
  chartData: React.PropTypes.shape({
    star_series_reading_percentile: React.PropTypes.array.isRequired,
    mcas_series_ela_scaled: React.PropTypes.array.isRequired,
    mcas_series_ela_growth: React.PropTypes.array.isRequired
  }).isRequired,
  student: React.PropTypes.object.isRequired
};

export default ELADetails;
