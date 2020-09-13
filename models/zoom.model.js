const mongoose = require('mongoose');

const zoomSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    host_id: String,
    topic: String,
    type: Number,
    start_time: Date,
    duration: Number,
    timezone: String,
    agenda: String,
    uuid: String,
    id: Number,
    join_url: String,
    status : String
}, { timestamps: true });

module.exports = mongoose.model('Zoom', zoomSchema);