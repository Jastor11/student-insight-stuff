import React from 'react';
import merge from '../../../utils/Merge';

const styles = {
  dialog: {
    border: '1px solid #ccc',
    borderRadius: 2,
    padding: 20,
    marginBottom: 20,
    marginTop: 10
  },
  date: {
    paddingRight: 10,
    fontWeight: 'bold',
    display: 'inline-block'
  },
  educator: {
    paddingLeft: 5,
    display: 'inline-block'
  },
  textarea: {
    fontSize: 14,
    border: '1px solid #eee',
    width: '100%' //overriding strange global CSS, should cleanup
  },
  cancelTakeNotesButton: { // overidding CSS
    color: 'black',
    background: '#eee',
    marginLeft: 10,
    marginRight: 10
  },
  serviceButton: {
    background: '#eee', // override CSS
    color: 'black',
    // shrinking:
    width: '12em',
    fontSize: 12,
    padding: 8
  }
};


/*
Pure UI form for taking notes about an event, tracking its own local state
and submitting it to prop callbacks.
*/

class TakeNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventNoteTypeId: null,
      text: null      
    }
  }
  
  // Focus on note-taking text area when it first appears.
  componentDidMount(prevProps, prevState) {
    this.textareaRef.focus();
  }

  onChangeText(event) {
    this.setState({ text: event.target.value });
  }

  onClickNoteType(noteTypeId, event) {
    this.setState({ eventNoteTypeId: noteTypeId });
  }

  onClickCancel(event) {
    this.props.onCancel();
  }

  onClickSave(event) {
    var params = _.pick(this.state, 'eventNoteTypeId', 'text');
    this.props.onSave(params);
  }
  
  renderNoteHeader(header) {
    return (
      <div>
        <span style={styles.date}>{header.noteMoment.format('MMMM D, YYYY')}</span>
        <span style={styles.educator}>{header.educatorEmail}</span>
      </div>
    )
  }
  
  renderNoteButton(eventNoteTypeId){
    const eventNoteType = this.props.eventNoteTypesIndex[eventNoteTypeId];
    const borderDisplay = (this.state.eventNoteTypeId === eventNoteTypeId)
                  ? '4px solid rgba(49, 119, 201, 0.75)'
                  : '4px solid white';
    return (
      <button 
        className="btn note-type"
        onClick={this.onClickNoteType.bind(this, eventNoteTypeId)}
        tabIndex=-1
        style={merge(styles.serviceButton, {
                background: '#eee',
                outline: 0,
                border: borderDisplay                   
        })}>
        {eventNoteType.name}
      </button>
    )
  }
  
  render(){
    const renderNoteHeaderDisplay = this.renderNoteHeader(          
      noteMoment: this.props.nowMoment,
      educatorEmail: this.props.currentEducator.email
    );
    
    const requestStatePending = (this.props.requestState === 'pending') ? dom.span({}, 'Saving...') : null;
    const requestStateError = (this.props.requestState === 'error') ? dom.span({}, 'Try again!') : null;    
    
    return (
      <div className="TakeNotes" style={styles.dialogue}>      
        {renderNoteHeaderDisplay}
        <textarea 
          rows=10,
          style={styles.textarea},
          ref={function(ref) { this.textareaRef = ref; }.bind(this)},
          value={this.state.text},
          onChange={this.onChangeText}
        ></textarea>
        <div style={{ marginBottom: '5', marginTop: '20' }}>What are these notes from?</div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1' }}>
            {this.renderNoteButton(300)}
            {this.renderNoteButton(301)}          
          </div>
          <div style={{ flex: '1' }}>
            {this.renderNoteButton(302)}
          </div>
          <div style={{ flex: 'auto' }}>
            {this.renderNoteButton(304)}
          </div>          
        </div>
        <button style={{
            marginTop: 20,
            background: (this.state.eventNoteTypeId === null) ? '#ccc' : undefined
          }}           
          disabled={(this.state.eventNoteTypeId === null)},
          className='btn save',
          onClick={this.onClickSave}>Save Notes</button>
        <button className='btn save' style={styles.cancelTakeNotesButton} onClick={this.onClickCancel}>Cancel</button>
        {requestStatePending}
        {requestStateError}
      </div>
    )
  }
}

TakeNotes.propTypes = {
  nowMoment: React.PropTypes.object.isRequired,
  eventNoteTypesIndex: React.PropTypes.object.isRequired,
  onSave: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  currentEducator: React.PropTypes.object.isRequired,
  requestState: PropTypes.nullable(React.PropTypes.string.isRequired)
}

export default TakeNotes;
