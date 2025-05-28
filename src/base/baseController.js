const logger = require('../utils/logger');

class BaseController {
    constructor(service, resourceName = 'resource') {
        this.service = service;
        this.resourceName = resourceName;
    }

    getAll = async (req, res) => {
        try {
            const data = await this.service.findAll();
            res.status(200).json(data);
        } catch (error) {
            logger.error(`Error fetching ${this.resourceName} list:`, error);
            res.status(500).json({ message: `Error fetching ${this.resourceName} list` });
        }
    };

    getById = async (req, res) => {
        try {
            const data = await this.service.findById(req.params.id);
            if (!data) {
                logger.warn(`${this.resourceName} with ID ${req.params.id} not found`);
                return res.status(404).json({ message: `${this.resourceName} not found` });
            }
            res.status(200).json(data);
        } catch (error) {
            logger.error(`Error fetching ${this.resourceName} by ID:`, error);
            res.status(500).json({ message: `Error fetching ${this.resourceName} by ID` });
        }
    };

    create = async (req, res) => {
        try {
            const data = await this.service.create(req.body);
            res.status(201).json(data);
        } catch (error) {
            logger.error(`Error creating ${this.resourceName}:`, error);
            res.status(500).json({ message: `Error creating ${this.resourceName}` });
        }
    };

    update = async (req, res) => {
        try {
            const data = await this.service.update(req.params.id, req.body);
            res.status(200).json(data);
        } catch (error) {
            logger.error(`Error updating ${this.resourceName}:`, error);
            res.status(500).json({ message: `Error updating ${this.resourceName}` });
        }
    };

    delete = async (req, res) => {
        try {
            const data = await this.service.delete(req.params.id);
            res.status(200).json(data);
        } catch (error) {
            logger.error(`Error deleting ${this.resourceName}:`, error);
            res.status(500).json({ message: `Error deleting ${this.resourceName}` });
        }
    };
}

module.exports = BaseController;