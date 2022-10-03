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

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const reviews = await Review.findAll({ where: { userId: req.user.id }, raw: true });
    const currUser = await User.findOne({ where: { id: req.user.id }, attributes: { exclude: ['username'] }, raw: true });

    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];

        const spotInfo = await Spot.findOne({
             where: { id: review.spotId },
             attributes: { exclude: ['createdAt', 'updatedAt'] },
             raw: true
        });
        const spotPreviews = await SpotImage.findAll({ where: { spotId: spotInfo.id }, raw: true, preview:true, limit:1 });
        spotPreviews.forEach(image => {spotInfo.previewImage = image.url});

        if (!spotInfo.previewImage) spotInfo.previewImage = null;

        const reviewImageInfo = await ReviewImage.findAll({ where: { reviewId: review.id }, attributes: ['id', 'url'], raw: true });

        review.User = currUser;
        review.Spot = spotInfo;
        review.ReviewImages = reviewImageInfo;
    };

    res.json({ Reviews: reviews });
});

//Edit a Review
router.put('/:reviewId', [requireAuth, validateReview], async (req, res, next) => {
    const { review, stars } = req.body
    const editedReview = await Review.findByPk(req.params.reviewId)

    if (!editedReview) {
        const err = new Error()
        err.message = "Review not found"
        err.status = 404
        return next(err)
    }
    if (req.user.id !== editedReview.userId) {
        const err = new Error()
        err.message = "Must be owner to edit review"
        err.status = 401
        return next(err)
    }


    editedReview.update({ review , stars})

    return res.json(editedReview)
});

//Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {

    const review = await Review.findByPk(req.params.reviewId)

    if (!review) {
        const err = new Error()
        err.message = "Review not found"
        err.status = 404
        return next(err)
    }
    if (req.user.id !== review.userId) {
        const err = new Error()
        err.message = "Must be owner to delete review"
        err.status = 401
        return next(err)
    }

    await review.destroy()

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    })

})



module.exports = router;
