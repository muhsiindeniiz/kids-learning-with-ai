import { palette } from './palette'

export const tokens = {
  light: {
    colors: {
      background: {
        primary: palette.common.white,
        secondary: palette.gray[50],
        tertiary: palette.gray[100],
      },
      text: {
        primary: palette.gray[900],
        secondary: palette.gray[700],
        tertiary: palette.gray[500],
        disabled: palette.gray[400],
        inverse: palette.common.white,
      },
      border: {
        primary: palette.gray[200],
        secondary: palette.gray[300],
        focus: palette.brand.primary[500],
      },
      action: {
        primary: palette.brand.primary[500],
        primaryHover: palette.brand.primary[600],
        primaryActive: palette.brand.primary[700],
        primaryDisabled: palette.brand.primary[200],
        secondary: palette.brand.secondary[500],
        secondaryHover: palette.brand.secondary[600],
        secondaryActive: palette.brand.secondary[700],
        secondaryDisabled: palette.brand.secondary[200],
      },
      status: {
        success: palette.semantic.success[500],
        warning: palette.semantic.warning[500],
        error: palette.semantic.error[500],
        successBackground: palette.semantic.success[50],
        warningBackground: palette.semantic.warning[50],
        errorBackground: palette.semantic.error[50],
      },
      overlay: {
        background: palette.alpha.black[50],
        hover: palette.alpha.black[5],
      },
    },
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
    },
    radii: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },
}

export const darkTokens = {
  colors: {
    background: {
      primary: palette.gray[900],
      secondary: palette.gray[800],
      tertiary: palette.gray[700],
    },
    text: {
      primary: palette.common.white,
      secondary: palette.gray[300],
      tertiary: palette.gray[500],
      disabled: palette.gray[600],
      inverse: palette.gray[900],
    },
    border: {
      primary: palette.gray[700],
      secondary: palette.gray[600],
      focus: palette.brand.primary[500],
    },
    action: {
      primary: palette.brand.primary[400],
      primaryHover: palette.brand.primary[500],
      primaryActive: palette.brand.primary[600],
      primaryDisabled: palette.brand.primary[200],
      secondary: palette.brand.secondary[400],
      secondaryHover: palette.brand.secondary[500],
      secondaryActive: palette.brand.secondary[600],
      secondaryDisabled: palette.brand.secondary[200],
    },
    status: {
      success: palette.semantic.success[400],
      warning: palette.semantic.warning[400],
      error: palette.semantic.error[400],
      successBackground: palette.semantic.success[900],
      warningBackground: palette.semantic.warning[900],
      errorBackground: palette.semantic.error[900],
    },
    overlay: {
      background: palette.alpha.black[70],
      hover: palette.alpha.white[5],
    },
  },
  spacing: tokens.light.spacing,
  radii: tokens.light.radii,
  shadows: tokens.light.shadows,
}
