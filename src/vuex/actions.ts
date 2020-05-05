import {
    getDetailAccounts,
    getDetailService,
    RouteProductRefNpDes,
    RouteProductCountriesList,
    ClientSourceExcludeCountryCode
} from '@/api/index'
import {
    resolveSelectResponed
} from '@/assets/ts/index'
import {
    responedInterface
} from '@/common/dataConfig/interface'
export const actions = {
    async getAccounts(state: any, data: any) {
        const res: responedInterface = await getDetailAccounts(data)
        return resolveSelectResponed(res)
    },
    async getService(state: any, data: any) {
        const res: responedInterface = await getDetailService(data)
        return resolveSelectResponed(res)
    },
    async getDestination(state: any, data: any) {
        const res: responedInterface = await RouteProductRefNpDes(data)
        return resolveSelectResponed(res)
    },
    async getCountries(state: any, data: any) {
        const res: responedInterface = await RouteProductCountriesList(data)
        return resolveSelectResponed(res)
    },
    async getCountriesCode(state: any, data: any) {
        const res: responedInterface = await ClientSourceExcludeCountryCode(data)
        return resolveSelectResponed(res)
    },


}
