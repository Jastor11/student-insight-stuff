import React from 'react';
import ReactModal from 'react-modal';

class HelpBubble extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen: false
    };
    
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.renderModal = this.renderModal.bind(this);    
  }
  
  closeModal(e){
    this.setState({modalIsOpen: false});
    e.preventDefault();    
  }
  
  openModal(e){
    this.setState({modalIsOpen: true});
    e.preventDefault();    
  }
  
  componentWillMount(){
    // This needs to be called for some reason, and we need to do it by the time the DOM exists.
    ReactModal.setAppElement(document.body);
  }
  
  render(){
    const renderedModal = this.renderModal();
    
    return (
      <div style={{display: 'inline', marginLeft: '10'}}>
        <a href="#" onClick={this.openModal} style={{fontSize: '12', outline: 'none'}}>
          {renderedModal}
        </a>
      </div>
    )
  }
  
  renderModal(){
    const {modalIsOpen} = this.state;
    const {content, title} = this.props;
    // There are three ways to close a modal dialog: click on one of the close buttons,
    // click outside the bounds, or press Escape.    
    return (
      <ReactModal isOpen={modalIsOpen} onRequestClose={this.closeModal} >
        <div className="modal-help">
          <div style={{borderBottom: '1px solid #333', paddingBottom: '10', marginBottom: '20'}}>
            <h1 style={{display: 'inline-block'}}>{title}</h1>
            <a href="#" onClick={this.closeModal} style={{float: 'right', cursor: 'pointer'}}>(ESC)</a>
          </div>
          <div>{content}</div>
          <div style={{flex: '1', minHeight: '20'}}></div>    
          <div>
            <a href="#" onClick={this.closeModal} style={{cursor: 'pointer'}}>(close)</a>
          </div>          
        </div>
      </ReactModal>
    )
  }  
}

HelpBubble.propTypes = {
  title: React.PropTypes.string.isRequired, // e.g. 'What is a Note?'
  content: React.PropTypes.object.isRequired, // React DOM objects which will be displayed in the modal text box.
  teaserText: React.PropTypes.string.isRequired // text displayed before the user clicks, e.g. 'Find out more.'
}

export default HelpBubble;