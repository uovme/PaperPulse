<template>
  <router-view v-if="!appStore.isLoggedIn" />

  <div v-else class="paper-shell flex min-h-[100dvh] overflow-hidden">
    <aside :class="['paper-sidebar flex flex-col', appStore.sidebarCollapsed ? 'paper-sidebar-collapsed w-[76px]' : 'w-64']">
      <div class="paper-sidebar-brand flex items-center gap-3 px-4">
        <router-link to="/dashboard" class="flex min-w-0 flex-1 items-center gap-3">
          <div class="paper-logo-mark flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div v-if="!appStore.sidebarCollapsed" class="min-w-0">
            <div class="paper-brand-word truncate" aria-label="PaperPulse">
              <span class="paper-brand-accent">P</span>aper<span class="paper-brand-accent">P</span>ulse
            </div>
            <div class="paper-brand-subtitle truncate">{{ ui.brandSubtitle }}</div>
          </div>
        </router-link>
      </div>

      <div v-if="workspaceStore.currentWorkspace" class="paper-workspace-wrap px-3">
        <div v-if="!appStore.sidebarCollapsed" class="paper-workspace rounded-lg p-2.5">
          <div class="mb-2 flex items-center gap-2 xai-eyebrow">
            <span
              class="h-2 w-2 rounded-full"
              :style="{ backgroundColor: workspaceStore.currentWorkspace.color || '#ffffff' }"
            ></span>
            {{ ui.workspace }}
          </div>
          <div class="flex gap-2">
            <select
              :value="workspaceStore.currentWorkspace.id"
              class="min-w-0 flex-1 rounded-lg border border-[var(--xai-hairline)] bg-[var(--xai-canvas-soft)] px-2.5 py-2 text-sm text-[var(--xai-ink)]"
              @change="switchWorkspace"
            >
              <option v-for="workspace in workspaceStore.workspaces" :key="workspace.id" :value="workspace.id">
                {{ workspace.name }}
              </option>
            </select>
            <button
              class="rounded-lg border border-[var(--xai-hairline)] px-3 py-2 text-sm text-[var(--xai-mute)] hover:border-[rgba(36,84,230,0.35)] hover:text-[var(--xai-primary)]"
              :title="ui.newWorkspace"
              @click="createWorkspace"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5" />
              </svg>
            </button>
            <button
              class="rounded-lg border border-[var(--xai-hairline)] px-2 py-2 text-xs text-[var(--xai-danger)] hover:border-[rgba(207,46,60,0.4)]"
              :title="ui.deleteWorkspace"
              @click="deleteWorkspace"
              v-if="workspaceStore.currentWorkspace && !workspaceStore.currentWorkspace.is_default"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <button
          v-else
          class="paper-workspace-mini mx-auto flex h-9 w-9 items-center justify-center rounded-lg"
          :title="ui.newWorkspace"
          @click="createWorkspace"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5" />
          </svg>
        </button>
      </div>

      <nav class="paper-sidebar-nav flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Primary navigation">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="['paper-side-nav-link', isActive(item.path) ? 'paper-side-nav-link-active' : '']"
          :title="item.label"
        >
          <span :class="['paper-side-nav-mark', item.featured ? 'paper-side-nav-mark-featured' : '']">
            {{ item.mark }}
          </span>
          <span v-if="!appStore.sidebarCollapsed" class="min-w-0 flex-1 truncate">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="paper-sidebar-footer relative space-y-2 border-t border-[var(--xai-hairline)] p-3">
        <div
          v-if="accountMenuOpen"
          :class="['paper-account-menu', appStore.sidebarCollapsed ? 'paper-account-menu-collapsed' : '']"
        >
          <router-link to="/settings" class="paper-account-menu-item" @click="closeAccountMenu">
            <span class="paper-account-menu-title">{{ ui.settings }}</span>
            <span class="paper-account-menu-desc">{{ ui.settingsDesc }}</span>
          </router-link>
          <button class="paper-account-menu-item" type="button" @click="toggleLanguageFromMenu">
            <span class="paper-account-menu-title">{{ ui.switchLanguage }}</span>
            <span class="paper-account-menu-desc">{{ ui.switchLanguageDesc }}</span>
          </button>
          <button class="paper-account-menu-item" type="button" @click="toggleThemeFromMenu">
            <span class="paper-account-menu-title">{{ ui.switchTheme }}</span>
            <span class="paper-account-menu-desc">{{ ui.switchThemeDesc }}</span>
          </button>
          <button class="paper-account-menu-item" type="button" @click="openAbout">
            <span class="paper-account-menu-title">{{ ui.about }}</span>
            <span class="paper-account-menu-desc">{{ ui.aboutDesc }}</span>
          </button>
          <button class="paper-account-menu-item paper-account-menu-danger" type="button" @click="handleLogout">
            <span class="paper-account-menu-title">{{ ui.logout }}</span>
            <span class="paper-account-menu-desc">{{ ui.logoutDesc }}</span>
          </button>
        </div>

        <button
          :class="['paper-account-button', accountMenuOpen ? 'paper-account-button-active' : '']"
          type="button"
          :title="ui.accountMenu"
          @click="toggleAccountMenu"
        >
          <span class="paper-account-avatar">{{ accountInitial }}</span>
          <span v-if="!appStore.sidebarCollapsed" class="min-w-0 flex-1 text-left">
            <span class="block truncate xai-eyebrow">{{ ui.account }}</span>
            <span class="mt-1 block truncate text-sm text-[var(--xai-ink)]">{{ appStore.authUsername }}</span>
          </span>
          <span v-if="!appStore.sidebarCollapsed" class="paper-account-chevron">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
        <button
          class="paper-side-action"
          :title="appStore.sidebarCollapsed ? ui.expandSidebar : ui.collapseSidebar"
          @click="appStore.toggleSidebar"
        >
          <span class="paper-side-nav-mark">
            <svg v-if="appStore.sidebarCollapsed" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 18 6-6-6-6" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 18-6-6 6-6" />
            </svg>
          </span>
          <span v-if="!appStore.sidebarCollapsed">{{ ui.collapseSidebar }}</span>
        </button>
      </div>
    </aside>

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header class="paper-mainbar flex min-h-16 flex-shrink-0 items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <div class="min-w-0">
          <h1 class="text-base font-semibold tracking-tight text-[var(--xai-ink)]">{{ currentTitle }}</h1>
          <p class="mt-0.5 text-xs text-[var(--xai-mute)]">{{ currentSubtitle }}</p>
        </div>
        <div v-if="route.path !== '/settings'" class="paper-mainbar-actions">
          <button class="paper-control-button" type="button" :title="ui.toggleLanguageTitle" @click="appStore.toggleLanguage">
            <span class="paper-control-mark">{{ appStore.language === 'zh' ? 'EN' : '中' }}</span>
            <span class="hidden sm:inline">{{ appStore.language === 'zh' ? 'English' : '中文' }}</span>
          </button>
          <button class="paper-control-button" type="button" :title="ui.toggleThemeTitle" @click="appStore.toggleTheme">
            <svg v-if="appStore.isDarkMode" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36 6.36-1.41-1.41M7.05 7.05 5.64 5.64m12.72 0-1.41 1.41M7.05 16.95l-1.41 1.41M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
            <span class="hidden sm:inline">{{ appStore.isDarkMode ? ui.lightMode : ui.darkMode }}</span>
          </button>
        </div>
      </header>

      <div class="paper-content flex-1 overflow-y-auto px-4 pb-6 pt-3 sm:px-6 lg:pb-7 lg:pt-4">
        <div class="mx-auto max-w-7xl">
          <router-view v-slot="{ Component }">
            <transition name="paper-route" mode="out-in">
              <component :is="Component" :key="pageKey" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>

    <div class="fixed right-4 top-4 z-50 space-y-2">
      <div
        v-for="toast in appStore.toasts"
        :key="toast.id"
        :class="[
          'toast-enter flex min-w-[280px] max-w-sm items-center rounded-lg border px-4 py-3',
          toastClasses[toast.type],
        ]"
      >
        <div class="flex-1 text-sm">{{ toast.message }}</div>
        <button class="ml-3 opacity-70 hover:opacity-100" @click="appStore.removeToast(toast.id)">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="aboutOpen" class="paper-about-overlay" @click.self="closeAbout">
      <section class="paper-about-dialog" role="dialog" aria-modal="true" aria-labelledby="paper-about-title">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="xai-eyebrow">{{ ui.about }}</p>
            <h2 id="paper-about-title" class="mt-2 text-xl font-semibold text-[var(--xai-ink)]">PaperPulse</h2>
          </div>
          <button class="paper-about-close" type="button" :title="ui.close" @click="closeAbout">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-4 text-sm leading-6 text-[var(--xai-body)]">
          {{ ui.aboutBody }}
        </p>
        <div class="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div class="paper-about-meta">
            <span>{{ ui.version }}</span>
            <strong>1.0.0</strong>
          </div>
          <div class="paper-about-meta">
            <span>{{ ui.project }}</span>
            <strong>noaul/PaperPulse</strong>
          </div>
        </div>
        <div class="paper-about-release mt-5">
          <p class="xai-eyebrow">{{ ui.latestUpdate }}</p>
          <ul class="mt-3 space-y-2 text-sm text-[var(--xai-body)]">
            <li v-for="item in ui.changelog" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="paper-about-release mt-3">
          <p class="xai-eyebrow">{{ ui.roadmap }}</p>
          <ul class="mt-3 space-y-2 text-sm text-[var(--xai-body)]">
            <li v-for="item in ui.roadmapItems" :key="item">{{ item }}</li>
          </ul>
        </div>
      </section>
    </div>

    <ModalDialog
      :visible="createWsOpen"
      type="prompt"
      :eyebrow="ui.workspace"
      :title="ui.newWorkspace"
      :placeholder="ui.workspacePlaceholder"
      :confirm-text="ui.create"
      @confirm="onCreateWsConfirm"
      @cancel="createWsOpen = false"
    />

    <ModalDialog
      :visible="deleteWsOpen"
      type="confirm"
      :eyebrow="ui.workspace"
      :title="`${ui.deleteWorkspace}「${workspaceStore.currentWorkspace?.name}」`"
      :message="ui.deleteWorkspaceMessage"
      :confirm-text="ui.confirmDelete"
      :danger="true"
      @confirm="onDeleteWsConfirm"
      @cancel="deleteWsOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { workspaceApi } from '@/api'
