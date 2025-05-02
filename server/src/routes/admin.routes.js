const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/role.middlewares.js");
const { createUser } = require("../controllers/user.controllers.js");
const {
  AuthenticateRequest,
} = require("../middlewares/authenticate.middlewares.js");
const {} = require("../controllers/task.controllers.js");
const {
  banUser,
  removeUser,
  promoteUser,
} = require("../controllers/admin.controllers.js");

router.post("/create-user", AuthenticateRequest, isAdmin, createUser);
router.post("/create-admin", createUser);
router.put("/promote", AuthenticateRequest, isAdmin, promoteUser);
router.post("/remove-user", AuthenticateRequest, isAdmin, removeUser);
router.post("/ban-user", AuthenticateRequest, isAdmin, banUser);
module.exports = router;
