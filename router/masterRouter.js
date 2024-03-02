const FileController = require('../masterController/fileMasterController')
const ReplicasController = require('../masterController/ReplicMasterController')
const router = require('express').Router()
const passport = require('../middleware/passport')

//добавление данных в бд, на таблицу compressing
router.post('/file/add', passport.authenticate('jwt', {session: false}),  FileController.addFileToDb)
//добавление данных в бд, на таблицу compressing
router.post('/file/compress/add', passport.authenticate('jwt', {session: false}),  FileController.addCompressing)
router.get('/file/compress/get',passport.authenticate('jwt', {session: false}),  FileController.isExists)
// получение url поинта по юзеру
router.get("/point/get",passport.authenticate('jwt', {session: false}), FileController.getPoint)
//обновление статуса в бд, на таблице files
router.put("/file/compress", FileController.updateCompressedByPath)
// получение текущего статуса файла
router.get("/compress/status", FileController.getCompressing)


router.get("/file/:id", FileController.fileById)
router.get("/get/lastId", FileController.LastId)

//добавление данных в бд, на таблицу file_replicas
router.post('/rep/add', passport.authenticate('jwt', {session: false}),  ReplicasController.addReplicInfoToDb)
//получение данных из таблицы file_replicas которые в ожиданиях
router.get('/rep/get/wait',  ReplicasController.getWaitingRep)
// обновление статуса
router.put('/rep/update/:id', ReplicasController.updateToReady)

module.exports = router