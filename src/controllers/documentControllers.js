const asyncHandler = require('express-async-handler')

const Document = require('../models/documentModel')
const Confirm = require('../models/confirmModel')

const { deleteFile } = require('../utils/fileHandlers')

// @desc    Fetch all documents
// @route   GET /api/document
// @access  Private/Admin
exports.getDocumentsByAdmin = asyncHandler(async (req, res) => {
    const pageSize = 4
    const page = Number(req.query.pageNumber) || 1
    const sort = req.query.sort || '-createdAt';

    const query = { deleted: false }

    const count = await Document.countDocuments(query)

    const documents = await Document.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)

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

            if (confirm) {
                // Because file doc auto download when click
                if (document.url.includes('.doc')) {
                    confirm.status = "Completed"
                    await confirm.save()
                }

                // Check confirm have confirmed yet
                if (confirm.status !== "Completed") {
                    confirm.status = "Reading"
                    await confirm.save()
                }

                res.json(document)
            } else {
                res.status(401)
                throw new Error('Not authorized, need admin assigned')
            }
        } else {
            res.json(document)
        }
    } else {
        res.status(404)
        throw new Error('Document not found')
    }
})

// @desc    Create document
// @route   POST /api/document
// @access  Private/Admin
exports.createDocument = asyncHandler(async (req, res) => {
    const document = new Document({
        title: req.file.originalname,
        postedBy: req.user.id,
        url: req.file.path,
    })

    const createdDocs = await document.save()
    res.status(201).json(createdDocs)
})

// @desc    Update a document
// @route   PUT /api/document/:id
// @access  Private/Admin
exports.updateDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        deleteFile(document.url)

        document.title = req.file.originalname
        document.url = req.file.path

        const updatedDocument = await document.save()
        await Confirm.updateMany({ docId: document._id }, { status: "Open" })
        res.json(updatedDocument)
    } else {
        res.status(404)
        throw new Error('Doc not found')
    }
})

// @desc    Delete a document
// @route   DELETE /api/document/:id
// @access  Private/Admin
exports.deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        await Confirm.delete({ docId: document._id })

        await Document.delete({ _id: req.params.id })

        res.json({ message: 'Doc removed' })
    } else {
        res.status(404)
        throw new Error('Doc not found')
    }
})

// @desc    Fetch deleted documents
// @route   GET /api/document/deleted
// @access  Private/Admin
exports.getDeletedDocumentsByAdmin = asyncHandler(async (req, res) => {
    const pageSize = 5
    const page = Number(req.query.pageNumber) || 1
    const sort = req.query.sort || '-createdAt';

    const query = { deleted: true }

    const count = await Document.countDocuments(query)

    const documents = await Document.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)

    res.json({ documents, page, pages: Math.ceil(count / pageSize), count })
})

// @desc    Restore a document
// @route   PATCH /api/admin/documents/:id
// @access  Private/Admin
exports.restoreDocument = asyncHandler(async (req, res) => {
    const document = await Document.restore({ _id: req.params.id })

    if (document) {
        await Confirm.restore({ docId: req.params.id })

        res.json({ message: 'Doc restored' })
    } else {
        res.status(404)
        throw new Error('Doc not found')
    }
})