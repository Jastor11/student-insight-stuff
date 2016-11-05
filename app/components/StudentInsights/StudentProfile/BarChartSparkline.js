import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import d3 from 'd3';

var dom = window.shared.ReactHelpers.dom;
var createEl = window.shared.ReactHelpers.createEl;
var merge = window.shared.ReactHelpers.merge;

var QuadConverter = window.shared.QuadConverter;

const BarChartSparkline = (props) => {
  
  const renderXAxis = (color, x, y) => {
    return (
      <line x1={x.range()[0]} x2={x.range()[1]} y1={y.range()[0]} y2={y.range()[0]} stroke={color} />
    )
  }
  
  const renderThresholdLine = (value, color, x, y) => {
    return (
     <line x1={x.range()[0]} x2={x.range()[1]} y1={y(value)} y2={y(value)} stroke={color} strokeDasharray={5} />    
    )
  }
  
  const renderBars = (quads, color, x, y) => {   
    return quads.map( quad => {
      return (
        <rect key={quad.toString()}
              x={x(QuadConverter.toDate(quad))}
              y={y(quad[3])}
              height={y.range()[0] - y(quad[3])}
              width=5
              fill={color}
        />
      )
    })
  }
  
  const renderYearStarts = (x, y) => {
    const years = _.range(props.dateRange[0].getFullYear(), props.dateRange[1].getFullYear());
    return years.map( year => {
      const yearStartDate = moment.utc([year, 8, 15].join('-'), 'YYYY-M-D').toDate();
      return (
        <line key={year} x1={x(yearStartDate)} x2={x(yearStartDate)} y1={y.range()[0]} y2={y.range()[1]} stroke="#ccc" />
      )
    })
  }
  
  const color = '#666';
  const x = d3.time.scale()
    .domain(props.dateRange)
    .range([0, props.width]);
  const y = d3.scale.linear()
    .domain(props.valueRange)
    .range([props.height, 0]);  
  
  return (
    <div className="Sparkline" style={{overflow: 'hidden'}}>
      <svg>
        {renderThresholdLine(props.thresholdValue, '#ccc', x, y)}
        {renderYearStarts(x, y)}
        {renderBars(props.quads, color, x, y)}
        {rendeXAxis('#ccc', x, y)}
      </svg>
    </div>
  );
};

BarChartSparkline.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  quads: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)).isRequired,
  dateRange: React.PropTypes.array.isRequired,
  valueRange: React.PropTypes.array.isRequired,
  thresholdValue: React.PropTypes.number.isRequired,
};

export default BarChartSparkline;