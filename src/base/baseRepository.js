class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    return await this.model.findAll();
  }

  async findById(id) {
    return await this.model.findByPk(id);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const record = await this.model.findByPk(id);
    if (record) {
      return await record.update(data);
    }
    throw new Error('Record not found');
  }

  async delete(id) {
    const record = await this.model.findByPk(id);
    if (record) {
      return await record.destroy();
    }
    throw new Error('Record not found');
  }
}

module.exports = new BaseRepository();