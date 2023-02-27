import Cookies from "js-cookie"

/**
 * 获取指定key的Cookie值
 * @param key
 * @returns 
 */
export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

/**
 * 设置新的值到Cookie中
 * @param key
 * @param value 
 */
export const setCookie = (key: string, value: any): void => {
  Cookies.set(key, value)
}