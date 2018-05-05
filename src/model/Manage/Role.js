import HyAll from '../Common/HyAll';

export default class extends HyAll {

  async initFieldsOptions() {
    const allTableName = await this.getAllTableNames();
    return {
      ignoreFields: {
        form: ['registraters']
      },
      specialFields: {
        table: {
          title: '数据表',
          form: {
            type: 'select',
            options: allTableName,
            placeholder: '请选择角色所在数据表'
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
          title: '完善角色信息',
          moduleUrl: '/Manage/Role',
        },
        {
          title: '分配角色模块',
          moduleUrl: '/Manage/Auth',
        }
      ]
    }
  }
};