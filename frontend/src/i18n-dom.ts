import { nextTick, watch } from 'vue'
import type { LanguageCode } from '@/stores/app'

const zhToEn: Record<string, string> = {
  '抓取、分析和报告，放在一个稳定的研究工作台里。': 'Fetch, analyze, and report from one stable research workbench.',
  '面向单用户部署的文献监控系统，集中处理 RSS、AI 相关性分析、邮件报告、WebDAV 备份和工作区隔离。': 'A single-user literature monitoring system for RSS, AI relevance analysis, email reports, WebDAV backup, and workspace isolation.',
  '初始化账户': 'Initialize Account',
  '登录 PaperPulse': 'Log in to PaperPulse',
  '创建唯一管理员，开始管理你的文献工作流。': 'Create the only admin account and start managing your literature workflow.',
  '进入你的文献监控与分析工作台。': 'Enter your literature monitoring and analysis workbench.',
  '用户名': 'Username',
  '密码': 'Password',
  '请输入用户名': 'Enter username',
  '请输入密码': 'Enter password',
  '处理中...': 'Processing...',
  '注册': 'Register',
  '登录': 'Log in',
  '已有账户？': 'Already have an account?',
  '去登录': 'Go to login',
  '首次使用？': 'First time here?',
  '注册账户': 'Create account',
  '操作失败': 'Operation failed',
  '保存失败': 'Save failed',
  '连接测试失败': 'Connection test failed',
  '发送测试邮件失败': 'Failed to send test email',
  '创建工作区失败': 'Failed to create workspace',
  '加载分析结果失败': 'Failed to load analysis results',
  '加入阅读队列失败': 'Failed to add to reading queue',
  '取消编辑': 'Cancel edit',

  '快捷操作': 'Quick Actions',
  '抓取全部订阅': 'Fetch all feeds',
  '运行分析': 'Run analysis',
  '发送报告': 'Send report',
  '一键抓取并分析': 'Fetch and analyze',
  '运行完整工作流': 'Run full workflow',
  '分析进度': 'Analysis Progress',
  '暂停': 'Pause',
  '继续': 'Resume',
  '取消': 'Cancel',
  '已分析': 'Analyzed',
  '相关论文': 'Relevant Papers',
  '分析结果': 'Analysis Results',
  '趋势': 'Trend',
  '重新分析': 'Reanalyze',
  '每日新增': 'Daily New',
  '每日分析': 'Daily Analysis',
  '累计总量': 'Cumulative Total',
  '加载中...': 'Loading...',
  '加载统计数据失败': 'Failed to load stats',
  '加载近期论文失败': 'Failed to load recent papers',
  '加载执行记录失败': 'Failed to load workflow runs',
  '加载执行日志失败': 'Failed to load execution logs',
  '刷新分析进度失败': 'Failed to refresh analysis progress',
  '分析失败': 'Analysis failed',
  '文献汇总分析已取消': 'Literature analysis cancelled',
  '文献汇总分析完成': 'Literature analysis complete',
  '已发送暂停请求，当前论文处理完后暂停': 'Pause requested. The current paper will finish first.',
  '文献汇总分析已继续': 'Literature analysis resumed',
  '已发送取消请求': 'Cancel requested',
  '控制分析任务失败': 'Failed to control analysis task',
  '抓取并分析已开始': 'Fetch and analysis started',
  '文献汇总分析已开始': 'Literature analysis started',
  '报告已发送': 'Report sent',
  '报告未发送：请检查邮件配置或是否有符合条件的论文': 'Report not sent. Check email settings or matching papers.',
  '完整工作流运行完成': 'Full workflow completed',
  '完整工作流运行失败': 'Full workflow failed',
  '完整工作流失败': 'Full workflow failed',
  '重新分析失败': 'Reanalysis failed',
  '工作流记录': 'Workflow Runs',
  '全部记录': 'All records',
  '刷新': 'Refresh',
  '暂无执行记录': 'No workflow runs yet',
  '执行详情': 'Run Details',
  '收起': 'Collapse',
  '展开': 'Expand',
  '选择一条执行记录查看节点日志': 'Select a workflow run to view node logs',
  '节点日志': 'Node Logs',
  '暂无节点日志': 'No node logs yet',
  '展开查看节点日志': 'Expand to view node logs',
  '高相关论文': 'High-Relevance Papers',
  '查看全部 →': 'View all →',
  '暂无高相关性论文': 'No high-relevance papers yet',
  '等待中': 'Pending',
  '运行中': 'Running',
  '已暂停': 'Paused',
  '已取消': 'Cancelled',
  '成功': 'Success',
  '失败': 'Failed',
  '手动 AI 分析': 'Manual AI analysis',
  '手动抓取并分析': 'Manual fetch and analyze',
  '手动发送报告': 'Manual report send',
  '每日完整工作流': 'Daily full workflow',
  '无摘要': 'No summary',
  '订阅源': 'Feeds',
  '论文总数': 'Total Papers',
  '今日新增': 'New Today',
  '今日分析': 'Analyzed Today',
  '高相关': 'High Relevance',
  '1天': '1 day',
  '3天': '3 days',
  '7天': '7 days',
  '14天': '14 days',
  '邮件已发送': 'Email sent',
  '邮件未发送': 'Email not sent',
  'WebDAV已备份': 'WebDAV backed up',
  'WebDAV未备份': 'WebDAV not backed up',
  '新增:': 'New:',
  '分析:': 'Analysis:',
  '相关:': 'Relevant:',
  '累计:': 'Total:',

  '搜索': 'Search',
  '搜索论文标题、作者...': 'Search paper title or authors...',
  '期刊': 'Journal',
  '全部期刊': 'All journals',
  '关键词': 'Keyword',
  '关键词筛选...': 'Filter by keyword...',
  '评分': 'Score',
  '全部评分': 'All scores',
  '≥ 7 高相关': '≥ 7 High relevance',
  '≥ 5 中相关': '≥ 5 Medium relevance',
  '≥ 3 低相关': '≥ 3 Low relevance',
  '完整摘要': 'Full Abstract',
  'AI 分析摘要': 'AI Analysis Summary',
  '原文链接 →': 'Source link →',
  '暂无论文数据': 'No paper data yet',
  '上一页': 'Previous',
  '下一页': 'Next',
  '未分析': 'Not analyzed',
  '加载论文失败': 'Failed to load papers',

  '主题词': 'Topic',
  '全部主题': 'All topics',
  '全部关键词': 'All keywords',
  '研究质量评分': 'Research Quality Score',
  '全部（含不相关）': 'All, including irrelevant',
  '仅相关': 'Relevant only',
  '≥ 5 良好': '≥ 5 Good',
  '≥ 7 优秀': '≥ 7 Excellent',
  '≥ 9 顶尖': '≥ 9 Top tier',
  '重置': 'Reset',
  '暂无分析结果。请先在仪表盘运行文献分析。': 'No analysis results yet. Run literature analysis from the dashboard first.',
  '论文摘要': 'Paper Abstract',
  '该订阅源未提供摘要': 'This feed did not provide an abstract',
  '添加中...': 'Adding...',
  '加入阅读队列': 'Add to Reading Queue',
  '原文 →': 'Source →',
  '已加入阅读队列': 'Added to reading queue',

  'RSS 订阅源管理': 'RSS Feed Management',
  '刷新中...': 'Refreshing...',
  '全部刷新': 'Refresh all',
  '删除所选': 'Delete selected',
  '添加订阅源': 'Add feed',
  '名称': 'Name',
  '论文数': 'Papers',
  '上次抓取': 'Last fetched',
  '状态': 'Status',
  '操作': 'Actions',
  '从未': 'Never',
  '抓取': 'Fetch',
  '编辑': 'Edit',
  '删除': 'Delete',
  '还没有订阅源': 'No feeds yet',
  '添加第一个订阅源 →': 'Add your first feed →',
  '编辑订阅源': 'Edit feed',
  '期刊名称': 'Journal name',
  '如：Nature Materials': 'e.g. Nature Materials',
  '保存中...': 'Saving...',
  '保存': 'Save',
  '批量删除失败': 'Bulk delete failed',
  '删除失败': 'Delete failed',
  '抓取失败': 'Fetch failed',
  '全部刷新失败': 'Refresh all failed',
  '加载订阅源失败': 'Failed to load feeds',
  '订阅源已更新': 'Feed updated',
  '订阅源已添加': 'Feed added',
  '订阅源已删除': 'Feed deleted',
  '已启用': 'Enabled',
  '已禁用': 'Disabled',

  '编辑邮件主题': 'Edit Email Topic',
  '创建邮件主题': 'Create Email Topic',
  '按规则行组合关键词，系统会按主题分别筛选论文并发送邮件。': 'Combine keywords by rule row. Papers are filtered and emailed by topic.',
  '新主题': 'New topic',
  '保存主题': 'Save topic',
  '创建主题': 'Create topic',
  '主题名称': 'Topic name',
  '例如：疲劳与蠕变': 'e.g. fatigue and creep',
  '邮件发送': 'Email delivery',
  '启用': 'Enabled',
  '自定义收件人': 'Custom recipients',
  '留空使用全局邮件配置': 'Leave blank to use global email settings',
  '主题规则': 'Topic Rules',
  '第一行输入主题关键词，后续规则选择 AND / OR / NOT 继续组合。': 'Enter the topic keyword in the first row. Use AND / OR / NOT in later rows.',
  '添加规则': 'Add rule',
  '主题关键词': 'Topic keyword',
  '关系': 'Relation',
  '输入关键词，或选择已有关键词': 'Enter a keyword or select an existing one',
  '删除规则': 'Delete rule',
  '关键词管理': 'Keyword Management',
  '维护当前工作区可用于邮件主题的关键词，删除后会从相关主题规则中移除。': 'Manage keywords available for email topics in this workspace. Deleted keywords are removed from related topic rules.',
  '还没有关键词，可以在上方规则里直接输入并创建主题。': 'No keywords yet. Enter one in the rules above to create a topic.',
  '已创建主题': 'Created Topics',
  '还没有邮件主题': 'No email topics yet',
  '先在上方创建一个主题，例如“疲劳与蠕变”或“显微组织排除模拟”。': 'Create a topic above, such as "fatigue and creep" or "exclude simulation from microstructure".',
  '邮件发送中': 'Email active',
  '邮件已暂停': 'Email paused',
  '暂停邮件': 'Pause email',
  '启动邮件': 'Start email',
  '使用全局邮件配置': 'Use global email settings',
  'OR 其中一个命中': 'OR any match',
  'AND 必须同时命中': 'AND all must match',
  'NOT 排除该关键词': 'NOT exclude this keyword',
  '未分类': 'Uncategorized',
  '至少添加一个 OR 或 AND 规则作为主题关键词。': 'Add at least one OR or AND rule as the topic keyword.',
  '未选择': 'Not selected',
  '同时包含全部关键词': 'Must include all keywords',
  '包含但排除': 'Include with exclusions',
  '包含任一关键词': 'Include any keyword',
  '未选择关键词': 'No keywords selected',
  '加载邮件主题失败': 'Failed to load email topics',
  '关键词已删除': 'Keyword deleted',
  '删除关键词失败': 'Failed to delete keyword',
  '请至少添加一个 OR 或 AND 关键词规则': 'Add at least one OR or AND keyword rule',
  '邮件主题已更新': 'Email topic updated',
  '邮件主题已创建': 'Email topic created',
  '保存邮件主题失败': 'Failed to save email topic',
  '主题邮件已启动': 'Topic email started',
  '主题邮件已暂停': 'Topic email paused',
  '更新邮件主题失败': 'Failed to update email topic',
  '邮件主题已删除': 'Email topic deleted',
  '删除邮件主题失败': 'Failed to delete email topic',

  '生成报告': 'Generate Report',
  '保存今日正分分析结果，可预览、下载 Markdown 或重新发送邮件。': 'Save today\'s positive-score analysis results, preview them, download Markdown, or resend email.',
  '历史报告': 'Report History',
  '暂无报告，先生成一份今日报告。': 'No reports yet. Generate today\'s report first.',
  '0 分已排除': 'Zero-score excluded',
  '选择报告查看内容、投递记录和 Markdown 预览。': 'Select a report to view content, deliveries, and Markdown preview.',
  '发送邮件': 'Send email',
  '下载 Markdown': 'Download Markdown',
  '删除报告': 'Delete report',
  '报告论文': 'Report Papers',
  '邮件投递': 'Email Deliveries',
  '最近发送': 'Last Sent',
  '报告条目': 'Report Items',
  '查看条目': 'View items',
  '查看 Markdown': 'View Markdown',
  '本报告没有正分论文。': 'This report has no positive-score papers.',
  '原文': 'Source',
  '该条目没有摘要。': 'This item has no abstract.',
  '邮件投递记录': 'Email Delivery Records',
  '暂无投递记录。': 'No delivery records yet.',
  '未配置收件人': 'No recipient configured',
  '已发送': 'Sent',
  '已跳过': 'Skipped',
  '手动生成': 'Manual',
  '每日邮件': 'Daily email',
  '报告邮件已发送': 'Report email sent',
  '邮件未发送，请检查邮件配置': 'Email not sent. Check email settings.',
  '邮件发送失败': 'Email sending failed',
  '报告已删除': 'Report deleted',
  '加载报告失败': 'Failed to load reports',
  '加载报告详情失败': 'Failed to load report details',
  '生成报告失败': 'Failed to generate report',
  '发送报告失败': 'Failed to send report',
  '删除报告失败': 'Failed to delete report',
  '下载 Markdown 失败': 'Failed to download Markdown',

  '添加阅读条目': 'Add Reading Item',
  '编辑阅读条目': 'Edit Reading Item',
  '把需要跟进的论文先放进队列，列表会在下方集中管理。': 'Put papers that need follow-up into the queue; the list below keeps them organized.',
  '标题': 'Title',
  '论文或文章标题': 'Paper or article title',
  '标签': 'Tags',
  '摘要': 'Abstract',
  '粘贴摘要或简短说明': 'Paste an abstract or short note',
  '备注': 'Notes',
  '阅读理由、下一步动作或个人笔记': 'Reading reason, next action, or personal notes',
  '标题或摘要': 'Title or abstract',
  '全部': 'All',
  '待读': 'Unread',
  '已读': 'Read',
  '清空': 'Clear',
  '暂无阅读队列条目。': 'No reading queue items yet.',
  '没有摘要。': 'No abstract.',
  '条目已更新': 'Item updated',
  '条目已添加': 'Item added',
  '条目已删除': 'Item deleted',
  '标题不能为空': 'Title is required',
  '加载阅读队列失败': 'Failed to load reading queue',
  '保存阅读队列失败': 'Failed to save reading queue',
  '更新状态失败': 'Failed to update status',
  '删除阅读队列失败': 'Failed to delete reading queue item',

  '确定': 'Confirm',
  '关闭': 'Close',
  '请求失败': 'Request failed',
  '中文': 'Chinese',
}

