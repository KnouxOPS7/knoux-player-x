/**
 * Project: KNOUX Player X™
 * File: src/ui/components/neon/types.ts
 * Author: knoux
 * Purpose: TypeScript type definitions for neon glassmorphism components
 * Layer: Source -> UI -> Components -> Neon -> Types
 */

import { ReactNode, MouseEventHandler, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

// ========== CORE TYPES ==========
export type NeonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
export type NeonSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
export type NeonElevation = 1 | 2 | 3 | 4 | 5;
export type NeonOrientation = 'horizontal' | 'vertical';
export type NeonAlignment = 'left' | 'center' | 'right';
export type NeonPosition = 'top' | 'right' | 'bottom' | 'left';

// ========== NEON BUTTON TYPES ==========
export interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button variant style */
    variant?: NeonVariant;
    
    /** Button size */
    size?: NeonSize;
    
    /** Button elevation level */
    elevation?: NeonElevation;
    
    /** Whether button is disabled */
    disabled?: boolean;
    
    /** Whether button is in loading state */
    loading?: boolean;
    
    /** Whether button takes full width */
    fullWidth?: boolean;
    
    /** Icon to display before children */
    startIcon?: ReactNode;
    
    /** Icon to display after children */
    endIcon?: ReactNode;
    
    /** Click handler */
    onClick?: MouseEventHandler<HTMLButtonElement>;
    
    /** Custom CSS class name */
    className?: string;
    
    /** Child elements */
    children?: ReactNode;
}

// ========== NEON CARD TYPES ==========
export interface NeonCardProps {
    /** Card content */
    children?: ReactNode;
    
    /** Card elevation level */
    elevation?: NeonElevation;
    
    /** Whether card has hover effect */
    hoverable?: boolean;
    
    /** Whether card is clickable */
    clickable?: boolean;
    
    /** Click handler */
    onClick?: MouseEventHandler<HTMLDivElement>;
    
    /** Custom CSS class name */
    className?: string;
    
    /** Inline styles */
    style?: React.CSSProperties;
}

// ========== NEON PANEL TYPES ==========
export interface NeonPanelProps {
    /** Panel title */
    title?: string;
    
    /** Panel content */
    children?: ReactNode;
    
    /** Whether panel is collapsible */
    collapsible?: boolean;
    
    /** Whether panel is collapsed by default */
    defaultCollapsed?: boolean;
    
    /** Custom header actions */
    headerActions?: ReactNode;
    
    /** Custom CSS class name */
    className?: string;
    
    /** Inline styles */
    style?: React.CSSProperties;
}

// ========== NEON SLIDER TYPES ==========
export interface NeonSliderProps {
    /** Minimum value */
    min?: number;
    
    /** Maximum value */
    max?: number;
    
    /** Current value */
    value?: number;
    
    /** Default value */
    defaultValue?: number;
    
    /** Step increment */
    step?: number;
    
    /** Change handler */
    onChange?: (value: number) => void;
    
    /** Custom CSS class name */
    className?: string;
    
    /** Inline styles */
    style?: React.CSSProperties;
}

// ========== NEON INPUT TYPES ==========
export interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Input label */
    label?: string;
    
    /** Input variant */
    variant?: NeonVariant;
    
    /** Input size */
    size?: NeonSize;
    
    /** Whether input is full width */
    fullWidth?: boolean;
    
    /** Start adornment */
    startAdornment?: ReactNode;
    
    /** End adornment */
    endAdornment?: ReactNode;
    
    /** Error message */
    error?: string;
    
    /** Helper text */
    helperText?: string;
    
    /** Custom CSS class name */
    className?: string;
}

// ========== NEON SWITCH TYPES ==========
export interface NeonSwitchProps {
    /** Checked state */
    checked?: boolean;
    
    /** Default checked state */
    defaultChecked?: boolean;
    
    /** Change handler */
    onChange?: (checked: boolean) => void;
    
    /** Switch label */
    label?: string;
    
    /** Disabled state */
    disabled?: boolean;
    
    /** Custom CSS class name */
    className?: string;
}

// ========== NEON PROGRESS TYPES ==========
export interface NeonProgressProps {
    /** Progress value (0-100) */
    value?: number;
    
    /** Progress variant */
    variant?: NeonVariant;
    
    /** Progress size */
    size?: NeonSize;
    
    /** Whether progress is indeterminate */
    indeterminate?: boolean;
    
    /** Custom CSS class name */
    className?: string;
}

