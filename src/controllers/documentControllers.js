const asyncHandler = require('express-async-handler')
const stream = require('stream')

const Document = require('../models/documentModel')
const Confirm = require('../models/confirmModel')

const {
    generatePath,
    saveEncryptedFile,
    getEncryptedFile,
    removeToTrash,
    restoreFromTrash
} = require('../utils/fileHandlers')

// @desc    Fetch all documents
// @route   GET /api/document
// @access  Private/Admin
exports.getDocumentsByAdmin = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.perPage) || 12
    const page = Number(req.query.pageNumber) || 1
    const sort = req.query.sort || '-createdAt'

    const query = { deleted: false }

    const count = await Document.countDocuments(query)

    const documents = await Document.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)
    /*  #swagger.tags = ['Document']
        #swagger.description = 'Endpoint to get the specific document.' 
        #swagger.security = [{
            "Bearer": []
        }]
    */
    res.json({ documents, page, pages: Math.ceil(count / pageSize), count })
})

// @desc    Fetch single document
// @route   GET /api/document/:id
// @access  Private
exports.getDocumentById = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        if (req.user.role !== 9) {
            const confirm = await Confirm.findOne({ $and: [{ docId: document._id }, { userId: req.user._id }] })

            if (!confirm) {
                res.status(403)
                throw new Error(req.polyglot.t('403-assign'))
            }

            // Because file doc auto download when click
            if (document.url.includes('.doc')) {
                confirm.status = "C"
                await confirm.save()
            }

            // Check confirm have confirmed yet
            if (confirm.status !== "C") {
                confirm.status = "R"
                await confirm.save()
            }
        }

        /*  #swagger.tags = ['Document']
            #swagger.description = 'Endpoint to get the specific document.' 
            #swagger.security = [{
                "Bearer": []
            }]
        */
        res.json(document)
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})

// @desc    Fetch url of document
// @route   GET /api/document/:id/url
// @access  Private
exports.getUrlOfDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        if (req.user.role !== 9) {
            const confirm = await Confirm.findOne({ $and: [{ docId: document._id }, { userId: req.user._id }] })

            if (!confirm) {
                res.status(403)
                throw new Error(req.polyglot.t('403-assign'))
            }
        }

        const buffer = getEncryptedFile(document.url)

        if (document.url.includes('.doc')) {
            const readStream = new stream.PassThrough();
            readStream.end(buffer);
            res.writeHead(200, {
                "Content-disposition": "attachment; filename=" + document.title,
                "Content-Type": "application/octet-stream",
                "Content-Length": buffer.length
            });
            return res.end(buffer)
        }
        /*  #swagger.tags = ['Document']
            #swagger.description = 'Endpoint to get the specific document.' 
            #swagger.security = [{
                "Bearer": []
            }]
        */
        res.end(buffer)
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})

// @desc    Create document
// @route   POST /api/document
// @access  Private/Admin
exports.createDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400)
        throw new Error(req.polyglot.t('400-docCreateEmpty'))
    }

    if (typeof req.fileSizeError != "undefined") {
        res.status(400)
        throw new Error(req.polyglot.t('400-docCreateBig'))
    }

    // Generate file path
    const filePath = generatePath(req.file.originalname)

    // Encrypt file before save
    saveEncryptedFile(
        req.file.buffer,
        filePath,
    )

    const document = new Document({
        title: req.file.originalname,
        postedBy: req.user.id,
        url: filePath,
    })

    const createdDocs = await document.save()

    /*  #swagger.tags = ['Document']
        #swagger.description = 'Endpoint to get the specific document.'
        #swagger.security = [{
            "Bearer": []
        }]
    */
    res.status(201).json(createdDocs)
})

// @desc    Update a document
// @route   PUT /api/document/:id
// @access  Private/Admin
exports.updateDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        // delete old file
        removeToTrash(document.url)

        if (typeof req.fileSizeError != "undefined") {
            res.status(400)
            throw new Error(req.polyglot.t('400-docCreateBig'))
        }

        // Generate file path
        const filePath = generatePath(req.file.originalname)

        // Encrypt file before save
        saveEncryptedFile(
            req.file.buffer,
            filePath,
        )

        document.title = req.file.originalname
        document.url = filePath

        const updatedDocument = await document.save()
        await Confirm.updateMany({ docId: document._id }, { status: "O" })

        /*  #swagger.tags = ['Document']
            #swagger.description = 'Endpoint to get the specific document.'
            #swagger.security = [{
                "Bearer": []
            }]
        */
        res.json(updatedDocument)
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})

// @desc    Delete a document
// @route   DELETE /api/document/:id
// @access  Private/Admin
exports.deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        // Remove file
        removeToTrash(document.url)

        await Confirm.delete({ docId: document._id })
        await Document.delete({ _id: req.params.id })

        /*  #swagger.tags = ['Document']
            #swagger.description = 'Endpoint to get the specific document.'
            #swagger.security = [{
                "Bearer": []
            }]
        */
        res.json({ message: req.polyglot.t('200-docDelete') })
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})

// @desc    Delete many documents
// @route   DELETE /api/document/deleted
// @access  Private/Admin
exports.deleteManyDocuments = asyncHandler(async (req, res) => {
    const docDelete = req.body.docIds

    // Find exists documents need delete
    const docExistDel = await Document.find({ _id: { $in: docDelete } })

    if (docExistDel) {
        console.log(docExistDel)
        await Promise.all(docExistDel.map(async (document) => {
            // Remove file
            removeToTrash(document.url)

            await Confirm.delete({ docId: document._id })
            await Document.delete({ _id: document._id })
        }))

        /*  #swagger.tags = ['Document']
            #swagger.description = 'Endpoint to get the specific document.'
            #swagger.security = [{
                "Bearer": []
            }]
        */
        res.json({ message: req.polyglot.t('200-docsDelete') })
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})

// @desc    Fetch deleted documents
// @route   GET /api/document/deleted
// @access  Private/Admin
exports.getDeletedDocumentsByAdmin = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.perPage) || 12
    const page = Number(req.query.pageNumber) || 1
    const sort = req.query.sort || '-createdAt'

    const query = { deleted: true }

    const count = await Document.countDocuments(query)

    const documents = await Document.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)

    /*  #swagger.tags = ['Document']
        #swagger.description = 'Endpoint to get the specific document.'
        #swagger.security = [{
            "Bearer": []
        }]
    */
    res.json({ documents, page, pages: Math.ceil(count / pageSize), count })
})

// @desc    Restore a document
// @route   PATCH /api/admin/documents/:id
// @access  Private/Admin
exports.restoreDocument = asyncHandler(async (req, res) => {
    const document = await Document.restore({ _id: req.params.id })

    if (document) {
        // Restore confirm relative
        await Confirm.restore({ docId: req.params.id })

        // Restore file
        const documentDetail = await Document.findById(req.params.id)
        restoreFromTrash(documentDetail.url)

        /*  #swagger.tags = ['Document']
            #swagger.description = 'Endpoint to get the specific document.'
            #swagger.security = [{
                "Bearer": []
            }]
        */
        res.json({ message: req.polyglot.t('200-docRestore') })
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})