const HyBase = require('./HyBase');
const {act_encrypt, act_decrypt} = require('../../common/utils/crypto');
const _ = require('lodash');
const relate_sep = '_HY_SEP_';
const tablePrefix = 'homyit_';

module.exports = class HyAll extends HyBase {

    async allAction() {
      const {pagination: {pageSize, pageNo}} = this.post();
      const {relation_ids, table_name} = await this.getRouterFields(['relation_ids', 'table_name']);
      const relations = await this.model('frame_relations').where({id: ['IN', relation_ids.split(',')]}).select();
      const limit = pageSize && pageNo ? ` LIMIT ${(pageNo - 1) * pageSize},${pageNo * pageSize} ` : '';

      let totalFields = [];
      let relateConditions = '';

      for (let item of relations) {
        let {table, field, fields, relate_table, relate_field, relate_fields, relate_type} = item;
        const isRelate = relate_table && relate_fields && relate_type;

        relate_table = tablePrefix + relate_table;
        table = tablePrefix + table;

        totalFields = totalFields.concat(fields.split(',').map(field => `${table}.${field.trim()}`));

        if (!!isRelate) {
          totalFields = totalFields.concat(relate_fields.split(',').map(val =>
            `${relate_table}.${val.trim()} AS ${relate_table}${relate_sep}${val.trim()} `
          ));
          relateConditions += `${relate_type} JOIN ${relate_table} ON ${table}.${field}=${relate_table}.${relate_field}`;
        }
      }

      const totalFieldsStr = Array.from(new Set(totalFields)).join(',');
      const select = `SELECT ${totalFieldsStr} FROM homyit_${table_name} ${relateConditions} ${limit}`;
      console.log(select);
      const listData = await this.model(table_name).query(select);

      const packColumns = await this.getColumns();

      return this.json({...packColumns, listData});
    }

    async getColumns() {
      let {id, relation_ids, table_name, module_name} = await this.getRouterFields(['id', 'relation_ids', 'table_name', 'module_name']);
      const {step} = this.post();

      if (step && step > 0) {
        let count = 1;
        let pid = id;
        while (count <= step) {
          const {
            id,
            table_name: step_table_name,
            relation_ids: step_relation_ids,
            module_name: step_module_name
          } = await this.model('frame_modules').where({pid}).find();

          if (count++ === step) {
            table_name = step_table_name;
            relation_ids = step_relation_ids;
            module_name += '/' + step_module_name;
          }
          pid = id;
        }
      }
      const relations = await this.model('frame_relations').where({id: ['IN', relation_ids.split(',')]}).select();
      let columns = [];

      for (let item of relations) {
        const {table, fields, relate_table, relate_fields, relate_type} = item;
        const isRelate = relate_table && relate_fields && relate_type;

        let tableColumns = await this.model('frame_table_field').where({
          table_name: table,
          data_index: ['IN', fields.split(',')]
        }).select();

        if (table_name !== table) {
          tableColumns = tableColumns.map(item => ({
            ...item,
            data_index: `${table}${relate_sep}${item.data_index}`
          }));
        }
        columns = columns.concat(tableColumns);

        if (!!isRelate) {
          const tableColumns = await this.model('frame_table_field').where({
            table_name: relate_table,
            data_index: ['IN', relate_fields.split(',')]
          }).select();

          columns = columns.concat(tableColumns.map(item => ({
            ...item,
            data_index: `${tablePrefix}${relate_table}${relate_sep}${item.data_index}`
          })));
        }
      }

      const packColumns = {};

      for (let {data_index, title} of columns) {
        if (data_index === 'id') continue;
        packColumns[data_index] = {title}
      }

      return {columns: packColumns, module_name: '/' + module_name};

    }

    async columnsAction() {
      const result = await this.getColumns();
      this.json(result);
    }

    async ajaxAction() {
        const type = this.ctx.query.q;
        await this[`ajax_${type}`]();
    }

    async ajax_insert() {
      let {step, values, ...stepIds} = this.post();
      const isRelate = Object.keys(values).some(key => key.indexOf(relate_sep) > -1);

      Object.keys(values).map(key => {
        Array.isArray(values[key]) && (values[key] = values[key].join(','));
      });

      let {id, table_name} = await this.getRouterFields(['table_name', 'id']);
      let moduleTableName = table_name, pid = id;

      if (step > 0) {
        let count = 1;
        while (count <= step) {
          const {id, table_name, pfield} = await this.model('frame_modules').where({pid}).find();
          if (count++ === step) {
            moduleTableName = table_name;
            values[pfield] = stepIds[`step${count-2}`];
          }
          pid = id;
        }
      }

      // todo: 暂时只做单表写入，之后补上多表

      let insertId;

      if (!isRelate) {
          insertId = await this.model(moduleTableName).add(values);
      }

      this.json({status: true, id: insertId});
    }

    async ajax_edit() {
      const {path, pk} = this.post();
      const id = act_decrypt(pk);
    }

    async ajax_update() {

    }
};