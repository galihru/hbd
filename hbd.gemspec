# frozen_string_literal: true

require_relative "lib/hbd/version"

Gem::Specification.new do |spec|
  spec.name = "hbd"
  spec.version = HBD::VERSION
  spec.authors = ["Galih Ridho Utomo"]
  spec.email = ["g4lihru@students.unnes.ac.id"]

  spec.summary = "Happy Birthday with Animation"
  spec.description = "A Ruby gem that provides a beautiful birthday fireworks animation."
  spec.homepage = "https://github.com/4211421036/hbd"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.1.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage
  spec.metadata["changelog_uri"] = "#{spec.homepage}/blob/main/CHANGELOG.md"

  spec.files = Dir["lib/**/*", "README.md", "LICENSE.txt", "CHANGELOG.md"]
  spec.require_paths = ["lib"]

  spec.add_development_dependency "rake", "~> 13.0"
  spec.add_development_dependency "rspec", "~> 3.0"
end
