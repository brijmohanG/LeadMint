const express = require('express')
const router = express.Router()
const user = require('../controllers/user.controller')
const chatRoom = require('../controllers/chatroom.controller')
const middleware = require('../middleware/auth')

// user login and registration API
router.post("/registration", user.registerUser)
router.get("/login", user.login)
router.get("/profile/:userId", middleware.authenticateToken, user.getProfile)
router.post("/friend-request", middleware.authenticateToken, user.createFriendRequest)

// chatroom API 

router.post("/chatroom", middleware.authenticateToken, chatRoom.createChatRoom)
router.post("/joinroom", middleware.authenticateToken, chatRoom.joinRoom)

module.exports = router