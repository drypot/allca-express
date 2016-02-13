'use strict';

var init = require('../base/init');
var config = require('../base/config');
var expb = require('../express/express-base');

require('../category/category-list');

require('../user/user-new');
require('../user/user-view');
require('../user/user-list');
require('../user/user-update');
require('../user/user-deactivate');
require('../user/user-reset-pass');

require('../about/about-all');
require('../counter/counter-all');
require('../banner/banner-all');

//require('../category/category-listu'); // url 유저명 대조는 맨 마지막에

init.run(function (err) {
  if (err) throw err;
});
