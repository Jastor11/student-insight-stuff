import React from 'react';
import ProfileChart from './ProfileChart';
import ProfileBarChart from './ProfileBarChart';
import HighchartsWrapper from './HighchartsWrapper';
import moment from 'moment';

const styles = {
  box: {
    border: '1px solid #ccc',
    padding:15,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#f2f2f2'
  },
  item: {
    paddingBottom: 10,
    width: 160
  },
  itemHead: {
    fontWeight: 'bold',
  },
  header: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between'
  },
  desc: {
    fontWeight: 'bold',
    paddingTop: 30
  },
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
  centerItem: {
    paddingBottom: 10,
    textAlign: 'center',
    width: 75
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

class AttendanceDetails extends React.Component {
  
  renderNavBar() {
    return (
      <div style={styles.navBar}>
        <a style={styles.navBar} href="#disciplineChart">Discipline Chart | </a>
        <a style={styles.navBar} href="#absences">Absences Chart | </a>
        <a style={styles.navBar} href="#tardies">Tardies Chart | </a>
        <a style={styles.navBar} href="#history">Incident Chart | </a>        
      </div>
    );
  }  
  
  renderHeader(title) {
    return (
      <div style={styles.secHead}>
        <h4 style={styles.title}>{title}</h4>
        <span style={styles.navTop}>
          <a href="#">Back to top</a>
        </span>
      </div>
    );
  }
  
  renderDisciplineIncidents() {
    return (
      <ProfileBarChart 
        events={this.props.disciplineIncidents}
        titleText={'Discipline Incidents'}
        id="disciplineChart"
        monthsBack=48
        tooltipTemplateString="<span><a href='#history' style='font-size: 12px'><%= moment.utc(e.occurred_at).format('MMMM Do, YYYY')%></a></span>"
      />
    );
  }
  
  renderAbsences() {
    return (
      <ProfileBarChart 
        events={this.props.absences}
        titleText={'Absences'}
        id="absences"
        monthsBack=48
      />    
    )
  }

  renderTardies() {
    return (
      <ProfileBarChart 
        events={this.props.tardies}
        titleText={'Tardies'}
        id="tardies"
        monthsBack=48
      />        
    )
  }

    renderIncidents() {
      const disciplineIncidentList = this.props.disciplineIncidents.map( incident => {
        return (
          <div style={styles.box} key={incident.id}>
            <div style={styles.header}>
              <div style={styles.item}>
                <span style={styles.itemHead}>Date: </span>
                <span style={styles.itemHead}>{moment.utc(incident.occurred_at).format('MMM D, YYYY')} </span>          
              </div>
              <div style={styles.centerItem}>
                <span style={styles.itemHead}>Code: </span>
                <span style={styles.itemHead}>{moment.utc(incident.occurred_at).format('MMM D, YYYY')} </span>          
              </div>
              <div style={styles.item}>
                <span style={styles.itemHead}>Location: </span>
                <span style={styles.itemHead}>{moment.utc(incident.occurred_at).format('MMM D, YYYY')} </span>          
              </div>                
            </div>
            <div>
              <span style={styles.desc}>Description: </span>   
            </div>
            <div>{incident.incident_description}</div>
          </div>
        )
      })
      
      return (
        <div style={{paddingTop: '60'}}>
           {disciplineIncidentList}
        </div>      
      )
    }
    
    renderIncidentHistory() {
      return (
        <div>
          {this.renderHeader('Incident History')}
          <div></div>
          {(this.props.disciplineIncidents.length > 0) 
            ? this.renderIncidents()
            : <div style={{paddingTop: '60'}}>No Incidents</div>
          }
        </div>
      )
    } 
  
  render(){
    return (
      <div className="AttendanceDetails">
        {this.renderNavBar()}
        {this.renderDisciplineIncidents()}
        {this.renderAbsences()}
        {this.renderTardies()}
        {this.renderIncidentHistory()}
      </div>
  }
}

AttendanceDetails.propTypes = {
  displayName: React.PropTypes.string.isRequired,  
  absences: React.PropTypes.array.isRequired,
  tardies: React.PropTypes.array.isRequired,
  disciplineIncidents: React.PropTypes.array.isRequired,
  student: React.PropTypes.object.isRequired  
};

AttendanceDetails.defaultProps = {
  displayName: 'AttendanceDetails'
};

export default AttendanceDetails;