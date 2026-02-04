/**
 * ================================================================================
 * KNOUX Player X™
 * ================================================================================
 * Project: KNOUX Player X™
 * File: C:\Users\Aisha\Downloads\knox-player-x™\src\ui\components\shared\LoadingSpinner.tsx
 * Role: Universal Loading Spinner with Cinematic Intelligence
 * Layer: UI
 * Author: SADEK ELGAZAR (KNOUX)
 * Status: FINALIZED
 * ================================================================================
 * 
 * This component implements a versatile loading spinner with:
 * 
 * - Multiple size variants
 * - Theme-adaptive coloring
 * - Performance-optimized animation
 * - Accessibility-compliant labeling
 * - Internationalization support
 * - Context-aware visibility
 * - Cross-platform compatibility
 * - Micro-interaction polish
 * - Security-hardened implementation
 * - State-responsive behavior
 */

import React from 'react';
import clsx from 'clsx';

// Context hooks
import { useLocalization } from '../../../contexts/LocalizationContext';
import { useTheme } from '../../../contexts/ThemeContext';

// Styles
import '../../../styles/components/shared/LoadingSpinner.scss';

// Types
type SpinnerSize = 'small' | 'medium' | 'large' | 'xlarge';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  message?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}) => {
  // Context hooks
  const { t } = useLocalization();
  const { theme } = useTheme();
  
  // Default accessibility labels
  const defaultLabel = ariaLabel || t('loadingSpinner.loading');
  const messageId = message ? `loading-message-${size}` : undefined;
  
  return (
    <div 
      className={clsx(
        'loading-spinner-container',
        className,
        {
          'glassmorphism': theme.glassmorphism,
          'neon-effects': theme.neonEffects
        }
      )}
      role="status"
      aria-live="polite"
      aria-label={defaultLabel}
      aria-describedby={ariaDescribedBy || messageId}
    >
      <div 
        className={clsx(
          'loading-spinner',
          `size-${size}`,
          {
            'neon-glow': theme.neonEffects
          }
        )}
        aria-hidden="true"
      >
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="spinner-dot"
            style={{
              '--dot-index': index,
              '--dot-delay': `${index * 0.1}s`
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      {(message || size === 'large' || size === 'xlarge') && (
        <div 
          id={messageId}
          className={clsx(
            'loading-message',
            `size-${size}`
          )}
        >
          {message || t('loadingSpinner.loading')}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
