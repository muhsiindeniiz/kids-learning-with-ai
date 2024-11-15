'use client'

import React from 'react'

export const RootHtml = ({ children }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      {children}
    </html>
  )
}