import { useAppStore } from '@/stores/app'
import { useWorkspaceStore } from '@/stores/workspace'
import ModalDialog from '@/components/ModalDialog.vue'

const appStore = useAppStore()
const workspaceStore = useWorkspaceStore()
const route = useRoute()
const router = useRouter()
const accountMenuOpen = ref(false)
const aboutOpen = ref(false)
const createWsOpen = ref(false)
const deleteWsOpen = ref(false)

const shellCopy = {
  zh: {
    brandSubtitle: 'research operations',
    workspace: '工作区',
    newWorkspace: '新建工作区',
    deleteWorkspace: '删除当前工作区',
    workspacePlaceholder: '请输入工作区名称',
    create: '创建',
    confirmDelete: '确认删除',
    deleteWorkspaceMessage: '该操作不可恢复，工作区内的所有数据将被清除。',
    settings: '设置',
    settingsDesc: 'AI、邮件、同步和定时任务',
    switchLanguage: '切换语言',
    switchLanguageDesc: '当前为中文界面，点击切换到英文',
    switchTheme: '切换外观',
    switchThemeDesc: '在深色模式和白天模式之间切换',
    about: '关于项目',
    aboutDesc: '版本、更新日志和未来方向',
    logout: '退出登录',
    logoutDesc: '结束当前会话',
    accountMenu: '账户菜单',
    account: '账户',
    collapseSidebar: '收起侧边栏',
    expandSidebar: '展开侧边栏',
    toggleLanguageTitle: '切换语言',
    toggleThemeTitle: '切换深色/白天模式',
    lightMode: '白天模式',
    darkMode: '深色模式',
    close: '关闭',
    aboutBody: 'PaperPulse 是一个学术论文追踪工具，用于订阅期刊 RSS、执行 AI 文献分析、整理分析报告并通过邮件推送。',
    version: '版本',
    project: '项目',
    latestUpdate: '更新日志',
    roadmap: '日后功能方向',
    changelog: [
      '统一工作台 UI、设置页和账户菜单视觉语言。',
      '新增语言切换、深色模式和白天模式。',
      '定时任务改为按北京时间几点几分执行。',
    ],
    roadmapItems: [
      '扩展全站多语言文案覆盖。',
      '增加任务运行日历、失败重试和通知策略。',
      '继续强化 Zotero、WeKnora 和报告协作流。',
    ],
    titles: {
      '/dashboard': '仪表盘',
      '/papers': '论文',
      '/analysis': '分析结果',
      '/reports': '报告',
      '/feeds': '订阅源',
      '/email-topics': '邮件主题',
      '/reading-queue': '阅读队列',
      '/settings': '设置',
    },
    subtitles: {
      '/dashboard': '查看抓取、分析、邮件和备份工作流的实时状态',
      '/papers': '筛选论文、展开摘要并检查相关性评分',
      '/analysis': '复盘 AI 分析结果并加入阅读队列',
      '/reports': '生成、预览、下载和重发每日文献报告',
      '/feeds': '管理期刊 RSS 订阅源和批量刷新',
      '/email-topics': '按主题规则组织工作区邮件推送',
      '/reading-queue': '整理需要稍后精读的论文和外部文章',
      '/settings': '配置偏好、AI、邮件、同步和北京时间定时任务',
    },
    nav: [
      { path: '/dashboard', label: '仪表盘', mark: '仪', hint: 'Overview', featured: true },
      { path: '/papers', label: '论文', mark: '论', hint: 'Papers', featured: true },
      { path: '/analysis', label: '分析结果', mark: '析', hint: 'AI', featured: true },
      { path: '/reports', label: '报告', mark: '报', hint: 'Reports', featured: true },
      { path: '/feeds', label: '订阅源', mark: '源', hint: 'RSS', featured: true },
      { path: '/email-topics', label: '邮件主题', mark: '邮', hint: 'Mail', featured: true },
      { path: '/reading-queue', label: '阅读队列', mark: '读', hint: 'Queue', featured: true },
    ],
  },
  en: {
    brandSubtitle: 'research operations',
    workspace: 'Workspace',
    newWorkspace: 'New workspace',
    deleteWorkspace: 'Delete workspace',
    workspacePlaceholder: 'Workspace name',
    create: 'Create',
    confirmDelete: 'Delete',
    deleteWorkspaceMessage: 'This cannot be undone. All data in this workspace will be removed.',
    settings: 'Settings',
    settingsDesc: 'AI, email, sync, and scheduled jobs',
    switchLanguage: 'Switch language',
    switchLanguageDesc: 'Current interface is English. Switch back to Chinese.',
    switchTheme: 'Switch appearance',
    switchThemeDesc: 'Toggle between dark mode and day mode',
    about: 'About project',
    aboutDesc: 'Version, changelog, and roadmap',
    logout: 'Log out',
    logoutDesc: 'End this session',
    accountMenu: 'Account menu',
    account: 'Account',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    toggleLanguageTitle: 'Switch language',
    toggleThemeTitle: 'Switch dark/day mode',
    lightMode: 'Day mode',
    darkMode: 'Dark mode',
    close: 'Close',
    aboutBody: 'PaperPulse tracks journal RSS feeds, runs AI literature analysis, organizes reports, and sends email digests.',
    version: 'Version',
    project: 'Project',
    latestUpdate: 'Changelog',
    roadmap: 'Roadmap',
    changelog: [
      'Unified the workbench UI, settings page, and account menu.',
      'Added language switching, dark mode, and day mode.',
      'Scheduled jobs now run by Beijing time down to the minute.',
    ],
    roadmapItems: [
      'Expand full-app multilingual copy coverage.',
      'Add a schedule calendar, retry rules, and notification policies.',
      'Deepen Zotero, WeKnora, and report collaboration flows.',
    ],
    titles: {
      '/dashboard': 'Dashboard',
      '/papers': 'Papers',
      '/analysis': 'Analysis',
      '/reports': 'Reports',
      '/feeds': 'Feeds',
      '/email-topics': 'Email Topics',
      '/reading-queue': 'Reading Queue',
      '/settings': 'Settings',
    },
    subtitles: {
      '/dashboard': 'Monitor fetch, analysis, email, and backup workflows',
      '/papers': 'Filter papers, expand abstracts, and inspect relevance',
      '/analysis': 'Review AI results and add useful papers to the queue',
      '/reports': 'Generate, preview, download, and resend literature reports',
      '/feeds': 'Manage journal RSS sources and bulk refreshes',
      '/email-topics': 'Organize workspace email digests by topic rules',
      '/reading-queue': 'Collect papers and external articles for later reading',
      '/settings': 'Configure preferences, AI, email, sync, and Beijing-time jobs',
    },
    nav: [
      { path: '/dashboard', label: 'Dashboard', mark: 'D', hint: 'Overview', featured: true },
      { path: '/papers', label: 'Papers', mark: 'P', hint: 'Papers', featured: true },
      { path: '/analysis', label: 'Analysis', mark: 'A', hint: 'AI', featured: true },
      { path: '/reports', label: 'Reports', mark: 'R', hint: 'Reports', featured: true },
      { path: '/feeds', label: 'Feeds', mark: 'F', hint: 'RSS', featured: true },
      { path: '/email-topics', label: 'Email Topics', mark: 'M', hint: 'Mail', featured: true },
      { path: '/reading-queue', label: 'Reading Queue', mark: 'Q', hint: 'Queue', featured: true },
    ],
  },
}

