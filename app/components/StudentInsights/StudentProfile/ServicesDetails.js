import React from 'react';
import merge from '../../../utils/Merge';

import ServicesList from './ServicesList';
import RecordService from './RecordService';
import HelpBubble from './HelpBubble';

const styles = {
  servicesContainer: {
    flex: 1
  },
  addServiceContainer: {
    marginTop: 10
  }
};

/*
The bottom region of the page, showing notes about the student, services
they are receiving, and allowing users to enter new information about
these as well.
*/

class ServicesDetails extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isAddingService: false
    }
  }

  onClickRecordService(event) {
    this.setState({ isAddingService: true });
  }

  onCancelRecordService(event) {
    this.setState({ isAddingService: false });
  }

  onClickSaveService(serviceParams, event) {
    this.props.actions.onClickSaveService(serviceParams);
    this.setState({ isAddingService: false });
  }

  onClickDiscontinueService(serviceId, event) {
    this.props.actions.onClickDiscontinueService(serviceId);
  }
  
  getServicesHelpContent(){
    return (
      <div>
        <p>While Notes are a catch-all for student information, Services are a place to keep track of more formal extensive interventions for a student. It includes a specific person responsible and dates.</p>
        <br />
        <p>The types of Services are:</p>
        <ul>
          <li>
            <b>Attendance Officer: </b>
            This usually includes home visit(s), regular follow-up, and could later on lead to a formal attendance contract.      
          </li>
          <li>
            <b>Attendance Contract: </b>
            This is usually done in cooperation with the attendance officer, school adjustment counselor, and/or principal. This is a more formal document that requires a parent and student signature, along with regular checkpoints.
          </li>
          <li>
            <b>Behavior Contract: </b>
            This is usually done in cooperation with the attendance officer, school adjustment counselor, and/or principal. This is a more formal document that requires a parent and student signature, along with regular checkpoints.
          </li>
          <li>
            <b>Counseling, in-house: </b>
            Student receives regular weekly or bi-weekly counseling from an SPS counselor. One time or infrequent check-ins by a counselor should just be recorded in Notes.
          </li>
          <li>
            <b>Counseling, outside: </b>
            Student receives regular weekly or bi-weekly counseling from an outside counselor, ex. Riverside, Home for Little Wanderers. One time or infrequent check-ins by a counselor should just be recorded in Notes.
          </li>
          <li>
            <b>Reading Intervention: </b>
            Student works with a reading specialist at least 4x/week for 30-40 minutes.
          </li>      
        </ul>
        <br />
        <p>If your data fits into one of these categories, it's a Service. Otherwise, it's a Note.</p>
      </div>
    )
  }
  
  render(){
    const contentDisplay = this.getServicesHelpContent();
    const recordServiceSectionDisplay = this.renderRecordServiceSection();
    const {feed, educatorsIndex, serviceTypesIndex, requests} = this.props;
    
    return (
      <div className="ServicesDetails" style={styles.servicesContainer}>
        <div>
          <h4 style={{display: 'inline', color: 'black'}}>Services</h4>
          <HelpBubble title="What is a Service?" teaserText="(What is this?)" content={contentDisplay}/>
        </div>
        <div style={styles.addServiceContainer}>{recordServiceSectionDisplay}</div>
        <ServicesList 
          servicesFeed={feed.services},
          educatorsIndex={educatorsIndex},
          serviceTypesIndex={serviceTypesIndex},
          onClickDiscontinueService={this.onClickDiscontinueService},
          discontinueServiceRequests={requests.discontinueService}          
        />
      </div>
    )
  }
  
  renderRecordServiceSection() {
    if (this.state.isAddingService || this.props.requests.saveService !== null) {
      return createEl(RecordService, {
        studentFirstName: this.props.student.first_name,
        studentId: this.props.student.id,
        onSave: this.onClickSaveService,
        onCancel: this.onCancelRecordService,
        requestState: this.props.requests.saveService,

        nowMoment: moment.utc(), // TODO(kr) thread through
        currentEducator: this.props.currentEducator,
        serviceTypesIndex: this.props.serviceTypesIndex,
        educatorsIndex: this.props.educatorsIndex,
      });
    }

    return dom.button({
      className: 'btn record-service',
      onClick: this.onClickRecordService
    }, 'Record service')
  }  
}

ServicesDetails.propTypes = {
  student: React.PropTypes.object.isRequired,
  serviceTypesIndex: React.PropTypes.object.isRequired,
  educatorsIndex: React.PropTypes.object.isRequired,
  currentEducator: React.PropTypes.object.isRequired,
  actions: PropTypes.actions.isRequired,
  feed: PropTypes.feed.isRequired
}

