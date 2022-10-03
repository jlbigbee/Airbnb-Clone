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

    for(let i = 0; i< allSpots.length; i++){
      const spot = allSpots[i];

      const numReviews = await Review.count({ where: { spotId: spot.id } });
      const avgRating = await Review.sum('stars', { where: { spotId: spot.id } });

      if (numReviews > 0 && avgRating > 0) {
      spot.avgRating = avgRating / numReviews
    } else spot.avgRating = null;

    const spotImages = await SpotImage.findAll({
        where:{spotId: spot.id}, limit:1, raw:true, preview:true
    });

    if (spotImages[0]) {
        spot.previewImage = spotImages[0]
    } else spot.spotImage = null;

    };

    return res.json({Spots: allSpots, page, size});

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










module.exports = router;
