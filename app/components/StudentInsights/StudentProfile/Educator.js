import React from 'react';

/*
Canonical display of an educator, showing their name as a link to email them.
*/
class Educator extends React.Component {
  constructor(props){
    super(props);
    this.displayName = 'Educator';
  }
  // Turns SIS format (Watson, Joe) -> Joe Watson  
  educatorName(){
    const {educator} = this.props;
    if (educator.full_name === null) return educator.email.split('@')[0] + '@';
    var parts = educator.full_name.split(', ');
    return parts[1] + ' ' + parts[0];    
  }
  
  render(){
    const {educator} = this.props;
    const educatorName = this.educatorName(educator);    
    
    return (
      <a href={"mailto:"+educator.email} className="Educator">{educatorName}</a>  
    );
  }
}

Educator.propTypes = {
  educator: React.PropTypes.shape({
    full_name: PropTypes.nullable(React.PropTypes.string.isRequired),
    email: React.PropTypes.string.isRequired
  }).isRequired  
};

export default Educator;
 