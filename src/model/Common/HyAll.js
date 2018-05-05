import _ from 'lodash';
import Base from './Base';
import {
  defaultModuleOptions,
  defaultPageOptions,
  defaultSearchFiledOptions,
  defaultFormFieldOptions,
  defaultListFiledOptions,
  relateSep
} from '../../config/config';

export default class extends Base {

  constructor(...args) {
    super(...args);

    this.userInfo = args[1].userInfo;
    this.fieldsOptions = {};
    this.moduleOptions = {};
    this.pageOptions = {};
    this.breadCrumb = {};
    this.allTableName = [];
    this.limit = {};
    this._initialize();
  }

  _initialize() {
    this.moduleOptions = _.defaultsDeep({}, this.initModuleOptions() || {}, defaultModuleOptions);
    this.pageOptions = _.defaultsDeep({}, this.initPageOptions() || {}, defaultPageOptions);
    this.breadCrumb = this.initBreadCrumb() || {};
    this.limit = this.initLimit() || {};
    this.fieldsOptions = this.initFieldsOptions() || {};
  }

  get relation() {
    return {};
  };

  initLimit() {};

  initFieldsOptions() {};

  initPageOptions() {};

  initModuleOptions() {}

  initBreadCrumb() {};

  async all(table_name, params) {
    const columns = await this.packColumns(table_name);
    const listData = await this.getListData(table_name, params);

    return {
      columns,
      listData,
      pageOptions: this.pageOptions,
      breadCrumb: this.breadCrumb
    };
  }

  getModuleOption() {
    return this.moduleOptions;
  }

  async getModuleList(table_name, params) {
    return await this.getListData(table_name, params);
  }
  async packColumns(table_name) {
    if (this.fieldsOptions instanceof Promise) {
      this.fieldsOptions = await this.fieldsOptions;
    }

    const {ignoreFields = {}, specialFields = {}} = this.fieldsOptions;
    console.log(this.fieldsOptions);
    const current_table_name = table_name;

    let allColumns = [];
    let listColumns = {};
    let formColumns = {};
    let searchColumns = {};

    const columns = await this.model('frame_table_field').where({table_name: current_table_name}).select();
    allColumns = allColumns.concat(columns);

    if (!_.isEmpty(this.relation)) {
      for (let [table_name, options] of Object.entries(this.relation)) {

        const columns = await this.model('frame_table_field').where({table_name: options.model || table_name}).select();

        allColumns = allColumns.concat(columns);
      }
    }

    const normalFields = _.filter(allColumns, function (item) {
      const field = item.table_name === current_table_name ? item.data_index : item.table_name +  relateSep + item.data_index;
      const {all = []} = ignoreFields;

      return !all.some(val => val === field) && !Object.keys(specialFields).some(val => val === field);

    });

    for (let {title, data_index, table_name} of normalFields) {

      const {list = [], form = [], search = []} = ignoreFields;
      const key = table_name === current_table_name ? data_index : table_name + relateSep + data_index;
      if (!~search.indexOf(key)) {
        searchColumns[key] = _.defaultsDeep({}, {title}, defaultSearchFiledOptions);
      }
      if (!~list.indexOf(key)) {
        listColumns[key] = _.defaultsDeep({}, {title}, defaultListFiledOptions);
      }
      if (!~form.indexOf(key)) {
        formColumns[key] = _.defaultsDeep({}, {title}, defaultFormFieldOptions);
      }
    }

    for (let [data_index, field] of Object.entries(specialFields)) {
      let key = data_index;
      let {list: ignoreListFields, form: ignoreFormFields, search: ignoreSearchFields} = ignoreFields;
      let {title, table, list = {}, form = {}, search = {}} = field;

      ignoreListFields = ignoreListFields || [];
      const currentColumns = _.find(allColumns, item => item.data_index === data_index && item.table_name === current_table_name);
      title = currentColumns ? currentColumns.title : title;

      if (table && table !== current_table_name) {
        key = table + relateSep + data_index;
        const currentColumns = _.find(allColumns, item => item.data_index === data_index && item.table_name === table);
        title = currentColumns ? currentColumns.title : title;

      }

      if (!ignoreSearchFields || !~ignoreSearchFields.indexOf(key)) {
        searchColumns[key] = _.defaultsDeep({}, search, {title}, defaultSearchFiledOptions);
        if (searchColumns[key].type === 'select' && _.isPlainObject(searchColumns[key].options)) {
          searchColumns[key].options = this[`getOptions_${key}`] ? this[`getOptions_${key}`]() : {};
        }
      }
      if (!ignoreFormFields || !~ignoreFormFields.indexOf(key)) {
        formColumns[key] = _.defaultsDeep({}, form, {title}, defaultFormFieldOptions);
        if (formColumns[key].type === 'select' && _.isPlainObject(formColumns[key].options)) {
          formColumns[key].options = this[`getOptions_${key}`] ? this[`getOptions_${key}`]() : {};
        }
      }
      if (!ignoreListFields || !~ignoreListFields.indexOf(key)) {
        listColumns[key] = _.defaultsDeep({}, list, {title}, defaultListFiledOptions);
      }
   }

    return {
      searchColumns,
      listColumns,
      formColumns
    }


  }

  /**
   * 列表页dataTables数据输出
   */
  async getListData(table_name, params = {}) {

    const relation = this.relation;
    let data = [];
    if (this.limit instanceof Promise) {
      this.limit = await this.limit;
    }

    const relationKeys = _.keys(relation);
    if (relation && relationKeys.length) {

      data = await this.setRelation(true).where({...params}).select();

      if(!_.isEmpty(this.limit)) {
        data = data.filter(item => {
          let result = true;
          let limit = this.limit;
          let limitKeys = _.keys(limit);

          limitKeys.some(key => {
            if (~relationKeys.indexOf(key)) {

              _.keys(limit[key]).find(childKey => {
                  if (item[key][childKey] !== limit[key][childKey]) {
                    result = false
                  }
                  return !result;
              });

            } else if (item[key] !== limit[key]) {
              result = false;
            }

            return !result;
          });

          return result;
        })

      }

      data = data.map(item => {
        let newItem = {...item};
        relationKeys.map(model => {
          newItem = {
            ...newItem,
            ...(
              item[model]
              ? Object.keys(item[model]).reduce(function (ret, key) {
                  ret[model + relateSep + key] = item[model][key];
                  return ret;
                }, {})
              : {}
            )
          };

          delete newItem[model];
        });
        return newItem;
      });

    } else {
      data = await this.model(table_name).where({...params, ...this.limit}).select();
    }

    return data;
  }


  ajax() {

  }

  async ajax_edit(tableName, id, values) {
    return await this.model(tableName).where({id}).update(values);
  }

  ajax_update() {

  }

  async ajax_insert(tableName, values) {
    return await this.model(tableName).add(values);
  }

  ajax_delete() {

  }

  getOptions_TF() {
    return {
      0: '否',
      1: '是'
    }
  }

  getOptions_sex() {
    return {
      '女': '女',
      '男': '男'
    }
  }

  getOptions_status() {
    return [
      {value: 1, title: '启用'},
      {value: 0, title: '禁用'}
    ]
  }

};