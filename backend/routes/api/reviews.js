const express = require('express')

const { Spot, User, Booking, Review, SpotImage, ReviewImage, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateReview = [
    check("review")
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Stars is required')
        .isLength({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];


//Add an Image to a Review based on the Review's id

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
        const err = new Error()
        err.message = "Review not found"
        err.status = 404
        return next(err)
    }
    if (req.user.id !== review.userId) {
        const err = new Error()
        err.message = "Must be owner to add image"
        err.status = 401
        return next(err)
    }

    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: req.params.reviewId
        }
    })

    if (reviewImages.length > 9) {
        const err = new Error()
        err.message = "Maximum number of images for this resource was reached"
        err.status = 403
        return next(err)

    }
    const {url} = req.body
    const newImage = await ReviewImage.create({reviewId: req.params.reviewId, url})
    const result  = await ReviewImage.findOne({where: {url:url},attributs:['id','url']})

    res.json(result)

});

module.exports = router;
