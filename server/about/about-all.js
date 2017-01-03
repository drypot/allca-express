'use strict';

var init = require('../base/init');
var expb = require('../express/express-base');

init.add(function (done) {
  expb.core.get('/about/site', function (req, res, done) {
    res.render('about/about-site.pug');
  });

  expb.core.get('/about/company', function (req, res, done) {
    res.render('about/about-company.pug');
  });

  expb.core.get('/about/company2', function (req, res, done) {
    res.render('about/about-company.html');
  });

  expb.core.get('/about/ad', function (req, res, done) {
    res.render('about/about-ad.pug');
  });

  expb.core.get('/about/privacy', function (req, res, done) {
    res.render('about/about-privacy.pug');
  });

  expb.core.get('/about/suggest', function (req, res, done) {
    res.render('about/about-suggest.pug');
  });

  expb.core.get('/about/help', function (req, res, done) {
    res.render('about/about-help.pug');
  });

  done();
});
