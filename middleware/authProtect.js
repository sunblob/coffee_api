const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse.js')
const User = require('../models/User')

// Защита роутов
exports.protect = asyncHandler(async (req, res, next) => {
	let token

	if (req.headers.authorization) {
		token = req.headers.authorization
		console.log('token', token)
	}

	//Если токен не существует
	if (!token || token == '') {
		return next(new ErrorResponse('нет доступа к данному роуту', 401))
	}

	try {
		// проверка токена
		req.user = await User.findOne({ token })
		console.log(req.user)

		next()
	} catch (error) {
		return next(new ErrorResponse('возможно токена больше не существует', 404))
	}
})

// разрешить доступ тем кто подтвержден
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`У пользователя с ролью '${req.user.role}' нет прав на использование данного запроса`,
					403
				)
			)
		}
		next()
	}
}

exports.authorizeCourier = (prop) => {
	return (req, res, next) => {
		const { boss } = req.user
		if (!boss) {
			return next(new ErrorResponse(`У курьера нет прав на выполение действий без руководства`, 403))
		}

		next()
	}
}

exports.authorizeSupervisor = (...status) => {
	return (req, res, next) => {
		if (!status.includes(req.user.supervisorStatus)) {
			return next(
				new ErrorResponse(
					`У пользователя со статусом '${req.user
						.supervisorStatus}' нет прав на использование данного запроса`,
					403
				)
			)
		}
		next()
	}
}
