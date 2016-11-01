import React from 'react';

const styles = {
  caption: {
    marginRight: 5
  },
  value: {
    fontWeight: 'bold'
  },
  sparklineContainer: {
    paddingLeft: 15,
    paddingRight: 15
  },
  textContainer: {
    paddingBottom: 5
  }
};

const AcademicSummary = ({caption, value, sparkline}) => {
  
  return (
    <div className="AcademicSummary">
      <div style={styles.textContainer}>
        <span style={styles.caption}>{ caption }:</span>
        <span style={styles.value}>{ (value === undefined) ? 'none' : value }</span>
      </div>
      <div style={styles.sparklineContainer}>
        {sparkline}
      </div>
    </div>
  );
};

AcademicSummary.propTypes = {
    caption: React.PropTypes.string.isRequired,
    value: React.PropTypes.nullable(React.PropTypes.number.isRequired),
    sparkline: React.PropTypes.element.isRequired  
};

AcademicSummary.defaultProps = {
  displayName: 'AcademicSummary'
};

const SummaryWithoutSparkline = ({caption, value}) {
  
  return (
    <div className="AcademicSummary">
      <div style={styles.textContainer}>
        <span style={styles.caption}>{ caption }:</span>
        <br /><br />
        <span style={styles.value}>{ (value === undefined) ? 'none' : value }</span>
      </div>
    </div>
  );
}
