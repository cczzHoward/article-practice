class BaseModel {
  constructor() {
    this._data = {};
  }

  getData() {
    return this._data;
  }

  setData(data) {
    this._data = data;
  }

  get(key) {
    return this._data[key];
  }

  set(key, value) {
    this._data[key] = value;
  }
}

module.exports = new BaseModel();