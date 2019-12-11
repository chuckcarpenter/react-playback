import React from 'react';

const DurationFeedback = props => {
  const { curTime, playing } = props;

  return (
    <text
      className='audioplayer-feedback'
      transform='translate(0 15)'
      textAnchor='middle'
    >
      <tspan id='text' className='audioplayer-timer play-pause-1' x='4'>
        {curTime}
      </tspan>
      <tspan className='audioplayer-action play-pause-1' x='0'>
        {playing === true ? 'pause' : 'play'}
      </tspan>
    </text>
  );
};

export default DurationFeedback;
