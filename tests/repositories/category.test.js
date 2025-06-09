const CategoryRepository = require('../../src/repositories/category');
const CategoryModel = require('../../src/models/category');

jest.mock('../../src/models/category');

describe('CategoryRepository', () => {
    describe('findAll', () => {
        it('should return all categories', async () => {
            // Arrange
            const mockCategories = [{ name: 'Category1' }, { name: 'Category2' }];
            CategoryModel.find.mockResolvedValue(mockCategories);

            // Act
            const result = await CategoryRepository.findAll();

            // Assert
            expect(CategoryModel.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockCategories);
        });
    });

    describe('findById', () => {
        it('should find a category by ID', async () => {
            // Arrange
            const mockCategory = { _id: '123', name: 'Test Category' };
            CategoryModel.findById.mockResolvedValue(mockCategory);

            // Act
            const result = await CategoryRepository.findById('123');

            // Assert
            expect(CategoryModel.findById).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockCategory);
        });
    });

    describe('create', () => {
        it('should create a new category', async () => {
            // Arrange
            const mockCategory = { name: 'New Category' };
            const saveMock = jest.fn().mockResolvedValue(mockCategory);
            CategoryModel.mockImplementation(() => ({
                save: saveMock,
            }));

            // Act
            const result = await CategoryRepository.create(mockCategory);

            // Assert
            expect(CategoryModel).toHaveBeenCalledWith(mockCategory);
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(mockCategory);
        });
    });

    describe('update', () => {
        it('should update a category', async () => {
            // Arrange
            const mockCategory = { _id: '123', name: 'Updated Category' };
            const updateData = { name: 'Updated Category' };
            CategoryModel.findByIdAndUpdate.mockResolvedValue(mockCategory);

            // Act
            const result = await CategoryRepository.update('123', updateData);

            // Assert
            expect(CategoryModel.findByIdAndUpdate).toHaveBeenCalledWith('123', updateData, {
                new: true,
            });
            expect(result).toEqual(mockCategory);
        });
    });

    describe('delete', () => {
        it('should delete a category', async () => {
            // Arrange
            const mockCategory = { _id: '123', name: 'Deleted Category' };
            CategoryModel.findByIdAndDelete.mockResolvedValue(mockCategory);

            // Act
            const result = await CategoryRepository.delete('123');

            // Assert
            expect(CategoryModel.findByIdAndDelete).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockCategory);
        });
    });

    describe('findByName', () => {
        it('should find a category by name', async () => {
            // Arrange
            const mockCategory = { _id: '123', name: 'Test Category' };
            CategoryModel.findOne.mockReturnValue({
                select: jest.fn().mockReturnValue(mockCategory),
            });

            // Act
            const result = await CategoryRepository.findOneByName('Test Category');

            // Assert
            expect(CategoryModel.findOne).toHaveBeenCalledWith({ name: 'Test Category' });
            expect(result).toEqual(mockCategory);
        });
    });
});
