import { ratePlanColumn } from '@/common/ts/tableData';

export const mutations = {
  // 左侧菜单/子菜单 关闭/隐藏所占用的宽度
  mutionWidth(state: any, { width }: any): void {
    state.leftwidth = width
  },
  // 关闭 子菜单
  mutionchildShow(state: any, { childShow, leftwidth }: any): void {
    state.childShow = childShow
    state.leftwidth = leftwidth
  },
  /* 创建合同 */
  mutionContract(state: any, payload: object) {
    state.ContractObject = payload
    // console.log(payload)
  },
  /**保存Service */
  mutionService(state: any, payload: object) {
    state.ServiceObject = payload
    // console.log(payload);

  },
  mutioServictFilter(state: any, payload: object) {
    state.serviceFilter = payload
    //console.log(payload);
  },
  mutionServiceTest(state: any, payload: object) {
    state.serviceTest = payload
    //console.log(payload);
  },
  /**保存Cycle页面数据 */
  mutionCycle(state: any, payload: object) {
    state.CycleObjec = payload
    // console.log(payload);
  },
  /**保存RatePlan页面数据 */
  mutionRatePlan(state: any, payload: object) {
    state.ratePlanObject = payload
    // console.log(payload);
  },
  /* product 索引 */
  mutionProdurt(state: { productIndex: number }, payload: number) {
    state.productIndex = payload
  },
  /* product 表格插入数据 */
  mutionProductInsert(state: { productInsert: any[] }, payload: any[]) {
    state.productInsert = payload
  },
  /* 插入复制数据 */
  mutionProductCopyData(state: { productInsert: any[] }, payload: any[]) {
    state.productInsert = payload
  },
  /* product ZoneList 列表数据 */
  mutionProductZoneList(state: { productRatingZoneList: any[] }, payload: any[]) {
    state.productRatingZoneList = payload
  },
  /* 保存合同 所有数据 */
  mutionContractData(state: { contractData: object }, payload: object) {
    // state.contractData = payload
    state.contractData = Object.assign({},state.contractData,payload)
  },
  mutionProcutName (state:{productName:string},payload:string){
    state.productName = payload
  },
  // ,
  // mutionServiceData ( state: { serviceData: object }, payload:object ) {
  //   state.serviceData = payload
  // }
  /**Details模块 需要传入的 id 值 */
  mutionDetailsId(state: any, payload: any) {
    state.detailsId = payload
  },
  /**Details模块 需要传入的 id 值 */
  mutionEditProduct(state: any, payload: any) {
    state.editProctData = payload
  },
   /** 合同操作栏点击的index */
   mutioncontractIndex(state:{contractIndex:number}, payload: number) {
    state.contractIndex = payload
  },
  /** 合同操作栏点击的请求数据 */
  mutioncontractData(state:{editData:Object}, payload: Object) {
    state.editData = payload
  },
  /** 直接编辑product的数据 */
  mutionProduct(state:{editProduct:Array<Object>}, payload: Array<Object>) {
    state.editProduct = payload
  },
  // 合同退出数据清空
  clearContractData(state:any){
    console.log('关闭了',state.closeModel);

    state.ContractObject = {};
    state.ServiceObject = {};
    state.serviceFilter = {};
    state.serviceTest = [];
    state.CycleObjec = [];
    state.ratePlanObject = [];
    // state.productIndex = 0;
    state.productInsert = [];
    state.productCopyData = [];
    state.productRatingZoneList = [];
    state.contractData = [];
    state.productForm = {};
    state.prossData = {};
    state.editProduct = [];
    state.editData = {};
    state.closeModel = ''
  },

  // 修改editRouteData
  setEditRoutData(state:any, newVal: any) {
    state.editRouteData = newVal
  },
  setCommercialData(state: any, newVal: any) {
    state.commercialdata = newVal

  },

  closeModelFn(state:any, newVal: any){
    state.closeModel = newVal
  },
  setRoute(state: any,newVal: any) {
    state.route = newVal
  }
}
