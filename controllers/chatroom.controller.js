const ChatRoom = require('../models/chatroom')
const User = require('../models/user')
const Participants = require('../models/participants')
const Joi = require('joi')
const joiToForms = require('joi-errors-for-forms').form
const bcrypt = require('bcrypt')




module.exports.createChatRoom = function (req,res){
    const userId = req.decoded.userId
    try{
        const bodyData = req.body
        const validatedObject = Joi.object({
            password: Joi.string().min(5).max(16).required(),
        })
        /* validating the validation values */
        const validateValue = validatedObject.validate({
            password: bodyData.password
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

        User.findOne({
            where: {
                userId : userId
            },
            raw: true
        }).then(data => {
            if (data.isPrime == 0){
                return res.status(200).json({
                    success: false,
                    message: "Only prime members can create a chat room"
                })
            }else {
                const roomId = `room-${Date.now()}`;
                const hashedPassword = bcrypt.hashSync(validateValue.value.password, 10);
                const dataValues = {
                    roomId,
                    password: hashedPassword,
                    ownerId: userId
                }
                ChatRoom.create(dataValues,{raw: true}).then(data => {
                    if(data.dataValues) {
                        delete data.dataValues.password
                        res.status(200).json({
                            success: true,
                            message: "chat room created successfully",
                            response: data.dataValues
                        })
                    }
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

module.exports.joinRoom = function(req,res) {
    const bodyData = req.body 
    const userId = req.decoded.userId
    try{
        const validatedObject = Joi.object({
            roomId: Joi.string(),
            password: Joi.string().min(5).max(16).required(),
        })
        /* validating the validation values */
        const validateValue = validatedObject.validate({
            roomId: bodyData.roomId,
            password: bodyData.password
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

        ChatRoom.findAll({where: {
            roomId: validateValue.value.roomId
        }}).then(data => {
            console.log(data.length)
            if(data.length == 0 ) {
                res.status(200).json({
                    success: false,
                    message: "Room not found"
                })
            }else{
                const room = data[0]
                const isPasswordValid = bcrypt.compareSync(validateValue.value.password, room.password);
                if(!isPasswordValid){
                    return res.status(200).json({
                        success: false,
                        message: "Invalid password"
                    })
                }else{
                    Participants.findAndCountAll({
                        where: {
                            roomId: validateValue.value.roomId
                        }
                    }).then(data => {
                        const countresult = data.count
                        if(countresult >= room.maxCapacity) {
                            res.status(200).json({
                                success: false,
                                message: "Room is full"
                            })
                        }else{
                            User.findOne({
                                where: {
                                    userId: userId
                                },
                                raw: true
                            }).then(data => {
                                const isPrimeMember = data.isPrime
                                Participants.findOne({where: {
                                    userId : userId
                                }}).then(data => {
                                    if(data == null || isPrimeMember) {
                                        const paricipantsDataValues = {
                                            roomId: validateValue.value.roomId,userId
                                        }
                                        Participants.create(paricipantsDataValues).then(data => {
                                            if(data) {
                                                return res.status(200).json({
                                                    success: true,
                                                    message: "chat room created successfully",
                                                    response: data
                                                })
                                            }else{
                                                return res.status(200).json({
                                                    success: false,
                                                    message: "database error"
                                                })
                                            }
                                        })
                                    }else {
                                        if (data.availCoins < 150){
                                            return res.status(200).json({
                                                success: false,
                                                message: "Insufficient coins"
                                            })
                                        }else{
                                            data.availCoins -= 150
                                            const setCoinValue = {availCoins: data.availCoins}
                                            User.update(setCoinValue, {where : {userId: userId}}).then(data => {
                                                Participants.create({roomId: validateValue.value.roomId, userId: userId}).then(data=> {
                                                    return res.status(200).json({
                                                        success: true,
                                                        message: "participant add successfully",
                                                        response: data
                                                    })
                                                })
                                            })
                                        }
                                    }
                                })
                            })
                        }
                    })
                }
            }
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}



