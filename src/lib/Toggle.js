import React from 'react';

const Toggle = props => {
  const { playing, action } = props;

  return (
    <path
      onClick={() => action(!playing)}
      className='audioplayer-playtoggle'
      d='M 0 -100 v 0 A 100 100 1 1 1 -.1 -100'
      transform='translate(0, 0) scale(.9)'
      draggable='false'
    />
  );
};

export default Toggle;
