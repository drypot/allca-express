'use strict';

var crypto = require('crypto');

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var mongo2 = require('../mongo/mongo2');
var expb = require('../express/express-base');
var mailer2 = require('../mailer/mailer2');
var userb = require('../user/user-base');
var usern = require('../user/user-new');
var userp = exports;

var resets;

init.add(function (done) {
  resets = exports.resets = mongo2.db.collection('resets');
  resets.createIndex({ email: 1 }, done);
});

expb.core.get('/users/reset-pass', function (req, res, done) {
  res.render('user/user-reset-pass.pug');
});

expb.core.post('/api/reset-pass', function (req, res, done) {
  var form = {};
  form.email = String(req.body.email || '').trim();
  var errors = [];
  usern.checkFormEmail(form, errors);
  if (errors.length) {
    return done(error(errors));
  }
  crypto.randomBytes(12, function(err, buf) {
    if (err) return done(err);
    var token = buf.toString('hex');
    userb.users.findOne({ email: form.email }, function (err, user) {
      if (err) return done(err);
      if (!user) {
        return done(error('EMAIL_NOT_EXIST'));
      }
      resets.deleteOne({ email: form.email }, function (err) {
        if (err) return done(err);
        var reset = {
          email: form.email,
          token: token
        };
        resets.insertOne(reset, function (err, r) {
          if (err) return done(err);
          var reset = r.ops[0];
          var mail = {
            from: 'no-reply@raysoda.com',
            to: reset.email,
            subject: 'Reset Password - ' + config.appName,
            text:
              '\n' +
              'Open the following URL to reset your password.\n\n' +
              config.mainSite + '/users/reset-pass?step=3&id=' + reset._id + '&t=' + reset.token + '\n\n' +
              config.appName
          };
          mailer2.send(mail, function (err) {
            if (err) return done(err);
            res.json({});
          });
        });
      });
    });
  });
});

expb.core.put('/api/reset-pass', function (req, res, done) {
  var body = req.body;
  var form = {};
  form.id = String(body.id || '').trim();
  form.token = String(body.token || '').trim();
  form.password = String(body.password || '').trim();
  var errors = [];
  usern.checkFormPassword(form, errors);
  if (errors.length) {
    return done(error(errors));
  }
  resets.findOne({ _id: new mongo2.ObjectID(form.id) }, function (err, reset) {
    if (err) return done(err);
    if (!reset) {
      return done(error('INVALID_DATA'));
    }
    if (form.token != reset.token) {
      return done(error('INVALID_DATA'));
    }
    if (Date.now() - reset._id.getTimestamp().getTime() > 15 * 60 * 1000) {
      return done(error('RESET_TIMEOUT'));
    }
    var query = { 
      email: reset.email,
      admin: { $exists: false } // admin password can not be changed by web api for security.
    };
    userb.makeHash(form.password, function (err, hash) {
      if (err) return done(err);
      userb.users.updateOne(query, { $set: { hash: hash } }, function (err) {
        if (err) return done(err);
        resets.deleteOne({ _id: reset._id }, function (err) {
          if (err) return done(err);
          res.json({});
        });
      });
    });
  });
});

