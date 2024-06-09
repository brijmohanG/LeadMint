const User = require('../models/user')
const changeCaseObject = require('change-case-object')
const moment = require('moment')
const Joi = require('joi')
const joiToForms = require('joi-errors-for-forms').form
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")



module.exports.registerUser = function (req, res) {
    try {
        // 1) Validate request parameters
        const bodyData = req.body

        /* preparing the validation body */
        const validatedObject = Joi.object({
            email: Joi.string().email().insensitive().lowercase().required(),
            password: Joi.string().min(5).max(16).required(),
            phone: Joi.string().required().regex(/[0-9]{10}/).required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            zip: Joi.string().required(),

        })
        /* validating the validation values */
        const validateValue = validatedObject.validate({
            email: bodyData.email,
            password: bodyData.password,
            phone: bodyData.phone,
            firstName: bodyData.firstName,
            lastName: bodyData.lastName,
            city: bodyData.city,
            state: bodyData.state,
            country: bodyData.country,
            zip: bodyData.zip,
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
        const validatedValues = changeCaseObject.snakeCase(validateValue.value)

        User.findOne({
            where: {
                email: validatedValues.email
            },
            raw: true
        }).then(user => {
            if (user) {
                return res.status(200).json({
                    success: false,
                    message: "This email is already registered with us"
                })
            } else {
                const saltRounds = 10
                const password = validatedValues.password
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        const userCreateValues = {
                            email: validatedValues.email,
                            phone: String(validatedValues.phone),
                            password: hash,
                            first_name: validatedValues.first_name,
                            last_name: validatedValues.last_name,
                            city: validatedValues.city,
                            state: validatedValues.state,
                            country: validatedValues.country,
                            zip: validatedValues.zip,
                            createdAt: moment(new Date()).utc().format('MM/DD/YYYY HH:mm:ss'.YYYY_MM_DD_HH_MM_00),
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
        email: Joi.string().email().insensitive().lowercase().required(),
        password: Joi.string().min(5).max(16).required(),
    })
    /* validating the validation values */
    const validateValue = validatedObject.validate({
        email: bodyData.email,
        password: bodyData.password,
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

    const validatedValues = changeCaseObject.snakeCase(validateValue.value)
    const myPlaintextPassword = validatedValues.password

    User.findOne({
        where: {
            email: validatedValues.email
        },
        raw: true
    }).then(async data => {
        const isPasswordMatched = await bcrypt.compare(myPlaintextPassword, data.password);
        if (data) {
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