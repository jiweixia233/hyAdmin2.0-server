import {decryption, cryptoMd5} from "../../common/utils/crypto";

const Base = require('../Common/HyBase');

export default class extends Base {
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

  /**
   * 基础信息输出
   * @returns {Promise<*>}
   */
  async currentUserAction() {
    const userInfo = await this.session('userInfo');
    return this.json(userInfo);
  }

  /**
   * 登入
   * @returns {Promise<void>}
   */
  async loginAction() {
    const ctx = this.ctx;

    // 跨域检测
    if (ctx.request.method === 'OPTIONS') {
      return;
    }

    let {userName, password, type} = ctx.post();

    if (type === 'account') {
      await this.onAccountLogin(userName, password);
    }

    if (type === 'mobile') {
      await this.onMobileLogin(userName, password);
    }
  }
  async onAccountLogin(userNo, password) {
    const loginKey = await this.session('LOGIN_KEY');
    const sessionId = this.cookie('@hy');
    const isSso = this.config('SINGLE_POINT_ONLINE');
    const userModel = this.model('frame_user');

    userNo = decryption({data: userNo, key: loginKey});

    const userInfo = await userModel.where({'user_no': userNo, 'status': 1}).find();

    // 校验账号
    if (!userInfo.id) {
      return this.json({status: 'error', message: '账号不存在或已被禁用'});
    }

    const saveSessionId = await this.cache(`uid-${userInfo.id}`);
    const pwdKey = userInfo.password.substr(5, 32);
    try {
      password = decryption({data: password, key: pwdKey});
    } catch (e) {
      return this.json({status: 'error', message: '输入的密码有误'});
    }
    
    // 校验密码
    if (userInfo.password !== password) {
      return this.json({status: 'error', message: '输入的密码有误'});
    }
    // 单点登录限制
    if (isSso && sessionId && saveSessionId !== sessionId) {
      return this.json({status: 'error', message: '用户已经在线！如非正常退出，请稍后再试！'});
    }

    // 登录成功 缓存相关信息
    const {id, role} = userInfo;

    // 更新登录记录
    await userModel.where({id: userInfo.id}).update({
      login_last_time: Date.now(),
      login_times:['exp', 'login_times+1'],
    });

    // 缓存身份认证信息
    await this.session('USER_AGENT', this.userAgent);
    await this.session('isLogin', true);
    // session_id缓存
    await this.cache(`uid-${userInfo.id}`, sessionId);

    // 用户信息缓存
    await this.session('userId', id);
    await this.session('roleId', role);
    delete userInfo.password;
    await this.session('userInfo', userInfo);

    return this.json({status: 'ok', message: '登录成功，玩命加载中。。。', userInfo});
  }

  async onMobileLogin(userName, password) {

  }

  /**
   * 登出
   * @returns {Promise<void>}
   */
  async logoutAction() {
    if (!this.session('userId')) {
      return;
    }
    await this.session(null);
  }
};
