namespace :compile_react do
  desc 'Compile React application with Parcel and deploy to staging'
  task :staging do
    run_locally do
      system 'yarn run staging'
    end
  end

  desc 'Compile React application with Parcel and deploy to production'
  task :production do
    run_locally do
      system 'yarn run production'
    end
  end
end
