import React from 'react';
import moment from 'moment';

import Educator from './Educator';

const styles = {
  note: {
    border: '1px solid #eee',
    padding: 15,
    marginTop: 10,
    marginBottom: 10
  },
  date: {
    display: 'inline-block',
    width: '11em',
    paddingRight: 10,
    fontWeight: 'bold'
  },
  educator: {
    paddingLeft: 5,
    display: 'inline-block'
  },
  noteText: {
    marginTop: 5,
    padding: 0,
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 14,
    whiteSpace: 'pre-wrap'
  }
};

class NoteCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: props.text,
      isDirty: true
    }
  }
  
  onBlurText(event) {
    if (!this.state.isDirty) {
      return;
    }

    const params = {
      id: this.props.eventNoteId,
      eventNoteTypeId: this.props.eventNoteTypeId,
      text: this.state.text
    };

    this.props.onSave(params);
    this.setState({isDirty: false})
  }

  // Different user agents generate different HTML to achieve the same visual
  // rendering in contenteditable elements. In other words, `htmlToText` may
  // return the same plain text for different HTML strings, which means
  // `textToSanitizedHTML(htmlToText(html))` is not guaranteed to return `html`.
  // For our purposes, there's no need to normalize the HTML content between
  // page loads. Instead, we simply need to make sure that (1) the HTML is
  // sanitized, and (2) the HTML converted to plain text matches the next
  // state of the text.
//     shouldComponentUpdate(nextProps, nextState) {
//       var currentHTML = this.contentEditableEl.innerHTML;

//       return currentHTML !== htmlToSanitizedHTML(currentHTML)
//         || nextState.text !== htmlToText(currentHTML);
//     }

//     componentDidUpdate() {
//       var expectedHTML = textToSanitizedHTML(this.state.text);

//       if (
//         this.contentEditableEl
//         && expectedHTML !== this.contentEditableEl.innerHTML
//       ) {
//        this.contentEditableEl.innerHTML = expectedHTML;
//       }
//     }

//     onModifyText(){
//       var text = htmlToText(this.contentEditableEl.innerHTML);

//       if (text !== this.lastText) {
//         this.setState({ text: text });
//         this.isDirty = true;
//       }

//       this.lastText = text;
//     }
  
  render(){
    const {noteMoment, badge, educatorsIndex, educatorId} = this.props;
    
    return (
      <div className="NoteCard" style={styles.note}>
        <div>
          <span className="date" style={styles.date}>{noteMoment.format('MMMM D, YYYY')}</span>
          {badge}
          <span style={styles.educator}>
            <Educator educator={educatorsIndex[educatorId]} />  
          </span>
          <div className="note-text" style={styles.noteText}>
              {/* contentEditable: true,
                className: 'note-text',
                style: styles.noteText,
                ref: function(ref) { this.contentEditableEl = ref; }.bind(this),
                dangerouslySetInnerHTML: { __html: textToSanitizedHTML(this.state.text) },
                onInput: this.onModifyText,
                onKeyUp: this.onModifyText, // For IE compatibility.
                onPaste: this.onModifyText,
                onBlur: this.onBlurText  
                */}
          </div>
        </div>
      </div>
    )
  }
}

NoteCard.propTypes = {
  noteMoment: React.PropTypes.instanceOf(moment).isRequired,
  educatorId: React.PropTypes.number.isRequired,
  badge: React.PropTypes.element.isRequired,
  text: React.PropTypes.string.isRequired,
  onSave: React.PropTypes.func,
  eventNoteId: React.PropTypes.number,
  eventNoteTypeId: React.PropTypes.number,
  educatorsIndex: React.PropTypes.object.isRequired
}

export default NoteCard;
