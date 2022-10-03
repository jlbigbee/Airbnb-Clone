const express = require('express')
const { sequelize } = require('sequelize')
const { requireAuth } = require('../../utils/auth')
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models')
const { check, body } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { Op } = require('sequelize')

const router = express.Router()


//Get all Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {

    const bookings = await Booking.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'description']
                }
            }
        ]
    })

    const bookingsArray = []
    for (let booking of bookings) {
        const spot = await Spot.findByPk(booking.spotId)
        const spotImage = await SpotImage.findByPk(spot.id, {
            where: {
                preview: true
            }
        })

        let bookingData = booking.toJSON()
        bookingsArray.push(bookingData)
    }

    return res.json({ Bookings: bookingsArray })
})


module.exports = router
