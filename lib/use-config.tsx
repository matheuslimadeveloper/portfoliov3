"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { siteConfig as defaultConfig } from "./config-data"

export type SiteConfig = typeof defaultConfig

// Deep merge que garante todos os campos do defaultConfig existam
function deepMerge(defaultObj: any, savedObj: any): any {
  if (!savedObj) return defaultObj
  if (typeof defaultObj !== 'object' || defaultObj === null) return savedObj ?? defaultObj
  if (Array.isArray(defaultObj)) return savedObj ?? defaultObj
  
  const result: any = { ...defaultObj }
  for (const key of Object.keys(defaultObj)) {
    if (key in savedObj) {
      if (typeof defaultObj[key] === 'object' && !Array.isArray(defaultObj[key]) && defaultObj[key] !== null) {
        result[key] = deepMerge(defaultObj[key], savedObj[key])
      } else {
        result[key] = savedObj[key] ?? defaultObj[key]
      }
    }
  }
  // Adiciona campos extras do savedObj que nao existem no default
  for (const key of Object.keys(savedObj)) {
    if (!(key in defaultObj)) {
      result[key] = savedObj[key]
    }
  }
  return result
}

const ConfigContext = createContext<{
  config: SiteConfig
  updateConfig: (newConfig: SiteConfig) => Promise<void>
  loading: boolean
  reloadConfig: () => Promise<void>
}>({
  config: defaultConfig,
  updateConfig: async () => {},
  loading: false,
  reloadConfig: async () => {},
})

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config', { cache: 'no-store' })
      const data = await response.json()
      if (data.success && data.config) {
        // Deep merge garantindo estrutura completa
        const merged = deepMerge(defaultConfig, data.config)
        // Garante arrays criticos
        merged.projects = Array.isArray(data.config.projects) && data.config.projects.length > 0 
          ? data.config.projects 
          : defaultConfig.projects
        merged.faq = Array.isArray(data.config.faq) && data.config.faq.length > 0 
          ? data.config.faq 
          : defaultConfig.faq
        merged.team = Array.isArray(data.config.team) && data.config.team.length > 0 
          ? data.config.team 
          : defaultConfig.team
        setConfig(merged)
      }
    } catch (error) {
      // Silently use default on error
    }
    setLoading(false)
  }

  const updateConfig = async (newConfig: SiteConfig) => {
    try {
      // Merge com default antes de salvar para garantir estrutura completa
      const toSave = deepMerge(defaultConfig, newConfig)
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave),
      })
      const data = await response.json()
      if (data.success) {
        setConfig(toSave)
      }
    } catch (error) {
      console.error('Erro ao salvar config:', error)
    }
  }

  return (
    <ConfigContext.Provider value={{ config, updateConfig, loading, reloadConfig: loadConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)
