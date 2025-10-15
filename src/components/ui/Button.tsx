import React from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: 'primary' | 'primary-teal' | 'primary-orange' | 'secondary' | 'secondary-gray' | 'outline' | 'outline-orange' | 'danger' | 'ghost' | 'icon' | 'icon-sm';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Show loading state */
  loading?: boolean;
  /** Icon to display (before text) */
  icon?: React.ReactNode;
  /** Icon to display (after text) */
  iconRight?: React.ReactNode;
  /** Use Framer Motion for animations */
  animated?: boolean;
  /** Children/button content */
  children?: React.ReactNode;
}

/**
 * Enhanced Button Component
 * 
 * A comprehensive button component that consolidates all button styles
 * and provides a consistent interface across the PawPerfect Match app.
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, danger, ghost, icon)
 * - Three sizes (sm, md, lg)
 * - Loading state with spinner
 * - Icon support (left or right)
 * - Full accessibility (ARIA, focus states, disabled)
 * - Framer Motion animations (optional)
 * - Automatic touch target sizing for mobile
 * 
 * @example
 * ```tsx
 * // Primary action button
 * <Button variant="primary" icon={<Heart />}>
 *   Like
 * </Button>
 * 
 * // Loading state
 * <Button variant="primary-teal" loading>
 *   Saving...
 * </Button>
 * 
 * // Icon-only button with ARIA label
 * <Button variant="icon" aria-label="Filter">
 *   <Filter className="w-5 h-5" />
 * </Button>
 * 
 * // Danger button with confirmation
 * <Button variant="danger" onClick={handleDelete}>
 *   Delete
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconRight,
  animated = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  // Build class names based on props
  const baseClasses = [];

  // Variant classes
  switch (variant) {
    case 'primary':
      baseClasses.push('btn-primary');
      break;
    case 'primary-teal':
      baseClasses.push('btn-primary-teal');
      break;
    case 'primary-orange':
      baseClasses.push('btn-primary-orange');
      break;
    case 'secondary':
      baseClasses.push('btn-secondary');
      break;
    case 'secondary-gray':
      baseClasses.push('btn-secondary-gray');
      break;
    case 'outline':
      baseClasses.push('btn-outline');
      break;
    case 'outline-orange':
      baseClasses.push('btn-outline-orange');
      break;
    case 'danger':
      baseClasses.push('btn-danger');
      break;
    case 'ghost':
      baseClasses.push('btn-ghost');
      break;
    case 'icon':
      baseClasses.push('btn-icon');
      break;
    case 'icon-sm':
      baseClasses.push('btn-icon-sm');
      break;
    default:
      baseClasses.push('btn', `btn-${size}`);
  }

  // Full width modifier
  if (fullWidth && !variant.includes('icon')) {
    baseClasses.push('btn-full');
  }

  // Icon positioning
  if (icon && !iconRight && !variant.includes('icon')) {
    baseClasses.push('btn-icon-left');
  }
  if (iconRight && !variant.includes('icon')) {
    baseClasses.push('btn-icon-right');
  }

  // Loading state
  if (loading) {
    baseClasses.push('relative');
  }

  const combinedClassName = [...baseClasses, className].filter(Boolean).join(' ');

  // Loading spinner component
  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 absolute inset-0 m-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Button content with icons
  const content = (
    <>
      {loading && <Spinner />}
      <span className={loading ? 'opacity-0' : ''}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </span>
    </>
  );

  // Use motion.button if animated prop is true
  if (animated) {
    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        whileHover={{ scale: variant.includes('icon') ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {content}
      </motion.button>
    );
  }

  // Regular button
  return (
    <button
      ref={ref}
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

