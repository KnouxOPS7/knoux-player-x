import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../../../state/hooks/index';
// import { seekTo } from '../../../state/slices/playbackSlice'; 

interface SeekBarProps {
    current: number;
    duration: number;
    buffered?: number;
}

export const SeekBar: React.FC<SeekBarProps> = ({ current, duration, buffered = 0 }) => {
    const progressPercent = duration > 0 ? (current / duration) * 100 : 0;
    
    // UI Local state for dragging effect optimization
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Dispatch seek action
    };

    return (
        <div className="knoux-seekbar">
            <div className="track-bg" />
            <div className="track-fill" style={{ width: `${progressPercent}%` }} />
            {/* Native range input overlay for interaction */}
            <input 
                type="range" 
                min={0} 
                max={duration} 
                step={0.1}
                value={current}
                onChange={handleSeek}
                className="seek-input"
            />
        </div>
    );
};
