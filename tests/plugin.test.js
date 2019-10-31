const path = require('path');

// const { explore } = require('source-map-explorer');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');

const SwaggerJsdocSyncWebpackPlugin = require('../lib');

const fixtureUglyJson = '{"openapi":"3.0","info":{"title":"My API","version":"1.0.0","description":"What my API does."},"paths":{},"components":{"schemas":{"MyEntity":{"type":"object","required":["id","name"],"properties":{"id":{"type":"string","description":"Technical unique id."},"name":{"type":"string","description":"Entity name."},"description":{"type":"string","description":"Entity description."}}}}},"tags":[]}';

const fixturePrettyJson = `{
  "openapi": "3.0",
  "info": {
    "title": "My API",
    "version": "1.0.0",
    "description": "What my API does."
  },
  "paths": {},
  "components": {
    "schemas": {
      "MyEntity": {
        "type": "object",
        "required": [
          "id",
          "name"
        ],
        "properties": {
          "id": {
            "type": "string",
            "description": "Technical unique id."
          },
          "name": {
            "type": "string",
            "description": "Entity name."
          },
          "description": {
            "type": "string",
            "description": "Entity description."
          }
        }
      }
    }
  },
  "tags": []
}`;

const compile = (fixture, options = {}, webpackOptions = {}) => {
  const compiler = webpack({
    ...webpackOptions,
    mode: webpackOptions.mode || 'development',
    context: __dirname,
    entry: fixture,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    plugins: [
      new SwaggerJsdocSyncWebpackPlugin(options),
    ],
  });

  compiler.outputFileSystem = new MemoryFs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err);
      if (stats.hasErrors()) return reject(new Error(stats.toJson().errors));

      return resolve(stats);
    });
  });
};

describe('swagger-jsdoc-sync-webpack-plugin', () => {
  it('creates the swagger.json file', async () => {
    const stats = await compile(
      path.resolve(__dirname, '../fixtures/componentDefinition.js'),
      {
        swagger: {
          openapi: '3.0',
          info: {
            title: 'My API',
            version: '1.0.0',
            description: 'What my API does.',
          },
        },
      },
      {
        devtool: 'source-map',
      },
    );

    const specification = stats.compilation.assets['swagger.json'].source();

    expect(specification).toBe(fixtureUglyJson);
  });

  it('creates the swagger.json file with the default devtool (eval)', async () => {
    const stats = await compile(
      path.resolve(__dirname, '../fixtures/componentDefinition.js'),
      {
        swagger: {
          openapi: '3.0',
          info: {
            title: 'My API',
            version: '1.0.0',
            description: 'What my API does.',
          },
        },
      },
    );

    const specification = stats.compilation.assets['swagger.json'].source();

    expect(specification).toBe(fixtureUglyJson);
  });

  it('prints the swagger.json in readable format', async () => {
    const stats = await compile(
      path.resolve(__dirname, '../fixtures/componentDefinition.js'),
      {
        swagger: {
          openapi: '3.0',
          info: {
            title: 'My API',
            version: '1.0.0',
            description: 'What my API does.',
          },
        },
        prettyJson: true,
      },
    );

    const specification = stats.compilation.assets['swagger.json'].source();
    expect(specification).toBe(fixturePrettyJson);
  });

  it('creates an asset to the specified path', async () => {
    const stats = await compile(
      path.resolve(__dirname, '../fixtures/componentDefinition.js'),
      {
        swagger: {
          openapi: '3.0',
          info: {
            title: 'My API',
            version: '1.0.0',
            description: 'What my API does.',
          },
        },
        filename: 'customswaggerpath.json',
      },
    );

    const specification = stats.compilation.assets['customswaggerpath.json'].source();
    expect(specification).toBe(fixtureUglyJson);
  });

  it('works in production mode', async () => {
    const stats = await compile(
      path.resolve(__dirname, '../fixtures/componentDefinition.js'),
      {
        swagger: {
          openapi: '3.0',
          info: {
            title: 'My API',
            version: '1.0.0',
            description: 'What my API does.',
          },
        },
        prettyJson: true,
      },
      {
        mode: 'production',
      },
    );

    const specification = stats.compilation.assets['swagger.json'].source();
    expect(specification).toBe(fixturePrettyJson);
  });

  it('does not crash on syntax error in the swagger definition', async () => {
    expect.assertions(1);

    try {
      await compile(
        path.resolve(__dirname, '../fixtures/invalidComponentDefinition.js'),
        {
          swagger: {
            openapi: '3.0',
            info: {
              title: 'My API',
              version: '1.0.0',
              description: 'What my API does.',
            },
          },
          prettyJson: true,
        },
      );
    } catch (err) {
      expect(err.message.startsWith('bad indentation')).toBe(true);
    }
  });

  it('emits the bundle but not the swagger if emitWarningOnError is true', async () => {
    expect.assertions(2);

    const stats = await compile(
      path.resolve(__dirname, '../fixtures/invalidComponentDefinition.js'),
      {
        swagger: {
          openapi: '3.0',
          info: {
            title: 'My API',
            version: '1.0.0',
            description: 'What my API does.',
          },
        },
        emitWarningOnError: true,
        prettyJson: true,
      },
    );

    expect(stats.compilation.assets['bundle.js']).toBeDefined();
    expect(stats.compilation.assets['swagger.json']).toBeUndefined();
  });
});
