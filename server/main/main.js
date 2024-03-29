'use strict';

var init = require('../base/init');
var config = require('../base/config');
var expb = require('../express/express-base');

require('../counter/counter-all'); // 페이지 카운터를 연결하므로 앞쪽에

require('../user/user-new');
require('../user/user-view');
require('../user/user-list');
require('../user/user-update');
require('../user/user-deactivate');
require('../user/user-reset-pass');

require('../about/about-all');
require('../banner/banner-all');

require('../category/category-list'); // url wild card 가 여기에, 제일 마지막에 연결

init.run(function (err) {
  if (err) throw err;
});
