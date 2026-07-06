const BEIJING_TIMEZONE = 'Asia/Shanghai'
const timezonePattern = /(Z|[+-]\d{2}:?\d{2})$/i

export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null

  const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T')
  const withTimezone = timezonePattern.test(normalized) ? normalized : `${normalized}Z`
  const date = new Date(withTimezone)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatApiDateTime(value: string | null | undefined, options: Intl.DateTimeFormatOptions = {}): string {
  const date = parseApiDate(value)
  if (!date) return '-'

  return date.toLocaleString('zh-CN', {
    hour12: false,
    timeZone: BEIJING_TIMEZONE,
    ...options,
  })
}
