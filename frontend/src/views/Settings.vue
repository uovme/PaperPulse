<template>
  <div class="settings-page space-y-5">
    <section class="settings-hero">
      <div class="min-w-0">
        <p class="xai-eyebrow">{{ copy.eyebrow }}</p>
        <h2>{{ copy.title }}</h2>
        <p>{{ copy.description }}</p>
      </div>
    </section>

    <div class="settings-layout">
      <aside class="settings-tablist" aria-label="Settings sections">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="['settings-tab', activeTab === tab.id ? 'settings-tab-active' : '']"
          @click="activeTab = tab.id"
        >
          <span class="settings-tab-mark">{{ tab.mark }}</span>
          <span class="min-w-0">
            <span class="settings-tab-label">{{ tab.label }}</span>
            <span class="settings-tab-desc">{{ tab.desc }}</span>
          </span>
        </button>
      </aside>

      <section class="settings-panel">
        <div class="settings-panel-header">
          <div>
            <p class="xai-eyebrow">{{ currentTab?.label }}</p>
            <h3>{{ currentTab?.title }}</h3>
            <p>{{ currentTab?.intro }}</p>
          </div>
        </div>

        <div v-if="activeTab === 'preferences'" class="settings-stack">
          <div class="settings-option-row">
            <div>
              <h4>{{ copy.languageTitle }}</h4>
              <p>{{ copy.languageDesc }}</p>
            </div>
            <div class="settings-segmented">
              <button
                type="button"
                :class="['settings-segment', appStore.language === 'zh' ? 'settings-segment-active' : '']"
                @click="appStore.setLanguage('zh')"
              >
                中文
              </button>
              <button
                type="button"
                :class="['settings-segment', appStore.language === 'en' ? 'settings-segment-active' : '']"
                @click="appStore.setLanguage('en')"
              >
                English
              </button>
            </div>
          </div>

          <div class="settings-option-row">
            <div>
              <h4>{{ copy.themeTitle }}</h4>
              <p>{{ copy.themeDesc }}</p>
            </div>
            <button class="settings-mode-button" type="button" @click="appStore.toggleTheme">
              <span class="settings-mode-dot"></span>
              {{ appStore.isDarkMode ? copy.dayMode : copy.darkMode }}
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'ai'" class="settings-stack">
          <div class="settings-grid">
            <label class="settings-field md:col-span-2">
              <span>{{ copy.apiBase }}</span>
              <input v-model="aiForm.api_base" type="text" class="settings-input" placeholder="https://api.openai.com/v1" />
            </label>
            <label class="settings-field">
              <span>{{ copy.apiKey }}</span>
              <div class="relative">
                <input
                  v-model="aiForm.api_key"
                  :type="showApiKey ? 'text' : 'password'"
                  class="settings-input pr-10"
                  placeholder="sk-..."
                />
                <button class="settings-inline-icon" type="button" @click="showApiKey = !showApiKey">
                  {{ showApiKey ? copy.hide : copy.show }}
                </button>
              </div>
            </label>
            <label class="settings-field">
              <span>{{ copy.model }}</span>
              <input v-model="aiForm.model" type="text" class="settings-input" placeholder="gpt-4o-mini" />
            </label>
            <label class="settings-field">
              <span>{{ copy.reasoning }}</span>
              <select v-model="aiForm.reasoning_effort" class="settings-input">
                <option value="xhigh">xhigh</option>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
                <option value="none">none</option>
              </select>
            </label>
            <label class="settings-switch-line">
              <span>
                <strong>{{ copy.aiEnabled }}</strong>
                <small>{{ aiForm.enabled ? copy.enabled : copy.disabled }}</small>
              </span>
              <button
                type="button"
                :class="['settings-switch', aiForm.enabled ? 'settings-switch-on' : '']"
                @click="aiForm.enabled = !aiForm.enabled"
              >
                <span></span>
              </button>
            </label>
          </div>

          <div class="settings-actions">
            <button class="xai-btn xai-btn-primary" type="button" :disabled="savingAI" @click="saveAI">
              {{ savingAI ? copy.saving : copy.saveConfig }}
            </button>
            <button class="xai-btn" type="button" :disabled="testingAI" @click="testAI">
              {{ testingAI ? copy.testing : copy.testConnection }}
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'email'" class="settings-stack">
          <div class="settings-grid">
            <label class="settings-field">
              <span>{{ copy.smtpServer }}</span>
              <input v-model="emailForm.smtp_server" type="text" class="settings-input" placeholder="smtp.gmail.com" />
            </label>
            <label class="settings-field">
              <span>{{ copy.port }}</span>
              <input v-model.number="emailForm.smtp_port" type="number" class="settings-input" placeholder="587" />
            </label>
            <label class="settings-field">
              <span>{{ copy.username }}</span>
              <input v-model="emailForm.smtp_user" type="text" class="settings-input" placeholder="your@email.com" />
            </label>
            <label class="settings-field">
              <span>{{ copy.password }}</span>
              <input v-model="emailForm.smtp_password" type="password" class="settings-input" placeholder="******" />
            </label>
            <label class="settings-field">
              <span>{{ copy.senderName }}</span>
              <input v-model="emailForm.sender_name" type="text" class="settings-input" placeholder="PaperPulse" />
            </label>
            <label class="settings-field">
              <span>{{ copy.recipient }}</span>
              <input v-model="emailForm.recipient" type="email" class="settings-input" placeholder="recipient@email.com" />
            </label>
            <label class="settings-switch-line md:col-span-2">
              <span>
                <strong>{{ copy.emailEnabled }}</strong>
                <small>{{ emailForm.enabled ? copy.enabled : copy.disabled }}</small>
              </span>
              <button
                type="button"
                :class="['settings-switch', emailForm.enabled ? 'settings-switch-on' : '']"
                @click="emailForm.enabled = !emailForm.enabled"
              >
                <span></span>
              </button>
            </label>
          </div>

          <div class="settings-actions">
            <button class="xai-btn xai-btn-primary" type="button" :disabled="savingEmail" @click="saveEmail">
              {{ savingEmail ? copy.saving : copy.saveConfig }}
            </button>
            <button class="xai-btn" type="button" :disabled="testingEmail" @click="testEmail">
              {{ testingEmail ? copy.testing : copy.sendTestEmail }}
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'webdav'" class="settings-stack">
          <div class="settings-grid">
            <label class="settings-field md:col-span-2">
              <span>{{ copy.webdavUrl }}</span>
              <input v-model="webdavForm.url" type="text" class="settings-input" placeholder="https://dav.example.com/dav/" />
            </label>
            <label class="settings-field">
              <span>{{ copy.username }}</span>
              <input v-model="webdavForm.username" type="text" class="settings-input" placeholder="username" />
            </label>
            <label class="settings-field">
              <span>{{ copy.password }}</span>
              <input v-model="webdavForm.password" type="password" class="settings-input" placeholder="******" />
            </label>
            <label class="settings-field md:col-span-2">
              <span>{{ copy.remotePath }}</span>
              <input v-model="webdavForm.remote_path" type="text" class="settings-input" placeholder="/paperpulse/" />
            </label>
          </div>

          <div class="settings-actions">
            <button class="xai-btn xai-btn-primary" type="button" :disabled="savingWebDAV" @click="saveWebDAV">
              {{ savingWebDAV ? copy.saving : copy.saveConfig }}
            </button>
            <button class="xai-btn" type="button" :disabled="testingWebDAV" @click="testWebDAV">
              {{ testingWebDAV ? copy.testing : copy.testConnection }}
            </button>
            <button class="xai-btn" type="button" :disabled="backingUpWebDAV" @click="backupWebDAV">
              {{ backingUpWebDAV ? copy.backingUp : copy.backupNow }}
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'weknora'" class="settings-stack">
          <div class="settings-grid">
            <label class="settings-field md:col-span-2">
              <span>{{ copy.apiBase }}</span>
              <input v-model="weknoraForm.base_url" type="text" class="settings-input" placeholder="http://localhost:8080/api/v1" />
            </label>
            <label class="settings-field">
              <span>{{ copy.apiKey }}</span>
              <input v-model="weknoraForm.api_key" type="password" class="settings-input" placeholder="sk-..." />
            </label>
            <label class="settings-field">
              <span>{{ copy.knowledgeBase }}</span>
              <input v-model="weknoraForm.knowledge_base_id" type="text" class="settings-input" placeholder="kb-..." />
            </label>
            <label class="settings-field">
              <span>{{ copy.minScore }}</span>
              <input v-model.number="weknoraForm.min_score_to_sync" type="number" min="0" max="10" step="0.5" class="settings-input" />
            </label>
            <label class="settings-switch-line">
              <span>
                <strong>{{ copy.weknoraEnabled }}</strong>
                <small>{{ weknoraForm.enabled ? copy.enabled : copy.disabled }}</small>
              </span>
              <button
                type="button"
                :class="['settings-switch', weknoraForm.enabled ? 'settings-switch-on' : '']"
                @click="weknoraForm.enabled = !weknoraForm.enabled"
              >
                <span></span>
              </button>
            </label>
            <label class="settings-check">
              <input v-model="weknoraForm.sync_reports" type="checkbox" />
              <span>{{ copy.syncReports }}</span>
            </label>
            <label class="settings-check">
              <input v-model="weknoraForm.sync_papers" type="checkbox" />
              <span>{{ copy.syncPapers }}</span>
            </label>
          </div>

          <div class="settings-actions">
            <button class="xai-btn xai-btn-primary" type="button" :disabled="savingWeKnora" @click="saveWeKnora">
              {{ savingWeKnora ? copy.saving : copy.saveConfig }}
            </button>
            <button class="xai-btn" type="button" :disabled="testingWeKnora" @click="testWeKnora">
              {{ testingWeKnora ? copy.testing : copy.testConnection }}
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'schedule'" class="settings-stack">
          <div class="settings-time-card">
            <div>
              <p class="xai-eyebrow">{{ copy.beijingTime }}</p>
              <h4>{{ schedulePreview }}</h4>
              <p>{{ copy.scheduleHint }}</p>
            </div>
            <label class="settings-field settings-time-input">
              <span>{{ copy.executionTime }}</span>
              <input v-model="scheduleTime" type="time" class="settings-input" />
            </label>
          </div>

          <div class="settings-info">
            {{ copy.timezoneNote }}
          </div>

          <div class="settings-actions">
            <button class="xai-btn xai-btn-primary" type="button" :disabled="savingSchedule" @click="saveSchedule">
              {{ savingSchedule ? copy.saving : copy.saveConfig }}
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'changelog'" class="settings-stack">
          <div class="settings-release-grid">
            <article v-for="entry in copy.changelogItems" :key="entry.title" class="settings-release-card">
              <p class="xai-eyebrow">{{ entry.date }}</p>
              <h4>{{ entry.title }}</h4>
              <p>{{ entry.body }}</p>
            </article>
          </div>
          <div class="settings-roadmap">
            <p class="xai-eyebrow">{{ copy.roadmapTitle }}</p>
            <ul>
              <li v-for="item in copy.roadmapItems" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { settingsApi } from '@/api'
