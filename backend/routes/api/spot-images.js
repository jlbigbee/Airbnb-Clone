const express = require('express')
const { requireAuth } = require('../../utils/auth')
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models')

const router = express.Router()

//delete an existing image for a spot
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const image = await SpotImage.findByPk(req.params.imageId)

    if (!image) {
        const err = new Error()
        err.message = "Spot image not found"
        err.status = 404
        return next(err)
    }

    const spot = await Spot.findByPk(image.spotId)

    if (req.user.id == spot.ownerId) {
        await image.destroy()
    }


    await image.destroy()

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})

module.exports = router
