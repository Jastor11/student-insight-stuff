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
This renders details about math performance and growth in the student profile page.
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
        <a style={styles.navBar} href="#starMath">
          Star Math Chart | 
        </a>
        <a style={styles.navBar} href="#MCASMath">
          MCAS Math Scores Chart | 
        </a>
        <a style={styles.navBar} href="#MCASMathGrowth">
          MCAS Math SGPs 
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
  
  const renderStarMath = () => {    
    return (
      <div id="starMath" style={styles.container}>
        {renderHeader('STAR Math, last 4 years')}
        <ProfileChart 
          quadSeries: [{
            name: 'Percentile rank',
            data: chartData.star_series_math_percentile
          }],
          titleText: 'STAR Math, last 4 years',
          student: student,
          yAxis: merge(percentileYAxis, {title: {text: 'Percentile rank'}}) />
      </div>
    );
  };

  const renderMCASMathScore = () => {
    return (
      <div id='MCASMath' style={styles.container}>
        {renderHeader('MCAS Math Scores, last 4 years')}
        <ProfileChart 
          quadSeries: [{
            name: 'Scaled score',
            data: chartData.mcas_series_math_scaled
          }],
          titleText: 'MCAS Math Scores, last 4 years',
          student: student,
          yAxis: merge(ProfileChartSettings.default_mcas_score_yaxis,{
            plotLines: ProfileChartSettings.mcas_level_bands,
            title: { text: 'Scaled score' }
          }) />  
      </div>
    );
  };

  const renderMCASMathGrowth = () => {
    return (
      <div id="MCASMathGrowth" style={styles.container}>
        {renderHeader('MCAS Math SGPs, last 4 years')}
        <ProfileChart 
          quadSeries: [{
            name: 'Student growth percentile (SGP)',
            data: chartData.mcas_series_math_growth
          }],
          titleText: 'MCAS Math SGPs, last 4 years',
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
    <div className="MathDetails">
        {renderNavBar}
        {renderStarMath}
        {renderMCASMathScore}
        {renderMCASMathGrowth}    
    </div>
  );
};

MathDetails.propTypes = {
  chartData: React.PropTypes.shape({
    star_series_math_percentile: React.PropTypes.array.isRequired,
    mcas_series_math_scaled: React.PropTypes.array.isRequired,
    mcas_series_math_growth: React.PropTypes.array.isRequired
  }).isRequired,
  student: React.PropTypes.object.isRequired
};

export default MathDetails;
