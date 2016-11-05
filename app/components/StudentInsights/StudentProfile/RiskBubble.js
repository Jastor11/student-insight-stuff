import React from 'react';
import merge from '../../../utils/Merge';

const styles = {
  riskBubble: {
    fontSize: 20,
    width: 35,
    height: 35,
    color: 'white',
    borderRadius: 30,
    paddingTop: 3,
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 5, 
    marginRight: 5,
    display: 'inline-block'
  },

  riskItem: {
    fontSize: 25,
    padding: 5,
    marginTop: 3
  }
};

const RiskBubble = ({riskLevel}) => {
  const riskLevelDisplay = (this.props.riskLevel === null) ? 'NA' : this.props.riskLevel;
  
  const bubbleColor = function() {
    if (this.props.riskLevel === null) return '#555555';
    if (this.props.riskLevel === 0) return '#bbd86b';
    if (this.props.riskLevel === 1) return '#62c186';
    if (this.props.riskLevel === 2) return '#ffcb08';
    if (this.props.riskLevel === 3) return '#f15a3d';
  }  
  
  return (
    <span>
      <span styles={styles.riskItem}>Risk Level</span>
      <span style={merge(styles.riskBubble, {backgroundColor: bubbleColor})} >{riskLevelDisplay}</span> 
    </span>
  )
}

RiskBubble.propTypes = {
  riskLevel: React.PropTypes.number.isRequired  
}

export default RiskBubble;
