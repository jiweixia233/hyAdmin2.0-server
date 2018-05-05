const HyBase = require('./HyBase');
const {act_encrypt, act_decrypt} = require('../../common/utils/crypto');
const _ = require('lodash');
const relate_sep = '_HY_SEP_';
const tablePrefix = 'homyit_';

module.exports = class HyAll extends HyBase {

  async allAction() {
    const {
      link_field,
      link_id,
      table_name,
      child,
    } = await this.getRouterFields(['link_field', 'link_id', 'table_name', 'child']);
    const link_module = child && child.module_name;

    const current_model = await this.getCurrentModel();
    const model = await this.getModel(current_model);
    const params = this.getParams();

    const result = await model.all(table_name, params);

    return this.json({...result, link_field, link_id, link_module});
  }

  async moduleOptionAction() {
    const current_model = await this.getCurrentModel();
    const model = await this.getModel(current_model);

    this.json({status: true, moduleOptions: model.getModuleOption()});
  }

  async moduleListAction() {
    const table_name = await this.getRouterFields('table_name');
    const current_model = await this.getCurrentModel();
    const model = await this.getModel(current_model);
    const params = this.getParams();

    const listData = await model.getModuleList(table_name, params);

    this.json({status: true, listData});
  }

  getParams() {
    const {params} = this.post();
    const {page, ...ids} = params;
    return ids;
  }

  async getValues() {
    let {values} = this.post();
    let params = this.getParams();
    return {...values, ...params};
  }

  async getCurrentModel() {
    const {
      frame_nav,
      module_name
    } = await this.getRouterFields(['frame_nav', 'module_name']);

    return frame_nav.value + '/' + module_name;
  }
  async getModel(currentModel) {
    const modules = await this.getModules();
    const userId = await this.session('userId');
    const roleId = await this.session('roleId');
    const userInfo = {modules, userId, roleId};

    const models = Object.keys(this.ctx.app.models);
    const modelName = ~models.indexOf(currentModel) ? currentModel : 'Common/Empty';

    return this.model(modelName, {userInfo});
  }

  async nextFormAction() {
    const table_name = await this.getRouterFields('table_name');
    const {step, steps, path} = this.post();

    const currentModel = steps[step].moduleUrl.slice(1);
    const model = await this.getModel(currentModel);

    const {formColumns} = await model.packColumns(table_name);

    return this.json(formColumns);
  }
  async ajaxAction() {
      const type = this.ctx.query.q;
      await this[`ajax_${type}`]();
  }

  async ajax_insert() {
    const {link_id, table_name} = await this.getRouterFields(['table_name', 'link_id']);
    const values = await this.getValues();
    const current_model = await this.getCurrentModel();
    const model = await this.getModel(current_model);
    const insertId = await model.ajax_insert(table_name, values);
    const listData = await model.getListData(table_name, {id: insertId});

    return insertId ? this.json({status: true, id: insertId, listData: listData[0]}) : this.json({status: false});
  }

  async ajax_edit() {
    const {values} = this.post();
    const {id, ...restValues} = values;
    const {table_name} = await this.getRouterFields(['table_name', 'link_id']);

    const currentModel = await this.getCurrentModel();
    const model = await this.getModel(currentModel);
    const result = await model.ajax_edit(table_name, id, restValues);
    const listData = await model.getListData(table_name, {id});

    return result ? this.json({status: true, id, listData: listData[0]}) : this.json({status: false});

  }

  async ajax_delete() {
    const {id} = this.post();
    const table_name = await this.getRouterFields('table_name');
    console.log(table_name);
    const result = await this.model(table_name).where({id}).delete();
    this.json({status: !!result});
  }
};