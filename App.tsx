import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlaybackState, MediaFile, Settings, LogEntry } from './types';
import { LANGUAGES } from './localization';
import { engine } from './media-engine';
import { ConfigEngine } from './config-engine';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Settings as SettingsIcon, List, Info, Maximize, X, 
  ChevronRight, Monitor, Cpu, Terminal
} from 'lucide-react';

const DEFAULT_SETTINGS: Settings = {
  appearance: {
    theme: 'Dark (Neon)',
    uiOpacity: 0.9,
    blurStrength: 0.7,
    accentColor: '#00d9ff',
    showThumbnails: true,
    compactMode: false,
    autoHideControls: true,
    alwaysShowMenuBar: true,
    rememberWindowPosition: true,
    language: 'en',
  },
  performance: {
    hardwareAccel: 'Auto',
    frameDropping: true,
    hwDecode: true,
    hwRender: true,
    decoderThreads: 8,
    cacheSize: 512,
    preloadNext: true,
  },
  audio: {
    outputDevice: 'Default Output',
    channelLayout: 'Stereo',
    defaultVolume: 80,
    rememberVolume: true,
    startMuted: false,
    normalization: false,
    equalizerPreset: 'Flat',
    equalizerBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  video: {
    aspectRatio: 'Auto',
    deinterlace: 'Auto',
    autoRotate: true,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    gamma: 1.0,
    screenshotFormat: 'PNG',
  },
  subtitles: {
    autoLoad: true,
    fontFamily: 'Inter',
    fontSize: 24,
    textColor: '#ffffff',
    outlineColor: '#000000',
    outlineWidth: 2,
    bgOpacity: 40,
    bold: true,
    italic: false,
    position: 'Bottom',
    margin: 30,
  },
};

// --- Specialized UI Components ---

const Panel: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; isRtl?: boolean }> = ({ title, onClose, children, isRtl }) => (
  <div className={`fixed top-14 bottom-28 ${isRtl ? 'left-6' : 'right-6'} w-96 glass z-40 rounded-3xl overflow-hidden flex flex-col shadow-2xl border-white/10 animate-fade-in`}>
    <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
      <h3 className="font-black text-[10px] tracking-[0.2em] uppercase text-[#00d9ff] neon-text-blue">{title}</h3>
      <button onClick={onClose} className="hover:text-red-400 transition-colors opacity-60"><X size={18} /></button>
    </div>
    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm custom-scrollbar">
      {children}
    </div>
  </div>
);

