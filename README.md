# DataCommon

## Installation
1. `bundle install`
2. Setup your database settings by either replacing the values in settings.yml with real values or settings them in your `.env` file.
3. For the shapefile endpoint make sure your server has ogr2ogr. If it is an Ubuntu server you can follow the instructions to [install GDAL on Ubuntu](http://www.sarasafavi.com/installing-gdalogr-on-ubuntu.html):
```
sudo add-apt-repository ppa:ubuntugis/ppa && sudo apt-get update
sudo apt-get install gdal-bin
```
4. The user you run the application under needs a valid `.pgpass` file in their home directory with credentials to access the defined databases in order for the csv endpoint to work.
5. We have enabled caching in 20 minute periods on prql.mapc.org in its nginx configuration. This may cause issues later and should be investigated if data does not refresh as expected.

## Testing
All server-side tests are written in RSpec.
1. `bundle exec rake`

## Running the client
```
foreman start
```

`yarn start` will run [webpack-dev-server](https://github.com/webpack/webpack-dev-server) so you can develop locally.

`bundle exec rackup` will run the back-end (written in ruby and the rack library) so you can test that.

If you install foreman `gem install foreman` you can then start both the back and front end with `foreman start`.

## Deployment
`yarn staging` will build the app using `npx webpack` and attempt to rsync it to the staging server.

`yarn production` will build the app using `npx webpack` and attempt to rsync it to the production server.

## Usage

The rack app will serve up the metadata for these tables in JSON from the ArcSDE Postgres tables at http://server.com/tabular and http://server.com/geospatial where server.com is the server you have deployed this app to.
