var express = require('express')
var bodyParser = require('body-parser')
var getDistanceMatrix = require('./similarity.js')
var app = express()
var cors = require('cors')



app.use(bodyParser.json(),cors())

app.get('/', function (req, res, next) {
  res.send('Hello World!')
})

app.post('/similarityMatrix', function (req, res, next) {
  //console.log(req.body)+
  //console.log(req.body);
  let {method, keywords} = req.body
  //console.log(getDistanceMatrix)
  //console.log(keywords,method);
  getDistanceMatrix(keywords, method).then(result => res.json(result)).catch(err => console.log(err))
})

app.listen(3000, function () {
  console.log('CORS-enabled web server listening on port!')
})
