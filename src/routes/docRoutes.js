const express = require('express')
const router = express.Router()

const DocCtrl = require('../controllers/documentControllers')
const { protect, admin } = require('../middleware/authMiddleware')
const { uploadFile } = require('../utils/fileHandlers')

/* NOTE: 100% automatic */
router.route('/')
    .get(protect, admin, DocCtrl.getDocumentsByAdmin)
    .post(protect, admin, uploadFile.single('file'), DocCtrl.createDocument)

router.route('/deleted')
    .get(protect, admin, DocCtrl.getDeletedDocumentsByAdmin)

/* NOTE: 100% automatic */
router.route('/:id')
    .get(protect, DocCtrl.getDocumentById)
    .put(protect, admin, uploadFile.single('file'), DocCtrl.updateDocument)
    .patch(protect, admin, DocCtrl.restoreDocument)
    .delete(protect, admin, DocCtrl.deleteDocument)

module.exports = router