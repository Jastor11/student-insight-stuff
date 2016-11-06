import React from 'react';
import merge from '../../../utils/Merge';

import Educator from './Educator';
import serviceColor from './ServiceColor';
import moment from 'moment';

const styles = {
  noItems: {
    margin: 10
  },
  service: {
    border: '1px solid #eee',
    padding: 15,
    marginTop: 10,
    marginBottom: 10
  },
  userText: {
    whiteSpace: 'pre-wrap'
  },
  daysAgo: {
    opacity: 0.25,
    paddingLeft: '0.5em'
  },
  discontinue: {
    background: 'white',
    opacity: 0.5,
    border: '1px solid #ccc',
    color: '#666'
  },
  cancel: {
    background: 'white',
    color: 'black'
  },
  discontinueConfirm: {
    background: '#E2664A'
  }  
}


  var dom = window.shared.ReactHelpers.dom;
  var createEl = window.shared.ReactHelpers.createEl;
  var merge = window.shared.ReactHelpers.merge;

  var Educator = window.shared.Educator;
  var serviceColor = window.shared.serviceColor;
  var moment = window.moment;

  var styles = {
    noItems: {
      margin: 10
    },
    service: {
      border: '1px solid #eee',
      padding: 15,
      marginTop: 10,
      marginBottom: 10
    },
    userText: {
      whiteSpace: 'pre-wrap'
    },
    daysAgo: {
      opacity: 0.25,
      paddingLeft: '0.5em'
    },
    discontinue: {
      background: 'white',
      opacity: 0.5,
      border: '1px solid #ccc',
      color: '#666'
    },
    cancel: {
      background: 'white',
      color: 'black'
    },
    discontinueConfirm: {
      background: '#E2664A'
    }
  };

