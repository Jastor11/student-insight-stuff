import React from 'react';
import _ from 'lodash';

var dom = window.shared.ReactHelpers.dom;
var createEl = window.shared.ReactHelpers.createEl;
var merge = window.shared.ReactHelpers.merge;

var Routes = window.shared.Routes;
var PropTypes = window.shared.PropTypes;
var BarChartSparkline = window.shared.BarChartSparkline;
var Sparkline = window.shared.Sparkline;
var AcademicSummary = window.shared.AcademicSummary;
var SummaryWithoutSparkline = window.shared.SummaryWithoutSparkline;
var SummaryList = window.shared.SummaryList;
var QuadConverter = window.shared.QuadConverter;
var Scales = window.shared.Scales;
var FeedHelpers = window.shared.FeedHelpers;

var StudentProfileHeader = window.shared.StudentProfileHeader;
var ProfileDetails = window.shared.ProfileDetails;
var ELADetails = window.shared.ELADetails;
var MathDetails = window.shared.MathDetails;
var AttendanceDetails = window.shared.AttendanceDetails;
var InterventionsDetails = window.shared.InterventionsDetails;
var ServicesDetails = window.shared.ServicesDetails;
var NotesDetails = window.shared.NotesDetails;

// define page component
const styles = {
  summaryContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',

  },
  detailsContainer: {
    margin: 30
  },
  academicColumn: {
    textAlign: 'left',
  },
  profileColumn: {
    background: '#ededed'
  },
  interventionsColumn: {
    background: '#ededed'
  },
  column: {
    flexGrow: '1',
    flexShrink: '0',
    padding: '22px 26px 16px 26px',
    cursor: 'pointer',
    borderColor: 'white',
    borderTop: 0,
    margin: 0,
    borderRadius: '0 0 5px 5px',
    width: '100%'
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 5px 0 0',
    borderRadius: '5px 5px 5px 5px',
    border: '1px solid #ccc',
    width: '20%',
   },
  selectedColumn: {
    borderStyle: 'solid',
    borderColor: '#3177c9',
    borderWidth: '0 5px 5px 5px',
    padding: '22px 21px 11px 21px',
  },
  selectedTab: {
    background: '#3177c9',
    color: 'white',
    borderBottom: 0,
  },
  summaryWrapper: {
    paddingBottom: 10
  },
  tab: {
    fontWeight: 'bold',
    width: '100%',
    height: 40,
    borderBottom: 0,
    textAlign: 'center',
    padding: '10px 5px 5px 5px',
    margin: 0,
    borderRadius: '5px 5px 0 0',
    background: 'white',
    cursor: 'pointer'
  },
  sparklineWidth: 150,
  sparklineHeight: 50
};

class StudentProfilePage extends React.Component {
  constructor(props){
    super(props);
  }
  
  renderMcasElaSgpOrDibels() {
    const {student, chartData} = this.props;
    const grade = student.grade;
    const dibels = _.sortBy(this.props.dibels, 'date_taken');

    const belowGradeFour = _.includes(['KF', 'PK', '1', '2', '3'], grade);
    const hasDibels = (dibels.length > 0);

    if (belowGradeFour && hasDibels) {
      const latestDibels = _.last(dibels).performance_level.toUpperCase();
      return (
        <div style={styles.summaryWrapper}>
          <SummaryWithoutSparkline caption="DIBELS" value={latestDibels} />
        </div>
      );
    } else {
      return this.wrapSummary({
        caption: 'MCAS ELA SGP',
        value: student.most_recent_mcas_ela_growth,
        sparkline: this.renderSparkline(chartData.mcas_series_ela_growth || [])
      })
    }
  }

  renderAttendanceEventsSummary(count, events, flexibleRangeFn, props) {
    const cumulativeQuads = QuadConverter.cumulativeByMonthFromEvents(events);
    const valueRange = flexibleRangeFn(cumulativeQuads);
    const value = count;
    const sparklineElProps = _.merge({
      height: styles.sparklineHeight,
      width: styles.sparklineWidth,
      valueRange: valueRange,
      quads: cumulativeQuads,
      dateRange: this.dateRange()
    }, props);
    const sparklineElement = <BarChartSparkline sparklineElProps />;

    return this.wrapSummary(_.merge({
      title: props.title,
      value: value,
      sparkline: sparklineElement,
    }, props));
  }

  // render with style wrapper
  wrapSummary(props) {
    return (
      <div style={styles.summaryWrapper}>
        <AcademicSummary props />
      </div>
    );
  }

