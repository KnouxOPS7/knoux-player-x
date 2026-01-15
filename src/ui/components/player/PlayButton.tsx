import React from 'react';
import { NeonButton } from '../neon/NeonButton';

// Using inline SVG for maximum portability (No external icon deps needed for basic compilation)
const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);
const PauseIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
);

interface PlayButtonProps {
    isPlaying: boolean;
    onClick: () => void;
}

export const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onClick }) => {
    return (
        <NeonButton 
            variant="ghost" 
            className="play-btn" 
            onClick={onClick}
            aria-label={isPlaying ? "Pause" : "Play"}
        >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </NeonButton>
    );
};
