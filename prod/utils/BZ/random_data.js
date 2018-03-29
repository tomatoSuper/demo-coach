module.exports = {
  createCommodities (start, len) {
    let list = [];
    for(let i = start; i <= len; i++) {
      list.push(new Commodity(i));
    }
    function Commodity(idx) {
      this.id = `commodity-${idx}`;
      this.name = `商品-${idx}`;
      this.price = (Math.random() * 1000).toFixed(2);
    }
    return list;
  },
  
};