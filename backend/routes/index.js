const express = require('express');
const router = express.Router();



const apiRouter = require('./api');
router.use('/api', apiRouter);



// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

/* test routes */

// router.get('/', function (req, res) {
//     res.send({ message: 'IM WORKING :)' });
// });

// router.get('/hello/world', function(req, res) {
  //   res.cookie('XSRF-TOKEN', req.csrfToken());
  //   res.send('Hello World!');
  // });

  // router.get('/set-token-cookie', async (_req, res) => {
  //   const user = await User.findOne({
  //       where: {
  //         username: 'Demo-lition'
  //       }
  //     });
  //   setTokenCookie(res, user);
  //   return res.json({ user });
  // });


  // const { requireAuth } = require('../../utils/auth.js');
  // router.get(
  //   '/require-auth',
  //   requireAuth,
  //   (req, res) => {
  //     return res.json(req.user);
  //   }
  // );

  module.exports = router;