const SettingsDialog: React.FC<{ isOpen: boolean; onClose: () => void; settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>>; lang: string }> = ({ isOpen, onClose, settings, setSettings, lang }) => {
  const [activeTab, setActiveTab] = useState('appearance');
  if (!isOpen) return null;

  const t = LANGUAGES[lang].settings;
  const p = LANGUAGES[lang].panels;

  const updateSetting = (category: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
  };

  const tabs = [
    { id: 'appearance', icon: <Monitor size={18}/>, label: t.appearance },
    { id: 'performance', icon: <Cpu size={18}/>, label: t.performance },
    { id: 'audio', icon: <Volume2 size={18}/>, label: t.audio },
    { id: 'video', icon: <Play size={18}/>, label: t.video },
    { id: 'subtitles', icon: <Terminal size={18}/>, label: t.subtitles },
  ];

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-5xl h-[700px] glass rounded-[40px] overflow-hidden flex flex-col shadow-2xl border-white/10">
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-10 bg-white/5">
          <h2 className="text-xl font-black tracking-[0.4em] text-[#00d9ff] uppercase">{t.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-white/10 bg-black/40 p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#00d9ff]/20 text-[#00d9ff] neon-blue shadow-[0_0_15px_rgba(0,217,255,0.2)]' : 'hover:bg-white/5 opacity-50'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 p-12 overflow-y-auto bg-black/20 custom-scrollbar">
            {activeTab === 'appearance' && (
              <div className="space-y-10">
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00d9ff] mb-6">Interface Customization</h4>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-bold opacity-40 uppercase"><span>UI Opacity</span><span>{Math.round(settings.appearance.uiOpacity * 100)}%</span></div>
                      <input type="range" className="w-full" min="0.1" max="1" step="0.05" value={settings.appearance.uiOpacity} onChange={e => updateSetting('appearance', 'uiOpacity', parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-bold opacity-40 uppercase"><span>Blur Strength</span><span>{Math.round(settings.appearance.blurStrength * 100)}%</span></div>
                      <input type="range" className="w-full" min="0" max="1" step="0.05" value={settings.appearance.blurStrength} onChange={e => updateSetting('appearance', 'blurStrength', parseFloat(e.target.value))} />
                    </div>
                  </div>
                </section>
                <section className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'compactMode', label: 'Compact UI Mode' },
                    { key: 'autoHideControls', label: 'Auto-Hide Playback Bar' },
                    { key: 'alwaysShowMenuBar', label: 'Always Visible Top Menu' },
                    { key: 'rememberWindowPosition', label: 'Save Instance State' }
                  ].map(opt => (
                    <label key={opt.key} className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:border-[#00d9ff]/30 transition-all">
                      <input type="checkbox" className="w-5 h-5 rounded-lg accent-[#00d9ff]" checked={settings.appearance[opt.key as keyof typeof settings.appearance] as boolean} onChange={e => updateSetting('appearance', opt.key, e.target.checked)} />
                      <span className="text-xs font-bold opacity-70">{opt.label}</span>
                    </label>
                  ))}
                </section>
              </div>
            )}
            {activeTab === 'video' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00d9ff] mb-6">Processing Pipeline</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold opacity-40 uppercase">Deinterlace Engine</label>
                      <select className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-[#00d9ff]" value={settings.video.deinterlace} onChange={e => updateSetting('video', 'deinterlace', e.target.value)}>
                        <option>Off</option><option>Auto</option><option>Blend</option><option>Bob</option><option>Yadif</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold opacity-40 uppercase">Aspect Ratio Policy</label>
                      <select className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-[#00d9ff]" value={settings.video.aspectRatio} onChange={e => updateSetting('video', 'aspectRatio', e.target.value)}>
                        <option>Auto</option><option>16:9</option><option>4:3</option><option>21:9</option><option>Stretch</option>
                      </select>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
        <div className="h-20 border-t border-white/10 flex items-center justify-end px-12 space-x-6 bg-white/5">
          <button onClick={onClose} className="px-10 py-3 glass rounded-2xl text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Discard</button>
          <button onClick={async () => { await ConfigEngine.saveSettings(settings); onClose(); }} className="px-10 py-3 bg-[#00d9ff] text-black font-black rounded-2xl text-xs uppercase tracking-widest shadow-[0_0_20px_#00d9ff44] hover:neon-blue active:scale-95 transition-all">Commit</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Engine Interface ---

export default function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<MediaFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playbackState, setPlaybackState] = useState(PlaybackState.Stopped);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [osdMessage, setOsdMessage] = useState<string | null>(null);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [hoverSeekPos, setHoverSeekPos] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const osdTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = LANGUAGES[lang];
  const isRtl = lang === 'ar';
  const currentFile = playlist[currentIndex];

  const addLog = useCallback((level: LogEntry['level'], module: string, message: string) => {
    setLogs(prev => [{ timestamp: new Date().toLocaleTimeString(), level, module, message }, ...prev].slice(0, 50));
  }, []);

  const showOSD = useCallback((msg: string) => {
    setOsdMessage(msg);
    if (osdTimeoutRef.current) window.clearTimeout(osdTimeoutRef.current);
    osdTimeoutRef.current = window.setTimeout(() => setOsdMessage(null), 1500);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaybackState(PlaybackState.Playing);
      showOSD("PLAY");
    } else {
      videoRef.current.pause();
      setPlaybackState(PlaybackState.Paused);
      showOSD("PAUSE");
    }
  }, [showOSD]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = val;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val / 100;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        name: f.name,
        url: URL.createObjectURL(f),
        type: (f.type.startsWith('audio') ? 'audio' : 'video') as 'audio' | 'video',
        resolution: '4K Native',
        codec: 'HEVC / 10-bit'
      }));
      setPlaylist(prev => [...prev, ...newFiles]);
      if (currentIndex === -1) setCurrentIndex(0);
      addLog('INFO', 'MediaEngine', `Imported ${files.length} native files.`);
      showOSD("LOADED");
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    engine.bind(v);
    const onTime = () => setProgress(v.currentTime);
    const onDuration = () => setDuration(v.duration);
    const onProgress = () => { if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1)); };
    const onEnded = () => { if (currentIndex < playlist.length - 1) setCurrentIndex(prev => prev + 1); };
    
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onDuration);
    v.addEventListener('progress', onProgress);
    v.addEventListener('ended', onEnded);
    
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onDuration);
      v.removeEventListener('progress', onProgress);
      v.removeEventListener('ended', onEnded);
    };
  }, [currentIndex, playlist.length]);

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className={`h-screen flex flex-col relative overflow-hidden bg-[#010206] text-white selection:bg-[#00d9ff] selection:text-black ${isRtl ? 'rtl' : ''}`}>
      {/* Top Menu Bar */}
      <div className={`h-12 glass border-b border-white/5 flex items-center px-8 z-50 transition-transform ${settings.appearance.alwaysShowMenuBar ? 'translate-y-0' : '-translate-y-full hover:translate-y-0'}`}>
        <div className="font-black text-[10px] tracking-[0.6em] text-[#00d9ff] neon-text-blue mr-10 uppercase flex items-center">
          <span className="w-2 h-2 rounded-full bg-[#00d9ff] mr-3 animate-pulse shadow-[0_0_10px_#00d9ff]" />
          KNOX PLAYER X™
        </div>
        <div className="flex space-x-8">
          {['file', 'playback', 'audio', 'video', 'subtitles'].map(m => (
            <button key={m} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 hover:opacity-100 hover:text-[#00d9ff] transition-all">
              {t.menu[m as keyof typeof t.menu]}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-6">
          <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="text-[9px] font-black border-2 border-white/10 px-4 py-1 rounded-xl hover:border-[#00d9ff] hover:text-[#00d9ff] transition-all">
            {lang.toUpperCase()}
          </button>
          <div className="flex space-x-3">
             <div className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 transition-colors cursor-pointer" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500 transition-colors cursor-pointer" />
             <div className="w-3 h-3 rounded-full bg-green-500/20 hover:bg-green-500 transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Primary Media Viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {currentFile ? (
          <div className="w-full h-full relative group">
            <video 
              ref={videoRef} 
              src={currentFile.url} 
              className="w-full h-full object-contain"
              onClick={handlePlayPause}
              style={{ 
                filter: `brightness(${1 + settings.video.brightness / 100}) contrast(${1 + settings.video.contrast / 100}) saturate(${1 + settings.video.saturation / 100}) hue-rotate(${settings.video.hue}deg)`,
                aspectRatio: settings.video.aspectRatio === '16:9' ? '16/9' : settings.video.aspectRatio === '4:3' ? '4/3' : 'auto'
              }}
            />
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <Play size={80} className="mx-auto mb-12 opacity-5 scale-150 rotate-12 text-[#00d9ff]" />
            <h2 className="text-4xl font-thin tracking-[1em] uppercase opacity-20">OFFLINE MEDIA ENGINE</h2>
            <p className="mt-6 text-[10px] font-black tracking-widest opacity-10 uppercase">Hardware Accelerated Local Core</p>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="mt-12 px-16 py-4 glass rounded-[30px] text-[10px] font-black tracking-[0.5em] hover:neon-blue hover:text-[#00d9ff] border-white/10 active:scale-95 transition-all"
            >
              MOUNT LOCAL DISK
            </button>
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} accept="video/*,audio/*" />
          </div>
        )}

        {/* Library Sidebar Overlay */}
        {activePanel === 'playlist' && (
          <Panel title={t.panels.playlist_title} onClose={() => setActivePanel(null)} isRtl={isRtl}>
            {playlist.length === 0 && <div className="py-20 text-center opacity-20 text-[10px] font-bold uppercase italic">Queue Empty</div>}
            <div className="space-y-3">
              {playlist.map((f, i) => (
                <div 
                  key={f.id} 
                  onClick={() => setCurrentIndex(i)} 
                  className={`p-5 rounded-3xl cursor-pointer transition-all border ${i === currentIndex ? 'bg-[#00d9ff]/10 border-[#00d9ff]/40 text-[#00d9ff]' : 'hover:bg-white/5 border-transparent'}`}
                >
                  <div className="text-xs font-black truncate tracking-tighter mb-1">{f.name}</div>
                  <div className="text-[9px] opacity-40 uppercase font-bold tracking-widest">{f.codec} • {f.resolution}</div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* Diagnostics Engine Overlay */}
        {activePanel === 'info' && (
          <Panel title={t.panels.info_title} onClose={() => setActivePanel(null)} isRtl={isRtl}>
            {currentFile ? (
              <div className="space-y-8">
                <section className="p-6 glass rounded-3xl border-[#00d9ff]/20 bg-[#00d9ff]/5">
                   <div className="text-[10px] font-black uppercase tracking-widest text-[#00d9ff] mb-2">Engine Status</div>
                   <div className="text-2xl font-black tracking-tighter">RUNNING - HW: NVDEC</div>
                </section>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="text-[9px] font-bold opacity-30 uppercase">Codec</label><div className="text-xs font-black">{currentFile.codec}</div></div>
                  <div><label className="text-[9px] font-bold opacity-30 uppercase">Resolution</label><div className="text-xs font-black">{currentFile.resolution}</div></div>
                </div>
                <section className="pt-6 border-t border-white/5">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-[#00d9ff] mb-4">Diagnostics Console</h4>
                  <div className="h-48 overflow-y-auto font-mono text-[9px] space-y-2 opacity-50 px-2 custom-scrollbar">
                    {logs.map((log, i) => (
                      <div key={i} className="flex space-x-3">
                        <span className="text-white/20">[{log.timestamp}]</span>
                        <span className={log.level === 'ERROR' ? 'text-red-400' : 'text-[#00d9ff]'}>{log.level}</span>
                        <span className="truncate">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : <div className="text-center py-20 opacity-20 uppercase font-black tracking-widest text-[10px]">Engine Idle.</div>}
          </Panel>
        )}

        {/* OSD Logic */}
        {osdMessage && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass px-14 py-10 rounded-[50px] z-[110] border-[#00d9ff]/30 shadow-[0_0_80px_#00d9ff22]">
            <div className="text-5xl font-black text-[#00d9ff] drop-shadow-2xl">{osdMessage}</div>
          </div>
        )}
      </div>

      {/* Advanced Seek Bar Engine */}
      <div 
        className="h-2 bg-white/5 relative group hover:h-8 transition-all cursor-pointer z-50 overflow-visible"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const pct = Math.max(0, Math.min(1, x / rect.width));
          setHoverSeekTime(pct * (duration || 0));
          setHoverSeekPos(x);
        }}
        onMouseLeave={() => setHoverSeekTime(null)}
      >
        <div className="absolute inset-0 bg-white/10 w-full" />
        <div className="h-full bg-[#00d9ff]/20 absolute opacity-30 pointer-events-none" style={{ width: `${(buffered / (duration || 1)) * 100}%` }} />
        <div className="h-full bg-[#00d9ff] absolute shadow-[0_0_25px_#00d9ff] pointer-events-none" style={{ width: `${(progress / (duration || 1)) * 100}%` }} />
        <input type="range" className="absolute inset-0 w-full opacity-0 z-10 cursor-pointer" min="0" max={duration || 100} step="0.1" value={progress} onChange={handleSeek} />
        
        {hoverSeekTime !== null && (
          <div className="absolute bottom-12 glass px-5 py-2 rounded-2xl text-[12px] text-[#00d9ff] font-black -translate-x-1/2 shadow-2xl pointer-events-none border-[#00d9ff]/30" style={{ left: hoverSeekPos }}>
            {formatTime(hoverSeekTime)}
          </div>
        )}
      </div>

      {/* Primary Control Console */}
      <div className={`h-28 glass border-t border-white/5 flex items-center justify-between px-12 z-50 transition-transform ${settings.appearance.compactMode && playbackState === PlaybackState.Playing ? 'translate-y-full hover:translate-y-0' : 'translate-y-0'}`}>
        <div className="flex items-center space-x-12">
          <div className="flex items-center space-x-6">
            <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} className="opacity-30 hover:opacity-100 hover:text-[#00d9ff] transition-all"><SkipBack size={24} /></button>
            <button 
              onClick={handlePlayPause} 
              className="w-16 h-16 glass rounded-[35px] flex items-center justify-center hover:neon-blue border-[#00d9ff]/20 bg-[#00d9ff]/10 transition-all transform active:scale-95"
            >
              {playbackState === PlaybackState.Playing ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button onClick={() => setCurrentIndex(prev => Math.min(playlist.length - 1, prev + 1))} className="opacity-30 hover:opacity-100 hover:text-[#00d9ff] transition-all"><SkipForward size={24} /></button>
          </div>
          
          <div className="flex items-center space-x-6 group w-40">
            <button onClick={() => { setIsMuted(!isMuted); if (videoRef.current) videoRef.current.muted = !isMuted; }} className={`transition-all ${isMuted ? 'text-red-500' : 'opacity-30 hover:opacity-100'}`}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input type="range" className="w-full accent-[#00d9ff] opacity-40 group-hover:opacity-100 transition-all h-1.5" value={volume} onChange={handleVolumeChange} />
          </div>
        </div>

        {/* Metadata Engine Clock */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="font-mono text-3xl tracking-widest font-black text-[#00d9ff]">
            {formatTime(progress)} <span className="text-white/10 mx-2">/</span> <span className="text-white/40">{formatTime(duration)}</span>
          </div>
          <div className="flex items-center space-x-4 mt-2 px-6 py-1.5 glass rounded-full border-white/5 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Rate</span>
            <select className="bg-transparent text-[10px] border-none outline-none text-[#00d9ff] font-black cursor-pointer" value={playbackSpeed} onChange={(e) => {
              const s = parseFloat(e.target.value); setPlaybackSpeed(s); if(videoRef.current) videoRef.current.playbackRate = s; showOSD(`${s}x`);
            }}>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => <option key={s} value={s} className="bg-black">{s}x</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <button onClick={() => containerRef.current?.requestFullscreen()} className="p-3 opacity-30 hover:opacity-100 hover:text-[#00d9ff] transition-all"><Maximize size={24} /></button>
          <div className="flex items-center glass p-2 rounded-[25px] space-x-2 border-white/10">
            <button onClick={() => setActivePanel(p => p === 'playlist' ? null : 'playlist')} className={`p-4 rounded-2xl transition-all ${activePanel === 'playlist' ? 'bg-[#00d9ff] text-black shadow-lg shadow-[#00d9ff44]' : 'opacity-30 hover:opacity-80'}`}><List size={20} /></button>
            <button onClick={() => setActivePanel(p => p === 'info' ? null : 'info')} className={`p-4 rounded-2xl transition-all ${activePanel === 'info' ? 'bg-[#00d9ff] text-black shadow-lg shadow-[#00d9ff44]' : 'opacity-30 hover:opacity-80'}`}><Info size={20} /></button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-4 opacity-30 hover:opacity-100 hover:rotate-90 transition-all duration-700 hover:text-[#00d9ff]"><SettingsIcon size={20} /></button>
          </div>
        </div>
      </div>

      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} setSettings={setSettings} lang={lang} />
    </div>
  );
}