import { useAppStore } from '@/stores/app'

type TabId = 'preferences' | 'ai' | 'email' | 'webdav' | 'weknora' | 'schedule' | 'changelog'

const appStore = useAppStore()

const copyMap = {
  zh: {
    eyebrow: '设置',
    title: '系统偏好与连接配置',
    description: '统一管理界面语言、外观、AI、邮件、同步和北京时间定时任务。',
    dayMode: '白天模式',
    darkMode: '深色模式',
    languageTitle: '语言',
    languageDesc: '切换应用外壳和设置页语言，偏好会保存在当前浏览器。',
    themeTitle: '外观模式',
    themeDesc: '深色模式适合长时间阅读，白天模式适合明亮环境。',
    apiBase: 'API 地址',
    apiKey: 'API Key',
    model: '模型',
    reasoning: '推理强度',
    aiEnabled: 'AI 分析',
    enabled: '已启用',
    disabled: '已禁用',
    show: '显示',
    hide: '隐藏',
    smtpServer: 'SMTP 服务器',
    port: '端口',
    username: '用户名',
    password: '密码',
    senderName: '发件人名称',
    recipient: '收件人',
    emailEnabled: '邮件推送',
    webdavUrl: 'WebDAV URL',
    remotePath: '远程路径',
    knowledgeBase: '知识库 ID',
    minScore: '论文同步最低分',
    weknoraEnabled: 'WeKnora 联动',
    syncReports: '同步报告 Markdown',
    syncPapers: '同步高相关论文',
    beijingTime: '北京时间',
    executionTime: '执行时间',
    scheduleHint: '每日自动抓取、分析和报告会按这个北京时间触发。',
    timezoneNote: '后端调度器使用 Asia/Shanghai 时区；即使服务器在 UTC 环境运行，也按这里选择的北京时间执行。',
    saveConfig: '保存配置',
    saving: '保存中...',
    testConnection: '测试连接',
    testing: '测试中...',
    backupNow: '立即备份',
    backingUp: '备份中...',
    sendTestEmail: '发送测试邮件',
    roadmapTitle: '日后功能方向',
    changelogItems: [
      {
        date: '2026-07-06',
        title: '备份与抓取口径优化',
        body: 'WebDAV 增加立即备份入口，仪表盘“抓取全部订阅”只执行 RSS 抓取，论文列表补充抓取/更新时间。',
      },
      {
        date: '2026-07-04',
        title: 'UI 与偏好系统统一',
        body: '设置页、账户菜单和应用外壳统一到工作台风格，并新增语言、深色模式和白天模式切换。',
      },
      {
        date: '2026-07-04',
        title: '北京时间定时任务',
        body: '定时任务从小时/分钟输入升级为清晰的北京时间选择，后端调度器同步使用 Asia/Shanghai。',
      },
      {
        date: '2026-07-04',
        title: '账户入口稳定性',
        body: '侧栏底部账户区改为固定布局层，避免在长页面、折叠侧栏或窄屏状态下消失。',
      },
    ],
    roadmapItems: [
      '扩展全站完整中英双语覆盖，包括论文、报告和工作流详情页。',
      '新增任务日历、失败重试、运行窗口和节假日跳过策略。',
      '强化 Zotero 双向同步、WeKnora 知识库回写和报告协作批注。',
      '加入更细的主题 token 和密度设置，服务长时间阅读与高频运维场景。',
    ],
    tabs: [
      { id: 'preferences', label: '偏好', title: '语言与外观', desc: '主题/语言', intro: '这些偏好只影响当前浏览器，切换后立即生效。', mark: '偏' },
      { id: 'ai', label: 'AI', title: 'AI 配置', desc: '模型/Key', intro: '配置用于论文相关性判断、摘要和报告生成的兼容 API。', mark: 'AI' },
      { id: 'email', label: '邮件', title: '邮件配置', desc: 'SMTP', intro: '配置每日文献报告的发件服务和默认收件人。', mark: '邮' },
      { id: 'webdav', label: 'WebDAV', title: 'WebDAV 同步', desc: '备份', intro: '将订阅源、论文和分析结果备份到远程 WebDAV 目录。', mark: '同' },
      { id: 'weknora', label: 'WeKnora', title: 'WeKnora 联动', desc: '知识库', intro: '同步报告和高相关论文到 WeKnora 知识库。', mark: '知' },
      { id: 'schedule', label: '定时任务', title: '北京时间定时任务', desc: 'Asia/Shanghai', intro: '设置每日自动工作流按北京时间几点几分执行。', mark: '时' },
      { id: 'changelog', label: '更新日志', title: '更新日志与未来方向', desc: 'Roadmap', intro: '记录本次改动，并明确后续功能演进方向。', mark: '更' },
    ],
  },
  en: {
    eyebrow: 'Settings',
    title: 'System preferences and integrations',
    description: 'Manage language, appearance, AI, email, sync, and Beijing-time scheduled jobs.',
    dayMode: 'Day mode',
    darkMode: 'Dark mode',
    languageTitle: 'Language',
    languageDesc: 'Switch app shell and settings language. The preference is saved in this browser.',
    themeTitle: 'Appearance',
    themeDesc: 'Dark mode supports long reading sessions; day mode works better in bright environments.',
    apiBase: 'API base',
    apiKey: 'API Key',
    model: 'Model',
    reasoning: 'Reasoning effort',
    aiEnabled: 'AI analysis',
    enabled: 'Enabled',
    disabled: 'Disabled',
    show: 'Show',
    hide: 'Hide',
    smtpServer: 'SMTP server',
    port: 'Port',
    username: 'Username',
    password: 'Password',
    senderName: 'Sender name',
    recipient: 'Recipient',
    emailEnabled: 'Email delivery',
    webdavUrl: 'WebDAV URL',
    remotePath: 'Remote path',
    knowledgeBase: 'Knowledge base ID',
    minScore: 'Minimum score to sync',
    weknoraEnabled: 'WeKnora integration',
    syncReports: 'Sync report Markdown',
    syncPapers: 'Sync high-relevance papers',
    beijingTime: 'Beijing time',
    executionTime: 'Execution time',
    scheduleHint: 'The daily fetch, analysis, and report workflow runs at this Beijing time.',
    timezoneNote: 'The backend scheduler uses Asia/Shanghai, so this time runs as Beijing time even on UTC servers.',
    saveConfig: 'Save configuration',
    saving: 'Saving...',
    testConnection: 'Test connection',
    testing: 'Testing...',
    backupNow: 'Back up now',
    backingUp: 'Backing up...',
    sendTestEmail: 'Send test email',
    roadmapTitle: 'Roadmap',
    changelogItems: [
      {
        date: '2026-07-06',
        title: 'Backup and fetch behavior updates',
        body: 'WebDAV now supports manual backup, dashboard feed refresh only fetches RSS updates, and paper cards show their fetched/updated time.',
      },
      {
        date: '2026-07-04',
        title: 'Unified UI and preferences',
        body: 'The settings page, account menu, and app shell now share the same workbench language with language and theme controls.',
      },
      {
        date: '2026-07-04',
        title: 'Beijing-time scheduled jobs',
        body: 'Scheduling now exposes a clear Beijing-time picker and the backend scheduler runs with Asia/Shanghai.',
      },
      {
        date: '2026-07-04',
        title: 'Stable account entry',
        body: 'The sidebar account area now keeps its own fixed footer layer so it does not disappear across long pages or narrow layouts.',
      },
    ],
    roadmapItems: [
      'Expand full Chinese/English coverage across paper, report, and workflow detail screens.',
      'Add a schedule calendar, retry policies, execution windows, and holiday skip rules.',
      'Improve Zotero two-way sync, WeKnora write-back, and collaborative report annotation.',
      'Add finer theme tokens and density settings for long reading and repeated operations.',
    ],
    tabs: [
      { id: 'preferences', label: 'Preferences', title: 'Language and appearance', desc: 'Theme/lang', intro: 'These browser-level preferences apply immediately.', mark: 'P' },
      { id: 'ai', label: 'AI', title: 'AI configuration', desc: 'Model/key', intro: 'Configure the compatible API used for relevance, summaries, and reports.', mark: 'AI' },
      { id: 'email', label: 'Email', title: 'Email configuration', desc: 'SMTP', intro: 'Configure the sender service and default recipient for literature reports.', mark: 'M' },
      { id: 'webdav', label: 'WebDAV', title: 'WebDAV sync', desc: 'Backup', intro: 'Back up feeds, papers, and analysis results to a remote WebDAV folder.', mark: 'S' },
      { id: 'weknora', label: 'WeKnora', title: 'WeKnora integration', desc: 'Knowledge', intro: 'Sync reports and high-relevance papers to a WeKnora knowledge base.', mark: 'K' },
      { id: 'schedule', label: 'Schedule', title: 'Beijing-time schedule', desc: 'Asia/Shanghai', intro: 'Choose the exact Beijing time for the daily workflow.', mark: 'T' },
      { id: 'changelog', label: 'Changelog', title: 'Changelog and roadmap', desc: 'Roadmap', intro: 'Track this update and the next product directions.', mark: 'C' },
    ],
  },
} as const

