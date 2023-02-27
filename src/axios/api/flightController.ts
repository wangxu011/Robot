import axios from '../index'

import baseListResponse from '../vo/baseListResponse'
import baseObjectResponse from '../vo/baseObjectResponse'

export const _queryFlights = (params: object):Promise<baseListResponse<any>> => {
  return axios.get('/app/flight/search', { params })
}

/**
 * 1：N人脸搜索
 * @param face
 * @returns
 */
export const _searchByFace = (face: string):Promise<baseObjectResponse<any>> => {
  const data = {
    base64Image: face
  }
  return axios.post('/app/boardingPass/search', data)
}