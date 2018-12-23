var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get('/data/amount-range', function (req, res, next) {
  let {
    min,
    max
  } = req.query;
  console.log(JSON.stringify(req.query))

  if (min == null || max == null) {
    return res.status(402).send({
      reason: "NEED_RANGE"
    });
  } else {

    min = parseFloat(min);
    max = parseFloat(max);

    fs.readFile(path.resolve(__dirname, '../public/data.json'), 'utf-8', (err, response) => {
      if (err) {
        return next(err);
      } else if (response == null) {
        return next({
          _reason: "Unable to read"
        });
      } else {
        console.log(Array.isArray(JSON.parse(response)))
        let result = JSON.parse(response).filter((item) => {
          return item.amount > min && item.amount < max;
        });
        return res.json(result);
      }
    })
  }
});

router.get('/data', function (req, res, next) {
  fs.readFile(path.resolve(__dirname, '../public/data.json'), 'utf-8', (err, response) => {
    if (err) {
      return next(err);
    } else if (response === null)
      return next({
        _reason: "Unable to read"
      });
    else {
      return res.json(response);
    }

  })
});

router.post('/data/files', function (req, res, next) {
  let dataForFile;
  try {
    dataForFile = JSON.stringify(req.body);
  } catch (err) {
    return res.status(400).send();
  }
  fs.writeFile(path.resolve(__dirname, `../public/newData${Math.floor(Math.random() * 10)}.json`), dataForFile, (err) => {
    if (err)
      next(err);
    else {
      return res.status(201).send();
    }
  });
})

router.use(function (err, req, res, next) {
  console.error(err.stack);
  return res.status(500).send();
})

module.exports = router;