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

    async create(data, options = {}) {
        const doc = new this.model(data);
        return doc.save(options);
    }

    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id, options = {}) {
        return this.model.findByIdAndDelete(id, options);
    }
}

module.exports = BaseRepository;
