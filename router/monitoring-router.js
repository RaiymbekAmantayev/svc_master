const router = require("express").Router();
const MonitoringController = require("../masterController/monitoringController");
router.post("/add", MonitoringController.addMonitoring)
router.get("/show", MonitoringController.getAll )
module.exports=router;