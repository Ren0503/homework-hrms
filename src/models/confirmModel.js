const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

const confirmSchema = new mongoose.Schema({
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
    status: {
        type: String,
        required: true,
        default: 'Open'
    }
}, {
    timestamps: true,
})

confirmSchema.plugin(mongoose_delete,  {
    deletedAt: true,
    overrideMethods: 'all',
})

module.exports = mongoose.model('Confirm', confirmSchema)
