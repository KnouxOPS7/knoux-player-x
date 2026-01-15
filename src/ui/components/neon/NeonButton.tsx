/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: A glassmorphic button component with neon glow effects tailored for high-performance React render cycles.
 * Layer: UI -> Components -> Neon
 */

import React from 'react';

export type NeonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: NeonVariant;
    glowColor?: string;
    isProcessing?: boolean;
}

/**
 * High-performance Neon styled button with Memoization
 */
export const NeonButton = React.memo<NeonButtonProps>(({
    children, 
    variant = 'primary', 
    glowColor, 
    isProcessing,
    className = '',
    style = {},
    disabled,
    ...props 
}) => {

    // Theme color map
    const themeColors: Record<NeonVariant, string> = {
        primary: '#0ff',   // Cyan
        secondary: '#bf00ff', // Purple
        danger: '#ff2e2e',
        ghost: 'transparent'
    };

    const baseColor = glowColor || themeColors[variant];

    // CSS-in-JS logic optimized for critical rendering path (could be extracted to scss module in future steps)
    const computeStyle = (): React.CSSProperties => {
        if (variant === 'ghost') return { ...style };
        
        return {
            background: 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${baseColor}44`,
            boxShadow: `0 0 8px ${baseColor}22, inset 0 0 10px ${baseColor}11`,
            color: '#fff',
            textShadow: `0 0 5px ${baseColor}`,
            padding: '10px 24px',
            borderRadius: '6px',
            cursor: disabled || isProcessing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            backdropFilter: 'blur(5px)',
            opacity: disabled ? 0.5 : 1,
            ...style
        };
    };

    return (
        <button 
            className={`knoux-neon-btn ${variant} ${className}`}
            style={computeStyle()}
            disabled={disabled || isProcessing}
            {...props}
        >
            {isProcessing ? 'PROCESSING...' : children}
        </button>
    );
});

NeonButton.displayName = 'NeonButton';
