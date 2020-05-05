export const state = {
  leftwidth: 30, // 左侧菜单/子菜单 关闭/隐藏所占用的宽度
  childShow: false, // 子菜单显示/隐藏
  /* 创建合同 Contract Details 页面保存给 Service页面使用 */
  ContractObject: {},
  /**service 页面保存 给 Cycle 页面使用 */
  ServiceObject: {},
  serviceFilter: {},
  serviceTest: [],
  /**Cycle 页面保存 给 RatePlan 页面使用*/
  CycleObjec: [],
  /**RatePlan 页面 保存给 Product */
  ratePlanObject: [],
  /* Product 选中索引 / 初始索引 */
  productIndex: 0,
  /* prodyct 表格插入数据 */
  productInsert: [],
  /* 插入复制数据 */
  productCopyData: [],
  /* product ZoneList 列表数据 */
  productRatingZoneList: [],
  /* 合同Add 所有数据 */
  contractData: {},
  /* 获取product 当前所下的form表单 */
  productForm: {},
  /**Details模块 需要传入的 id 值 */
  detailsId: [],
  /* 存储页面product页面复制数据 */
  prossData: {},
  // 存取当前product 名称
  productName: "",
  // 存取合同编辑数据
  editData: {},
  // 直接编辑product保存的数据
  editProduct: [],
  closeModel: "", // 例如contract
  // 合同操作栏点击的index
  contractIndex: 0,
  loading: false, // 全局loading效果
  // edit route 修改过的data
  editRouteData: [],
  // commercial add or edit 跳转到benchmark
  commercialdata: {},
  route: ''
};
