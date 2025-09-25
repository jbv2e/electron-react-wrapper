import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: Date | string,
  format: string = 'YYYY-MM-DD HH:mm:ss',
  tz: string = 'Asia/Seoul',
): string {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  return dayjs(date).tz(tz).format(format)
}

export function isValidDate(date: Date | string): boolean {
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}

export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}
