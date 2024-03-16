const router = require("express").Router();
// eslint-disable-next-line no-unused-vars,no-undef
const ReplicaseController = require("../masterController/ReplicMasterController");

router.get("/showByDoc", ReplicaseController.ShowByDocId)
// router.get("/show",  PointController.showPoint);
module.exports=router;