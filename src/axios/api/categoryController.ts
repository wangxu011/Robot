import axios from '../index'

import baseListResponse from '../vo/baseListResponse'
import baseObjectResponse from '../vo/baseObjectResponse'

// 根据label名获取栏目的相关信息及其子栏目：如：交通指南、中转指南、旅客服务
export const _getCategoryByLabel = (label: string): Promise<baseObjectResponse<any>> => {
  return axios.get('/app/cms/categories/getByLabel', { params: {label} })
}

// 根据id获取栏目的详情及其子栏目
export const _getCategoryById = (id: string): Promise<baseObjectResponse<any>> => {
  return axios.get(`/app/cms/categories/${id}/get`)
}

// 根据id获取指定富文本内容
export const _getRichTextById = (id: string): Promise<baseObjectResponse<any>> => {
  return axios.get(`/app/cms/articles/${id}/get`)
}