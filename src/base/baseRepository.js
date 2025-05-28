class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(filter = {}) {
    return this.model.find(filter);
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async create(data) {
    const doc = new this.model(data);
    return doc.save();
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;