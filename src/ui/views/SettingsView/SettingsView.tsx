/**
 * Project: KNOUX Player X™
 * Layer: UI -> Settings View
 */

import React from "react";
import SettingsPanel from "../../components/settings/SettingsPanel";

import "../../../styles/views/SettingsView.scss";

const SettingsView: React.FC = () => {
    return (
        <section className="settings-view">
            <header>
                <h2>Settings</h2>
                <p>Manage application preferences</p>
            </header>
            <SettingsPanel />
        </section>
    );
};

export default SettingsView;
