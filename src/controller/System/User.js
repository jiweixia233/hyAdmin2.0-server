const HyAll = require('../Common/HyAll');
const {cryptoMd5} = require('../../common/utils/crypto');
const _ = require('lodash');

module.exports = class extends HyAll {
  /**
   * 登录态检查
   * @returns {Promise.<void>}
   */
  async checkAuthAction() {
    const isLogin = await this.session('isLogin');
    const result = {status: isLogin};
    if (!isLogin) {
        const key = cryptoMd5(parseInt(Math.random() * 10000000, 10));
        await this.session('LOGIN_KEY', key);

        result.key = key;
    }
    this.json(result);
  }

  async routerDataAction() {
    const routerData = [];
    const modules = await this.session('modules');

    for (let {content_type, module_name, frame_nav} of modules) {
      content_type && routerData.push({path: '/' + frame_nav.value + '/' + module_name, component: content_type});
    }

    return this.json({routerData});
  }

  async menuDataAction() {
    const modules = await this.session('modules');
    const nav = await this.model('frame_nav').where({status: 1}).select();

    const menuData = [];
    for (let {id, title, value, icon} of nav) {
      const children = modules.filter(item => item['nav_id'] === id && item['pid'] === 0).map(item => {
        const {content_type, table_name, title, module_name, icon} = item;
        return {content_type, icon, name: title, path: value + '/' + module_name};
      });
      children.length && menuData.push({name: title, path: value, icon, children});
    }

    return this.json({menuData})
  }

  async modulesAction() {
    let modules = await this.session('modules');
    console.log(modules);
    modules = modules.filter(item => item.pid === 0).map(item => ({value: item.id, title: item.title}));

    this.json({status: true, data: modules})
  }

  async currentUserAction() {
    const userInfo = await this.session('userInfo');
    return this.json(userInfo);
  }
};
