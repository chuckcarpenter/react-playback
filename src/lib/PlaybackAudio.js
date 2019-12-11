import React from 'react';
import DurationFeedback from './DurationFeedback';
import Indicator from './Indicator';
import Toggle from './Toggle';
import useAudioPlayer from './useAudioPlayer';

// TODO: <Indicator type='scrubber' value={scrubber} />

const PlaybackAudio = ({ src = '' }) => {
  const {
    curTime,
    duration,
    formatSeconds,
    handleMouseEvent,
    playing,
    progressIndicator,
    setPlaying,
    setClickedTime,
    scrubber
  } = useAudioPlayer();

  return (
    <div className='audioplayer'>
      <svg
        className='audioplayer-ui audioplayer-ui--detail'
        preserveAspectRatio='xMidYMid'
        viewBox='-125 -125 250 250'
        draggable='false'
      >
        <Indicator
          event={handleMouseEvent}
          type='track'
          value='M 0 -100 v 0 A 100 100 1 1 1 -.1 -100'
        />
        <Indicator type='progress' value={progressIndicator} />
        <Indicator type='scrubber' value={scrubber} />

        <Toggle playing={playing} action={setPlaying} />

        <DurationFeedback
          curTime={curTime}
          duration={formatSeconds(duration)}
          playing={playing}
        />
      </svg>
      <audio className='audioplayer-node' src={src}></audio>
    </div>
  );
};

export default PlaybackAudio;
