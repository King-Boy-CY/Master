// 状态管理
import store from '@/vuex/store'
import { Modal  } from 'ant-design-vue'
import axios from 'axios'
import { AxiosConfig, AxiosGetConfig } from './parameter'
// import router from '@/router'
// import { DEV_HOST } from './config'
// import qs from 'qs'
const instance = axios.create({
    headers: {},
    data: undefined,
    timeout: 25000,
})
// axios.defaults.baseURL = '/api/'
// 请求拦截器 (请求之前的操作 ---检查是否登陆过期)
instance.interceptors.request.use((config: any) => {
    /** 
     *  接口全局loading
     *  接口参数中加入 loseLoading: true 则访问接口不出现loading效果
     */

    if ((config.params && !config.params.loseLoading) || config.data && !config.data.loseLoading || (!config.params && !config.data)) {
        store.state.loading = true
    }
    config.params && delete config.params.loseLoading
    config.data && delete config.data.loseLoading
    // console.log(config.method);
    // const token = getToken()
    // if (token !== null) {
    //   config.headers['X-Token'] = token
    // }
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // if (config.method === 'post') {
    //   config.data = qs.stringify(config.data)
    // }
    return config
}, (err): Promise<any> => {
    Modal.error({
        title:'Error',
        content:'Network Error'
    })
    console.log('request', err)
    return err
})
// 请求拦截器 (请求完成的操作 ---检查是否登陆)
instance.interceptors.response.use((res: any) => {
    // 全局loading
    store.state.loading = false
    // console.log('axios message',message);
    if (res && res.data && res.data.code != undefined && res.data.code < 0) {
        // 1:操作成功
        // 0:操作成功，但无返回数据
        // -1:操作失败
        // -2:参数错误
        // -3:缺少系统数据
        // -4:缺少其他数据
        // -5:数据已存在
        // -6:不支持的操作
        // -7:数据无法编辑
        // -8:数据无法删除
        // -9:接收到的数据存在错误
        // -10:校验失败
        // -11:数据重复
        // -12:费率区重复
        // -13:号码头重复
        // -14:导出失败
        // -15:下载失败
        // -101:json解析失败
        // -102:参数绑定失败
        // -103:数字格式错误
        // -200:业务错误
        // -201:数据缺失
        // -202:数据重复
        // -203:数据校验失败
        // -204:未确认的操作
        switch (res.data.code) {
            case -1:
                Modal.error({
                    title:'operation failed',
                    content:res.data.msg
                })
                break;
            case -2:
                Modal.error({
                    title:'Parameter error',
                    content:res.data.msg
                })
                break;
            case -3:
                Modal.error({
                    title:'Missing system data',
                    content:res.data.msg
                })
                break;
            case -4:
                Modal.error({
                    title:'Missing additional data',
                    content:res.data.msg
                })
                break;
            case -5:
                Modal.error({
                    title:'Data already exists',
                    content:res.data.msg
                })
                break;
            case -6:
                Modal.error({
                    title:'Unsupported operation',
                    content:res.data.msg
                })
                break;
            case -7:
                Modal.error({
                    title:'Data cannot be edited',
                    content:res.data.msg
                })
                break;
            case -8:
                Modal.error({
                    title:'Data cannot be deleted',
                    content:res.data.msg
                })
                break;
            case -9:
                Modal.error({
                    title:'Error in received data',
                    content:res.data.msg
                })
                break;
            case -10:
                Modal.error({
                    title:'Check failed',
                    content:res.data.msg
                })
                break;
            case -11:
                Modal.error({
                    title:'Data duplication',
                    content:res.data.msg
                })
                break;
            case -12:
                Modal.error({
                    title:'Duplicate rate area',
                    content:res.data.msg
                })
                break;
            case -13:
                Modal.error({
                    title:'Repeat at pier No',
                    content:res.data.msg
                })
                break;
            case -14:
                Modal.error({
                    title:'Export failure',
                    content:res.data.msg
                })
                break;
            case -15:
                Modal.error({
                    title:'Download failed',
                    content:res.data.msg
                })
                break;
            case -101:
                Modal.error({
                    title:'JSON parsing failed',
                    content:res.data.msg
                })
                break;
            case -102:
                Modal.error({
                    title:'Parameter binding failed',
                    content:res.data.msg
                })
                break;
            case -103:
                Modal.error({
                    title:'Number format error',
                    content:res.data.msg
                })
                break;
            case -200:
                Modal.error({
                    title:'Business error',
                    content:res.data.msg
                })
                break;
            case -201:
                Modal.error({
                    title:'Missing data',
                    content:res.data.msg
                })
                break;
            case -202:
                Modal.error({
                    title:'Data duplication',
                    content:res.data.msg
                })
                break;
            case -203:
                Modal.error({
                    title:'Data verification failed',
                    content:res.data.msg
                })
                break;
            case -204:
                Modal.error({
                    title:'Unconfirmed action',
                    content:res.data.msg
                })
                break;
            default:
                Modal.error({
                    title:'Error',
                    content:res.data.msg
                })
                break;
        }
    }
    return res.data
}, (err: any): Promise<any> => {
    // 全局loading
    store.state.loading = false
    console.log(JSON.stringify(err));
    let text: string = 'System Error'
    if (err.response.data !== null && typeof err.response.data === 'object') {
        text = (err.response.data.path ? err.response.data.path + ': ' : '') + (err.response.data.status ? err.response.data.status + '--' : '') + err.response.data.error || ''
    }
    Modal.error({
        title:'Error',
        content:text
    })
    return Promise.reject(err)
})
// Demo AxiosGet('/contract/vc-contract/rateplans/summary',{params:ratePlanSearch}).then((res: any) => { } )
export const AxiosPost = async (url: AxiosConfig['url'], data?: AxiosConfig['data'], baseURL: string = ''): Promise<AxiosConfig> => {
    return new Promise((resolve, reject) => {
        instance.post(baseURL + url, data).then((res: any): void => {
            resolve(res)
        }).catch((err): void => {
            reject(err)
        })
    })
}

