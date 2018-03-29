module.exports = class extends think.Model {
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
  }
  async getModules(access) {
    console.log(access);
    return await this.setRelation(true).where({id: ['IN', access.split(',')]}).select();
  }

};