const enToZh = Object.entries(zhToEn).reduce<Record<string, string>>((acc, [zh, en]) => {
  if (!acc[en]) acc[en] = zh
  return acc
}, {})

function formatKeywordList(value: string) {
  return value.replace(/、/g, ', ')
}

const regexRules: Array<{
  zh: RegExp
  toEn: (match: RegExpMatchArray) => string
  en: RegExp
  toZh: (match: RegExpMatchArray) => string
}> = [
  {
    zh: /^共\s*(\d+)\s*条结果$/,
    toEn: (m) => `${m[1]} results`,
    en: /^(\d+)\s*results$/,
    toZh: (m) => `共 ${m[1]} 条结果`,
  },
  {
    zh: /^(.+失败):\s*(.+)$/,
    toEn: (m) => `${translateUiText(m[1], 'en')}: ${m[2]}`,
    en: /^(.+failed):\s*(.+)$/i,
    toZh: (m) => `${translateUiText(m[1], 'zh')}: ${m[2]}`,
  },
  {
    zh: /^共\s*(\d+)\s*篇$/,
    toEn: (m) => `${m[1]} papers`,
    en: /^(\d+)\s*papers$/,
    toZh: (m) => `共 ${m[1]} 篇`,
  },
  {
    zh: /^(\d+)\s*个关键词$/,
    toEn: (m) => `${m[1]} keywords`,
    en: /^(\d+)\s*keywords$/,
    toZh: (m) => `${m[1]} 个关键词`,
  },
  {
    zh: /^(\d+)\s*个主题$/,
    toEn: (m) => `${m[1]} topics`,
    en: /^(\d+)\s*topics$/,
    toZh: (m) => `${m[1]} 个主题`,
  },
  {
    zh: /^(\d+)\s*个$/,
    toEn: (m) => `${m[1]} items`,
    en: /^(\d+)\s*items$/,
    toZh: (m) => `${m[1]} 个`,
  },
  {
    zh: /^规则\s*(\d+)$/,
    toEn: (m) => `Rule ${m[1]}`,
    en: /^Rule\s*(\d+)$/,
    toZh: (m) => `规则 ${m[1]}`,
  },
  {
    zh: /^使用\s*(\d+)$/,
    toEn: (m) => `Used ${m[1]}`,
    en: /^Used\s*(\d+)$/,
    toZh: (m) => `使用 ${m[1]}`,
  },
  {
    zh: /^第\s*(\d+)\s*\/\s*(\d+)\s*页$/,
    toEn: (m) => `Page ${m[1]} / ${m[2]}`,
    en: /^Page\s*(\d+)\s*\/\s*(\d+)$/,
    toZh: (m) => `第 ${m[1]} / ${m[2]} 页`,
  },
  {
    zh: /^第\s*(\d+)\s*\/\s*(\d+)\s*页，共\s*(\d+)\s*条$/,
    toEn: (m) => `Page ${m[1]} / ${m[2]}, ${m[3]} items`,
    en: /^Page\s*(\d+)\s*\/\s*(\d+),\s*(\d+)\s*items$/,
    toZh: (m) => `第 ${m[1]} / ${m[2]} 页，共 ${m[3]} 条`,
  },
  {
    zh: /^最近\s*(\d+)\s*\/\s*(\d+)$/,
    toEn: (m) => `Latest ${m[1]} / ${m[2]}`,
    en: /^Latest\s*(\d+)\s*\/\s*(\d+)$/,
    toZh: (m) => `最近 ${m[1]} / ${m[2]}`,
  },
  {
    zh: /^最近\s*(\d+)\s*条$/,
    toEn: (m) => `Latest ${m[1]}`,
    en: /^Latest\s*(\d+)$/,
    toZh: (m) => `最近 ${m[1]} 条`,
  },
  {
    zh: /^展开全部\s*(\d+)\s*条$/,
    toEn: (m) => `Show all ${m[1]}`,
    en: /^Show all\s*(\d+)$/,
    toZh: (m) => `展开全部 ${m[1]} 条`,
  },
  {
    zh: /^(\d+)\s*条节点日志\s*·\s*(.+)$/,
    toEn: (m) => `${m[1]} node logs · ${m[2]}`,
    en: /^(\d+)\s*node logs\s*·\s*(.+)$/,
    toZh: (m) => `${m[1]} 条节点日志 · ${m[2]}`,
  },
  {
    zh: /^论文\s*(\d+)$/,
    toEn: (m) => `${m[1]} papers`,
    en: /^(\d+)\s*papers$/,
    toZh: (m) => `论文 ${m[1]}`,
  },
  {
    zh: /^(\d+)\s*份报告，选择一份查看下方详情。$/,
    toEn: (m) => `${m[1]} reports. Select one to view details below.`,
    en: /^(\d+)\s*reports\. Select one to view details below\.$/,
    toZh: (m) => `${m[1]} 份报告，选择一份查看下方详情。`,
  },
  {
    zh: /^来源：(.+)$/,
    toEn: (m) => `Source: ${m[1]}`,
    en: /^Source:\s*(.+)$/,
    toZh: (m) => `来源：${m[1]}`,
  },
  {
    zh: /^创建：(.+)$/,
    toEn: (m) => `Created: ${m[1]}`,
    en: /^Created:\s*(.+)$/,
    toZh: (m) => `创建：${m[1]}`,
  },
  {
    zh: /^(\d+)\s*篇正分论文\s*·\s*0\s*分不相关论文已排除$/,
    toEn: (m) => `${m[1]} positive-score papers · zero-score irrelevant papers excluded`,
    en: /^(\d+)\s*positive-score papers\s*·\s*zero-score irrelevant papers excluded$/,
    toZh: (m) => `${m[1]} 篇正分论文 · 0 分不相关论文已排除`,
  },
  {
    zh: /^新增:(\d+)\s*分析:(\d+)\s*相关:(\d+)\s*累计:(\d+)$/,
    toEn: (m) => `New: ${m[1]} Analysis: ${m[2]} Relevant: ${m[3]} Total: ${m[4]}`,
    en: /^New:\s*(\d+)\s*Analysis:\s*(\d+)\s*Relevant:\s*(\d+)\s*Total:\s*(\d+)$/,
    toZh: (m) => `新增:${m[1]} 分析:${m[2]} 相关:${m[3]} 累计:${m[4]}`,
  },
  {
    zh: /^新增论文\s*(\d+)$/,
    toEn: (m) => `${m[1]} new papers`,
    en: /^(\d+)\s*new papers$/,
    toZh: (m) => `新增论文 ${m[1]}`,
  },
  {
    zh: /^分析结果\s*(\d+)$/,
    toEn: (m) => `${m[1]} analysis results`,
    en: /^(\d+)\s*analysis results$/,
    toZh: (m) => `分析结果 ${m[1]}`,
  },
  {
    zh: /^正在分析：(.+)$/,
    toEn: (m) => `Analyzing: ${m[1]}`,
    en: /^Analyzing:\s*(.+)$/,
    toZh: (m) => `正在分析：${m[1]}`,
  },
  {
    zh: /^报告已生成：(\d+)\s*篇论文$/,
    toEn: (m) => `Report generated: ${m[1]} papers`,
    en: /^Report generated:\s*(\d+)\s*papers$/,
    toZh: (m) => `报告已生成：${m[1]} 篇论文`,
  },
  {
    zh: /^收件人：(.+)$/,
    toEn: (m) => `Recipient: ${m[1]}`,
    en: /^Recipient:\s*(.+)$/,
    toZh: (m) => `收件人：${m[1]}`,
  },
  {
    zh: /^当前主题会匹配：(.+)；并排除：(.+)。$/,
    toEn: (m) => `Current topic matches: ${formatKeywordList(m[1])}; excludes: ${formatKeywordList(m[2])}.`,
    en: /^Current topic matches:\s*(.+);\s*excludes:\s*(.+)\.$/,
    toZh: (m) => `当前主题会匹配：${m[1]}；并排除：${m[2]}。`,
  },
  {
    zh: /^当前主题要求论文同时命中：(.+)。$/,
    toEn: (m) => `Current topic requires papers to match all: ${formatKeywordList(m[1])}.`,
    en: /^Current topic requires papers to match all:\s*(.+)\.$/,
    toZh: (m) => `当前主题要求论文同时命中：${m[1]}。`,
  },
  {
    zh: /^当前主题会匹配任一关键词：(.+)。$/,
    toEn: (m) => `Current topic matches any keyword: ${formatKeywordList(m[1])}.`,
    en: /^Current topic matches any keyword:\s*(.+)\.$/,
    toZh: (m) => `当前主题会匹配任一关键词：${m[1]}。`,
  },
  {
    zh: /^论文需要同时包含：(.+)$/,
    toEn: (m) => `Papers must include all: ${formatKeywordList(m[1])}`,
    en: /^Papers must include all:\s*(.+)$/,
    toZh: (m) => `论文需要同时包含：${m[1]}`,
  },
  {
    zh: /^论文包含：(.+?)(?:；排除：(.+))?$/,
    toEn: (m) => `Papers include: ${formatKeywordList(m[1])}${m[2] ? `; exclude: ${formatKeywordList(m[2])}` : ''}`,
    en: /^Papers include:\s*(.+?)(?:;\s*exclude:\s*(.+))?$/,
    toZh: (m) => `论文包含：${m[1]}${m[2] ? `；排除：${m[2]}` : ''}`,
  },
  {
    zh: /^论文包含任意一个：(.+)$/,
    toEn: (m) => `Papers include any one: ${formatKeywordList(m[1])}`,
    en: /^Papers include any one:\s*(.+)$/,
    toZh: (m) => `论文包含任意一个：${m[1]}`,
  },
  {
    zh: /^正在重新分析过去(\d+)天的论文$/,
    toEn: (m) => `Reanalyzing papers from the past ${m[1]} days`,
    en: /^Reanalyzing papers from the past (\d+) days$/,
    toZh: (m) => `正在重新分析过去${m[1]}天的论文`,
  },
  {
    zh: /^全部刷新完成：(\d+)\s*个订阅源，新增\s*(\d+)\s*篇论文$/,
    toEn: (m) => `Refresh complete: ${m[1]} feeds, ${m[2]} new papers`,
    en: /^Refresh complete:\s*(\d+)\s*feeds,\s*(\d+)\s*new papers$/,
    toZh: (m) => `全部刷新完成：${m[1]} 个订阅源，新增 ${m[2]} 篇论文`,
  },
  {
    zh: /^已删除\s*(\d+)\s*个订阅源$/,
    toEn: (m) => `Deleted ${m[1]} feeds`,
    en: /^Deleted\s*(\d+)\s*feeds$/,
    toZh: (m) => `已删除 ${m[1]} 个订阅源`,
  },
  {
    zh: /^确定要删除订阅源 "(.+)" 吗？$/,
    toEn: (m) => `Delete feed "${m[1]}"?`,
    en: /^Delete feed "(.+)"\?$/,
    toZh: (m) => `确定要删除订阅源 "${m[1]}" 吗？`,
  },
  {
    zh: /^确定要删除选中的\s*(\d+)\s*个订阅源吗？$/,
    toEn: (m) => `Delete ${m[1]} selected feeds?`,
    en: /^Delete\s*(\d+)\s*selected feeds\?$/,
    toZh: (m) => `确定要删除选中的 ${m[1]} 个订阅源吗？`,
  },
  {
    zh: /^确定删除关键词 "(.+)" 吗？它会同时从\s*(\d+)\s*个邮件主题规则中移除。$/,
    toEn: (m) => `Delete keyword "${m[1]}"? It will also be removed from ${m[2]} email topic rules.`,
    en: /^Delete keyword "(.+)"\? It will also be removed from\s*(\d+)\s*email topic rules\.$/,
    toZh: (m) => `确定删除关键词 "${m[1]}" 吗？它会同时从 ${m[2]} 个邮件主题规则中移除。`,
  },
  {
    zh: /^确定删除关键词 "(.+)" 吗？$/,
    toEn: (m) => `Delete keyword "${m[1]}"?`,
    en: /^Delete keyword "(.+)"\?$/,
    toZh: (m) => `确定删除关键词 "${m[1]}" 吗？`,
  },
  {
    zh: /^确定要删除邮件主题 "(.+)" 吗？$/,
    toEn: (m) => `Delete email topic "${m[1]}"?`,
    en: /^Delete email topic "(.+)"\?$/,
    toZh: (m) => `确定要删除邮件主题 "${m[1]}" 吗？`,
  },
  {
    zh: /^确定删除报告「(.+)」？该操作不可恢复。$/,
    toEn: (m) => `Delete report "${m[1]}"? This cannot be undone.`,
    en: /^Delete report "(.+)"\? This cannot be undone\.$/,
    toZh: (m) => `确定删除报告「${m[1]}」？该操作不可恢复。`,
  },
  {
    zh: /^"(.+)"\s*抓取完成$/,
    toEn: (m) => `"${m[1]}" fetched`,
    en: /^"(.+)"\s*fetched$/,
    toZh: (m) => `"${m[1]}" 抓取完成`,
  },
  {
    zh: /^删除「(.+)」？$/,
    toEn: (m) => `Delete "${m[1]}"?`,
    en: /^Delete "(.+)"\?$/,
    toZh: (m) => `删除「${m[1]}」？`,
  },
]

