const server = 'http://api.baozun.com';
module.exports = {
  plp: {
    list: `${server}/plp/list`,
    enumeration: server + '/plp/enumeration'
  },
  pdp: `${server}/pdp`,
  shopCar: {
    list: `${server }/shopCar/list`
  }
}