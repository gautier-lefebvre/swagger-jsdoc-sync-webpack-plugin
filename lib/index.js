const path = require('path');

const { merge } = require('lodash');
const {
  createSpecification,
  parseApiFileContent,
  updateSpecificationObject,
  finalizeSpecificationObject,
} = require('swagger-jsdoc');

module.exports = class SwaggerJsdocSyncWebpackPlugin {
  /**
   * @constructor
   * @param {Object} opts - Options.
   * @param {Object} opts.swagger - Swagger definition.
   * @param {boolean} [opts.prettyJson] - Should print the configuration in a human readable format.
   * @param {string} [opts.filename='swagger.json']
   * - Swagger specification output filename (relative to compilation output folder).
   */
  constructor(opts) {
    this.opts = SwaggerJsdocSyncWebpackPlugin.getOpts(opts);
  }

  /**
   * Merge options with default options.
   *
   * @param {Object} opts - Options.
   * @returns {Object} Options with default values.
   */
  static getOpts(opts) {
    return merge(
      {
        prettyJson: false,
        filename: 'swagger.json',
      },
      opts,
    );
  }

  /**
   * Webpack plugin api.
   *
   * @param {Object} compiler - Webpack compiler.
   */
  apply(compiler) {
    // Subscribe to new compilations.
    compiler.hooks.compilation.tap(
      'SwaggerJsdocSyncWebpackPlugin',
      (compilation) => {
        // Init the swagger specification.
        const specification = createSpecification(this.opts.swagger);

        // Wait for the dependency tree to be complete.
        compilation.hooks.finishModules.tap(
          'SwaggerJsdocSyncWebpackPlugin',
          (modules) => {
            modules.forEach((mod) => {
              // If no mod.resource, the module is external (no need to parse it).
              // If no mod.originalSource, the module is not loaded
              // (should not happen after finishModules).
              if (
                mod.resource
                && path.extname(mod.resource) === '.js'
                && mod.originalSource
              ) {
                const parsedFile = parseApiFileContent(
                  mod.originalSource().source(),
                  '.js',
                );

                updateSpecificationObject(parsedFile, specification);
              }
            });

            // Clean the specification.
            const finalizedSpecification = finalizeSpecificationObject(specification);

            // Output as json.
            const output = JSON.stringify(
              finalizedSpecification,
              null,
              // Pretty json if specified.
              this.opts.prettyJson ? 2 : undefined,
            );

            // Add the swagger.json file as an asset.
            compilation.assets[this.opts.filename] = {
              source() { return output; },
              size() { return output.length; },
            };
          },
        );
      },
    );
  }
};