const attrs = ['placeholder', 'title', 'aria-label']
const skippedTags = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'])

function preserveWhitespace(original: string, translated: string) {
  const prefix = original.match(/^\s*/)?.[0] || ''
  const suffix = original.match(/\s*$/)?.[0] || ''
  return `${prefix}${translated}${suffix}`
}

export function translateUiText(value: string, language: LanguageCode): string {
  const trimmed = value.trim()
  if (!trimmed) return value

  const exact = language === 'en' ? zhToEn[trimmed] : enToZh[trimmed]
  if (exact) return preserveWhitespace(value, exact)

  for (const rule of regexRules) {
    const match = trimmed.match(language === 'en' ? rule.zh : rule.en)
    if (match) {
      return preserveWhitespace(value, language === 'en' ? rule.toEn(match) : rule.toZh(match))
    }
  }

  return value
}

function localizeRoot(root: ParentNode, language: LanguageCode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const parent = node.parentElement
    if (!parent || skippedTags.has(parent.tagName)) continue
    textNodes.push(node)
  }

  for (const node of textNodes) {
    const translated = translateUiText(node.nodeValue || '', language)
    if (translated !== node.nodeValue) node.nodeValue = translated
  }

  if (root instanceof Element || root instanceof Document) {
    const elements = root instanceof Document ? root.querySelectorAll('*') : root.querySelectorAll('*')
    for (const element of elements) {
      for (const attr of attrs) {
        const value = element.getAttribute(attr)
        if (!value) continue
        const translated = translateUiText(value, language)
        if (translated !== value) element.setAttribute(attr, translated)
      }
    }
  }
}

export function installDomI18n(languageSource: () => LanguageCode) {
  const root = document.getElementById('app')
  if (!root) return

  let queued = false
  const schedule = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      localizeRoot(root, languageSource())
    })
  }

  const nativeConfirm = window.confirm.bind(window)
  window.confirm = (message?: string) => nativeConfirm(message ? translateUiText(message, languageSource()) : message)

  const observer = new MutationObserver(schedule)
  observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true })

  watch(languageSource, async () => {
    await nextTick()
    schedule()
  })

  schedule()
}
