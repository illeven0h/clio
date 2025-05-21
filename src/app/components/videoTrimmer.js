'use client';

import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';

const MIN_DURATION = 1;

function VideoTrimmerUI(props, ref) {
  const {
    src,
    loop = true,
    minDuration = MIN_DURATION,
    onSelected,
  } = props;

  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [thumbs, setThumbs] = useState([0, 0]);
  const [playbackTime, setPlaybackTime] = useState(0);

  useImperativeHandle(ref, () => ({
    getSelection: () => thumbs,
  }));

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setThumbs([0, dur]);
    }
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current?.currentTime || 0;
    setPlaybackTime(current);
    if (current > thumbs[1]) {
      if (loop) {
        videoRef.current.currentTime = thumbs[0];
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleSliderChange = (e, thumbIndex) => {
    const value = parseFloat(e.target.value);
    let [start, end] = thumbs;

    if (thumbIndex === 0) {
      start = Math.min(value, end - minDuration);
    } else {
      end = Math.max(value, start + minDuration);
    }

    setThumbs([start, end]);
    videoRef.current.currentTime = start;
    if (onSelected) {
      onSelected(start, end);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <video
        ref={videoRef}
        src={src}
        controls
        width="100%"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />
      {duration > 0 && (
        <div style={{ marginTop: 16 }}>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={thumbs[0]}
            onChange={(e) => handleSliderChange(e, 0)}
          />
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={thumbs[1]}
            onChange={(e) => handleSliderChange(e, 1)}
          />
          <div style={{ marginTop: 8 }}>
            Selected Range: {thumbs[0].toFixed(1)}s - {thumbs[1].toFixed(1)}s
          </div>
        </div>
      )}
    </div>
  );
}

export default forwardRef(VideoTrimmerUI);
