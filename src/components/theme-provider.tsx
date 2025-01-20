"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ 
  children, 
  ...props 
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}