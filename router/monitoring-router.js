const router = require("express").Router();
const MonitoringController = require("../masterController/monitoringController");
const passport = require('../middleware/passport')
router.post("/add", MonitoringController.addMonitoring)
router.get("/show", MonitoringController.getAll )
router.post("/file/del/:id", MonitoringController.DeleteFileByPath)
module.exports=router;