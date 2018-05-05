import HyAll from '../Common/HyAll';

const _ = require('lodash');

export default class extends HyAll {
  get tableName() {
    return 'homyit_frame_modules';
  }

  get relation() {
    return {
      frame_nav: {
        type: think.Model.BELONG_TO,
        key: 'nav_id'
      }
    };
  };

  initLimit() {
    return {
      pid: 0
    }
  }

  async initFieldsOptions() {
    const allTableName = await this.getAllTableNames();
    const allNav = await this.getAllNav();

    return {
      ignoreFields: {
        all: ['nav_id'],
        list: ['table_name', 'module_name', 'content_type', 'nav_id'],
        form: ['frame_nav_HY_SEP_title', 'frame_nav_HY_SEP_value']
      },
      specialFields: {
        table_name: {
          form: {
            type: 'select',
            options: allTableName,
            placeholder: '请选择主表'
          }
        },
        content_type: {
          form: {
            type: 'select',
            options: [
              {value: 'tableList', title: '管理列表页'}
            ],
            placeholder: '请选择模块类型'
          }
        },
        nav_id: {
          form: {
            type: 'select',
            options: allNav,
            placeholder: '请选择菜单'
          }
        },
        status: {
          form: {
            type: 'select'
          }
        }
      }
    }
  }

  initModuleOptions() {
    return {
      writeByStep: true,
      steps: [
        {
          title: '完善基础信息',
          moduleUrl: '/Manage/Module',
        },
        {
          title: '分配模块角色',
          moduleUrl: '/Manage/Privileges',
        }
      ]
    }
  }

};
