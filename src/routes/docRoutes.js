const express = require('express')
const router = express.Router()

const DocCtrl = require('../controllers/documentControllers')
const { protect, admin } = require('../middleware/authMiddleware')
const { uploadFile } = require('../middleware/uploadMiddleware')

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/')
    .get(protect, admin, DocCtrl.getDocumentsByAdmin)
    .post(protect, admin, uploadFile.single('file'), DocCtrl.createDocument)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/deleted')
    .get(protect, admin, DocCtrl.getDeletedDocumentsByAdmin)
    .delete(protect, admin, DocCtrl.deleteManyDocuments)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/:id/url')
    .get(protect, DocCtrl.getUrlOfDocument)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/:id')
    .get(protect, DocCtrl.getDocumentById)
    .put(protect, admin, uploadFile.single('file'), DocCtrl.updateDocument)
    .patch(protect, admin, DocCtrl.restoreDocument)
    .delete(protect, admin, DocCtrl.deleteDocument)

module.exports = router