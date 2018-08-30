# DataCommon

## Installation
1. `bundle install`
2. Setup your database settings by either replacing the values in settings.yml with real values or settings them in your `.env` file.
3. `bundle exec rackup`
4. Make sure you install mailutils on the server for cron `sudo apt-get install mailutils libsasl2-2 ca-certificates libsasl2-modules`
5. Make sure to setup cron with rvm `rvm cron setup`
6. Insert the following entries in cron (`crontab -e`)
```
0,30 * * * * cd /var/www/datacommon/current && /home/datacommon/.rvm/gems/ruby-2.5.0/bin/bundle exec /var/www/datacommon/current/app/sync_tabular_data_with_carto.rb
15,45 * * * * cd /var/www/datacommon/current && /home/datacommon/.rvm/gems/ruby-2.5.0/bin/bundle exec /var/www/datacommon/current/app/sync_geospatial_data_with_carto.rb
```
7. For the shapefile endpoint make sure your server has ogr2ogr. If it is an Ubuntu server you can follow the instructions to [install GDAL on Ubuntu](http://www.sarasafavi.com/installing-gdalogr-on-ubuntu.html):
```
sudo add-apt-repository ppa:ubuntugis/ppa && sudo apt-get update
sudo apt-get install gdal-bin
```
8. The user you run the application under needs a valid `.pgpass` file in their home directory with credentials to access the defined databases in order for the csv endpoint to work.

## Testing
All server-side tests are written in RSpec.
1. `bundle exec rake`

All client-side tests are written using Jest.
1. `cd public`
2. `yarn install`
3. `yarn test`

## Usage

The cron tasks will sync tabular and geospatial tables from our ArcSDE data in Postgres to the target CartoDB instance.
The rack app will serve up the metadata for these tables in JSON from the ArcSDE Postgres tables at http://server.com/tabular and http://server.com/geospatial where server.com is the server you have deployed this app to.
