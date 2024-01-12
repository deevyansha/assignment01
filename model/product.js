const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const aggregatePaginate = require('mongoose-aggregate-paginate');
const schema = mongoose.Schema;
const productKey = new schema({
    title: {
        type: String,
        required: true,
      },
      images: {
        type: [String],
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discountPrice: {
        type: Number,
      },
      description: {
        type: String,
      },
      stock: {
        type: Number,
        required: true,
      },
     
    },
        {
        timestamps: true
    })
    productKey.plugin(aggregatePaginate);
    productKey.plugin(mongoosePaginate);
module.exports = mongoose.model('product', productKey);
