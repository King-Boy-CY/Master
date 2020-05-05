import { route } from '@/components/menu/router-menu';

export const getters = {
  nameValue(state: any) {
    return state.nameValue;
  },
  ServiceList(state: any) {
    // debugger
    return state.ServiceObject;
  },
  editRouteList(state: any) {
    return state.editRouteData;
  },
  commercialdataList(state: any) {
    return state.commercialdata
  },
  route(state: any) {
    return state.route
  }
};