const copy = computed(() => copyMap[appStore.language])
const tabs = computed(() => copy.value.tabs as unknown as Array<{
  id: TabId
  label: string
  title: string
  desc: string
  intro: string
  mark: string
}>)
const activeTab = ref<TabId>('preferences')
const currentTab = computed(() => tabs.value.find(tab => tab.id === activeTab.value))
const showApiKey = ref(false)

const aiForm = reactive({
  api_base: '',
  api_key: '',
  model: '',
  reasoning_effort: 'xhigh',
  enabled: false,
})
const savingAI = ref(false)
const testingAI = ref(false)

const emailForm = reactive({
  smtp_server: '',
  smtp_port: 587,
  smtp_user: '',
  smtp_password: '',
  sender_name: '',
  recipient: '',
  enabled: false,
})
const savingEmail = ref(false)
const testingEmail = ref(false)

const webdavForm = reactive({
  url: '',
  username: '',
  password: '',
  remote_path: '',
})
const savingWebDAV = ref(false)
const testingWebDAV = ref(false)
const backingUpWebDAV = ref(false)

const weknoraForm = reactive({
  enabled: false,
  base_url: 'http://localhost:8080/api/v1',
  api_key: '',
  knowledge_base_id: '',
  min_score_to_sync: 6.0,
  sync_reports: true,
  sync_papers: true,
})
const savingWeKnora = ref(false)
const testingWeKnora = ref(false)

