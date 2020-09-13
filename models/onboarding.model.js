const mongoose = require('mongoose');
const { stream } = require('winston');

const onboardingSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    },
    btn: {
        type: String,
        default: 'Next'
    }
}, { timestamps: true })

module.exports = mongoose.model('Onboarding', onboardingSchema);

