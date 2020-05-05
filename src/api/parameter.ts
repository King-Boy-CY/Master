interface AxiosConfig {
    code: number,
    msg: string,
    data: any,
    url?: string,
    baseURL?: string,
    responseType?: string
}
interface AxiosGetConfig {
    params: any
}
export {
    AxiosConfig,
    AxiosGetConfig
}
