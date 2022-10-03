const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


  const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required')
      .isLength({ min: 2 })
      .withMessage('Please provide a first name with at least 2 characters.'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required')
      .isLength({ min: 2 })
      .withMessage('Please provide a last name with at least 2 characters.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
      const { firstName, lastName, email, password, username } = req.body;

      const emailExists = await User.findOne({ where: { email } });
      const usernameExists = await User.findOne({ where: { username } });

      if (emailExists) {
          const err = new Error("User already exists");
          err.status = 403;
          err.errors = { "email": "User with that email already exists"}
          next(err);
      }
      else if (usernameExists) {
          const err = new Error("User already exists");
          err.status = 403;
          err.errors = { "username": "User with that username already exists"}
          next(err);
      }
      else {
          const user = await User.signup({ firstName, lastName, email, username, password });

          const token = await setTokenCookie(res, user);

          const userJson = user.toJSON();
          userJson.token = token

            return res.json({
              ...userJson
          });
      }
  }
);


module.exports = router;
