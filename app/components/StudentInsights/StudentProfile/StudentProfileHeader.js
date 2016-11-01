import Routes from './Routes';
import RiskBubble from './RiskBubble';

const styles = {
  titleContainer: {
    fontSize: 16,
    padding: 20,
    display: 'flex'
  },
  nameTitle: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  titleItem: {
    fontSize: 24,
    padding: 5
  }
};

/*
This pure UI component renders top-line information like the student's name, school and
classroom.
*/

class StudentProfileHeader extends React.Component {
  
  bulletSpacer() {
    return <span style={styles.titleItem}>•</span>
  }
  
  render(){
    const {student} = this.props;
    
    return (
      <div style={styles.titleContainer}>
        <div style={{display: 'inline-block'}}>
          <a href={Routes.studentProfile(student.id)} style={styles.nameTitle}>
            {student.first_name + ' ' + student.last_name}
          </a>      
          {this.bulletSpacer()}
          {this.homeroomOrEnrollmentStatus()}
          {this.bulletSpacer()}
          <span style={styles.titleItem}>
            {'Grade ' + student.grade}
          </span>
          {this.bulletSpacer()}
          <a style={styles.titleItem} href={Routes.school(student.school_id)}>{student.school_name}</a>
        </div>
        <div style={{
            width: '15em',
            display: 'flex',
            justifyContent: 'flex-end'                    
         }}>
          <RiskBubble riskLevel={student.student_risk_level.level}/>
        </div>
      </div>  
    );
  }
  
  homeroomOrEnrollmentStatus() {
    const {student} = this.props;
    if (student.enrollment_status === 'Active') {
      return (
        <a href={Routes.homeroom(student.homeroom_id)} style={styles.titleItem} className="homeroom-link">
          {'Homeroom ' + student.homeroom_name}
        </a>
      )
    } else {
      return <span style={styles.titleItem}>{student.enrollment_status}</span>
    }
  }    
}

StudentProfileHeader.propTypes = {
  student: React.PropTypes.object.isRequired  
};

export default StudentProfileHeader;