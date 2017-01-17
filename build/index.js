'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeProcessor = exports.connect = undefined;

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _makeProcessor = require('./makeProcessor');

var _makeProcessor2 = _interopRequireDefault(_makeProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.connect = _api2.default;
exports.makeProcessor = _makeProcessor2.default;