const scheduleForm = reactive({
  cron_hour: 8,
  cron_minute: 0,
  timezone: 'Asia/Shanghai',
})
const savingSchedule = ref(false)

const scheduleTime = computed({
  get() {
    return `${padTime(scheduleForm.cron_hour, 23)}:${padTime(scheduleForm.cron_minute, 59)}`
  },
  set(value: string) {
    const [hour, minute] = value.split(':').map(Number)
    if (Number.isInteger(hour) && Number.isInteger(minute)) {
      scheduleForm.cron_hour = clamp(hour, 0, 23)
      scheduleForm.cron_minute = clamp(minute, 0, 59)
    }
  },
})

const schedulePreview = computed(() => `${scheduleTime.value} ${copy.value.beijingTime}`)

function padTime(value: number, max: number) {
  return String(clamp(value, 0, max)).padStart(2, '0')
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.min(Math.max(Math.trunc(value), min), max)
}

function normalizeSchedule() {
  scheduleForm.cron_hour = clamp(scheduleForm.cron_hour, 0, 23)
  scheduleForm.cron_minute = clamp(scheduleForm.cron_minute, 0, 59)
  scheduleForm.timezone = 'Asia/Shanghai'
}

function errorPrefix(action: string) {
  if (appStore.isEnglish) return `${action} failed: `
  return `${action}失败: `
}

