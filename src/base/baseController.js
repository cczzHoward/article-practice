const logger = require('../utils/logger');
const responseUtils = require('../utils/response');

class BaseController {
    constructor(service, resourceName = 'resource') {
        this.service = service;
        this.resourceName = resourceName;

        // 綁定 this
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res) {
        try {
            const data = await this.service.findAll();
            responseUtils.success(res, data);
        } catch (error) {
            logger.error(`Error fetching ${this.resourceName} list:`, error);
            responseUtils.error(res, `Error fetching ${this.resourceName} list`);
        }
    };

    async getById(req, res) {
        try {
            const data = await this.service.findById(req.params.id);
            if (!data) {
                logger.warn(`${this.resourceName} with ID ${req.params.id} not found`);
                responseUtils.notFound(res, `${this.resourceName} not found`);
            }
            responseUtils.success(res, data);
        } catch (error) {
            logger.error(`Error fetching ${this.resourceName} by ID:`, error);
            responseUtils.error(res, `Error fetching ${this.resourceName} by ID`);
        }
    };

    async create(req, res) {
        try {
            const data = await this.service.create(req.body);
            responseUtils.created(res, data, `${this.resourceName} created successfully`);
        } catch (error) {
            logger.error(`Error creating ${this.resourceName}:`, error);
            responseUtils.error(res, `Error creating ${this.resourceName}`);
        }
    };

    async update(req, res) {
        try {
            const data = await this.service.update(req.params.id, req.body);
            responseUtils.success(res, data, `${this.resourceName} updated successfully`);
        } catch (error) {
            logger.error(`Error updating ${this.resourceName}:`, error);
            responseUtils.error(res, `Error updating ${this.resourceName}`);
        }
    };

    async delete(req, res) {
        try {
            const data = await this.service.delete(req.params.id);
            responseUtils.noContent(res, `${this.resourceName} deleted successfully`);
        } catch (error) {
            logger.error(`Error deleting ${this.resourceName}:`, error);
            responseUtils.error(res, `Error deleting ${this.resourceName}`);
        }
    };
}

module.exports = BaseController;