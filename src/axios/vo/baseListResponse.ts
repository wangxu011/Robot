export default interface baseListResponse<T> {
  code: number,
  message: string,
  value: valueObj<T>
}

interface valueObj<T> {
  results: Array<T>,
  total: number
}