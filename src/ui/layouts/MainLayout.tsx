// Main Application Layout
// KNOUX Player X - Version 1.0.0

import React from 'react';
import { motion } from 'framer-motion';
import PlayerView from '../views/PlayerView/PlayerView';
import PlaylistView from '../views/PlaylistView/PlaylistView';
import SettingsView from '../views/SettingsView/SettingsView';
import ControlBar from '../components/player/ControlBar';
import GlassPanel from '../components/ui/GlassPanel';
import { useSettings } from '../../state/hooks/useSettings';

const MainLayout: React.FC = () => {
    const { settings } = useSettings();
    const [activeView, setActiveView] = useState<'player' | 'playlist' | 'settings'>('player');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <GlassPanel className="p-6">
                        {/* View Toggle */}
                        <div className="flex space-x-4 mb-6">
                            <button
                                onClick={() => setActiveView('player')}
                                className={px-4 py-2 rounded-lg transition-all }
                            >
                                Player
                            </button>
                            <button
                                onClick={() => setActiveView('playlist')}
                                className={px-4 py-2 rounded-lg transition-all }
                            >
                                Playlist
                            </button>
                            <button
                                onClick={() => setActiveView('settings')}
                                className={px-4 py-2 rounded-lg transition-all }
                            >
                                Settings
                            </button>
                        </div>

                        {/* Active View */}
                        <div className="min-h-[600px]">
                            {activeView === 'player' && <PlayerView />}
                            {activeView === 'playlist' && <PlaylistView />}
                            {activeView === 'settings' && <SettingsView />}
                        </div>
                    </GlassPanel>
                </motion.div>
            </div>

            {/* Global Control Bar */}
            <ControlBar />
        </div>
    );
};

export default MainLayout;
