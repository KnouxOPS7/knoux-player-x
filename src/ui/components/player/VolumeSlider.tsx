import React from 'react';

interface VolumeProps {
    volume: number;
    isMuted: boolean;
}

export const VolumeSlider: React.FC<VolumeProps> = ({ volume, isMuted }) => {
    return (
        <div className="knoux-volume">
            <span className="icon">🔊</span>
            <input 
                type="range" 
                min={0} max={1} step={0.05} 
                value={isMuted ? 0 : volume} 
                className="vol-input"
            />
        </div>
    );
};
