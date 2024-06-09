const express = require('express')
const router = express.Router()
const user = require('../controllers/user.controller')


router.post("/registration", user.registerUser)
router.get("/login", user.login)

module.exports = router