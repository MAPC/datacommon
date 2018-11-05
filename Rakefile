begin
  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)
  task :default => :spec

  desc 'Launch app Docker container'
  task :start do
    system("docker build -t datacommon/app .") 
    system("docker run -it --rm -v $(PWD):/usr/src/app -p '9292:9292' --name datacommon_app datacommon/app") 
  end

  desc 'Remove Docker images'
  task :clean do
    system("docker rmi -f datacommon/app")
  end
rescue LoadError
  # no rspec available
end
