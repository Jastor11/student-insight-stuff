import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import QuadConverter from './QuadConverter';
import ProfileChartSettings from './ProfileChartSettings';
import HighchartsWrapper from './HighchartsWrapper';

let ProfileChartSettings = {};

ProfileChartSettings.base_options = {
  chart: {
    renderTo: 'chart',
    type: 'areaspline',
    spacingBottom: 0,
    spacingTop: 0,
    spacingLeft: 0,
    spacingRight: 0,
    marginTop: 10
  },
  title: {
    text: '',
    style: {
      display: 'none'
    }
  },
  subtitle: {
    text: '',
    style: {
      display: 'none'
    }
  },
  legend: {
    enabled: false,
    layout: 'horizontal',
    align: 'right',
    verticalAlign: 'top',
    itemStyle: {
      font: '12px "Open Sans", sans-serif !important;',
      color: '#555555'
    }
  },
  xAxis: {
    categories: [],
    dateTimeLabelFormats: {}
  },
  tooltip: {
    shared: true
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    areaspline: {
      fillOpacity: 0
    }
  }
}

ProfileChartSettings.x_axis_datetime = {
  type: 'datetime',
  dateTimeLabelFormats: {
    day: '%b %e %Y',
    week: '%b %e %Y',
    year: '%b %e %Y'
  }
}

ProfileChartSettings.x_axis_schoolyears = {
  type: 'linear',
  categories: [],
  dateTimeLabelFormats: {}
}

ProfileChartSettings.default_yaxis = {
  allowDecimals: false,
  title: {
    text: '',
    style: {
      display: 'none'
    }
  },
  plotLines: [],
  min: undefined,
  max: undefined
}

ProfileChartSettings.mcas_level_bands = [{
  color: '#E7EBED',
  from: 200,
  to: 218,
  label: {
    text: 'Warning',
    align: 'left',
    style: {
      color: '#999999'
    }
  }
}, {
  color: '#F6F7F8',
  from: 220,
  to: 238,
  label: {
    text: 'Needs Improvement',
    align: 'left',
    style: {
      color: '#999999'
    }
  }
}, {
  color: '#E7EBED',
  from: 240,
  to: 258,
  label: {
    text: 'Proficient',
    align: 'left',
    style: {
      color: '#999999'
    }
  }
}, {
  color: '#F6F7F8',
  from: 260,
  to: 280,
  label: {
    text: 'Advanced',
    align: 'left',
    style: {
      color: '#999999'
    }
  }
}]

ProfileChartSettings.default_mcas_score_yaxis = {
  allowDecimals: false,
  title: {
    text: '',
    style: {
      display: 'none'
    }
  },
  plotLines: [],
  min: 200,
  max: 280
}

ProfileChartSettings.percentile_yaxis =  {
  allowDecimals: false,
  title: {
    text: '',
    style: {
      display: 'none'
    }
  },
  plotLines: [],
  min: 0,
  max: 100
}

ProfileChartSettings.benchmark_plotline = [{
  color: '#B90504',
  width: 1,
  zIndex: 3,
  value: 50,
  label: {
    text: 'Average baseline: 50th percentile',
    align: 'center',
    style: {
      color: '#999999'
    }
  }
}, {
  color: '#B90504',
  width: 1,
  zIndex: 3,
  value: 40,
  label: {
    text: 'Warning: Less than 40th percentile',
    align: 'center',
    style: {
      color: '#999999'
    }
  }
}];

class ProfileChart extends React.Component {
  constructor(props){
    super(props);
    const nonce = moment.utc().toDate();
    this.defaultProps = {
      now: nonce,
      intervalBack: [4, 'years'],
      timestampRange: {
        min: moment(nonce).subtract(4, 'years').toDate().getTime(),
        max: nonce.getTime(),
      }
    };  
  }
  
