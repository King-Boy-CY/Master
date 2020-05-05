/* 展开表格数据 -> 头部 */
export const columnss:any = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
     sorter: (a:any, b:any) => a.age - b.age // -> 排序声明函数
  },
  {
    title: 'age',
    dataIndex: 'age ',
    key: 'age',
    width: '12%'
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '30%',
    key: 'address'
  },
  {
    title: 'Action',
    key: 'operation',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
/* 展开表格数据 -> 身体 */
export const datas = [
  {
    key: 1,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    operation: 'operation'
    // children: [{  // -> 如果有子级的话 children[] 数组渲染则嵌套成有子级
    //   key: 11,
    //   name: 'John Brown',
    //   age: 42,
    //   address: 'New York No. 2 Lake Park'
    // },
    // {
    //   key: 12,
    //   name: 'John Brown2',
    //   age: 42,
    //   address: 'New York No. 2 Lake Park'
    // }]
  },
  {
    key: 2,
    name: 'Joe Black2',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 3,
    name: 'Joe Black3',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 4,
    name: 'Joe Blacks',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 5,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]
/* 表格数据 -> 身体 */
export const data = [
  {
    key: 1,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
    // children: [{  -> 如果有子级的话 children[] 数组渲染则嵌套成有子级
    //   key: 11,
    //   name: 'John Brown',
    //   age: 42,
    //   address: 'New York No. 2 Lake Park'
    // },
    // {
    //   key: 11,
    //   name: 'John Brown2  ',
    //   age: 42,
    //   address: 'New York No. 2 Lake Park'
    // }]
  },
  {
    key: 2,
    name: 'Joe Black2',
    age: 32,
    address: 'Sidney No. 2sLake Park'
  },
  {
    key: 3,
    name: 'Joe Black3',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 4,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 5,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 6,
    name: 'Joe Black',
    age: 31,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 7,
    name: 'Joe Black',
    age: 33,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 8,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 9,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 10,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]
/* 表格数据 -> 头部 */
export const columns:any = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '12%'
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '30%',
    key: 'address'
  }
]
