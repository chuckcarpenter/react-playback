import React from 'react';

const Indicator = props => {
  const { event, type, value } = props;
  const classValue = `audioplayer-indicator audioplayer-${type}`;

  return (
    <path
      onMouseLeave={event}
      onMouseDown={event}
      onMouseMove={event}
      d={value}
      className={classValue}
      transform='translate(0, 0)'
      draggable='false'
    />
  );
};

export default Indicator;
