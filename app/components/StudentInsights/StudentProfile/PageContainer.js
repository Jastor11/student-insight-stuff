import React from 'react';
import _ from 'lodash';
import StudentProfilePage from './StudentProfilePage';
import Routes from './Routes';
import Api from './Api';
import fromPair from './fromPair';

class PageContainer extends React.Component {
  constructor(props){
    super(props);
    var {serializedData, queryParams} = this.props;
    
    this.state = {
        // context
        currentEducator: serializedData.currentEducator,
        // constants
        educatorsIndex: serializedData.educatorsIndex,
        serviceTypesIndex: serializedData.serviceTypesIndex,
        eventNoteTypesIndex: serializedData.eventNoteTypesIndex,
        // data
        student: serializedData.student,
        feed: serializedData.feed,
        chartData: serializedData.chartData,
        attendanceData: serializedData.attendanceData,
        access: serializedData.access,
        dibels: serializedData.dibels,
        // ui
        selectedColumnKey: queryParams.column || 'interventions',

        // This map holds the state of network requests for various actions.  This allows UI components to branch on this
        // and show waiting messages or error messages.
        // The state of a network request is described with null (no requests in-flight),
        // 'pending' (a request is currently in-flight),
        // and 'error' or another value if the request failed.
        // The keys within `request` hold either a single value describing the state of the request, or a map that describes the
        // state of requests related to a particular object.
        // For example, `saveService` holds the state of that request, but `saveNotes` is a map that can track multiple active
        // requests, using `serviceId` as a key.
        requests: {
          saveNotes: {},
          saveService: null,
          discontinueService: {}
        }
      };
  }
  
  componentWillMount(props, state) {
    this.api = this.props.api || new Api();
  }
  
  componentDidUpdate(props, state) {
    const path = Routes.studentProfile(this.state.student.id, {
      column: this.state.selectedColumnKey
    });
    window.history.replaceState({}, null, path);
  }
  
  onColumnClicked(columnKey) {
    this.setState({ selectedColumnKey: columnKey });
  }

  onClickSaveNotes(eventNoteParams) {
    let saveNotes = {};
    saveNotes[eventNoteParams.id] = 'pending';
    const newRequests = _.merge(this.state.requests, {saveNotes: saveNotes})
    this.setState({ requests: newRequests });
    this.api.saveNotes(this.state.student.id, eventNoteParams)
      .done(this.onSaveNotesDone)
      .fail(this.onSaveNotesFail);
  }
  
  onSaveNotesDone(response) {
    var updatedEventNotes;
    var foundEventNote = false;

    updatedEventNotes = this.state.feed.event_notes.map(function(eventNote) {
      if (eventNote.id === response.id) {
        foundEventNote = true;
        return _.merge(eventNote, response);
      }
      else {
        return eventNote;
      }
    });

    if (!foundEventNote) {
      updatedEventNotes = this.state.feed.event_notes.concat([response]);
    }

    var updatedFeed = _.merge(this.state.feed, { event_notes: updatedEventNotes });
    this.setState({
      feed: updatedFeed,
      requests: _.merge(this.state.requests, { saveNotes: {} })
    });
  }

  onSaveNotesFail(request, status, message) {
    var saveNotes = {};
    saveNotes[request.event_note.id] = 'error';
    this.setState({ requests: _.merge(this.state.requests, saveNotes) });
  }
  
  onClickSaveService(serviceParams) {
    // Very quick name validation, just check for a comma between two words
    if ((/(\w+, \w|^$)/.test(serviceParams.providedByEducatorName))) {
        this.setState({ requests: _.merge(this.state.requests, { saveService: 'pending' }) });
        this.api.saveService(this.state.student.id, serviceParams)
      .done(this.onSaveServiceDone)
      .fail(this.onSaveServiceFail);
    } else {
        this.setState({ requests: _.merge(this.state.requests, { saveService: 'Please use the form Last Name, First Name' }) });
    }
  }

  onSaveServiceDone(response) {
    var updatedActiveServices = this.state.feed.services.active.concat([response]);
    var updatedFeed = _.merge(this.state.feed, {
      services: _.merge(this.state.feed.services, {
        active: updatedActiveServices
      })
    });

    this.setState({
      feed: updatedFeed,
      requests: _.merge(this.state.requests, { saveService: null })
    });
  }

  onSaveServiceFail(request, status, message) {
    this.setState({ requests: merge(this.state.requests, { saveService: 'error' }) });
  }

  onClickDiscontinueService(serviceId) {
    this.setState(this.mergedDiscontinueService(this.state, serviceId, 'pending'));
    this.api.discontinueService(serviceId)
      .done(this.onDiscontinueServiceDone.bind(this, serviceId))
      .fail(this.onDiscontinueServiceFail.bind(this, serviceId));
  }

  onDiscontinueServiceDone(serviceId, response) {
    var updatedStateOfRequests = this.mergedDiscontinueService(this.state, serviceId, null);
    var updatedFeed = _.merge(this.state.feed, {
      services: _.merge(this.state.feed.services, {
        discontinued: this.state.feed.services.discontinued.concat([response]),
        active: this.state.feed.services.active.filter(function(service) {
          return service.id !== serviceId;
        }),
      })
    });
    this.setState(_.merge(updatedStateOfRequests, { feed: updatedFeed }));
  }

  // Returns an updated state, adding serviceId and requestState, or removing
  // the `serviceId` from the map if `requestState` is null.
  mergedDiscontinueService(state, serviceId, requestState) {
    var updatedDiscontinueService = (requestState === null)
      ? _.omit(state.requests.discontinueService, serviceId)
      : _.merge(state.requests.discontinueService, fromPair(serviceId, requestState));

    return _.merge(state, {
      requests: _.merge(state.requests, {
        discontinueService: updatedDiscontinueService
      })
    });
  }

  onDiscontinueServiceFail(serviceId, request, status, message) {
    this.setState(this.mergedDiscontinueService(this.state, serviceId, 'error'));
  }  

  dateRange() {
    var nowMoment = this.props.nowMomentFn();
    return [nowMoment.clone().subtract(1, 'year').toDate(), nowMoment.toDate()];
  }
  
  render(){
    const newProperties = _.merge(_.pick(this.state,           
          'currentEducator',
          'educatorsIndex',
          'serviceTypesIndex',
          'eventNoteTypesIndex',
          'student',
          'feed',
          'access',
          'chartData',
          'dibels',
          'attendanceData',
          'selectedColumnKey',
          'requests' ), {
          nowMomentFn: this.props.nowMomentFn,
          actions: this.props.actions || {
            onColumnClicked: this.onColumnClicked,
            onClickSaveNotes: this.onClickSaveNotes,
            onClickSaveService: this.onClickSaveService,
            onClickDiscontinueService: this.onClickDiscontinueService
          }
        })
    
    return (
      <div className="PageContainer">
        <StudentProfilePage  />
      </div> 
    );
  }
}

PageContainer.propTypes = {
  nowMomentFn: React.PropTypes.func.isRequired,
  serializedData: React.PropTypes.object.isRequired,
  queryParams: React.PropTypes.object.isRequired,

  // for testing
//   actions: PropTypes.actions,
//   api: PropTypes.api  
};