async function loadAI() {
  try {
    const { data } = await settingsApi.getAI()
    Object.assign(aiForm, data)
  } catch {
    // use defaults
  }
}

async function loadEmail() {
  try {
    const { data } = await settingsApi.getEmail()
    Object.assign(emailForm, data)
  } catch {
    // use defaults
  }
}

async function loadWebDAV() {
  try {
    const { data } = await settingsApi.getWebDAV()
    Object.assign(webdavForm, data)
  } catch {
    // use defaults
  }
}

async function loadWeKnora() {
  try {
    const { data } = await settingsApi.getWeKnora()
    Object.assign(weknoraForm, data)
  } catch {
    // use defaults
  }
}

async function loadSchedule() {
  try {
    const { data } = await settingsApi.getSchedule()
    Object.assign(scheduleForm, data)
    normalizeSchedule()
  } catch {
    normalizeSchedule()
  }
}

async function saveAI() {
  savingAI.value = true
  try {
    await settingsApi.saveAI({ ...aiForm })
    appStore.success(appStore.isEnglish ? 'AI configuration saved' : 'AI 配置已保存')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Save' : '保存') + err.message)
  } finally {
    savingAI.value = false
  }
}

async function saveEmail() {
  savingEmail.value = true
  try {
    await settingsApi.saveEmail({ ...emailForm })
    appStore.success(appStore.isEnglish ? 'Email configuration saved' : '邮件配置已保存')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Save' : '保存') + err.message)
  } finally {
    savingEmail.value = false
  }
}

