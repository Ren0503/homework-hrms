const asyncHandler = require('express-async-handler')
const Document = require('../models/documentModel')
const Confirm = require('../models/confirmModel')
const { deleteFile } = require('../utils/fileHandlers')

// @desc    Fetch all documents
// @route   GET /api/admin/documents
// @access  Private/Admin
exports.getDocumentsByAdmin = asyncHandler(async (req, res) => {
    const pageSize = 12
    const page = Number(req.query.pageNumber) || 1

    const query = { deleted: false }
    const count = await Document.countDocuments(query)
    const documents = await Document.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))

    res.json({ documents, page, pages: Math.ceil(count / pageSize), count })
})

// @desc    Fetch single document
// @route   GET /api/admin/documents/:id
// @access  Private/Admin
exports.getDocumentById = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        res.json(document)
    } else {
        res.status(404)
        throw new Error('Document not found')
    }
})

// @desc    Create document
// @route   POST /api/admin/documents
// @access  Private/Admin
exports.createDocument = asyncHandler(async (req, res) => {
    const document = new Document({
        title: req.file.filename,
        postedBy: req.user.id,
        url: req.file.path,
    })

    const createdDocs = await document.save()
    res.status(201).json(createdDocs)
})

// @desc    Update a document
// @route   PUT /api/admin/documents/:id
// @access  Private/Admin
exports.updateDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        deleteFile(document.url)

        document.title = req.file.filename,
        document.url = req.file.path
        const updatedDocument = await document.save()
        res.json(updatedDocument)
    } else {
        res.status(404)
        throw new Error('Doc not found')
    }
})

// @desc    Delete a document
// @route   DELETE /api/admin/documents/:id
// @access  Private/Admin
exports.deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        deleteFile(document.url)

        await Confirm.remove({ document: document._id })

        await document.remove()

        res.json({ message: 'Doc removed' })
    } else {
        res.status(404)
        throw new Error('Doc not found')
    }
})