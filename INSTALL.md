# Install

아래는 Arch Linux 를 가정.

## Nginx

Mac 개발환경용 Nginx 설정 예

    server {
      listen 8080;
      server_name allca.localhost;
      root /Users/drypot/projects/allca/website/public;

      client_max_body_size 10m;

      location / {
        try_files $uri @app;
      }

      location /static/bower/ {
        alias /Users/drypot/projects/allca/website/bower_components/;
      }

      location @app {
        proxy_pass http://localhost:8070;
        proxy_set_header Host $http_host;
      }
    }

## Requirements

mongodb, redis

## Clone Source

프로젝트 클론.

    $ mkdir /data/web
    $ cd /data/web

    $ git clone https://github.com/drypot/allca.git
    $ cd allca

    $ npm install
    $ bower install

설정파일 생성.

    config/allca-live.json

실행.

    node server/main/main.js -c config/allca-live.json


## 서비스로 등록

/usr/lib/systemd 디렉토리는 패키지의 유닛 파일들만 들어간다.
사용자 추가 유닛들은 /etc/systemd/system 에 생성.

    /etc/systemd/system/allca.service

    [Unit]
    Description=AllCa
    Requires=nginx.service mongodb.service redis.service
    After=nginx.service mongodb.service redis.service

    [Service]
    User=drypot
    Restart=always
    RestartSec=15
    WorkingDirectory=/data/web/allca
    ExecStart=/usr/bin/node server/main/main.js -c config/allca-live.json
    Environment=NODE_ENV=production

    [Install]
    WantedBy=multi-user.target

설치

    $ sudo systemctl status allca
    $ sudo systemctl enable allca
    $ sudo systemctl start allca

* Group 을 지정하지 않으면 유저 기본 그룹을 사용.
* StandardOutput 을 지정하지 않으면 journal 을 사용.
* syslog 를 지정하면 syslog 에도 쌓이고 journal 에도 쌓인다. journal 에는 기본적으로 쌓임.
* [Install] 파트는 enable, disable 명령에서 사용한다.

## 관리자 계정

(아직 관리자 기능 없음)

웹 페이지에서는 관리자 설정을 할 수 없다. 서버 콘솔에서 아래 코드를 실행한다.

    $ node server/user-script/set-admin.js -c config/allca-live.json 'admin@gmail.com'
