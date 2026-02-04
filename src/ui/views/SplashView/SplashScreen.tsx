/**
 * Project: KNOUX Player X™
 * Layer: UI -> Splash Screen
 */

import React from "react";
import LoadingAnimation from "./LoadingAnimation";

import "../../../styles/views/SplashView.scss";

const SplashScreen: React.FC = () => {
    return (
        <div className="splash-screen">
            <LoadingAnimation />
            <h2>KNOUX Player X</h2>
            <p>Initializing media systems...</p>
        </div>
    );
};

export default SplashScreen;
