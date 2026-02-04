/**
 * Project: KNOUX Player X™
 * Layer: UI -> Control Bar
 */

import React from "react";
import { ControlsBar } from "./ControlsBar";

const ControlBar: React.FC = () => {
    return (
        <div className="control-bar-container">
            <ControlsBar visible />
        </div>
    );
};

export default ControlBar;
