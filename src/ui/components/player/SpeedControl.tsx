/**
 * Project: KNOUX Player X™
 * Layer: UI -> Speed Control
 */

import React from "react";

interface SpeedControlProps {
    value: number;
    onChange: (value: number) => void;
}

const SpeedControl: React.FC<SpeedControlProps> = ({ value, onChange }) => {
    return (
        <div className="speed-control">
            <label htmlFor="speed-select">Speed</label>
            <select
                id="speed-select"
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
            >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <option key={rate} value={rate}>
                        {rate}x
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SpeedControl;
