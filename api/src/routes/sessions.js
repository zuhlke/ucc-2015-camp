var express = require('express');
var router = express.Router();
var Session = require('../model/session');

router.post('/', function(req, res, next) {
  new Session({name: req.body.name, items: []}).save(function (err, session) {
    console.log(session);
    res.jsonp(session)
  });
});

router.get('/', function(req, res, next) {
  res.send({
    items: [
      {name:'Dummy Session', links: [{rel: "self", href: "/sessions/123456"}]}
    ]
  })
});

router.get('/:sessionId', function(req, res, next) {
  if (req.params.sessionId == "123456") {
    res.send({
      id: req.params.sessionId,
      items: [
        {
          name: 'Item 1',
          description: 'Lorem Ipsum',
          estimates: [4, 10, 23, 9],
          links: [
            {rel: "estimate", href: "/sessions/123456/item/1234/estimate"}
          ]
        },
        {
          name: 'Item number 2',
          description: 'Lorem Ipsum hfhfhfhf',
          links: [
            {rel: "estimate", href: "/sessions/123456/item/24689/estimate"}
          ]
        },
        {
          name: 'I am 3',
          description: 'Lorem asdfasdf Ipsum',
          estimates: [8, 0, 3456],
          links: [
            {rel: "estimate", href: "/sessions/123456/item/4554545/estimate"}
          ]
        },
        {
          name: 'Four',
          description: 'Lorem 444444444 v  44 4 4 4Ipsum',
          links: [
            {rel: "estimate", href: "/sessions/123456/item/98765/estimate"}
          ]
        }
      ],
      activeItem: {name: 'Four', description: 'Lorem 444444444 v  44 4 4 4Ipsum', links: [
        {rel: "estimate", href: "/sessions/123456/item/98765/estimate"}
      ]}
    });
  } else res.sendStatus(404);
});

router.post('/:sessionId/item/:itemId/estimate', function(req, res, next) {
  res.statusCode = 200;
  res.send();
});

router.get('/:sessionId/items/:itemId', function(req, res, next) {
    res.send({
      id: req.params.itemId,
          name: 'Item 1',
          description: 'Lorem Ipsum',
          estimates: [4, 10, 23, 9],
          links: [
            {rel: "estimate", href: "/sessions/123456/item/1234/estimate"}
          ]
    });

});

module.exports = router;