// ========== NEON LOADER TYPES ==========
export interface NeonLoaderProps {
    /** Loader size */
    size?: NeonSize;
    
    /** Loader variant */
    variant?: NeonVariant;
    
    /** Custom CSS class name */
    className?: string;
}

// ========== NEON TOOLTIP TYPES ==========
export interface NeonTooltipProps {
    /** Tooltip content */
    title: string;
    
    /** Child element */
    children: ReactNode;
    
    /** Tooltip position */
    position?: NeonPosition;
    
    /** Whether tooltip is disabled */
    disabled?: boolean;
    
    /** Custom CSS class name */
    className?: string;
}

// ========== NEON DIALOG TYPES ==========
export interface NeonDialogProps {
    /** Whether dialog is open */
    open: boolean;
    
    /** Close handler */
    onClose: () => void;
    
    /** Dialog title */
    title?: string;
    
    /** Dialog content */
    children?: ReactNode;
    
    /** Dialog actions */
    actions?: ReactNode;
    
    /** Whether dialog is closable */
    closable?: boolean;
    
    /** Custom CSS class name */
    className?: string;
}

// ========== LAYOUT COMPONENT TYPES ==========
export interface NeonGridProps {
    /** Grid columns */
    columns?: number;
    
    /** Grid gap */
    gap?: number | string;
    
    /** Child elements */
    children?: ReactNode;
    
    /** Custom CSS class name */
    className?: string;
}

export interface NeonContainerProps {
    /** Container max width */
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    
    /** Whether container is fluid */
    fluid?: boolean;
    
    /** Child elements */
    children?: ReactNode;
    
    /** Custom CSS class name */
    className?: string;
}

// ========== NAVIGATION COMPONENT TYPES ==========
export interface NeonTabsProps {
    /** Active tab value */
    value?: string;
    
    /** Change handler */
    onChange?: (value: string) => void;
    
    /** Tab items */
    tabs?: Array<{
        value: string;
        label: string;
        icon?: ReactNode;
    }>;
    
    /** Child elements */
    children?: ReactNode;
    
    /** Custom CSS class name */
    className?: string;
}

export interface NeonMenuProps {
    /** Whether menu is open */
    open: boolean;
    
    /** Close handler */
    onClose: () => void;
    
    /** Menu anchor element */
    anchorEl?: HTMLElement | null;
    
    /** Menu items */
    items?: Array<{
        id: string;
        label: string;
        icon?: ReactNode;
        disabled?: boolean;
        divider?: boolean;
    }>;
    
    /** Custom CSS class name */
    className?: string;
}

// ========== MEDIA COMPONENT TYPES ==========
export interface NeonPlayerControlsProps {
    /** Whether player is playing */
    playing?: boolean;
    
    /** Current time */
    currentTime?: number;
    
    /** Total duration */
    duration?: number;
    
    /** Volume level */
    volume?: number;
    
    /** Whether player is muted */
    muted?: boolean;
    
    /** Play/Pause handler */
    onPlay?: () => void;
    
    /** Stop handler */
    onStop?: () => void;
    
    /** Seek handler */
    onSeek?: (time: number) => void;
    
    /** Volume change handler */
    onVolumeChange?: (volume: number) => void;
    
    /** Mute toggle handler */
    onMuteToggle?: () => void;
    
    /** Custom CSS class name */
    className?: string;
}

export interface NeonProgressBarProps {
    /** Progress value (0-100) */
    value?: number;
    
    /** Buffered value (0-100) */
    buffered?: number;
    
    /** Click handler */
    onClick?: (percent: number) => void;
    
    /** Custom CSS class name */
    className?: string;
}

export interface NeonVolumeControlProps {
    /** Volume level (0-100) */
    value?: number;
    
    /** Muted state */
    muted?: boolean;
    
    /** Volume change handler */
    onChange?: (volume: number) => void;
    
    /** Mute toggle handler */
    onMuteToggle?: () => void;
    
    /** Custom CSS class name */
    className?: string;
}

// ========== UTILITY TYPES ==========
export interface WithNeonChangeHandler<T> {
    /** Change handler with typed value */
    onChange?: (value: T) => void;
}

export interface WithNeonFocusEvents {
    /** Focus handler */
    onFocus?: () => void;
    
    /** Blur handler */
    onBlur?: () => void;
}

export interface WithNeonMouseEventHandlers {
    /** Mouse enter handler */
    onMouseEnter?: () => void;
    
    /** Mouse leave handler */
    onMouseLeave?: () => void;
}

export default {
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
};
