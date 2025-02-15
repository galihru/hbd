require_relative "hbd/version"

module HBD
  class Error < StandardError; end
  
  def self.root
    File.expand_path "../..", __FILE__
  end
  
  def self.assets_path
    File.join root, "assets"
  end
end
