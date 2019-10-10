namespace :compile_react do
  desc 'Compile React app on staging server'
  task :staging do
    on roles(:all) do |host|
      execute :yarn, 'install'
      execute :yarn, 'run staging'
    end
  end

  desc 'Compile React application with Parcel and deploy to production'
  task :production do
    on roles(:all) do |host|
      execute :yarn, 'install'
      execute :yarn, 'run production'
    end
  end
end
