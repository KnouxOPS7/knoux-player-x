import React from 'react';

interface VolumeProps {
    volume: number;
    isMuted: boolean;
    onChange: (volume: number) => void;
    onToggleMute: () => void;
}

export const VolumeSlider: React.FC<VolumeProps> = ({ volume, isMuted, onChange, onToggleMute }) => {
    return (
        <div className="knoux-volume">
            <button type="button" className="icon" onClick={onToggleMute} aria-label="Toggle mute">
                {isMuted ? "🔇" : "🔊"}
            </button>
            <input 
                type="range" 
                min={0} max={1} step={0.05} 
                value={isMuted ? 0 : volume} 
                onChange={(event) => onChange(Number(event.target.value))}
                className="vol-input"
            />
        </div>
    );
};
