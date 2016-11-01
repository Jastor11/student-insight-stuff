import React from 'react';

class HighchartsWrapper extends React.Component {
    onRefForChart(el) {
      this._chartEl = el;
    }

    componentDidMount: function(props, state) {
      $(this._chartEl).highcharts(this.props);
    }

    componentWillUnmount: function(props, state) { 
      delete this._chartEl;
    }
  
  render(){
    return (
    
    );
  }
}

HighchartsWrapper.propTypes = {
  
};

export default HighchartsWrapper;

  // This component wraps Highcharts so that you can provide Highcharts
  // options as props, and it bridges calling into the library.
  var HighchartsWrapper = window.shared.HighchartsWrapper = React.createClass({
    displayName: 'HighchartsWrapper',

    // direct passthrough to highcharts
    propsTypes: {},

    onRefForChart: function(el) {
      this._chartEl = el;
    },

    componentDidMount: function(props, state) {
      $(this._chartEl).highcharts(this.props);
    },

    componentWillUnmount: function(props, state) { 
      delete this._chartEl;
    },

    render: function() {
      return dom.div({ className: 'HighchartsWrapper' },
        dom.div({ ref: this.onRefForChart })
      );
    }
  });
