namespace :compile_react do
  desc 'Compile React app on staging server'
  task :staging do
    within release_path do
      system 'yarn install'
      system 'yarn run staging'
    end
  end

  desc 'Compile React application with Parcel and deploy to production'
  task :production do
    within release_path do
      system 'yarn install'
      system 'yarn run production'
    end
  end
end
