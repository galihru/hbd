# frozen_string_literal: true

require_relative "lib/my_example_gem/version"

Gem::Specification.new do |spec|
  spec.name = "HBD"
  spec.version = MyExampleGem::VERSION
  spec.authors = ["4211421036"]
  spec.email = ["4211421036@users.noreply.github.com"]

  spec.summary = "HBD"
  spec.description = "HBD"
  spec.homepage = "https://github.com/4211421036/hbd"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.1.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage

  spec.files = Dir["lib/**/*", "README.md"]
  spec.require_paths = ["lib"]

  spec.add_development_dependency "rake", "~> 13.0"
  spec.add_development_dependency "rspec", "~> 3.0"
end
