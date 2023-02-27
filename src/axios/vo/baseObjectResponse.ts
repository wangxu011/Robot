export default interface baseObjectResponse<T> {
  code: number,
  message: string,
  value: T
}