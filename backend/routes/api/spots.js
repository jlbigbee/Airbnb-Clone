const express = require('express');
const router = express.Router();
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { requireAuth } = require('../../utils/auth');
const { check, param } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const { Booking, User, Spot, SpotImage, Review, sequelize, ReviewImage } = require('../../db/models');


const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is required')
        .isLength({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is required')
        .isLength({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ max: 49 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

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


//Get all Spots
router.get('/', async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    page = parseInt(page)
    size = parseInt(size)

    if (!page) page = 1
    if (!size) size = 20
    if (size > 20) size = 20
    if (page > 10) page = 1

    const pagination = {}

    if (page >= 1 && size >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }


    let queryLimits = [];
      if (minLat) {
        queryLimits.push({
          lat: { [Op.gte]: Number(minLat) },
        });
      }

      if (maxLat) {
        queryLimits.push({
          lat: { [Op.lte]: Number(maxLat) },
        });
      }

      if (minLng) {
        queryLimits.push({
          lng: { [Op.gte]: Number(minLng) },
        });
      }

      if (maxLng) {
        queryLimits.push({
          lat: { [Op.lte]: Number(maxLng) },
        });
      }

      if (minPrice) {
        queryLimits.push({
          price: { [Op.gte]: Number(minPrice) },
        });
      }

      if (maxPrice) {
        queryLimits.push({
          price: { [Op.lte]: Number(maxPrice) },
        });
      };

    let allSpots = await Spot.findAll({
      where: {
        [Op.and]: queryLimits,
      },
       ...pagination
    });

    const spotRes = [];

    for (let i = 0; i < allSpots.length; i++) {
      let currentSpot = allSpots[i].toJSON();

      const reviewSum = await Review.sum('stars', {where: { spotId: currentSpot.id }})
      const reviewNum = await Review.count({where: { spotId: currentSpot.id }});

      if (!reviewSum) {
        currentSpot.avgRating = null
      } else {
        currentSpot.avgRating = (reviewSum / reviewNum)
      };

      const prevImage = await SpotImage.findOne({where: {preview: true, spotId: currentSpot.id}});

      if (!prevImage) {
        currentSpot.previewImage = 'no image'
      } else {
        currentSpot.previewImage = prevImage.url
      };

      spotRes.push(currentSpot);
    }

    return res.json({ Spots: spotRes, page, size });

});

//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id

    const newSpot = await Spot.create({ ownerId: ownerId, address, city, state, country, lat, lng, name, description, price })

    res.json(newSpot);

 })

//Add an image to Spot based on Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error()
        err.message = "Spot not found"
        err.status = 404
        return res.json(err)
    }
    if (req.user.id !== spot.ownerId) {
        const err = new Error()
        err.message = "Must be owner to add image"
        err.status = 403
        return res.json(err)
    }

    const { url, preview } = req.body
    const image = await SpotImage.create({spotId: req.params.spotId, url, preview})
    const imageData = await SpotImage.findByPk(image.id, {
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'reviewId', 'spotId']
        }
    })
    return res.json(imageData)
})


//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const userSpots = await Spot.findAll({ where: { ownerId: userId }, raw: true });

    for (let i = 0; i < userSpots.length; i++) {
        const spot = userSpots[i];

        const numReviews = await Review.count({ where: { spotId: spot.id } });
        const ratingSum = await Review.sum('stars', { where: { spotId: spot.id } });

        if (numReviews > 0 && ratingSum > 0) {
            spot.avgRating = ratingSum / numReviews;
        } else spot.avgRating = null;

        const spotImages = await SpotImage.findAll({
            where:{spotId: spot.id}, limit:1, raw:true, preview:true
        });

        if (spotImages[0]) {
            spot.previewImage = spotImages[0]
        } else spot.previewImage = null;

    };

    res.json({ Spots: userSpots });
});

//Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const currentSpotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
      return res.status(404)
      .json({
        "message": "Spot couldn't be found",
        "statusCode": 404
      })
    }

    const spotData = spot.toJSON();

    spotData.numReviews = await Review.count({ where: { spotId: spot.id } });
    const reviewSum = await Review.sum('stars', { where: { spotId: spot.id } });
    spotData.avgStarRating = reviewSum / spotData.numReviews;
    spotData.spotImages = await SpotImage.findAll({
        where: { spotId: currentSpotId },
        attributes: ['id', 'url', 'preview']
    });
    spotData.Owner = await User.findByPk(spot.ownerId, { attributes: ['id', 'firstName', 'lastName'] });

    res.json(spotData);

});

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const spot = await Spot.findByPk(parseInt(req.params.spotId));
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if (!spot) {
    return res.status(404)
    .json({
        "message": "Spot not found",
        "statusCode": 404
    })
    }

    if(spot.ownerId !== req.user.id){
    return res.status(403)
        .json({
        "message": "Must be owner to edit spot",
        "statusCode": 403
    });
    }

spot.update({ address, city, state, country, lat, lng, name, description, price });
return res.json(spot);

})

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', [requireAuth, validateReview], async (req, res, next) => {
    const { review, stars } = req.body
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error()
        err.message = "Spot not found"
        err.status = 404
        return next(err)
    }

    const reviewExits = await Review.findOne({where: {spotId: spot.id, userId: req.user.id}})

    if (reviewExits) {
        const err = new Error()
        err.message = "A review already exists"
        err.status = 403
        return next(err)
    }


    const newReview = await Review.create({userId: req.user.id, spotId: spot.id, review, stars})

    return res.json(newReview)
    })

//Get all reviews by spot's id

router.get('/:spotId/reviews', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const reviews = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['user', 'email', 'hashedPassword', 'token', 'createdAt', 'updatedAt', 'username']
                }
            },
            {
                model: ReviewImage,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'reviewId']
                }
            }
        ]
    })
    if (!spot) {
        const err = new Error()
        err.message = "Spot not found"
        err.status = 404
        return next(err)
    }

    return res.json({ Reviews: reviews })
})
//create a booking from a spot based on the spots id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error()
        err.message = "Spot not found"
        err.status = 404
        return next(err)
    }

    if (req.user.id === spot.ownerId) {
        const err = new Error()
        err.message = "Must not be owner to book"
        err.status = 404
        return next(err)
    }

    const { startDate, endDate } = req.body

    const startDateTime = new Date(startDate).getTime()
    const endDateTime = new Date(endDate).getTime()

    if (endDateTime < startDateTime) {
        const err = new Error()
        err.message = "endDate can't be on or before startDate"
        err.status = 400
        return next(err)
    }

    const startDateCheck = await Booking.findOne({
        where: {
            startDate: startDate
        }
    })
    const endDateCheck = await Booking.findOne({
        where: {
            endDate: endDate
        }
    })

    if (startDateCheck || endDateCheck) {
        const err = new Error()
        err.message = "Spot is booked for specified dates"
        err.status = 403
        err.errors = {
            startDate: 'Start date conflicts with an existing booking',
            endDate: 'End date conflicts with an existing booking',
        }
        return next(err)
    }

    const newBooking = await Booking.create({
        userId: req.user.id,
        spotId: req.params.spotId,
        startDate,
        endDate
    })

    return res.json(newBooking)

})


//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const userId = req.user.id

    if (!spot) {
        const err = new Error()
        err.message = "Spot not found"
        err.status = 404
        return next(err)
    }

    if (userId !== spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                userId: userId,
                spotId: spot.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'id', 'userId']
            }
        })

        return res.json({ Bookings: bookings })
    }

    if (userId === spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ['username', 'token', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
                    }
                }
            ]
        })

        return res.json({ Bookings: bookings })
    }
})

//delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        const err = new Error()
        err.message = "Spot not found"
        err.status = 404
        return next(err)
    }
    if (req.user.id !== spot.ownerId) {
        const err = new Error()
        err.message = "Must be owner to delete spot"
        err.status = 401
        return next(err)
    }
    await spot.destroy()
    return res.json({
        message: "Successfully Deleted",
        statusCode: 200
    })
})


module.exports = router;
