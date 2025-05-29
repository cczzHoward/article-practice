function baseSchemaPlugin(schema) {
    schema.add({
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    });

    schema.options.versionKey = false; // Disable version key (__v)

    schema.options.toJSON = {
        transform: function (doc, ret) {
            ret.id = doc._id;
            delete ret._id;
            return ret;
        }
    };

    schema.pre('save', function (next) {
        this.updated_at = Date.now();
        if (!this.created_at) {
            this.created_at = this.updated_at;
        }
        next();
    });

    schema.pre('findOneAndUpdate', function (next) {
        this.set({ updated_at: Date.now() });
        next();
    });
}

module.exports = baseSchemaPlugin;