  padElements(style, elements) {
    const elementList = elements.map( (element, index) => {
      return <div key={index} style={style}>element</div>
    })
    
    return (
      <div>
        {elementList}
      </div>
    );
  }  
  
  renderSectionDetails() {
    const {student, feed, access, dibels, selectedColumnKey, chartData, attendanceData, serviceTypesIndex, eventNoteTypesIndex, educatorsIndex, currentEducator, feed, actions, requests} = this.props;
    
    switch (selectedColumnKey) {
      case 'profile': return <ProfileDetails student feed access dibels chartData attendanceData serviceTypesIndex />;
      case 'ela': return <ELADetails chartData student />
      case 'math': return <MathDetails chartData student />
      case 'attendance': 
        const {disciplineIncidents, absences, tardies} = attendanceData;
        return <AttendanceDetails disciplineIncidents absences tardies student />
      case 'interventions':
        return (
          <div className="InterventionsDetails" style={{display: 'flex'}}>
            <NotesDetails student eventNoteTypesIndex educatorsIndex currentEducator feed actions requests showingRestrictedNotes={false} helpContent={this.getNotesHelpContent()} helpTitle="What is a Note?" title: "Notes" />
            <ServicesDetails student serviceTypesIndex educatorsIndex currentEducator feed actions requests />
          </div>
        );
    return null;
  }  
  
  onColumnClicked(columnKey) {
    this.props.actions.onColumnClicked(columnKey);
  }

  dateRange() {
    var nowMoment = this.props.nowMomentFn();
    return [nowMoment.clone().subtract(2, 'year').toDate(), nowMoment.toDate()];
  }

  selectedColumnStyles(columnKey) {
    return (columnKey === this.props.selectedColumnKey) ? styles.selectedColumn : {};
  }

  selectedTabStyles(columnKey) {
    return (columnKey === this.props.selectedColumnKey) ? styles.selectedTab : {};
  }
  
  renderSaveStatus() {
    var activeRequestCount = _.where(_.values(this.props.requests), { state: 'pending' }).length;
    const opacityDetail = (activeRequestCount === 0) ? 0 : 0.75;
    return (
      <div style={{
        position: 'fixed',
        left: '10',
        top: '10',
        padding: '10',
        opacity: opacityDetail,
        borderRadius: '2',
        background: 'rgb(74,144,226)'      
      }}>
        <div style={{color: 'white'}}>Saving...</div>
      </div>
    );
  }
  
  render(){
    const {student} = this.props;
    
    return (
      <div className="StudentProfilePage">
        {this.renderSaveStatus()}
        <StudentProfileHeader student={student} />
        <div className="summary-container" style={styles.summaryContainer}>
          {this.renderProfileColumn()}
          {this.renderELAColumn()}
          {this.renderMathColumn()}
          {this.renderAttendanceColumn()}
          {this.renderInterventionsColumn()}
        </div>
        <div style={styles.detailsContainer}>
          {this.renderSectionDetails()}
        </div>
      </div>
    )
  }
  
  renderTitle(text) {
    return <div style={{fontWeight: "bold"}}>{text}</div>;
  }  
  
  // quads format is: [[year, month (Ruby), day, value]]
  renderSparkline(quads, props) {
    const sparklineProps = _.merge({
      height: styles.sparklineHeight,
      width: styles.sparklineWidth,
      quads: quads,
      dateRange: this.dateRange(),
      valueRange: [0, 100],
      thresholdValue: 50      
    }, props || {})
    
    return <Sparkline sparklineProps />
  }  
  
  renderStaff(student) {
    const activeServices = this.props.feed.services.active;
    const educatorNamesFromServices = _.pluck(activeServices, 'provided_by_educator_name');
    const uniqueNames = _.unique(educatorNamesFromServices);
    const nonEmptyNames = _.filter(uniqueNames, function(id) { return id !== "" && id !== null; });
    const educatorNames = _.isEmpty( nonEmptyNames ) ? ["No staff"] : nonEmptyNames;

    const limit = 3;

    const elements = educatorNames.slice(0, limit);

    if (educatorNames.length > limit) {
      elements.push(<span>{'+ ' + (educatorNames.length - limit) + ' more'}</span>);
    } else if (educatorNames.length === 0) {
      elements.push(['None']);
    }

    return (
      <SummaryList title="Staff providing services" elements={educatorNames} />
    );
  }  
  
  renderInterventionsColumn() {
    const {student} = this.props;
    const columnKey = 'interventions';
    
    return (
      <div style={styles.columnContainer} onClick={this.onColumnClicked.bind(this, columnKey)}>
        <div style={_.merge(styles.tab, this.selectedTabStyles(columnKey))}>
          Interventions
          <div className="interventions-column" style={_.merge(styles.column, styles.academicColumn, styles.academicColumn, styles.interventionsColumn, this.selectedColumnStyles(columnKey))} onClick={this.onColumnClicked.bind(this, columnKey)}>
            {this.padElements(styles.summaryWrapper, [
             this.renderPlacement(student),
             this.renderServices(student),
             this.renderStaff(student)
             ])}
          </div>
        </div>
      </div>
    );
  }

  renderAttendanceColumn() {
    var {student, attendanceData} = this.props;
    var columnKey = 'attendance';
    
    return (
      <div style={styles.columnContainer} onClick={this.onColumnClicked.bind(this, columnKey)}>
        <div style={_.merge(styles.tab, this.selectedTabStyles(columnKey))}>Attendance and Behavior</div>
        <div style={_.merge(styles.column, styles.academicColumn, this.selectedColumnStyles(columnKey))} className="attendance-background" onClick={this.onColumnClicked.bind(this, columnKey)}>
          {this.renderAttendanceEventsSummary(
            student.discipline_incidents_count,
            attendanceData.discipline_incidents,
            Scales.disciplineIncidents.flexibleRange, {
              caption: 'Discipline this school year',
              thresholdValue: Scales.disciplineIncidents.threshold,
            }
          )}
          {this.renderAttendanceEventsSummary(
            student.absences_count,
            attendanceData.abseneces,
            Scales.absences.flexibleRange, {
              caption: 'Absences this school year',
              thresholdValue: Scales.absences.threshold,
            }
          )}
          {this.renderAttendanceEventsSummary(
            student.tardies_count,
            attendanceData.tardies,
            Scales.tardies.flexibleRange, {
              caption: 'Tardies this school year',
              thresholdValue: Scales.tardies.threshold,
            }
          )}
        </div>
      </div>
    );
  }
  
  renderProfileColumn() {
    const {student, access} = this.props;
    const columnKey = 'profile';
    const demographicsElements = [
      'Disability: ' + (student.sped_level_of_need || 'None'),
      'Low income: ' + student.free_reduced_lunch,
      'Language: ' + student.limited_english_proficiency
    ];

    if (access) {
      demographicsElements.push('ACCESS Composite score: ' + this.props.access.composite);
    };
    
    return (
      <div style={styles.columnContainer} onClick={this.onColumnClicked.bind(this, columnKey)}>
        <div style={_.merge(styles.tab, this.selectedTabStyles(columnKey))}>
          Overview
          <div style={_.merge(styles.column, styles.academicColumn, this.selectedColumnStyles(columnKey), styles.profileColumn)}>
            <SummaryList title="Demographics" elements={demographicsElements} />
          </div>
        </div>
      </div>
    );
  }
  
  renderPlacement(student) {
    var placement = (student.sped_placement !== null)
      ? student.program_assigned + ', ' + student.sped_placement
      : student.program_assigned;

    return createEl(SummaryList, {
      title: 'Placement',
      elements: [
        placement,
        'Homeroom ' + student.homeroom_name
      ]
    });
  }  
  
  renderELAColumn() {
    const {student, chartData} = this.props;
    const columnKey = 'ela';
    
    return (
      <div style={styles.columnContainer} onClick={this.onColumnClicked.bind(this, columnKey)}>
        <div style={_.merge(styles.tab, this.selectedTabStyles(columnKey))}>Reading</div>
        <div className="ela-background" style={_.merge(styles.column, styles.academicColumn, this.selectedColumnStyles(columnKey))} onClick={this.onColumnClicked.bind(this, columnKey)}>
          {this.wrapSummary({
           caption: 'STAR Reading',
           value: student.most_recent_star_reading_percentile,
           sparkline: this.renderSparkline(chartData.star_series_reading_percentile || [])
          })}
          {this.wrapSummary({
           caption: 'MCAS ELA Score',
           value: student.most_recent_mcas_ela_scaled,
           sparkline: this.renderSparkline(chartData.star_series_reading_percentile || [])
          })}  
        </div>
      </div>
    );
  }
  
  renderMathColumn() {
    const {student, chartData} = this.props;
    var columnKey = 'math';

    return (
      <div style={styles.columnContainer} onClick={this.onColumnClicked.bind(this, columnKey)}>
        <div style={_.merge(styles.tab, this.selectedTabStyles(columnKey))}>Math</div>
        <div style={_.merge(styles.column, styles.academicColumn, this.selectedColumnStyles(columnKey))} className="math-background" onClick={this.onColumnClicked.bind(this, columnKey)}>
          {this.wrapSummary({
            caption: 'STAR Math',
            value: student.most_recent_star_math_percentile,
            sparkline: this.renderSparkline(chartData.star_series_math_percentile || [])
          })}
          {this.wrapSummary({
            caption: 'MCAS Math Score',
            value: student.most_recent_mcas_math_scaled,
            sparkline: this.renderSparkline(chartData.mcas_series_math_scaled || [], {
              valueRange: Scales.mcas.valueRange,
              thresholdValue: Scales.mcas.threshold
            })
          })}
          {this.wrapSummary({
            caption: 'MCAS Math SGP',
            value: student.most_recent_mcas_math_growth,
            sparkline: this.renderSparkline(chartData.mcas_series_math_growth || [])
          })}      
        </div>
      </div>
    )
  }  
  
  getNotesHelpContent(){
    return (
      <div>
        <p>The Notes tab is the place to keep notes about a student, whether it’s SST, MTSS, a parent conversation, or some informal strategies that a teacher/team is using to help a student. More formal strategies (e.g. the student meets with a tutor or counselor every week) should be recorded in Services.</p>
        <br />
        <p>
          <b>Who can enter a note? </b>
          Anyone who works with or involved with the student, including classroom/ELL/SPED teachers, principals/assistant principals, counselors, and attendance officers.
        </p>
        <br />
        <p><b>What can/should I put in a note? </b>The true test is to think about whether the information will help your team down the road in supporting this student, either in the coming weeks, or a few years from now. Examples include: </p>
        <br />
        <ul>
          <li>Oscar just showed a 20 point increase in ORF. It seems like the take home readings are working (parents are very supportive) and we will continue it.</li>
          <li>This is a follow-up MTSS meeting for Julie. Over the last 4 weeks, she is not showing many gains despite the volunteer tutor and the change in seating…</li>
          <li>Alex just got an M on the latest F&P. Will try having him go next door to join the other 4th grade group during guided reading.</li>  
          <li>Medicine change for Uri on 4/10. So far slight increase in focus.</li>  
          <li>51a filed on 3/21. Waiting determination and follow-up from DCF.</li>  
          <li>Just found that Cora really likes to go help out in grade 1. Best incentive yet for when she stays on task and completes work.</li>  
          <li>Arranged for Kevin to go to community schools 2x/week and to get extra homework help.</li>  
          <li>Julia will do an FBA and report back at the next SST meeting to determine sources of the behavior.</li>   
          <li>Mediation occurred between Oscar and Uri and went well. Both have agreed to keep distance for 2 weeks.</li> 
          <li>Parent called to report that Jill won art award and will be going to nationals. She suggested this might be an outlet if she shows frustration in schoolwork.</li>           
        </ul>
      </div>
    );
  }  
}

StudentProfilePage.propTypes = {
  // context
  nowMomentFn: React.PropTypes.func.isRequired,
  currentEducator: React.PropTypes.object.isRequired,
  // constants
  educatorsIndex: React.PropTypes.object.isRequired,
  serviceTypesIndex: React.PropTypes.object.isRequired,
  eventNoteTypesIndex: React.PropTypes.object.isRequired,
  // data
  student: React.PropTypes.object.isRequired,
  feed: React.PropTypes.object.isRequired,
  dibels: React.PropTypes.array.isRequired,
  chartData: React.PropTypes.shape({
    // ela
    most_recent_star_reading_percentile: React.PropTypes.number,
    most_recent_mcas_ela_scaled: React.PropTypes.number,
    most_recent_mcas_ela_growth: React.PropTypes.number,
    star_series_reading_percentile: React.PropTypes.array,
    mcas_series_ela_scaled: React.PropTypes.array,
    mcas_series_ela_growth: React.PropTypes.array,
    // math
    most_recent_star_math_percentile: React.PropTypes.number,
    most_recent_mcas_math_scaled: React.PropTypes.number,
    most_recent_mcas_math_growth: React.PropTypes.number,
    star_series_math_percentile: React.PropTypes.array,
    mcas_series_math_scaled: React.PropTypes.array,
    mcas_series_math_growth: React.PropTypes.array
  }),
  attendanceData: React.PropTypes.shape({
    discipline_incidents: React.PropTypes.array,
    tardies: React.PropTypes.array,
    absences: React.PropTypes.array
  }),
  access: React.PropTypes.object
  // flux-y bits
//   requests: PropTypes.requests,
//   actions: PropTypes.actions  
}

export default StudentProfilePage;