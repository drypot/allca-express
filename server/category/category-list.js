'use strict';

var init = require('../base/init');
var util2 = require('../base/util2');
var error = require('../base/error');
var config = require('../base/config');
var mongo2 = require('../mongo/mongo2');
var expb = require('../express/express-base');
var userb = require('../user/user-base');
var imageb = require('../category/category-base');
var bannerb = require('../banner/banner-base');
var categoryl = exports;

var bootdt = new Date();

expb.core.get('/', function (req, res, done) {
  list(req, res, false, done);
});

expb.core.get('/api/categories', function (req, res, done) {
  list(req, res, true, done);
});

function list(req, res, api, done) {
  if (api) {
    res.json({ 
      bootdt: bootdt 
    });
  } else {
    res.render('category/category-list.jade', {
      bootdt: util2.dateTimeString(bootdt).slice(0, 16)
    });
  }
}

expb.core.get('/:name([0-9a-z\-]+)', function (req, res, done) {
  res.render('category-pages/' + req.params.name + '.jade');
});