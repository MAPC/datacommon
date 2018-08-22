namespace :compile_react do
  desc 'Compile React application with Parcel and deploy to staging'
  task :staging do
    run_locally do
      system 'cd public; yarn run staging'
    end
  end
end