const ui = computed(() => shellCopy[appStore.language])
const currentTitle = computed(() => (ui.value.titles as Record<string, string>)[route.path] || (route.meta.title as string) || 'PaperPulse')
const currentSubtitle = computed(() => {
  return (ui.value.subtitles as Record<string, string>)[route.path] || 'PaperPulse literature operations workspace'
})
const pageKey = computed(() => `${route.fullPath}:${workspaceStore.currentWorkspaceId || 'default'}`)
const accountInitial = computed(() => (appStore.authUsername || 'P').trim().slice(0, 1).toUpperCase())
const navItems = computed(() => ui.value.nav)

function isActive(path: string): boolean {
  if (path === '/email-topics') return ['/email-topics', '/keywords', '/email-rules'].includes(route.path)
  return route.path === path
}

function handleLogout() {
  closeAccountMenu()
  appStore.logout()
  router.push('/login')
}

function toggleAccountMenu() {
  accountMenuOpen.value = !accountMenuOpen.value
}

function closeAccountMenu() {
  accountMenuOpen.value = false
}

function toggleLanguageFromMenu() {
  appStore.toggleLanguage()
  closeAccountMenu()
}

function toggleThemeFromMenu() {
  appStore.toggleTheme()
  closeAccountMenu()
}

function openAbout() {
  closeAccountMenu()
  aboutOpen.value = true
}

