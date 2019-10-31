# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2019-10-31
### Added
- `emitWarningOnError` option to prevent the compilation from failing on swagger parsing error.
### Fixed
- No longer crash webpack watcher on swagger parsing error.

## [1.0.2] - 2019-09-18
### Fixed
- Tap on the correct hook to wait for the dependency tree to be completed.

## [1.0.1] - 2019-09-18
### Fixed
- Read actual sources from the dependencies tree to make it work in production mode.

## [1.0.0] - 2019-08-08
### Added
- Generate swagger definition from the jsdoc comments of the dependencies of your project.

[Unreleased]: https://github.com/gautier-lefebvre/swagger-jsdoc-sync-webpack-plugin/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/gautier-lefebvre/swagger-jsdoc-sync-webpack-plugin/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/gautier-lefebvre/swagger-jsdoc-sync-webpack-plugin/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/gautier-lefebvre/swagger-jsdoc-sync-webpack-plugin/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/gautier-lefebvre/swagger-jsdoc-sync-webpack-plugin/releases/tag/v1.0.0
