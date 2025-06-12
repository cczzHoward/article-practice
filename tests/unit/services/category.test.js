const CategoryService = require('../../../src/services/category');
const CategoryRepository = require('../../../src/repositories/category');

jest.mock('../../../src/repositories/category');

describe('CategoryService', () => {
    describe('findAll', () => {
        it('should return all categories', async () => {
            // Arrange
            const mockCategories = [{ name: 'Category1' }, { name: 'Category2' }];
            CategoryRepository.findAll.mockResolvedValue(mockCategories);

            // Act
            const result = await CategoryService.findAll();

            // Assert
            expect(result).toEqual(mockCategories);
            expect(CategoryRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return category by ID', async () => {
            // Arrange
            const mockCategory = { _id: '123', name: 'TestCategory' };
            CategoryRepository.findById.mockResolvedValue(mockCategory);

            // Act
            const result = await CategoryService.findById('123');

            // Assert
            expect(result).toEqual(mockCategory);
            expect(CategoryRepository.findById).toHaveBeenCalledWith('123');
        });
    });

    describe('create', () => {
        it('should create a new category', async () => {
            // Arrange
            const mockCategory = { name: 'NewCategory' };
            CategoryRepository.create.mockResolvedValue(mockCategory);

            // Act
            const result = await CategoryService.create(mockCategory);

            // Assert
            expect(result).toEqual(mockCategory);
            expect(CategoryRepository.create).toHaveBeenCalledWith(mockCategory);
        });
    });

    describe('update', () => {
        it('should update a category by ID', async () => {
            // Arrange
            const categoryId = '123';
            const updateData = { name: 'UpdatedCategory' };
            const mockCategory = { _id: categoryId, ...updateData };
            CategoryRepository.update.mockResolvedValue(mockCategory);

            // Act
            const result = await CategoryService.update(categoryId, updateData);

            // Assert
            expect(result).toEqual(mockCategory);
            expect(CategoryRepository.update).toHaveBeenCalledWith(categoryId, updateData);
        });
    });

    describe('delete', () => {
        it('should delete a category by ID', async () => {
            // Arrange
            const categoryId = '123';
            CategoryRepository.delete.mockResolvedValue(true);

            // Act
            const result = await CategoryService.delete(categoryId);

            // Assert
            expect(result).toBe(true);
            expect(CategoryRepository.delete).toHaveBeenCalledWith(categoryId);
        });
    });
});
