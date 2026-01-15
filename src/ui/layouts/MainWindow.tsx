/**
 * ================================================================================
 * KNOUX Player X
 * ================================================================================
 * Project: KNOUX Player X
 * File: C:\Users\Aisha\Downloads\knox-player-x\src\ui\layouts\MainWindow.tsx
 * Role: Main Window Layout with Cinematic Intelligence Framework
 * Layer: UI
 * Author: SADEK ELGAZAR (KNOUX)
 * Status: FINALIZED
 * ================================================================================
 * 
 * This component implements the primary application window layout with:
 * 
 * - Custom title bar with window controls
 * - Responsive grid-based content area
 * - Glassmorphism UI with neon effects
 * - Dynamic theme adaptation
 * - Performance-optimized rendering
 * - Accessibility compliance
 * - Cross-platform compatibility
 * - Secure context integration
 * - State-aware layout management
 * - Micro-interaction polish
 */

import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import log from 'electron-log';

// Context hooks
import { useTheme } from '../../contexts/ThemeContext';
import { useLocalization } from '../../contexts/LocalizationContext';

// Components
import TitleBar from '../components/ui/TitleBar';
import Sidebar from '../components/ui/Sidebar';
import StatusBar from '../components/ui/StatusBar';

// Styles
import '../../styles/layouts/MainWindow.scss';

// Types
interface MainWindowProps {
  children: React.ReactNode;
  className?: string;
}

// Performance monitoring
import { measureRender } from '../../utils/performance';

const MainWindow: React.FC<MainWindowProps> = ({ children, className }) => {
  // Performance tracking
  const renderStart = performance.now();
  
  // Context hooks
  const { theme } = useTheme();
  const { t } = useLocalization();
  
  // State management
  const [isMaximized, setIsMaximized] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowFocused, setWindowFocused] = useState(true);
  
  // Refs
  const mainWindowRef = useRef<HTMLDivElement>(null);
  
  // Window state synchronization
  useEffect(() => {
    const updateWindowState = async () => {
      try {
        if (window.knoxAPI?.window?.isMaximized) {
          const maximized = await window.knoxAPI.window.isMaximized();
          setIsMaximized(maximized);
        }
      } catch (error) {
        log.error('Failed to update window state:', error);
      }
    };
    
    updateWindowState();
    
    // Set up window focus listeners
    const handleFocus = () => setWindowFocused(true);
    const handleBlur = () => setWindowFocused(false);
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
  
  // Theme application
  useEffect(() => {
    if (mainWindowRef.current) {
      mainWindowRef.current.style.setProperty('--window-theme-primary', theme.colors.primary);
      mainWindowRef.current.style.setProperty('--window-theme-secondary', theme.colors.secondary);
    }
  }, [theme]);
  
  // Performance measurement
  useEffect(() => {
    const renderTime = performance.now() - renderStart;
    measureRender('MainWindow', renderTime);
  });
  
  // Window control handlers
  const handleMinimize = async () => {
    try {
      if (window.knoxAPI?.window?.minimize) {
        await window.knoxAPI.window.minimize();
      }
    } catch (error) {
      log.error('Failed to minimize window:', error);
    }
  };
  
  const handleMaximize = async () => {
    try {
      if (window.knoxAPI?.window?.maximize) {
        await window.knoxAPI.window.maximize();
        setIsMaximized(!isMaximized);
      }
    } catch (error) {
      log.error('Failed to maximize window:', error);
    }
  };
  
  const handleClose = async () => {
    try {
      if (window.knoxAPI?.window?.close) {
        await window.knoxAPI.window.close();
      }
    } catch (error) {
      log.error('Failed to close window:', error);
    }
  };
  
  // Sidebar toggle handlers
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div 
      ref={mainWindowRef}
      className={classNames(
        'main-window',
        className,
        {
          'window-focused': windowFocused,
          'window-blurred': !windowFocused,
          'sidebar-visible': sidebarVisible,
          'sidebar-collapsed': sidebarCollapsed,
          'glassmorphism': theme.glassmorphism,
          'neon-effects': theme.neonEffects
        }
      )}
      role="main"
      aria-label={t('mainWindow.ariaLabel')}
    >
      {/* Custom Title Bar */}
      <TitleBar
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
        isMaximized={isMaximized}
        windowFocused={windowFocused}
        onToggleSidebar={toggleSidebar}
        sidebarVisible={sidebarVisible}
      />
      
      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Sidebar Navigation */}
        {sidebarVisible && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapse={toggleSidebarCollapse}
            className="main-sidebar"
          />
        )}
        
        {/* Primary Content */}
        <main 
          className={classNames(
            'primary-content',
            {
              'with-sidebar': sidebarVisible,
              'sidebar-collapsed': sidebarCollapsed
            }
          )}
          role="main"
        >
          {children}
        </main>
      </div>
      
      {/* Status Bar */}
      <StatusBar className="main-status-bar" />
      
      {/* Focus trap for accessibility */}
      <div 
        tabIndex={0} 
        onFocus={() => mainWindowRef.current?.focus()}
        className="focus-trap"
        aria-hidden="true"
      />
    </div>
  );
};

export default MainWindow;