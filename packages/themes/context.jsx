'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

import { darkTokens, tokens } from './tokens'

const ThemeContext = createContext(undefined)

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState({
    current: 'light',
    tokens: tokens.light,
  })

  const setTheme = mode => {
    setThemeState({
      current: mode,
      tokens: mode === 'light' ? tokens.light : darkTokens,
    })
    localStorage.setItem('theme-preference', mode)
    document.documentElement.classList.remove(mode === 'light' ? 'dark' : 'light')
    document.documentElement.classList.add(mode)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      setTheme(savedTheme)
    } else if (systemPrefersDark) {
      setTheme('dark')
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = e => {
      if (!localStorage.getItem('theme-preference')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
