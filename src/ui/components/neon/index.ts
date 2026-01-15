/**
 * Project: KNOUX Player X™
 * File: src/ui/components/neon/index.ts
 * Author: knoux
 * Purpose: Barrel export file for all neon glassmorphism UI components
 * Layer: Source -> UI -> Components -> Neon
 */

// Core Components
export { default as NeonButton } from './NeonButton';
export { default as NeonCard } from './NeonCard';
export { default as NeonPanel } from './NeonPanel';
export { default as NeonSlider } from './NeonSlider';
export { default as NeonInput } from './NeonInput';
export { default as NeonSwitch } from './NeonSwitch';
export { default as NeonProgress } from './NeonProgress';
export { default as NeonLoader } from './NeonLoader';
export { default as NeonTooltip } from './NeonTooltip';
export { default as NeonDialog } from './NeonDialog';

// Layout Components
export { default as NeonGrid } from './NeonGrid';
export { default as NeonContainer } from './NeonContainer';

// Navigation Components
export { default as NeonTabs } from './NeonTabs';
export { default as NeonMenu } from './NeonMenu';

// Media Components
export { default as NeonPlayerControls } from './NeonPlayerControls';
export { default as NeonProgressBar } from './NeonProgressBar';
export { default as NeonVolumeControl } from './NeonVolumeControl';

// Type Definitions
export type { 
    NeonButtonProps,
    NeonCardProps,
    NeonPanelProps,
    NeonSliderProps,
    NeonInputProps,
    NeonSwitchProps,
    NeonProgressProps,
    NeonLoaderProps,
    NeonTooltipProps,
    NeonDialogProps,
    NeonGridProps,
    NeonContainerProps,
    NeonTabsProps,
    NeonMenuProps,
    NeonPlayerControlsProps,
    NeonProgressBarProps,
    NeonVolumeControlProps
} from './types';

// Theme Interface
export interface NeonTheme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
        primary: string;
        secondary: string;
        disabled: string;
    };
    glass: {
        opacity: number;
        blur: number;
        borderOpacity: number;
    };
    shadows: {
        small: string;
        medium: string;
        large: string;
    };
    transitions: {
        fast: string;
        normal: string;
        slow: string;
    };
}

// Default Theme Configuration
export const defaultNeonTheme: NeonTheme = {
    primary: '#8A2BE2',
    secondary: '#00FFFF',
    accent: '#FF00FF',
    background: '#0F0F1A',
    surface: '#1A1A2E',
    text: {
        primary: '#FFFFFF',
        secondary: '#CCCCCC',
        disabled: '#666699'
    },
    glass: {
        opacity: 0.15,
        blur: 12,
        borderOpacity: 0.3
    },
    shadows: {
        small: '0 0 5px rgba(138, 43, 226, 0.3), 0 0 10px rgba(0, 255, 255, 0.3)',
        medium: '0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(0, 255, 255, 0.5)',
        large: '0 0 20px rgba(138, 43, 226, 0.7), 0 0 40px rgba(0, 255, 255, 0.7)'
    },
    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// Component Categories
export const NEON_COMPONENT_CATEGORIES = {
    CORE: 'Core Components',
    LAYOUT: 'Layout Components',
    NAVIGATION: 'Navigation Components',
    MEDIA: 'Media Components',
    UTILITY: 'Utility Components'
};

// Component Metadata Registry
export const NEON_COMPONENTS_METADATA = {
    NeonButton: {
        name: 'NeonButton',
        category: 'Core Components',
        description: 'Glassmorphism button with neon glow effects',
        tags: ['button', 'glass', 'neon', 'interactive']
    },
    NeonCard: {
        name: 'NeonCard',
        category: 'Core Components',
        description: 'Glass card container with elevation and hover effects',
        tags: ['card', 'container', 'glass', 'layout']
    },
    NeonPanel: {
        name: 'NeonPanel',
        category: 'Core Components',
        description: 'Collapsible panel with header and content sections',
        tags: ['panel', 'accordion', 'collapsible', 'ui']
    }
    // Additional components metadata would be added here
};

export default {
    // Component Exports
    NeonButton,
    NeonCard,
    NeonPanel,
    NeonSlider,
    NeonInput,
    NeonSwitch,
    NeonProgress,
    NeonLoader,
    NeonTooltip,
    NeonDialog,
    NeonGrid,
    NeonContainer,
    NeonTabs,
    NeonMenu,
    NeonPlayerControls,
    NeonProgressBar,
    NeonVolumeControl,
    
    // Theme Exports
    defaultNeonTheme,
    NEON_COMPONENT_CATEGORIES,
    NEON_COMPONENTS_METADATA
};
