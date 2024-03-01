const FileController = require('../masterController/fileMasterController')
const ReplicasController = require('../masterController/ReplicMasterController')
const router = require('express').Router()
const passport = require('../middleware/passport')

router.post('/file/add', passport.authenticate('jwt', {session: false}),  FileController.addFileToDb)
router.post('/file/compress/add', passport.authenticate('jwt', {session: false}),  FileController.addCompressing)
router.get('/file/compress/get',passport.authenticate('jwt', {session: false}),  FileController.isExists)
router.get("/point/get",passport.authenticate('jwt', {session: false}), FileController.getPoint)
router.put("/file/compress", FileController.updateCompressedByPath)
router.get("/compress/status", FileController.getCompressing)
router.get("/file/:id", FileController.fileById)
router.get("/get/lastId", FileController.LastId)


router.post('/rep/add', passport.authenticate('jwt', {session: false}),  ReplicasController.addReplicInfoToDb)
router.get('/rep/get/wait',  ReplicasController.getWaitingRep)
router.put('/rep/update/:id', ReplicasController.updateToReady)
// router.get('')
module.exports = router