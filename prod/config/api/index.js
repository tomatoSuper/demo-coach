const server = 'http://api.common.com'
module.exports = {
  BZ: require('./BZ.js'),
  Teein: require('./Teein.js'),
  common: {
    login: `${server}/login`,
    user: {
      coupons: {
        list: `${server}/user/coupons/list`,
        rules: `${server}/user/coupons/rules`
      },
      info: `${server}/user/info`,
      points: {
        list: `${server}/user/points/list`,
        value: `${server}/user/coupons/value`
      }
    }
  } 
}