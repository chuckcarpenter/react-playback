import { useEffect, useRef, useState } from 'react';

let trackAt = 0;

const formatSeconds = time => {
  const mins = Math.floor(time / 60);

  let secs = (time - mins * 60).toFixed(0);

  if (secs.toString().length < 2) {
    secs = `0${secs}`;
  }

  return `${mins}:${secs}`;
};

const useAudioPlayer = () => {
  const [clickedTime, setClickedTime] = useState();
  const [curTime, setCurTime] = useState('0:00');
  const [duration, setDuration] = useState();
  const [scrubber, setScrubber] = useState();
  const [playing, setPlaying] = useState(false);
  const [progressIndicator, setProgressIndicator] = useState('');
  const [startTime, setStartTime] = useState();

  const requestRef = useRef();

  const animate = () => {
    const drawStart = Date.now();
    const diff = drawStart - startTime;
    const radius = 100;
    const t = 60;

    if (playing && trackAt < 2 * Math.PI) {
      if (diff <= t) {
        let theta = (2 * Math.PI * (diff / 1000)) / duration;

        trackAt += theta;
        drawArc(trackAt, radius, 'progress');
        // triggers animation frame
        setStartTime(drawStart);
      }
    }
  };

  const arcAngle = (x, y, deg) => {
    const radius = Math.sqrt(x * x + y * y),
      deltaY = y + radius;

    let theta = Math.acos(
      1 - (x * x + deltaY * deltaY) / (2 * radius * radius)
    );

    if (x < 0) {
      theta = 2 * Math.PI - theta;
    }

    // theta measured in radians.
    return deg ? theta * (180 / Math.PI) : theta;
  };

  const drawArc = (theta, r, el) => {
    const zero = 1e-10;

    let largeArcFlag = theta > Math.PI ? 1 : 0, // Are we going around the long way (1) or the short way (0)
      sweepFlag = theta < 2 * Math.PI ? 1 : 0, // Following a negative angle (0) or a positive one (1)
      x = r * Math.sin(theta); // Where along the x-axis the arc endpoint is

    if (Math.abs(x) <= zero) {
      x = 0;
    }

    let y = -(r * Math.cos(theta)); // Where along the y-axis the arc endpoint is

    const d = `M 0 -${r} v 0 A ${r} ${r} 1 ${largeArcFlag} ${sweepFlag} ${x} ${y}`;

    if (el === 'scrubber') {
      return setScrubber(d);
    }

    return setProgressIndicator(d);
  };

  const handleMouseEvent = evt => {
    let mousedown = [false, false, false];

    switch (evt.type) {
      case 'mouseleave':
        setScrubber('M 0 -100 v 0 A 100 100 1 1 1 0 -100');
        break;

      case 'mousedown':
      case 'mousemove':
        if (evt.type === 'mousedown') {
          mousedown[evt.button] = true;
        }

        if (mousedown[0]) {
          let dAttr = scrubber.split(' '),
            xArcStart = 0,
            yArcStart = -100,
            xTrack = parseFloat(dAttr[dAttr.length - 2], 10),
            yTrack = parseFloat(dAttr[dAttr.length - 1], 10),
            angle = arcAngle(xTrack, yTrack),
            arcAsRatio = angle / (2 * Math.PI);

          console.log(arcAsRatio);

          // this.scrubTo(arcAsRatio);
        }

        if (evt.type === 'mousemove') {
          let viewBox, translation, offsetX, offsetY, x, y, theta;

          viewBox = '-125 -125 250 250';
          viewBox = viewBox ? viewBox.split(' ') : [];

          translation = viewBox.slice(0, 2);
          if (translation.length !== 2) {
            translation = [0, 0];
          }

          offsetX = evt.nativeEvent.hasOwnProperty('offsetX')
            ? evt.offsetX
            : evt.nativeEvent.layerX;
          offsetY = evt.nativeEvent.hasOwnProperty('offsetY')
            ? evt.offsetY
            : evt.nativeEvent.layerY;

          x = offsetX + parseInt(translation[0], 10);
          y = offsetY + parseInt(translation[1], 10);

          theta = arcAngle(x, y);

          drawArc(theta, 100, 'scrubber');
        }
        break;

      case 'mouseup':
        mousedown[e.button] = false;
        break;
    }
  };

  const play = player => {
    player.play();

    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  useEffect(() => {
    requestRef.current = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(requestRef.current);
  }, [startTime]);

  useEffect(() => {
    const node = document.querySelector('.audioplayer-node');

    // state setters wrappers
    const setAudioData = () => {
      setDuration(node.duration);
      setCurTime(formatSeconds(node.currentTime));
    };

    const setAudioTime = () => setCurTime(formatSeconds(node.currentTime));

    // DOM listeners: update React state on DOM events
    node.addEventListener('loadeddata', setAudioData);
    node.addEventListener('timeupdate', setAudioTime);

    // React state listeners: update DOM on React state changes
    playing ? play(node) : node.pause();

    if (clickedTime && clickedTime !== curTime) {
      node.currentTime = clickedTime;
      setClickedTime(null);
    }

    return () => {
      node.removeEventListener('loadeddata', setAudioData);
      node.removeEventListener('timeupdate', setAudioTime);
    };
  });

  return {
    curTime,
    duration,
    formatSeconds,
    handleMouseEvent,
    playing,
    progressIndicator,
    scrubber,
    setPlaying,
    setProgressIndicator,
    setClickedTime
  };
};

export default useAudioPlayer;
