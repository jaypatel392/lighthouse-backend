const mongoose = require('mongoose');

const rcadsSchema = new mongoose.Schema({
    rcads : {
        type: Array,
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
})

module.exports = mongoose.model('Rcads', rcadsSchema);

