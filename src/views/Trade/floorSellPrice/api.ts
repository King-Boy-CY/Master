import { getRefInDestinationName, getCountryName, getDetailAccounts, getDetailService } from '@/api/index'
import { getExpData } from '../sellPrice/method'
export const ExpData = function (formData: any,field?:any) {
    setTimeout(() => {
        let sedFied = field || ['beginDate', 'endDate', { direction: 1 }];
        getExpData({
            data: formData,
            fns: [getRefInDestinationName,getCountryName,getDetailAccounts, getDetailService],
            field: [undefined, sedFied, sedFied, undefined]
        });
    }, 0);
}