const express = require('express')
const router = express.Router()

const DocCtrl = require('../controllers/documentControllers')
const { protect, admin } = require('../middleware/authMiddleware')
const { uploadFile } = require('../utils/files')

router.route('/')
    .get(protect, admin, DocCtrl.getDocumentsByAdmin)
    .post(protect, admin, uploadFile.single('file'), DocCtrl.createDocument)

router.route('/:id')
    .get(protect, admin, DocCtrl.getDocumentById)
    .put(protect, admin, uploadFile.single('file'), DocCtrl.updateDocument)
    .delete(protect, admin, DocCtrl.deleteDocument)

module.exports = router