const router = require("express").Router();
const PointController = require("../masterController/pointController");
const passport = require('../middleware/passport')

router.post("/add",   PointController.addPoint);
router.get("/show", passport.authenticate('jwt', {session: false}),  PointController.showPoint);
router.get("/search", PointController.getPointByCode)
router.get("/get/:id", PointController.PointById)
router.get("/current", PointController.getPointByCurrentService)
router.delete("/:id", PointController.Delete)

module.exports=router;