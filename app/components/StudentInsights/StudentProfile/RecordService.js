import React from 'react';
import moment from 'moment';
import merge from '../../../utils/Merge';

// import ReactSelect from 'react-select';
import DatePicker from './DatePicker';
import ServiceColor from './ServiceColor';
import ProvidedByEducatorDropdown from './ProvidedByEducatorDropdown';

const styles = {
  dialog: {
    border: '1px solid #ccc',
    borderRadius: 2,
    padding: 20,
    marginBottom: 20,
    marginTop: 10
  },
  cancelRecordServiceButton: { // overidding CSS
    color: 'black',
    background: '#eee',
    marginLeft: 10,
    marginRight: 10
  },
  datepickerInput: {
    fontSize: 14,
    padding: 5,
    width: '50%'
  },
  serviceButton: {
    background: '#eee', // override CSS
    color: 'black'
  },
  buttonWidth: {
    width: '12em',
    fontSize: 12,
    padding: 8
  }
};


/*
Pure UI form for recording that a student is receiving a service.
Tracks its own local state and submits values to prop callbacks.
*/


class RecordService extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      serviceTypeId: null,
      providedByEducatorName: "",
      momentStarted: moment.utc() // TODO should thread through      
    }
  }

  onDateChanged(dateText) {
    var textMoment = moment.utc(dateText, 'MM/DD/YYYY');
    var updatedMoment = (textMoment.isValid()) ? textMoment : null;
    this.setState({ momentStarted: updatedMoment });
  }

  onProvidedByEducatorTyping(event) {
    this.setState({ providedByEducatorName: event.target.value });
  }

  onProvidedByEducatorDropdownSelect(string) {
    this.setState({ providedByEducatorName: string });
  }

  onServiceClicked(serviceTypeId, event) {
    this.setState({ serviceTypeId: serviceTypeId });
  }

  onClickCancel(event) {
    this.props.onCancel();
  }

  onClickSave(event) {
    const {serviceTypeId, providedByEducatorName, momentStarted } = this.state;
    // Get the value of the autocomplete input
    this.props.onSave({
      serviceTypeId: serviceTypeId,
      providedByEducatorName: providedByEducatorName,
      dateStartedText: momentStarted.format('YYYY-MM-DD'),
      recordedByEducatorId: this.props.currentEducator.id
    })
  }
  
  render(){
    const renderWhichServiceDisplay = this.renderWhichService();
    const renderWhoAndWhenDisplay = this.renderWhoAndWhen();
    const renderButtonsDisplay = this.renderButtons();
    
    return (
      <div className="RecordService" style={styles.dialog}>
        {renderWhichServiceDisplay}
        {renderWhoAndWhenDisplay}
        {renderButtonsDisplay}
      </div>
    )
  }

  renderWhichService() {    
    return (
      <div>
        <div style={{marginBottom: '5', display: 'inline'}}>
          Which Service
        </div>      
        <div style={{display: 'flex', justifyContent: 'flex-start'}}>
          <div style={styles.buttonWidth}>
            {this.renderServiceButton(503)}
            {this.renderServiceButton(502)}
            {this.renderServiceButton(504)}
          </div>
          <div style={styles.buttonWidth}>
            {this.renderServiceButton(505)}
            {this.renderServiceButton(506)}
            {this.renderServiceButton(507)}
          </div>          
        </div>      
      </div>
    )
  }

    renderServiceButton(serviceTypeId, options) {
      var serviceText = this.props.serviceTypesIndex[serviceTypeId].name;
      var color = serviceColor(serviceTypeId);

      return dom.button({
        className: 'btn service-type',
        onClick: this.onServiceClicked.bind(this, serviceTypeId),
        tabIndex: -1,
        style: merge(styles.serviceButton, styles.buttonWidth, {
          background: color,
          outline: 0,
          border: (this.state.serviceTypeId === serviceTypeId)
            ? '4px solid rgba(49, 119, 201, 0.75)'
            : '4px solid white'
        })
      }, serviceText);
    }

    renderEducatorSelect() {
      return createEl(ProvidedByEducatorDropdown, {
        onUserTyping: this.onProvidedByEducatorTyping,
        onUserDropdownSelect: this.onProvidedByEducatorDropdownSelect,
        studentId: this.props.studentId
      });
    }

    renderWhoAndWhen() {
      return dom.div({},
        dom.div({ style: { marginTop: 20 } },
          dom.div({}, 'Who is working with ' + this.props.studentFirstName + '?'),
          dom.div({}, this.renderEducatorSelect())
        ),
        dom.div({ style: { marginTop: 20 } }, 'When did they start?'),
        createEl(Datepicker, {
          styles: { input: styles.datepickerInput },
          defaultValue: (this.state.momentStarted && this.state.momentStarted.format('MM/DD/YYYY')),
          onChange: this.onDateChanged,
          datepickerOptions: {
            showOn: 'both',
            dateFormat: 'mm/dd/yy',
            minDate: undefined
          }
        })
      );
    }

    renderEducatorSelect() {
      return createEl(ProvidedByEducatorDropdown, {
        onUserTyping: this.onProvidedByEducatorTyping,
        onUserDropdownSelect: this.onProvidedByEducatorDropdownSelect,
        studentId: this.props.studentId
      });
    }

    renderWhoAndWhen() {
      return dom.div({},
        dom.div({ style: { marginTop: 20 } },
          dom.div({}, 'Who is working with ' + this.props.studentFirstName + '?'),
          dom.div({}, this.renderEducatorSelect())
        ),
        dom.div({ style: { marginTop: 20 } }, 'When did they start?'),
        createEl(Datepicker, {
          styles: { input: styles.datepickerInput },
          defaultValue: (this.state.momentStarted && this.state.momentStarted.format('MM/DD/YYYY')),
          onChange: this.onDateChanged,
          datepickerOptions: {
            showOn: 'both',
            dateFormat: 'mm/dd/yy',
            minDate: undefined
          }
        })
      );
    }

    renderButtons() {
      var isFormComplete = (this.state.serviceTypeId && this.state.momentStarted);
      return dom.div({ style: { marginTop: 15 } },
        dom.button({
          style: {
            marginTop: 20,
            background: (isFormComplete) ? undefined : '#ccc'
          },
          disabled: !isFormComplete,
          className: 'btn save',
          onClick: this.onClickSave
        }, 'Record service'),
        dom.button({
          className: 'btn cancel',
          style: styles.cancelRecordServiceButton,
          onClick: this.onClickCancel
        }, 'Cancel'),
        (this.props.requestState === 'pending') ? dom.span({}, 'Saving...') : this.props.requestState
      );
    }

    renderButtons() {
      var isFormComplete = (this.state.serviceTypeId && this.state.momentStarted);
      return dom.div({ style: { marginTop: 15 } },
        dom.button({
          style: {
            marginTop: 20,
            background: (isFormComplete) ? undefined : '#ccc'
          },
          disabled: !isFormComplete,
          className: 'btn save',
          onClick: this.onClickSave
        }, 'Record service'),
        dom.button({
          className: 'btn cancel',
          style: styles.cancelRecordServiceButton,
          onClick: this.onClickCancel
        }, 'Cancel'),
        (this.props.requestState === 'pending') ? dom.span({}, 'Saving...') : this.props.requestState
      );
    }  
}

RecordService.propTypes = {
  studentFirstName: React.PropTypes.string.isRequired,
  studentId: React.PropTypes.number.isRequired,
  onSave: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  requestState: PropTypes.nullable(React.PropTypes.string.isRequired),

  // context
  nowMoment: React.PropTypes.object.isRequired,
  serviceTypesIndex: React.PropTypes.object.isRequired,
  educatorsIndex: React.PropTypes.object.isRequired,
  currentEducator: React.PropTypes.object.isRequired  
};

export default RecordService;