const bluebird = require('bluebird');
const connectionModel = require('../models/connection');

exports.login = async ctx => {
  try {
    const data = ctx.request.body;
    const connection = connectionModel.getConnection();
    const query = bluebird.promisify(connection.execute.bind(connection));

    const results = await query(
      'SELECT phone, password FROM user WHERE phone = ? AND password = ?',
      [data.phone, data.password],
    );

    if (results.length) {
      const user = results[0];

      // login success, set cookies
      ctx.cookies.set('userID', user.id, {
        httpOnly: false,
      });

      ctx.body = {
        status: 0,
        data: {
          id: user.id,
          name: user.phone,
        },
      };
    } else {
      throw new Error('用户名或密码错误');
    }
    connection.end();
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      msg: e.message,
    };
  }
};

exports.signup = async ctx => {
  try {
    const data = ctx.request.body;
    const connection = connectionModel.getConnection();
    const query = bluebird.promisify(connection.execute.bind(connection));

    // 返回的是数据，如果匹配内容，数组长度不为 1
    const searchPhone = await query('SELECT phone FROM user WHERE phone = ?', [
      data.phone,
    ]);

    const searchUsername = await query(
      'SELECT username FROM user WHERE username = ?',
      [data.username],
    );

    if (!searchPhone.length && !searchUsername.length) {
      const result = await query(
        `INSERT INTO user(
          username,
          password,
          createdAt,
          phone)
        VALUES(
          '${data.username}',
          '${data.password}',
          ${connection.escape(new Date())},
          '${data.phone}')`,
      );

      if (result) {
        ctx.body = {
          status: 0,
          data: {
            msg: '注册成功',
          },
        };
      } else {
        throw new Error('DB操作失败');
      }
    } else if (searchPhone.length) {
      throw new Error('该手机号已注册');
    } else {
      throw new Error('该用户名已注册');
    }
  } catch (e) {
    console.log('[/signup] error:', e.message, e.stack);
    ctx.status = 400;
    ctx.body = {
      msg: e.message,
    };
  }
};
