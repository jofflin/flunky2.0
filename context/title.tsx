'use client'

import { createContext, useContext, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TitleContext = createContext<{
  title: string
  updateTitle: (title: string) => void
} | null>(null)

export function useTitleContext() {
  const ctx = useContext(TitleContext)
  if (!ctx) {
    throw new Error('useTitleContext must be used within a TitleProvider')
  }
  return ctx
}

export function TitleProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [title, setTitle] = useState('Flunky 2024')

  const updateTitle = (title: string) => {
    setTitle(title)
  }

  return (
    <TitleContext.Provider value={{ title, updateTitle }}>
      {children}
    </TitleContext.Provider>
  )
}
