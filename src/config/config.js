// default config
module.exports = {
  workers: 1,
  sso: true,
  publicController: [],
  publicAction: [
    'account/login'
  ],
  defaultModuleOptions: {
    // 新增和编辑的弹层类型 可选'drawer','Model'
    writeType: '',
    // 新增和编辑的内容类型 是否分步展示
    writeByStep: false,
    // 如果writeByStep为true，则必须配置steps，且steps.length 不得为 0
    steps: [
      // {
      //   title: '', // 当前步骤名
      //   moduleUrl: '', // 该步骤对应的模块url
      // }
    ],
  },
  defaultPageOptions: {
    // 操作组
    actions: {
      edit: {
        title: '编辑',
        hidden: false
      },
      delete: {
        title: '删除',
        // 物理删除 ：delete | 逻辑删除：status|9 （status为逻辑删除的字段，9为临界值）
        type: '',
        hidden: false
      }
    },
    // 按钮组
    buttons: {
      add: {
        title: '新增',
        hidden: false
      }
    },
    //分页限制
    limit: 10,
    // 显示全部
    all: false,
    // 复选框
    checkbox: true,
    //字段排序开关
    sort: true,
    // 默认排序字段
    order: '',
    // 打印开关
    print: true,
    // 导出 xls(csv)、pdf
    export: 'xls',
    //表单尺寸 small | default | large
    formSize: 'default',
    // 详情模板
    detailTpl: ''
  },
  relateSep: '_HY_SEP_',
  relationType: {
    BELONG_TO: 3
  },
  defaultSearchFiledOptions:  {
    // 检索字段显示名称：
    title: 'null',
    // 检索表现类型（text|select|date...）
    type: 'text',
    // 如果类型是select，制定options
    options: {},
    // SQL 匹配方式（eq|like|lt|gt...）
    query: {}
  },
  defaultListFiledOptions: {
    // 字段显示名称
    title: '',
    // 排序（为false则关闭排序，字符串为自定义排序，如排序字典）
    order: true,
    // 宽度
    width: '',
  },

  /**
   * 默认表单字段配置
   *
   * 说明
   * 参数	          类型              默认值    说明
   * colon	        boolean	          true     配合 label 属性使用，表示是否显示 label 后面的冒号
   * extra	        string|ReactNode           额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。
   * hasFeedback	  boolean           false    配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用
   * help	          string|ReactNode           提示信息，如不设置，则会根据校验规则自动生成
   * label	        string|ReactNode           label 标签的文本
   * labelCol	      object                     label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}
   * required	      boolean           false    是否必填，如不设置，则会根据校验规则自动生成
   * validateStatus	string                     校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating'
   * wrapperCol	    object                     需要为输入控件设置布局样式时，使用该属性，用法同labelCol
   *
   */

  defaultFormFieldOptions:  {
  // label 标签的文本
  title: '',
  // 配合 label 属性使用，表示是否显示 label 后面的冒号
  colon: true,
  // 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。
  // extra: '',
  // 配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用
  // hasFeedback: false,
  // 提示信息，如不设置，则会根据校验规则自动生成
  // help: '',
  // label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  // 是否必填，如不设置，则会根据校验规则自动生成
  required: true,
  // 校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating'
  // validateStatus: '',
  // 需要为输入控件设置布局样式时，使用该属性，用法同labelCol
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  type: '',
  // 是否支持多选
  multiple: false,
  options: {},
  decorator: {}
}
};
