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

  async initFieldsOptions() {

    const roles = await this.model('frame_role').where({status: 1}).select();

    const roles_options = roles.map(item => ({
      value: item.id,
      title: item.name
    }));

    return {
      ignoreFields: {
        all: [
          'module_id',
          'frame_modules_HY_SEP_nav_id',
          'frame_role_HY_SEP_status',
          'frame_modules_HY_SEP_table_name',
          'frame_modules_HY_SEP_module_name',
          'frame_role_HY_SEP_registraters',
          'frame_role_HY_SEP_table',
          'frame_modules_HY_SEP_content_type',
          'frame_modules_HY_SEP_title',
          'frame_modules_HY_SEP_status'
        ],
        list: ['role_id', 'module_id'],
        form: [
          'frame_modules_HY_SEP_title',
          'frame_role_HY_SEP_name',
        ]
      },
      specialFields: {
        role_id: {
          form: {
            title: '角色',
            type: 'select',
            options: roles_options,
            placeholder: '请选择需要添加的角色'
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
