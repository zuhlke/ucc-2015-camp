var express = require('express');
var router = express.Router();
var Session = require('../model/session');
var _ = require('lodash');

router.get('/sendevent', function(req, res, next) {


  console.log('sending event');
  res.sendStatus(200);
});

router.post('/', function(req, res, next) {
  var session = new Session({name: req.body.name, items: []});
  session.save(function(err) {
    if (err) {
      res.statusCode = 400;
      res.send(err);
    } else {
      res.json(halSession(session.toObject()));
    }
  });
});

router.get('/', function(req, res, next) {
  res.send({
    items: [
      {
        name:'Dummy Session',
        links: [
          {rel: "self", href: "/sessions/123456"}
        ]
      }
    ]
  })
});

router.get('/:sessionName', function(req, res, next) {
  Session.findOne({name:req.params.sessionName}).then(
    function(session) {
      if (session) res.json(halSession(session.toObject()));
      else res.sendStatus(404);
    }
  );
});

router.post('/:sessionId/item', function(req, res, next) {
  Session.findById(req.params.sessionId, function (err, session) {
    if (err) { res.sendStatus(500) }
    else if (session) {
      session.items.push({name: req.body.name});
      session.save(function () {
        res.sendStatus(201);
      });
    }
  })
});

router.post('/:sessionName/item/:itemId/estimate', function(req, res, next) {
  Session.findOne({name:req.params.sessionName}).then(function(session) {

    var item = _.first(_.filter(session.items, function(item){return item._id == req.params.itemId}));
    console.log(item);
    console.log(req.body.estimate);
    item.estimates.push(req.body.estimate);

    session.save(function() {
      res.statusCode = 200;
      var io = req.app.get('io');
      var halSession = session.toObject();
      halSession.links = [{rel: "items", href: "/sessions/" + session._id + "/item"}];
      io.sockets.emit('estimateUpdated', {session: halSession});
      res.send();
    });
  });


});

router.get('/:sessionName/items/:itemId', function(req, res, next) {
  Session.findOne({name:req.params.sessionName}).then(function(session) {
    var item = _.first(_.filter(session.items, function (item) { return item._id == req.params.itemId })).toObject();
    res.send(halItem(item, req.params.sessionName));
  });
});

function halItem(item, sessionName) {
  console.log(item);
  item.links = [{rel: "estimate", href:"/sessions/" + sessionName + "/item/" + item._id + '/estimate'}];
  var estimates = _(item.estimates);
  if (estimates.size() > 0) {
    item.min = estimates.min();
    item.max = estimates.max();
    item.total = estimates.reduce(function(total, n) { return total + n; });
    item.average = item.total / estimates.size();
    item.stddev = Math.sqrt(estimates.map(function(e){
      var diff = e - item.average;
      return (diff * diff) / (estimates.size() - 1);
    }).reduce(function(total, n) { return total + n; })) / item.average;
  }
  return item;
}

function halSession(session) {
  session.links = [{rel: "items", href: "/sessions/" + session._id + "/item"}];
  session.items = _.map(session.items, function(item){return halItem(item, session.name)});
  return session;
}


module.exports = router;
