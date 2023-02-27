import axios from '../index'

import baseListResponse from '../vo/baseListResponse'
import baseObjectResponse from '../vo/baseObjectResponse'

// 根据指定商铺类别（美食 / 购物）获取其对应子栏目列表
export const _queryCategoriesByLabel = (name: string): Promise<baseObjectResponse<any>> => {
  return axios.get('/app/business/categories/getByLabel', { params: { name } })
}

// 根据搜索条件查找具体门店
export const _queryShops = (params: any): Promise<baseListResponse<any>> => {
  params.name = params.name.trim()
  return axios.get('/app/business/shops/query', { params })
}