async function saveWebDAV() {
  savingWebDAV.value = true
  try {
    await settingsApi.saveWebDAV({ ...webdavForm })
    appStore.success(appStore.isEnglish ? 'WebDAV configuration saved' : 'WebDAV 配置已保存')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Save' : '保存') + err.message)
  } finally {
    savingWebDAV.value = false
  }
}

async function saveWeKnora() {
  savingWeKnora.value = true
  try {
    await settingsApi.saveWeKnora({ ...weknoraForm })
    appStore.success(appStore.isEnglish ? 'WeKnora configuration saved' : 'WeKnora 配置已保存')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Save' : '保存') + err.message)
  } finally {
    savingWeKnora.value = false
  }
}

async function saveSchedule() {
  savingSchedule.value = true
  normalizeSchedule()
  try {
    await settingsApi.saveSchedule({ ...scheduleForm })
    appStore.success(appStore.isEnglish ? 'Beijing-time schedule saved' : '北京时间定时任务已保存')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Save' : '保存') + err.message)
  } finally {
    savingSchedule.value = false
  }
}

async function testAI() {
  testingAI.value = true
  try {
    await settingsApi.testAI({ ...aiForm })
    appStore.success(appStore.isEnglish ? 'AI connection succeeded' : 'AI 连接测试成功')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Connection test' : '连接测试') + err.message)
  } finally {
    testingAI.value = false
  }
}

