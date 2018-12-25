var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const test = process.env.NODE_ENV === 'test';
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get('/data/amount-range', function (req, res, next) {
  let {
    min,
    max
  } = req.query;

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
  fs.writeFile(path.resolve(__dirname, test ? '../test/temp/newData.json' : `../public/newData${Math.floor(Math.random() * 10)}.json`), dataForFile, (err) => {
    if (err)
      next(err);
    else {
      return res.status(201).send();
    }
  });
});

router.get('/non-repeating-character', function (req, res, next) {
  let {
    name
  } = req.query;
  if (name == null) {
    return res.status(400).json({
      reason: "missing_input"
    });
  } else {
    let char;
    for (let i = 0; i < name.length; i++) {
      char = name.charAt(i);
      if (name.indexOf(char) === i && name.indexOf(char, i + 1) === -1) {
        return res.json({
          result: char
        });
      }
    }
    return res.json({
      result: null
    });
  }
})

router.use(function (err, req, res, next) {
  console.error(err.stack);
  return res.status(500).send();
})

module.exports = router;