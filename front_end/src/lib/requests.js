import ajax from './ajax';

export default {
  // 登录
  login(bodyPar) {
    return ajax('PUT', '/api/login', { bodyParams: bodyPar });
  },
  // 注册
  signup(bodyPar) {
    return ajax('POST', '/api/signup', { bodyParams: bodyPar });
  },
  // 获取邮箱验证码
  sendCaptcha(bodyPar) {
    return ajax('POST', '/api/sendCaptcha', { bodyParams: bodyPar });
  },
};
