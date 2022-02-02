# DataCommon

## Installation
1. Set up your `.env` (for database connections) and `config/master.key` (for encrypted credentials). You can find these values in the Digital Services group on Dashlane.
2. Run `bin/setup`
3. For the shapefile endpoint make sure your server has ogr2ogr. If it is an Ubuntu server you can follow the instructions to [install GDAL on Ubuntu](http://www.sarasafavi.com/installing-gdalogr-on-ubuntu.html):
```
sudo add-apt-repository ppa:ubuntugis/ppa && sudo apt-get update
sudo apt-get install gdal-bin
```
4. The user you run the application under needs a valid `.pgpass` file in their home directory with credentials to access the defined databases in order for the csv endpoint to work.
5. We have enabled caching in 20 minute periods on prql.mapc.org in its nginx configuration. This may cause issues later and should be investigated if data does not refresh as expected.

## Running the app
This is a React-on-Rails app, so you'll need to run both `bundle exec rails s` and `bin/webpack-dev-server` to run the app on localhost:3000

## Testing
All server-side tests are written in RSpec.
`bundle exec rspec`

Javascript tests are written in Jest *(note: some tests are not fully implemented and will fail on default)*
`yarn test`

## Deployment
1 In one terminal, ssh into the appropriate environment (either `ssh username@prep.mapc.org` or `ssh ubuntu@live.mapc.org`). Instructions/scripts for getting set on these servers is available in the [infrastructure report](https://github.com/MAPC/infrastructure/blob/1de75d64378000280cc289a480985fd02568845e/bin/add_app_to_server.sh).
2. In another terminal window, run the appropriate capistrano command (either `cap staging deploy` or `cap production deploy`)
3. **Important:** Staging deploys from the current state of the `dev` branch on Github, and production deploys from the current `master` branch on Github. Make sure the appropriate changes are up on the remote repo!

### Server configuration
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

## Gallery entries

Images for the grid view of the data visualization gallery should be 250x175 pixels and highlight the visualization (not the surrounding narrative, as much as possible). An additional square crop should be added to `calendar-home.svg` in Illustrator. To export the fonts correctly, save the image by selecting `Export as...`, save the image, and follow these SVG options:
- Styling: Presentation Attributes
- Font: Convert to Outlines
- Images: Embed
- Object IDs: Layer names
- Decimal: 4

And check both "Minify" and "Responsive"

## Cached CSVs

When data has been updated the cached csv files have to be deleted from the server and they regenerate when the csv file is requested again.

Cached files are located in
```
/var/www/datacommon/shared/public/cache
```