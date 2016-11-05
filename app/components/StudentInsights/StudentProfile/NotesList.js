import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import NoteCard from './NoteCard';
import FeedHelpers from '../../../helpers/FeedHelpers';

const styles = {
  noItems: {
    margin: 10
  },
  badge: {
    display: 'inline-block',
    background: '#eee',
    outline: '3px solid #eee',
    width: '10em',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10
  }
};

/*
Renders the list of notes.
*/


const NotesList = ({eventNoteTypesIndex, educatorsIndex, onSaveNote}) => {
  const mergedNotes = FeedHelpers.mergedNotes(props.feed);
  const displayedNotes = (mergedNotes.length === 0) 
    ? <div style={styles.noItems}>No Notes</div>
    : mergedNotes.map( mergedNote => {
      switch (mergedNote.type) {
        case 'event_notes': return renderEventNote(mergedNote)
        case 'deprecated_interventions': return renderDeprecatedIntervention(mergedNote)
      }
    }, this);
  
    const renderEventNoteTypeBadge = (eventNoteTypeId) => {
      var eventNoteType = eventNoteTypesIndex[eventNoteTypeId];
      if (eventNoteType === undefined) return null;
      return <span style={styles.badge}>{eventeNoteType.name}</span>
    }

    const renderEventNote = (eventNote) => {
      return (
        <NoteCard 
          key={['event_note', eventNote.id].join()},
          eventNoteId={eventNote.id},
          eventNoteTypeId={eventNote.event_note_type_id},
          noteMoment={moment.utc(eventNote.recorded_at)},
          badge={renderEventNoteTypeBadge(eventNote.event_note_type_id)},
          educatorId={eventNote.educator_id},
          text={eventNote.text},
          educatorsIndex={educatorsIndex},
          onSave={onSaveNote}        
        />
      )
    }

    // TODO(kr) support custom intervention type
    // This assumes that the `end_date` field is not accurate enough to be worth splitting
    // this out into two note entries.
    const renderDeprecatedIntervention = (deprecatedIntervention) => {
      const newBadge = <span style={styles.badge}>Old Intervention</span>
      return (
        <NoteCard 
          key={['deprecated_intervention', deprecatedIntervention.id].join()},
          noteMoment={moment.utc(deprecatedIntervention.start_date_timestamp)},
          badge={newBadge},
          educatorId={deprecatedIntervention.educator_id},
          text={_.compact([deprecatedIntervention.name, deprecatedIntervention.comment, deprecatedIntervention.goal]).join('\n')},
          educatorsIndex={educatorsIndex},       
        />
      );
    }
  
  return (
    <div className="NotesList">
      {displayedNotes}
    </div>
  )
}

NotesList.propTypes = {
//  feed: PropTypes.feed.isRequired,
  educatorsIndex: React.PropTypes.object.isRequired,
  eventNoteTypesIndex: React.PropTypes.object.isRequired,
  onSaveNote: React.PropTypes.func.isRequired
}

export default NotesList;
