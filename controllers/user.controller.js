const User = require('../models/user')
const FriendRequest = require('../models/friendRequest')
const Joi = require('joi')
const joiToForms = require('joi-errors-for-forms').form
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');



module.exports.registerUser = function (req, res) {
    try {
        // 1) Validate request parameters
        const bodyData = req.body
        const userId = uuidv4(); 

        /* preparing the validation body */
        const validatedObject = Joi.object({
            deviceId: Joi.string().required(),
            password: Joi.string().min(5).max(16).required(),
            phone: Joi.string().required().regex(/[0-9]{10}/).required(),
            name: Joi.string().required(),
            availCoins: Joi.string(),
            isPrime: Joi.bool(),
        })
        /* validating the validation values */
        const validateValue = validatedObject.validate({
            deviceId: bodyData.deviceId,
            password: bodyData.password,
            phone: bodyData.phone,
            name: bodyData.name,
            isPrime: bodyData.isPrime,
            availCoins: bodyData.availCoins
        }, { abortEarly: false })
        /* converts errors in key : value pair */
        const convertToForms = joiToForms([
            {
                regex: '/[0-9]{10}/',
                message: 'Please enter a valid 10 digit phone number.'
            }
        ])
        const errMsg = convertToForms(validateValue.error)

        /* checking for any validation error, If received error then throw it to client */
        if (errMsg) {
            return res.status(200).json({
                success: false,
                message: "Validation failed for given parameters",
                error: errMsg
            })
        }
        User.findOne({
            where: {
                name: validateValue.value.name
            },
            raw: true
        }).then(user => {
            if (user) {
                return res.status(200).json({
                    success: false,
                    message: "This user is already registered with us"
                })
            } else {
                const saltRounds = 10
                const password = validateValue.value.password
                if(validateValue.value.isPrimeMember == true){
                    validateValue.value.isPrime = 1
                } else {
                    validateValue.value.isPrime = 0
                }
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        const userCreateValues = {
                            userId,
                            deviceId: validateValue.value.deviceId,
                            phone: String(validateValue.value.phone),
                            password: hash,
                            name: validateValue.value.name,
                            isPrime:validateValue.value.isPrime,
                            availCoins: validateValue.value.availCoins
                        }
                        User.create(userCreateValues).then((user) => {
                            delete user.dataValues.password
                            return res.status(200).json({
                                success: true,
                                message: "user registred successfully",
                                response: user.dataValues
                            })
                        })
                    })
                })
            }
        }).catch((err) => {
            return res.status(500).json({
                success: false,
                message: err.message
            })
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}

module.exports.login = async function (req, res) {

    try{
    // 1) Validate request parameters
    const bodyData = req.body

    /* preparing the validation body */
    const validatedObject = Joi.object({
        name: Joi.string().required(),
        password: Joi.string().min(5).max(16).required(),
    })
    /* validating the validation values */
    const validateValue = validatedObject.validate({
        name: bodyData.name,
        password: bodyData.password,
    }, { abortEarly: false })
    /* converts errors in key : value pair */
    const convertToForms = joiToForms()
    const errMsg = convertToForms(validateValue.error)

    /* checking for any validation error, If received error then throw it to client */
    if (errMsg) {
        return res.status(200).json({
            success: false,
            message: "Validation failed for given parameters",
            error: errMsg
        })
    }

    const myPlaintextPassword = validateValue.value.password

    User.findOne({
        where: {
            name: validateValue.value.name
        },
        raw: true
    }).then(async data => {
        
        if (data) {
            const isPasswordMatched = await bcrypt.compare(myPlaintextPassword, data.password);
            if (isPasswordMatched == true) {
                delete data.password
                const payload = data
                const jsonWebToken = jwt.sign(payload, "000000");
                res.status(200).json({
                    success: true,
                    message: "login successfull",
                    response: {
                        data: {
                            jwt: jsonWebToken
                        }
                    }
                })
            } else {
                res.status(200).json({
                    success: false,
                    message: "wrong password"
                })
            }
        }else {
            res.status(200).json({
                success: false,
                message: "user not exists"
            })
        }
    })
}catch(error){
    res.status(500).json({
        success: false,
        message: "server error"
    })
}
}
// Get profile 
module.exports.getProfile = function(req,res) {
    const userId = req.params
    try{
        User.findOne({
            where: {
                userId: userId
            }
        }).then(data => {
            if(data) {
                res.status(200).json({
                    success: true,
                    message: "profile get successfully",
                    response: data
                })
            }else {
                res.status(200).json({
                    success:false,
                    message: "profile not found"
                })
            }
        })
    }catch(error) {
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }

}


// Send friend request

module.exports.sendRequest = function(req,res) {
    try{
    // 1) Validate request parameters
    const bodyData = req.body
    const fromUserId = req.decoded.userId

    /* preparing the validation body */
    const validatedObject = Joi.object({
        toUserId: Joi.string().required(),
    })
    /* validating the validation values */
    const validateValue = validatedObject.validate({
        toUserId: bodyData.toUserId,
    }, { abortEarly: false })
    /* converts errors in key : value pair */
    const convertToForms = joiToForms()
    const errMsg = convertToForms(validateValue.error)

    /* checking for any validation error, If received error then throw it to client */
    if (errMsg) {
        return res.status(200).json({
            success: false,
            message: "Validation failed for given parameters",
            error: errMsg
        })
    }
    const createFriendRequestValue = {fromUserId,toUserId:validateValue.value.toUserId}
    FriendRequest.create(createFriendRequestValue).then(data => {
        if(data){
            res.status(200).json({
                success: true,
                message: "friend request send successfully",
                response: data
            })
        }else{
            res.status(200).json({
                success: true,
                message: "database error"
            })
        }
    })
}catch(error){
    res.status(500).json({
        success: false,
        message: "server error"
    })
}

}
