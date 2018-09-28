# DataCommon

## Installation
1. `bundle install`
2. Setup your database settings by either replacing the values in settings.yml with real values or settings them in your `.env` file.
3. `bundle exec rackup`
4. For the shapefile endpoint make sure your server has ogr2ogr. If it is an Ubuntu server you can follow the instructions to [install GDAL on Ubuntu](http://www.sarasafavi.com/installing-gdalogr-on-ubuntu.html):
```
sudo add-apt-repository ppa:ubuntugis/ppa && sudo apt-get update
sudo apt-get install gdal-bin
```
5. The user you run the application under needs a valid `.pgpass` file in their home directory with credentials to access the defined databases in order for the csv endpoint to work.
6. We have enabled caching in 20 minute periods on prql.mapc.org in its nginx configuration. This may cause issues later and should be investigated if data does not refresh as expected.

## Testing
All server-side tests are written in RSpec.
1. `bundle exec rake`

All client-side tests are written using Jest.
1. `cd public`
2. `yarn install`
3. `yarn test`

## Usage

The rack app will serve up the metadata for these tables in JSON from the ArcSDE Postgres tables at http://server.com/tabular and http://server.com/geospatial where server.com is the server you have deployed this app to.