  getSchoolYearStartPositions(n, now, current_grade){
    // Takes in an integer (number of months back), the current date
    // as a Moment object (UTC), and the student's current grade.
    // Returns an object mapping:
    // integer (timestamp) --> string (school year starting at that position).

    const range = [now.clone().subtract(n, 'months'), now];
    const startDates = QuadConverter.schoolYearStartDates(range);
    const create_label = function(current, grade){
      // Assumes that the student progressed grades in the usual fashion;
      // wasn't held back or skipped forward.

      // Handle grade before 1st grade
      if (grade === 0) grade = 'KF';

      // No label for "negative" grades
      if (grade < 0) return '';

      return _.template("<b>Grade <%=grade%><br>started</b>")({
        year: current.year(),
        grade: grade
      });
    };

    return _.object(
      startDates.map(function(date){ return date.valueOf(); }),
      startDates.map(function(date, i){
        return create_label(
          date,
          (current_grade - startDates.length) + (i + 1) // (current_grade - n/12) to current_grade inclusive
        )
      })
    );
  }
  
  baseOptions() {
    if (this.props.student.grade === 'KF') {
      return ProfileChartSettings.base_options;
    } else {
      return this.baseOptionsForNonKF();
    };
  }
  
  baseOptionsForNonKF() {
    const positionsForYearStarts = this.getSchoolYearStartPositions(
      48, moment.utc(), parseInt(this.props.student.grade)
    );

    return _.merge(ProfileChartSettings.base_options, {
      xAxis: [
        _.merge(ProfileChartSettings.x_axis_datetime, {
          plotLines: this.x_axis_bands,
          min: this.props.timestampRange.min,
          max: this.props.timestampRange.max
        }),
        {
          type: "datetime",
          offset: 35,
          linkedTo: 0,
          tickPositions: _.keys(positionsForYearStarts).map(Number),
          categories: positionsForYearStarts,
        }
      ]
    });
  }  
  
  render(){
    return (
    
    );
  }
}

ProfileChart.propTypes = {
  quadSeries: React.PropTypes.arrayOf( // you can plot multiple series on the same graph
    React.PropTypes.shape({
      name: React.PropTypes.string.isRequired, // e.g. 'Scaled score'
      data: React.PropTypes.array.isRequired // [year, month, date, value] quads
    })
  ),
  titleText: React.PropTypes.string.isRequired, // e.g. 'MCAS scores, last 4 years'
  yAxis: React.PropTypes.object.isRequired, // options for rendering the y-axis
  student: React.PropTypes.object.isRequired  
};

ProfileChart.defaultProps = {
  
};

  // Component for all charts in the profile page.
  window.shared.ProfileChart = React.createClass({
    displayName: 'ProfileChart',

    propTypes: {
      quadSeries: React.PropTypes.arrayOf( // you can plot multiple series on the same graph
        React.PropTypes.shape({
          name: React.PropTypes.string.isRequired, // e.g. 'Scaled score'
          data: React.PropTypes.array.isRequired // [year, month, date, value] quads
        })
      ),
      titleText: React.PropTypes.string.isRequired, // e.g. 'MCAS scores, last 4 years'
      yAxis: React.PropTypes.object.isRequired, // options for rendering the y-axis
      student: React.PropTypes.object.isRequired
    },

    render() {
      <HighchartsWrapper />
      
      return createEl(HighchartsWrapper, merge(this.baseOptions(), {
        series: this.props.quadSeries.map(function(obj){
          return {
            name: obj.name,
            data: obj.data ? _.map(obj.data, QuadConverter.toPair): []
          }
        }),
        yAxis: this.props.yAxis
      }));
    },

    baseOptions: function() {
      if (this.props.student.grade === 'KF') {
        return ProfileChartSettings.base_options;
      } else {
        return this.baseOptionsForNonKF();
      };
    },

    baseOptionsForNonKF: function () {
      var positionsForYearStarts = this.getSchoolYearStartPositions(
        48, moment.utc(), parseInt(this.props.student.grade)
      );

      return merge(ProfileChartSettings.base_options, {
        xAxis: [
          merge(ProfileChartSettings.x_axis_datetime, {
            plotLines: this.x_axis_bands,
            min: this.props.timestampRange.min,
            max: this.props.timestampRange.max
          }),
          {
            type: "datetime",
            offset: 35,
            linkedTo: 0,
            tickPositions: _.keys(positionsForYearStarts).map(Number),
            categories: positionsForYearStarts,
          }
        ]
      });
    }

  });
