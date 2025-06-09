const CategoryModel = require('../../models/category');

const categoriesData = [
    { name: '技術新知' },
    { name: '前端' },
    { name: '後端' },
    { name: '資料庫' },
    { name: '測試' },
    { name: '安全' },
    { name: 'API 設計' },
    { name: '部署與維運' },
    { name: '使用者體驗' },
    { name: '其他' },
];

async function seedCategories() {
    await CategoryModel.deleteMany({});
    for (const category of categoriesData) {
        await CategoryModel.create(category);
    }
    console.log('Category seeding done!');
}

module.exports = seedCategories;
