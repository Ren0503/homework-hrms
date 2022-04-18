const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Document',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    seen: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true,
})

notificationSchema.plugin(mongoose_delete,  {
    deletedAt: true,
    overrideMethods: 'all',
})

module.exports = mongoose.model('Notification', notificationSchema)
