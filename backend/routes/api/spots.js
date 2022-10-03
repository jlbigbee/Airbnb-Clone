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

    let spotsArray = [];

    for(let i = 0; i< allSpots.length; i++){
      const spot = allSpots[i];

      const numReviews = await Review.count({ where: { spotId: spot.id } });
      const avgRating = await Review.sum('stars', { where: { spotId: spot.id } });

      if (numReviews > 0 && avgRating > 0) {
      spot.avgRating = avgRating / numReviews
    } else spot.avgRating = null;

    const spotImage = await SpotImage.findAll({
        where:{spotId: spot.id}, limit:1, raw:true, preview:true
    });

    if (spotImage[0]) {
        spot.previewImage = spotImage[0]
    } else spot.spotImage = null;

    };

    spotsArray.push

    return res.json({Spots: allSpots, page, size});

});


module.exports = router;







    //   let avgRating = await Review.findByPk(currentId, {
    //       attributes: [[sequelize.fn('AVG', sequelize.col("stars")), 'avgRating']]
    //   })
    //   const rawAvgRating = avgRating.dataValues.avgRating;
    //   spotObj.avgRating = Number.parseInt(rawAvgRating).toFixed(1);

    //   const previewImageUrl = await SpotImage.findAll({
    //       where: { spotId: currentId, preview: true },
    //       attributes: ['url'],
    //       limit: 1
    //   })

    //   if (previewImageUrl[0]) {
    //     spotObj.prevewImage = previewImageUrl[0].url
    //   } else {
    //     spotObj.prevewImage = null;
    //   }

    //   spotsArr.push(spotObj)
    // }


    // return res.json({ Spots: spotsArray, page, size});
