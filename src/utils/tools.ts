/**
 * 计算两点间直线距离
 * @param p1 
 * @param p2 
 * @returns 
 */
export const getDistance = (p1: number[], p2: number[]):number => {
  const x2 = Math.pow(p1[0] - p2[0], 2)
  const y2 = Math.pow(p1[1] - p2[1], 2)
  return Math.ceil(Math.pow((x2 + y2), 0.5))
}

/**
 * 判断传入的图片资源是否存在
 * @param path 
 * @returns 
 */
export const ifImageExist = (path: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = path
    img.onload = () => {
      resolve(true)
    }
    img.onerror = () => {
      resolve(false)
    }
  })
}