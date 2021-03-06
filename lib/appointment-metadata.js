/**
 * Rhizome API -
 *
 * @file campaign-metadata.js
 * @description
 * @author Chris Bates-Keegan
 *
 */

const restler = require('restler');
const Rhizome = require('./rhizome');

/**
 * @param {String} rhizomeId - id for the campaign
 * @return {Promise} - promise fulfilled with the value of the metadata
 * @private
 */
const _loadAllMetadata = rhizomeId => {
  return new Promise((resolve, reject) => {
    const url = `${Rhizome.url}/appointment/${rhizomeId}/metadata`;
    restler
      .get(url, {query: {token: Rhizome.authToken}})
      .on('success', data => resolve(data))
      .on('error', (data, response) => reject(response))
      .on('fail', (data, response) => {
        reject(new Error(`${response.statusCode}:${response.statusMessage}`));
      });
  });
};

const _loadMetadata = (rhizomeId, key, defaultValue) => {
  return new Promise((resolve, reject) => {
    const url = `${Rhizome.url}/appointment/${rhizomeId}/metadata/${key}`;
    restler
      .get(url, {query: {token: Rhizome.authToken}})
      .on('success', data => resolve(data))
      .on('error', (data, response) => reject(response))
      .on('fail', (data, response) => {
        if (response.statusCode === 404) {
          resolve(defaultValue);
          return;
        }
        reject(new Error(`${response.statusCode}:${response.statusMessage}`));
      });
  });
};

const _saveMetadata = (rhizomeId, key, value) => {
  return new Promise((resolve, reject) => {
    const url = `${Rhizome.url}/appointment/${rhizomeId}/metadata/${key}`;
    restler
      .post(url, {
        query: {
          token: Rhizome.authToken
        },
        data: {
          value: JSON.stringify(value)
        }
      })
      .on('error', err => reject(err))
      .on('success', data => resolve(data.value))
      .on('fail', err => reject(err));
  });
};

const _rmMetadata = (rhizomeId, key) => {
  return new Promise((resolve, reject) => {
    const url = `${Rhizome.url}/appointment/${rhizomeId}/metadata/${key}`;
    restler
      .del(url, {
        query: {
          token: Rhizome.authToken
        }
      })
      .on('error', err => reject(err))
      .on('success', data => resolve(data))
      .on('fail', (data, response) => {
        if (response.statusCode === 404) {
          resolve('not_found');
          return;
        }
        reject(new Error(`${response.statusCode}:${response.statusMessage}`));
      });
  });
};

module.exports = {
  loadAll: _loadAllMetadata,
  load: _loadMetadata,
  save: _saveMetadata,
  remove: _rmMetadata
};
