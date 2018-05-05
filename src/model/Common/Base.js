import _ from 'lodash';

export default class extends think.Model {

  async getAllTableNames() {
    let allTableName = await this.query(`select TABLE_NAME from information_schema.TABLES where table_schema='hyadmin2.0' and table_type='BASE TABLE'`);

    return allTableName.reduce((ret, item) => {
      if (ret.TABLE_NAME === 'homyit_frame_user') return ret;
      ret.push({value: item.TABLE_NAME.slice(7), title: item.TABLE_NAME.slice(7)});
      return ret;
    }, []);
  }
  async getAllNav() {
    let allNav = await this.model('frame_nav').where({status: 1}).select();
    return allNav.reduce((ret, item) => {
      ret.push({value: item.id, title: item.title});
      return ret;
    }, []);
  }
  async getModules(access) {
    const allModules = await this.model('frame_modules').setRelation({
      frame_nav: {
        type: think.Model.BELONG_TO,
        key: 'nav_id'
      }
    }).where({id: ['IN', access]}).select();

    const topLevelModules = [];
    const restModules = [];

    allModules.map(item => {
      item.pid === 0 ? topLevelModules.push(item) : restModules.push(item);
    });

    let level = 0;

    function packModules(superModules) {

      if (restModules.length === 0) return superModules;

      superModules = superModules.map((item) => {
        let childItem = item;
        let child;
        let deep = level;

        while (deep--) {
          childItem = childItem.child;
        }
        restModules.some((restItem, index) => {
          if (childItem && childItem.id === restItem.pid) {
            child = restItem;
            while (deep++ < level) {
              child = {child};
            }
            restModules.splice(index, 1);
            return true;
          }
          return false;
        });
        if (child) {
          item = _.defaultsDeep({}, item, child);
        }
        return item;
      });
      level++;
      return packModules(superModules);
    }

    return packModules(topLevelModules);

  }
};