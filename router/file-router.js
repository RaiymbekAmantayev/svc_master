const fileController = require('../masterController/fileMasterController')
const router = require('express').Router()
const passport = require('../middleware/passport')

router.get('/show', passport.authenticate('jwt', {session: false}),  fileController.ShowAll)
router.get('/search', passport.authenticate('jwt', {session: false}),  fileController.getFilesByDocument)
router.get("/local", passport.authenticate('jwt', {session: false}),  fileController.getAllLocalFiles)
router.get("/docs", passport.authenticate('jwt', {session: false}),  fileController.getDocuments)
router.get("/last", passport.authenticate('jwt', {session: false}),  fileController.LastFile)
router.get("/:id", passport.authenticate('jwt', {session: false}),  fileController.getFileById)

module.exports = router;