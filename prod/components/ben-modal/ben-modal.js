// components/ben-modal/ben-modal.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    open: {
      type: Boolean, value: false,
      observer(cur, old) { cur && this.data.toast && this._showToast(); }
    },
    toast: { type: Boolean, value: false },
    title: { type: String, value: '' },
    duration: { type: Number, value: 1 },
    btnText: { type: Array, value: [] }
  },
  data: {
    animation: 'display: none;'
  },
  ready() { },
  methods: {
    _closeModal(e) { this.setData({ open: false }) },
    _touchDialog(e) { },
    _showToast() {
      let animation = 'animation: toasting linear ' + this.data.duration + 's; animation-fill-mode:forwards;'
      this.setData({ animation });
      let timer = setTimeout(_ => { this.setData({ animation: 'display: none;', open: false }); clearTimeout(timer) }, this.data.duration * 1000)
    },
    _onTapCancel(e) {
      let self = this;
      this.triggerEvent('onCancel', _ => { self.closeModal() });
    },
    _onTapEnsure(e) {
      let self = this;
      this.triggerEvent('onEnsure', _ => { self.setData({ open: false }) });
    },
  }
})
