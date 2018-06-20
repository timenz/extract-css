'use strict';

var assert = require('assert'),
    Batch = require('batch'),
    getStylesData = require('style-data'),
    getStylesheetList = require('list-stylesheets');

module.exports = function (html, options, callback) {
    var batch = new Batch(),
        data = getStylesheetList(html, options);

    batch.push(function (cb) {
        getStylesData(data.html, options, cb);
    });
    if (data.hrefs.length) {
        assert.ok(options.url, 'options.url is required');
    }
    batch.end(function (err, results) {
        var stylesData,
            css;

        if (err) {
            return callback(err);
        }

        stylesData = results.shift();

        results.forEach(function (content) {
            stylesData.css.push(content);
        });
        css = stylesData.css.join('\n');

        return callback(null, stylesData.html, css);
    });
};