async function testEmail() {
  testingEmail.value = true
  try {
    await settingsApi.testEmail({ ...emailForm })
    appStore.success(appStore.isEnglish ? 'Test email sent' : '测试邮件已发送')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Send test email' : '发送测试邮件') + err.message)
  } finally {
    testingEmail.value = false
  }
}

async function testWebDAV() {
  testingWebDAV.value = true
  try {
    await settingsApi.testWebDAV({ ...webdavForm })
    appStore.success(appStore.isEnglish ? 'WebDAV connection succeeded' : 'WebDAV 连接测试成功')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Connection test' : '连接测试') + err.message)
  } finally {
    testingWebDAV.value = false
  }
}

async function backupWebDAV() {
  backingUpWebDAV.value = true
  try {
    await settingsApi.backupWebDAV()
    appStore.success(appStore.isEnglish ? 'WebDAV backup completed' : 'WebDAV 备份完成')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Backup' : '备份') + err.message)
  } finally {
    backingUpWebDAV.value = false
  }
}

async function testWeKnora() {
  testingWeKnora.value = true
  try {
    await settingsApi.testWeKnora({ ...weknoraForm })
    appStore.success(appStore.isEnglish ? 'WeKnora connection succeeded' : 'WeKnora 连接测试成功')
  } catch (err: any) {
    appStore.error(errorPrefix(appStore.isEnglish ? 'Connection test' : '连接测试') + err.message)
  } finally {
    testingWeKnora.value = false
  }
}

onMounted(() => {
  loadAI()
  loadEmail()
  loadWebDAV()
  loadWeKnora()
  loadSchedule()
})
</script>
