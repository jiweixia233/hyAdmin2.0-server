import HyAll from '../Common/HyAll';

const _ = require('lodash');

export default class extends HyAll {
  get tableName() {
    return 'homyit_frame_access';
  }

  get relation() {
    return {
      frame_modules: {
        type: think.Model.BELONG_TO,
        key: 'module_id'
      },
      frame_role: {
        type: think.Model.BELONG_TO,
        key: 'role_id'
      }
    };
  };

  initLimit() {
    return {
      frame_modules: {
        pid: 0
      }
    }
  }

  initFieldsOptions() {
    let modules_form_options = this.userInfo.modules.filter(item => item.pid === 0).map(item => ({
      value: item.id, title: item.title
    }));

    return {
      ignoreFields: {
        all: ['role_id', 'frame_modules_HY_SEP_nav_id', 'frame_role_HY_SEP_status'],
        list: ['module_id'],
        form: [
          'frame_modules_HY_SEP_content_type',
          'frame_modules_HY_SEP_module_name',
          'frame_modules_HY_SEP_table_name',
          'frame_modules_HY_SEP_title',
          'frame_role_HY_SEP_name',
          'frame_role_HY_SEP_registraters',
          'frame_role_HY_SEP_table',
          'frame_modules_HY_SEP_status'
        ]
      },
      specialFields: {
        module_id: {
          form: {
            type: 'select',
            options: modules_form_options,
            placeholder: '请选择需要添加的模块'
          }
        },
        status: {
          title: '状态',
          form: {
            type: 'select',
          }
        }
      }
    }
  }
};
