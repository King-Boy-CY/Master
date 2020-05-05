// 返回数据
import { AxiosConfig as recodeConfig} from '@/api/parameter'
// 声明 ref  
interface refsConfig {
    [key: string]: any
}
interface mutationsConfig {
    mutionContract: (value: Object) => void
    contractData: (value: Object) => void
}
export {
    recodeConfig,
    refsConfig,
    mutationsConfig
}