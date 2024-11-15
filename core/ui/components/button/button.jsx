'use client'

import { cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/packages/util/cn'

import styles from './button.module.scss'

export const buttonStyles = cva(styles.base, {
  variants: {
    intent: {
      primary: styles.primary,
      secondary: styles.secondary,
      ghost: styles.ghost,
      danger: styles.danger,
    },
    size: {
      sm: styles.small,
      md: styles.medium,
      lg: styles.large,
    },
    fullWidth: {
      true: styles.fullWidth,
    },
    loading: {
      true: styles.loading,
    },
    withIcon: {
      true: styles.withIcon,
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
    fullWidth: false,
    loading: false,
    withIcon: false,
  },
})

const Button = ({
  intent,
  size,
  fullWidth,
  disabled = false,
  loading = false,
  className,
  children,
  onClick,
  startIcon,
  endIcon,
}) => {
  return (
    <button
      className={cn(
        buttonStyles({
          intent,
          size,
          fullWidth,
          loading,
          withIcon: !!(startIcon || endIcon),
        }),
        className
      )}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
    >
      {loading && <Loader2 className='h-4 w-4 animate-spin' />}
      {!loading && startIcon}
      {children}
      {!loading && endIcon}
    </button>
  )
}

export default Button
