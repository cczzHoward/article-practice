const mongoose = require('mongoose');

// TODO: 不知道這個檢查 ObjectId 的方法是不是好的，感覺有點冗長
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = isValidObjectId;
