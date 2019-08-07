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
    // Register the function on the 'emit' event (i.e. before the assets are written to the disk).
    compiler.hooks.emit.tap(
      'SwaggerJsdocSyncWebpackPlugin',
      (compilation) => {
        // Init the swagger specification.
        const specification = createSpecification(this.opts.swagger);

        // Update the specification by parsing the jsdoc in each emitted js file.
        compilation.chunks.forEach((chunk) => {
          chunk.files.forEach((filename) => {
            // Only parse js files.
            if (path.basename(filename) === '.js') {
              // Parse the jsdoc and update the specification.
              const parsedFile = parseApiFileContent(compilation.assets[filename].source(), '.js');
              updateSpecificationObject(parsedFile, specification);
            }
          });
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
  }
};
