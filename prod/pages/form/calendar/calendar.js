let app = getApp(), { monthEnum, weekEnum } = app.language.ZH_CN, today = app.util.formatTime(new Date(), 'json');
Page({
  data: {
    current: {},
    today,
    yearEnum: [],
    monthEnum,
    weekEnum,
    dateEnum: [],
  },
  onLoad(options) {
    let current = app.util.formatTime(new Date(), 'json'),
        { year, month, date, day } = current,
        current_setting = { current, yearEnum: this._setYearEnum(year), dateEnum: this._setDateEnum(year, month) };
    this.setData(current_setting);
  },
  _closeDatePicker (e) {},
  _checkMonth (e) {
    let month = e.currentTarget.dataset.index + 1, { year } = this.data.current;
    this.setData({ ['current.month']: month, dateEnum: this._setDateEnum(year, month) })
  },
  _checkYear(e) {
    let { month } = this.data.current, _year = this.data.yearEnum[e.currentTarget.dataset.index];
    this.setData({ ['current.year']: _year, dateEnum: this._setDateEnum(_year, month) })
  },
  _checkDate (e) {
    let { date } = e.currentTarget.dataset;
    console.log(date);
  },
  _setYearEnum(year) { 
    let yearEnum = [], year_start = year - year % 10;
    for (let i = year_start; i < year_start + 10; i++) { yearEnum.push(i); }
    return yearEnum
  },
  _setDateEnum(year, month) {
    let dateEnum = [];
    let dateLength = [31, year % 4 == 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let month_start_day = new Date([year, month, 1].join('/')).getDay();
    if (month_start_day > 0) {
      let start = dateLength[month - 2], len = start - month_start_day;
      for (let i = start; i > len; i--) { dateEnum.unshift({ year, month: month - 1, date: i }); }
    }
    for (let i = 1; i <= dateLength[month-1]; i++) {
      let isTody = today.year === year && today.month === month && today.date === i;
      dateEnum.push({ year, month, date: i, isTody });
    }
    if (dateEnum.length < 42) {
      let len = 42 - dateEnum.length;
      for (let i = 1; i <= len; i++) { dateEnum.push({ year, month: month+1, date: i }); }
    }
    return dateEnum;
  },

  onReady () {
  
  },
  onShow () {
  
  },
})