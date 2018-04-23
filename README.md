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

## Testing
All tests are written in RSpec.
1. `bundle exec rake`
