import { THEME } from '../../constant/styles'

export const dialogStyles = {
  overlay: {
    background: THEME.colors.overlay,
    backdropFilter: 'blur(4px)',
    zIndex: 999,
  },
  content: {
    background: THEME.colors.background.dialog,
    borderRadius: THEME.borderRadius.lg,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    border: `1px solid ${THEME.colors.border.primary}`,
  },
  header: {
    background: 'rgba(255,255,255,0.05)',
    borderBottom: `1px solid ${THEME.colors.border.primary}`,
    padding: THEME.spacing.lg,
  },
}
