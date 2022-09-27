const express = require('express');
const router = express.Router();

const apiRouter = require('./api');


// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});


router.use('/api', apiRouter);

/* test routes */

// router.get('/', function (req, res) {
//     res.send({ message: 'IM WORKING :)' });
// });

// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

module.exports = router;
