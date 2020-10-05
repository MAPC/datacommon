# DataCommon

## Installation
1. `bin/setup`
2. Setup your database settings by either replacing the values in database.yml with real values or settings them in your `.env` file.
3. For the shapefile endpoint make sure your server has ogr2ogr. If it is an Ubuntu server you can follow the instructions to [install GDAL on Ubuntu](http://www.sarasafavi.com/installing-gdalogr-on-ubuntu.html):
```
sudo add-apt-repository ppa:ubuntugis/ppa && sudo apt-get update
sudo apt-get install gdal-bin
```
4. The user you run the application under needs a valid `.pgpass` file in their home directory with credentials to access the defined databases in order for the csv endpoint to work.
5. We have enabled caching in 20 minute periods on prql.mapc.org in its nginx configuration. This may cause issues later and should be investigated if data does not refresh as expected.

## Testing
All server-side tests are written in RSpec.
`bundle exec rspec`

## Deployment
TODO: Update deployment strategy for the Rails monorepo.

Make sure to install poppler on your production/staging server to get PDF previews to work.

```
sudo apt-get install -y poppler-utils
```

You also need to update CORS permissions on your AWS bucket and create a relevant AWS IAM user with access to the bucket. A sample working AWS policy is below:
```
{
  "Version": '2012-10-17',
    "Statement": [
      {
        "Sid": 'VisualEditor0',
          "Effect": 'Allow',
          "Action": [
            's3:PutAccountPublicAccessBlock',
              's3:GetAccountPublicAccessBlock',
              's3:ListAllMyBuckets',
              's3:ListJobs',
              's3:CreateJob',
              's3:HeadBucket'
          ],
          "Resource": '*'
      },
        {
          "Sid": 'VisualEditor1',
            "Effect": 'Allow',
            "Action": 's3:*',
            "Resource": [
              'arn:aws:s3:::datacommon-test-bucket',
                'arn:aws:s3:*:371734135060:job/*',
                'arn:aws:s3:::datacommon-test-bucket/*'
            ]
        }
    ]
}
```

A sample nginx configuration file to get this working along with the Ember based databrowser is below:

```
server {
    server_name datacommon.mapc.org;

    passenger_enabled on;
    passenger_app_env production;

  # include snippets/ngx-http-gzip.conf;

    location ~* ^\/browser$ {
            rewrite ^\/browser$ browser/ permanent;
    }

    location /browser {
        root /var/www/databrowser;
        try_files $uri /browser/index.html;
    }

    location / {
        root /var/www/datacommon/current/public;
    }

    location /profile {
        root /var/www/datacommon/current/public;
        try_files $uri /index.html;
    }

  listen [::]:443 http2 ssl; # managed by Certbot
  listen 443 http2 ssl; # managed by Certbot
  ssl_certificate /etc/letsencrypt/live/datacommon.mapc.org/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/datacommon.mapc.org/privkey.pem; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
  if ($host = datacommon.mapc.org) {
      return 301 https://$host$request_uri;
  } # managed by Certbot

    listen 80;
    listen [::]:80;

    server_name datacommon.mapc.org;
  return 404; # managed by Certbot
}
```

## Usage

The app will serve up the metadata for these tables in JSON from the ArcSDE Postgres tables at http://server.com/tabular and http://server.com/geospatial where server.com is the server you have deployed this app to.
