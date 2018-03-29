module.exports = class extends think.Model {
  async getUserInfo(userNo) {
     const self = this;
     return await this.model('frame_user').where({'user_no': userNo, 'status': 1}).find();
  }

};