export default ServicesDetails;

/*
The bottom region of the page, showing notes about the student, services
they are receiving, and allowing users to enter new information about
these as well.
*/
  var ServicesDetails = window.shared.ServicesDetails = React.createClass({
    propTypes: {
      student: React.PropTypes.object.isRequired,
      serviceTypesIndex: React.PropTypes.object.isRequired,
      educatorsIndex: React.PropTypes.object.isRequired,
      currentEducator: React.PropTypes.object.isRequired,
      actions: PropTypes.actions.isRequired,
      feed: PropTypes.feed.isRequired
    },

    getInitialState: function() {
      return {
        isAddingService: false
      }
    },

    onClickRecordService: function(event) {
      this.setState({ isAddingService: true });
    },

    onCancelRecordService: function(event) {
      this.setState({ isAddingService: false });
    },

    onClickSaveService: function(serviceParams, event) {
      this.props.actions.onClickSaveService(serviceParams);
      this.setState({ isAddingService: false });
    },

    onClickDiscontinueService: function(serviceId, event) {
      this.props.actions.onClickDiscontinueService(serviceId);
    },

    getServicesHelpContent: function(){
      return dom.div({},
        dom.p({}, 'While Notes are a catch-all for student information, Services are a place to keep track of more formal \
        extensive interventions for a student. It includes a specific person responsible and dates.'),
        dom.br({}),
        dom.p({}, 'The types of Services are:'),
        dom.ul({},
          dom.li({}, dom.b({}, 'Attendance Officer: '), 'This usually includes home visit(s), regular follow-up, \
          and could later on lead to a formal attendance contract.'),
          dom.li({}, dom.b({}, 'Attendance Contract: '), 'This is usually done in cooperation with the attendance officer, \
          school adjustment counselor, and/or principal. This is a more formal document that requires a parent and \
          student signature, along with regular checkpoints.'),
          dom.li({}, dom.b({}, 'Behavior Contract: '), 'This is usually done in cooperation with the attendance officer, \
          school adjustment counselor, and/or principal. This is a more formal document that requires a parent and \
          student signature, along with regular checkpoints.'),
          dom.li({}, dom.b({}, 'Counseling, in-house: '), 'Student receives regular weekly or bi-weekly counseling from an SPS counselor. \
          One time or infrequent check-ins by a counselor should just be recorded in Notes.'),
          dom.li({}, dom.b({}, 'Counseling, outside: '), 'Student receives regular weekly or bi-weekly counseling from an outside \
          counselor, ex. Riverside, Home for Little Wanderers. One time or infrequent check-ins by a counselor should \
          just be recorded in Notes.'),
          dom.li({}, dom.b({}, 'Reading Intervention: '), 'Student works with a reading specialist at least 4x/week for 30-40 minutes.')
        ),
        dom.br({}),
        dom.p({}, "If your data fits into one of these categories, it's a Service. Otherwise, it's a Note.")
      )
    },

    render: function() {
      return dom.div({ className: 'ServicesDetails', style: styles.servicesContainer },
        dom.div({style: {borderBottom: '1px solid #333', padding: 10}},
          dom.h4({style: {display: 'inline', color: 'black'}}, 'Services'),
          createEl(HelpBubble, {
            title: 'What is a Service?',
            teaserText: '(what is this?)',
            content: this.getServicesHelpContent()
          })
        ),
        dom.div({ style: styles.addServiceContainer }, this.renderRecordServiceSection()),
        createEl(ServicesList, {
          servicesFeed: this.props.feed.services,
          educatorsIndex: this.props.educatorsIndex,
          serviceTypesIndex: this.props.serviceTypesIndex,
          onClickDiscontinueService: this.onClickDiscontinueService,
          discontinueServiceRequests: this.props.requests.discontinueService
        })
      );
    },

    renderRecordServiceSection: function() {
      if (this.state.isAddingService || this.props.requests.saveService !== null) {
        return createEl(RecordService, {
          studentFirstName: this.props.student.first_name,
          studentId: this.props.student.id,
          onSave: this.onClickSaveService,
          onCancel: this.onCancelRecordService,
          requestState: this.props.requests.saveService,

          nowMoment: moment.utc(), // TODO(kr) thread through
          currentEducator: this.props.currentEducator,
          serviceTypesIndex: this.props.serviceTypesIndex,
          educatorsIndex: this.props.educatorsIndex,
        });
      }

      return dom.button({
        className: 'btn record-service',
        onClick: this.onClickRecordService
      }, 'Record service')
    }
  });
})();