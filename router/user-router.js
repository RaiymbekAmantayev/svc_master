const router = require("express").Router();
const passport = require('../middleware/passport')
const UserController = require("../masterController/userController");
router.post("/auth",  UserController.Auth);
router.post("/login",  UserController.Login);
router.get("/getCurrent", passport.authenticate('jwt', {session: false}), UserController.getCurrentUser)
router.get("/search", UserController.getUserByEmail)
router.get("/get/jwt", UserController.getJWTPayLoad)
module.exports=router;