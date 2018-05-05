const HyAll = require('../Common/HyAll');
const {cryptoMd5} = require('../../common/utils/crypto');

module.exports = class extends HyAll {

  async routerDataAction() {
    const routerData = [];
    let modules = await this.getModules();

    for (let {content_type, module_name, frame_nav} of modules) {
      content_type && routerData.push({path: '/' + frame_nav.value + '/' + module_name, component: content_type});
    }

    return this.json({routerData});
  }

  async menuDataAction() {
    const modules = await this.getModules();
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
    let modules = await this.getModules();
    modules = modules.filter(item => item.pid === 0).map(item => ({value: item.id, title: item.title}));

    this.json({status: true, data: modules})
  }
};