function closeAbout() {
  aboutOpen.value = false
}

function switchWorkspace(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value)
  if (value) workspaceStore.switchWorkspace(value)
}

async function createWorkspace() {
  createWsOpen.value = true
}

async function onCreateWsConfirm(name: string) {
  createWsOpen.value = false
  if (!name) return
  try {
    const { data } = await workspaceApi.create({ name })
    await workspaceStore.load()
    workspaceStore.switchWorkspace(data.id)
  } catch (err: any) {
    appStore.error((appStore.isEnglish ? 'Failed to create workspace: ' : '创建工作区失败: ') + err.message)
  }
}

async function deleteWorkspace() {
  const ws = workspaceStore.currentWorkspace
  if (!ws || ws.is_default) return
  deleteWsOpen.value = true
}

async function onDeleteWsConfirm() {
  deleteWsOpen.value = false
  const ws = workspaceStore.currentWorkspace
  if (!ws) return
  try {
    await workspaceApi.delete(ws.id)
    await workspaceStore.load()
    const def = workspaceStore.workspaces.find(w => w.is_default) || workspaceStore.workspaces[0]
    if (def) workspaceStore.switchWorkspace(def.id)
    appStore.success(appStore.isEnglish ? 'Workspace deleted' : '工作区已删除')
  } catch (err: any) {
    appStore.error((appStore.isEnglish ? 'Delete failed: ' : '删除失败: ') + (err.response?.data?.detail || err.message))
  }
}

onMounted(() => {
  if (appStore.isLoggedIn) workspaceStore.load()
})

const toastClasses: Record<string, string> = {
  success: 'bg-[rgba(16,185,129,0.12)] border-[rgba(16,185,129,0.28)] text-[#6ee7b7] shadow-2xl shadow-black/30 backdrop-blur-xl',
  error: 'bg-[rgba(244,63,94,0.12)] border-[rgba(244,63,94,0.28)] text-[#fda4af] shadow-2xl shadow-black/30 backdrop-blur-xl',
  info: 'bg-[rgba(59,130,246,0.12)] border-[rgba(59,130,246,0.30)] text-[#93c5fd] shadow-2xl shadow-black/30 backdrop-blur-xl',
  warning: 'bg-[rgba(245,158,11,0.12)] border-[rgba(245,158,11,0.30)] text-[#fcd34d] shadow-2xl shadow-black/30 backdrop-blur-xl',
}
</script>
