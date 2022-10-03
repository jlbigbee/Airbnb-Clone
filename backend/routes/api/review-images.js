const express = require('express')
const { requireAuth } = require('../../utils/auth')
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models')

const router = express.Router()

//delete an existing image for a review
router.delete('/:imageId', requireAuth, async (req, res, next) => {

    const image = await ReviewImage.findByPk(req.params.imageId)

    if (!image) {
        const err = new Error()
        err.message = "Review image not found"
        err.status = 404
        return res.json(err)
    }

    const review = await Review.findByPk(image.reviewId)

    if (req.user.id !== review.userId) {
        const err = new Error()
        err.message = "Must be owner to delete image"
        err.status = 403
        return res.json(err)
    }

    await image.destroy()

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})

module.exports = router
