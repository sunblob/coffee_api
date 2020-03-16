const mongoose = require('mongoose')

const PointSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'Введите название точки']
    },
    description: {
        type: String,
        required: [true, 'Введите описание'],
        maxLength: [150, 'Описание не может быть длиннее 150 символов']
    },
    hint: {
        type: String,
        default: '',
        maxLength: [50, 'Подсказка не может быть длиннее 50 символов']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Point', PointSchema)
