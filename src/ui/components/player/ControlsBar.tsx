/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Layer: UI Component
 * Purpose: Main overlay for video controls. Auto-hides on inactivity.
 */

import React, { useEffect, useState } from 'react';
import { NeonPanel } from '../neon/NeonPanel';
import { PlayButton } from './PlayButton';
import { SeekBar } from './SeekBar';
import { VolumeSlider } from './VolumeSlider';
import { TimeDisplay } from './TimeDisplay';

// Import Types and Hooks
import { useAppDispatch, useAppSelector } from '../../../state/hooks/index';
import { setPlaybackRate, setVolume, toggleMuted, togglePlay } from '../../../state/slices/playbackSlice'; 
import { PlayerStatus } from '../../../types/media';
import SpeedControl from './SpeedControl';

import '../../../styles/components/player/ControlsBar.scss';

interface ControlsBarProps {
    visible: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({ visible }) => {
    const dispatch = useAppDispatch();
    const playback = useAppSelector((state) => state.playback);

    const handlePlayToggle = () => {
        // Dispatch action which eventually triggers ipc -> native player
        dispatch(togglePlay());
    };

    const handleVolumeChange = (volume: number) => {
        dispatch(setVolume(volume));
    };

    const handleToggleMute = () => {
        dispatch(toggleMuted());
    };

    const handleSpeedChange = (rate: number) => {
        dispatch(setPlaybackRate(rate));
    };

    return (
        <div className={`knoux-controls-wrapper ${visible ? 'visible' : 'hidden'}`}>
            <NeonPanel className="controls-panel" height={80} glassOpacity={0.15}>
                
                {/* Row 1: Seek Bar */}
                <div className="seek-row">
                    <SeekBar 
                        current={playback.currentTime} 
                        duration={playback.duration} 
                        buffered={0} // To be implemented via native
                    />
                </div>

                {/* Row 2: Actions */}
                <div className="actions-row">
                    <div className="left-group">
                        <PlayButton isPlaying={playback.status === PlayerStatus.PLAYING} onClick={handlePlayToggle} />
                        <VolumeSlider
                            volume={playback.volume}
                            isMuted={playback.isMuted}
                            onChange={handleVolumeChange}
                            onToggleMute={handleToggleMute}
                        />
                        <TimeDisplay current={playback.currentTime} duration={playback.duration} />
                    </div>
                    
                    <div className="right-group">
                        <SpeedControl value={playback.playbackRate} onChange={handleSpeedChange} />
                    </div>
                </div>

            </NeonPanel>
        </div>
    );
};
