/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Container panel using Glassmorphism backdrop-filter with border gradient effect.
 * Layer: UI -> Components -> Neon
 */

import React from 'react';

interface NeonPanelProps {
    children: React.ReactNode;
    width?: string | number;
    height?: string | number;
    className?: string;
    glassOpacity?: number;
    borderColor?: string;
}

export const NeonPanel: React.FC<NeonPanelProps> = ({
    children,
    width = '100%',
    height = 'auto',
    className = '',
    glassOpacity = 0.05,
    borderColor = 'rgba(0, 255, 255, 0.15)'
}) => {
    
    const panelStyle: React.CSSProperties = {
        width,
        height,
        background: `rgba(18, 18, 18, ${0.6 + glassOpacity})`, // Deep dark backing
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        overflow: 'hidden',
        position: 'relative'
    };

    return (
        <div className={`knoux-glass-panel ${className}`} style={panelStyle}>
            {children}
        </div>
    );
};