export const AxiosGet = async (url: AxiosConfig['url'], data?: AxiosGetConfig, baseURL: string = ''): Promise<AxiosConfig> => {
    return new Promise((resolve, reject) => {
        instance.get(baseURL + url, data && !data.params ? { params: data } : data).then((res: any): void => {
            resolve(res)
        }).catch((err): void => {
            reject(err)
        })
    })
}

export const AxiosPut = async (url: AxiosConfig['url'], data?: AxiosConfig['data'], baseURL: string = ''): Promise<AxiosConfig> => {
    return new Promise((resolve, reject) => {
        instance.put(baseURL + url, data).then((res: any): void => {
            resolve(res)
        }).catch((err): void => {
            reject(err)
        })
    })
}

export const AxiosPatch = async (url: AxiosConfig['url'], data?: AxiosConfig['data'], baseURL: string = ''): Promise<AxiosConfig> => {
    return new Promise((resolve, reject) => {
        instance.patch(baseURL + url, data).then((res: any): void => {
            resolve(res)
        }).catch((err): void => {
            reject(err)
        })
    })
}

// DELETE
export const AxiosDelete = async (url: AxiosConfig['url'], data?: AxiosConfig['data'], baseURL: string = ''): Promise<AxiosConfig> => {
    return new Promise((resolve, reject) => {
        instance.delete(baseURL + url, data).then((res: any): void => {
            resolve(res)
        }).catch((err): void => {
            reject(err)
        })
    })
}

export const Axios = async (config: object): Promise<AxiosConfig> => {
    return new Promise((resolve, reject) => {
        instance.request(config).then((res: any): void => {
            resolve(res)
        }).catch((err): void => {
            reject(err)
        })
    })
}
