import HyAll from '../Common/HyAll';

export default class extends HyAll {

  initPageOptions() {
    return {
      // 按钮组
      buttons: {
        add: {
          hidden: true
        }
      },
      actions: {
        delete: {
          title: '删除',
          // 物理删除 ：delete | 逻辑删除：status|9 （status为逻辑删除的字段，9为临界值）
          type: '',
          hidden: true
        }
      }
    }
  }
  initLimit() {
    return {
      id: this.userInfo.userId
    }
  }

  async initFieldsOptions() {
    const allTableName = await this.getAllTableNames();
    const allNav = await this.getAllNav();

    return {
      ignoreFields: {
        form: ['login_last_time', 'login_times']
      }
    }
  }
};