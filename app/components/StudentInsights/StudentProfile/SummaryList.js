import React from 'react';

const SummaryList = ({title, elements}) => {
  const summaryListDisplay = elements.map( (element, index) => {
    return <li key={index}>{element}</li>
  });
  
  return (
    <div className="SummaryList" style={{paddingBottom: '10'}}>
      <div style={{fontWeight:'bold'}}>
        {title}
      </div>
      <ul>
        {summaryListDisplay}
      </ul>
    </div>
  )
}

export default SummaryList;
