module.exports = {
  data: {
    distanceY: 0,
    onTop: true,
    startY: 0
  },
  method: {
    _onScrollBottom(e) {
      let { method, name } = e.currentTarget.dataset;
      this[method.loadMore](name, e);
    },
    _onScrollTop(e) { this.data.onTop = true },
    _scrolling(e) {
      this.data.scrollTop = e.detail.scrollTop;
      if (this.data.distanceY < 0) { this.data.onTop = false }
    },
    _touchStart(e) { this.data.startY = e.touches[0].clientY; },
    _touchMove(e) {
      let self = this, y = e.touches[0].clientY, { method, name } = e.currentTarget.dataset;
      this.data.distanceY = y - this.data.startY;
      if (this.data.distanceY > 100 && this.data.onTop) {
        if (!this.data.refresh) {
          this[method.refresh](name, e);
        }
      }
    },
  }
}