class ServicesList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hoveringDiscontinueServiceId: null,
      hoveringCancelServiceId: null,
      discontinuingServiceId: null      
    };
  }
  
  resetDiscontinueState() {
    return {
      discontinuingServiceId: null,
      hoveringCancelServiceId: null,
      hoveringDiscontinueServiceId: null
    };
  }

  // Confirmation step
  onClickDiscontinueService(serviceId) {
    if (this.state.discontinuingServiceId !== serviceId) {
      this.setState(merge(this.resetDiscontinueState(), {
        discontinuingServiceId: serviceId,
      }));
      return;
    }

    this.props.onClickDiscontinueService(serviceId);
    const newState = this.resetDiscontinueState();
    this.setState(newState);
  }

  onClickCancelDiscontinue(serviceId) {
    const newStated = this.resetDiscontinueState();
    this.setState(newStated);
  }

  onMouseEnterDiscontinue(serviceId) {
    this.setState({ hoveringDiscontinueServiceId: serviceId });
  }

  onMouseLeaveDiscontinue() {
    this.setState({ hoveringDiscontinueServiceId: null });
  }

  onMouseEnterCancel(serviceId) {
    this.setState({ hoveringCancelServiceId: serviceId });
  }

  onMouseLeaveCancel() {
    this.setState({ hoveringCancelServiceId: null });
  }

  wasDiscontinued(service) {
    return (service.discontinued_by_educator_id !== null);
  }

  // Active services before inactive, then sorted by time
  sortedMergedServices(servicesFeed) {
    return _.flatten([
      _.sortBy(servicesFeed.active, 'date_started').reverse(),
      _.sortBy(servicesFeed.discontinued, 'date_started').reverse()
    ]);
  }
  
  renderEducatorName(educatorName) {
    if (educatorName !== "" && educatorName !== null) {
      return <div>{'With ' + educatorName}</div>
    };
  }

  renderDiscontinuedInformation(service) {
    var discontinuedAt = moment.utc(service.discontinued_recorded_at);
    var now = moment();

    if (discontinuedAt > now) {
      var description = 'Ending';
    } else {
      var description = 'Ended';
    };

    if (this.wasDiscontinued(service)) {
      return (
        <div>
          <div>{description}</div>
          <div>{discontinuedAt.format('MMMM D, YYYY')}</div>
        </div>
       )
    }

    return this.renderDiscontinueButton(service)
  }

  // Toggles when in confirmation state
  renderDiscontinueButton(service) {
    const isConfirming = (this.state.discontinuingServiceId === service.id);
    const isHovering = (this.state.hoveringDiscontinueServiceId === service.id);
    const isPending = (this.props.discontinueServiceRequests[service.id] === 'pending');

    const buttonText = (isPending)
      ? 'Updating...'
      : (isConfirming) ? 'Confirm' : 'Discontinue';
    const style = (isConfirming || isPending) ?
      styles.discontinueConfirm
      : (isHovering) ? {} : styles.discontinue;

    const discontinueButton = <div className="btn" onMouseEnter={this.onMouseEnterDiscontinue.bind(this, service.id) } onMouseLeave={this.onMouseLeaveDiscontinue } style={style} onClick={this.onClickDiscontinueService.bind(this, service.id)} >{buttonText}</div>


    const cancelButton = (isConfirming) ? this.renderCancelDiscontinueButton(service) : null;
    return (
      <div>
        {discontinueButton}
        {cancelButton}
      </div>
    )
  }
  
  render(){
    const elements = (this.props.servicesFeed.active.length === 0 && this.props.servicesFeed.discontinued.length === 0)
        ? dom.div({ style: styles.noItems }, 'No services')
        : this.sortedMergedServices(this.props.servicesFeed).map(this.renderService);
    
    return (
      <div className="ServicesList">{elements}</div>
    )
  }
  
  renderService(service) {
    const wasDiscontinued = this.wasDiscontinued(service);
    const serviceText = this.props.serviceTypesIndex[service.service_type_id].name;
    const momentStarted = moment.utc(service.date_started);
    const providedByEducatorName = service.provided_by_educator_name;   
    const wasDiscontinuedDisplay = (wasDiscontinued)
            ? moment.utc(service.discontinued_recorded_at).from(moment.utc(service.date_started), true)
            : moment.utc(service.date_started).fromNow(true))
    
    return (
      <div key={service.id} style={merge(styles.service, {
        background: serviceColor(service.service_type_id),
        opacity: (wasDiscontinued) ? '0.8' : '1'      
      })}>
        <div style={{display: 'flex'}}>
          <div style={{flex: '1'}}>
            <div style={{fontWeight: 'bold'}}>
              {serviceText}
            </div>
            {this.renderEducatorName(providedByEducatorName)}
            <div>
              Started
              {momentStarted.format('MMMM D, YYYY')}
            </div>
            <div>
              {wasDiscontinuedDisplay}
            </div>              
          </div>
          {this.renderDiscontinuedInformation(service)}
        </div>
        <div style={merge(styles.userText, { paddingTop: '15'})}>service.comment</div>   
      </div>
    )
  }

  // Toggles when in confirmation state
  renderDiscontinueButton(service) {
    const isConfirming = (this.state.discontinuingServiceId === service.id);
    const isHovering = (this.state.hoveringDiscontinueServiceId === service.id);
    const isPending = (this.props.discontinueServiceRequests[service.id] === 'pending');

    const buttonText = (isPending)
      ? 'Updating...'
      : (isConfirming) ? 'Confirm' : 'Discontinue';
    const style = (isConfirming || isPending) ?
      styles.discontinueConfirm
      : (isHovering) ? {} : styles.discontinue;

    const discontinueButton = dom.button({
      className: 'btn',
      onMouseEnter: this.onMouseEnterDiscontinue.bind(this, service.id),
      onMouseLeave: this.onMouseLeaveDiscontinue,
      style: style,
      onClick: this.onClickDiscontinueService.bind(this, service.id)
    }, buttonText);

    const cancelButton = (isConfirming) ? this.renderCancelDiscontinueButton(service) : null;
    return dom.div({}, discontinueButton, cancelButton);
  }

    renderCancelDiscontinueButton(service) {
      const isHovering = (this.state.hoveringCancelServiceId === service.id);
      const style = (isHovering) ? {} : styles.cancel;

      return dom.button({
        className: 'btn',
        onMouseEnter: this.onMouseEnterCancel.bind(this, service.id),
        onMouseLeave: this.onMouseLeaveCancel,
        style: merge(style, { marginLeft: 5 }),
        onClick: this.onClickCancelDiscontinue.bind(this, service.id)
      }, 'Cancel');
    }

  renderCancelDiscontinueButton(service) {
    const isHovering = (this.state.hoveringCancelServiceId === service.id);
    const style = (isHovering) ? {} : styles.cancel;
    
    return (
      <div 
        className="btn" 
        onMouseEnter={this.onMouseEnterCancel.bind(this, service.id)} 
        onMouseLeave={this.onMouseLeaveCancel} 
        style={merge(style, { marginLeft: '5' })} 
        onClick={this.onClickCancelDiscontinue.bind(this, service.id)} >
          Cancel
      </div>    
    )
  }
}

ServicesList.propTypes = {
  servicesFeed: React.PropTypes.object.isRequired,
  serviceTypesIndex: React.PropTypes.object.isRequired,
  educatorsIndex: React.PropTypes.object.isRequired,
  discontinueServiceRequests: React.PropTypes.object.isRequired,
  onClickDiscontinueService: React.PropTypes.func.isRequired  
};

export default ServicesList;
