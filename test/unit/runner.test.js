var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;

var proxyquire = require('proxyquire');

// phantom smoke test

var runner = proxyquire('../../lib/report/index.js', {
    'gardr-validator': function (options, callback) {
        // test just want the options for verifying the actual option-object
        callback(null, options);
    }
});

describe('getReport', function () {

    it('calling runner without scriptUrl should return an error', function (done) {
        runner(null, function (err, result) {
            assert(err);
            done();
        });
    });

    it('calling runner should work, and return options as expected', function (done) {

        var input = {
            'output': {
                'url': 'id_' + Math.round(Math.random() * 100012391023)
            },
            'options': {
                'target': 'mobile',
                'viewport': {
                    height: 123
                }
            },
            id: 'asd'
        };

        runner(input, function (err, options) {
            refute(err, 'should not return error');
            assert.isObject(options);
            assert.isString(options.scriptUrl);
            assert.equals(options.scriptUrl, input.output.url);
            assert.equals(options.height, 123);
            assert(options.parentUrl.indexOf(process.cwd()) !== -1, 'smoketest file path resolving');
            done();
        });
    });
});
