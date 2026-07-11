import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export type ThemeMode = 'dark' | 'light'
export type LanguageCode = 'zh' | 'en'

const themeStorageKey = 'paperpulse_theme'
const languageStorageKey = 'paperpulse_language'

function readTheme(): ThemeMode {
  return localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light'
}

function readLanguage(): LanguageCode {
  return localStorage.getItem(languageStorageKey) === 'en' ? 'en' : 'zh'
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
  document.documentElement.style.colorScheme = mode
}

function applyLanguage(language: LanguageCode) {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
}

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const toasts = ref<Toast[]>([])
  const loading = ref(false)
  const themeMode = ref<ThemeMode>(readTheme())
  const language = ref<LanguageCode>(readLanguage())
  let toastId = 0

  // Auth state
  const authToken = ref<string | null>(localStorage.getItem('auth_token'))
  const authUsername = ref<string | null>(localStorage.getItem('auth_username'))
  const isLoggedIn = computed(() => !!authToken.value)
  const isDarkMode = computed(() => themeMode.value === 'dark')
  const isEnglish = computed(() => language.value === 'en')

  applyTheme(themeMode.value)
  applyLanguage(language.value)

  function setAuth(token: string, username: string) {
    authToken.value = token
    authUsername.value = username
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_username', username)
  }

  function logout() {
    authToken.value = null
    authUsername.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_username')
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setTheme(mode: ThemeMode) {
    themeMode.value = mode
    localStorage.setItem(themeStorageKey, mode)
    applyTheme(mode)
  }

  function toggleTheme() {
    setTheme(themeMode.value === 'dark' ? 'light' : 'dark')
  }

  function setLanguage(nextLanguage: LanguageCode) {
    language.value = nextLanguage
    localStorage.setItem(languageStorageKey, nextLanguage)
    applyLanguage(nextLanguage)
  }

  function toggleLanguage() {
    setLanguage(language.value === 'zh' ? 'en' : 'zh')
  }

  function showLoading() {
    loading.value = true
  }

  function hideLoading() {
    loading.value = false
  }

  function addToast(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type, duration })
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  function removeToast(id: number) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message: string) {
    addToast(message, 'success')
  }

  function error(message: string) {
    addToast(message, 'error', 5000)
  }

  function info(message: string) {
    addToast(message, 'info')
  }

  function warning(message: string) {
    addToast(message, 'warning', 4000)
  }

  return {
    sidebarCollapsed,
    toasts,
    loading,
    authToken,
    authUsername,
    isLoggedIn,
    themeMode,
    language,
    isDarkMode,
    isEnglish,
    setAuth,
    logout,
    toggleSidebar,
    setTheme,
    toggleTheme,
    setLanguage,
    toggleLanguage,
    showLoading,
    hideLoading,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
})
