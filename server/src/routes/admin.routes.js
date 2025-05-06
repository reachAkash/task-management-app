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
  promoteToAdmin,
} = require("../controllers/admin.controllers.js");

router.put("/promote-admin", AuthenticateRequest, promoteToAdmin);
router.post("/remove-user", AuthenticateRequest, isAdmin, removeUser);
router.post("/ban-user", AuthenticateRequest, isAdmin, banUser);
module.exports = router;
