import React from 'react';
import { formatTime } from '../../../utils/time';

export const TimeDisplay: React.FC<{ current: number, duration: number }> = ({ current, duration }) => {
    return (
        <div className="knoux-time text-sm font-mono text-cyan-400/80 select-none ml-3">
            <span>{formatTime(current)}</span>
            <span className="mx-1 opacity-50">/</span>
            <span className="opacity-70">{formatTime(duration)}</span>
        </div>
    );
};
