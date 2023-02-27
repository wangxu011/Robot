import dayjs from 'dayjs'

/**
 * 根据首页时间的显示需要，对当前时间做格式化处理
 * @returns 
 */
export const formatToday = (): string => {
  return dayjs().format('MM/DD HH:mm')
}