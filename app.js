const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-Parser')
const { runInNewContext } = require('vm')
const app = express()
const port = 3000

app.set('view eng""ine', 'ejs')
/*body parseer had to be installed even if it is shipped with  express,
post request needs it  be defined line3 line10!!*/
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/RestfulExample')
const schema = {
  city: 'string',
  impression: 'string',
}
const Artictle = mongoose.model('Article', schema)

app
  .route('/articles')
  .get(function (req, res) {
    Artictle.find({}, function (err, results) {
      !err ? res.send(results) : res.send(err)
    })
  })
  .post(function (req, res) {
    const newArticle = new Artictle({
      city: req.body.city,
      impression: req.body.impression,
    })
    newArticle.save((err) => {
      if (!err) {
        res.send('YAYY succes')
      } else {
        res.send(err)
      }
    })
  })
  //delete all the articles
  .delete((req, res) => {
    //leave the filter empty
    Artictle.deleteMany((err) => {
      if (!err) {
        res.send('Deleted evereything')
      } else {
        res.send(err)
      }
    })
  })
app
  //things to be done with one city route
  .route('/articles/:city')
  .get(function (req, res) {
    Artictle.findOne({ city: req.params.city }, (err, foundCity) => {
      if (foundCity) {
        res.send(foundCity)
      } else {
        res.send('no articles found')
      }
    })
  })
  //updates specific parts of the data
  .patch((req, res) => {
    Artictle.updateOne({ city: req.params.city }, { $set: req.body }, (err) => {
      if (!err) {
        res.send('infos updated')
      } else {
        res.send('Error occured', err)
      }
    })
  })
  .delete((req, res) => {
    Artictle.deleteOne({ city: req.params.city }, (err, foundCity) => {
      if (!err) {
        res.send('city deleted')
      } else {
        res.send('no city founc')
      }
    })
  })
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
