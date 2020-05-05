import { AxiosPost, AxiosGet, AxiosPut, Axios } from './axios'

/**
 *
 * Comercial 页面API
 */

/**
 *  获取form options
 * @param params
 */
export function getFormoptions(params: any = {}, url: string = '/route/droplists'): any {
  return AxiosGet(url, { params: params })
}

/**
 * search
 * @param data
 */
export function postSearchResult(data: any, url: string = '/route/oc-routing/search'): any {
  return AxiosPost(url, data)
}

/**
 * Add
 * @param data
 */
export function postComercialAdd(data: any, url: string = '/route/commercial-routing/add'): any {
  return AxiosPost(url, data)
}

export function putComercialEdit(data: any, url: string = '/route/commercial-routing/update'): any {
  return AxiosPut(url, data)
}

export function putApproveAndReject(
  data: any,
  type: string,
  url: string = '/route/commercial-routing/update/status'
): any {
  return AxiosPut(`${url}/${type}`, data)
}

export function postDelete(data: any, url: string = '/route/route-product/del'): any {
  return AxiosPost(url, data)
}

// route class benchmark
