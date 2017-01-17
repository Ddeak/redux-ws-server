"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (processor) {
  return function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(action, next, broadcast) {
      var result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return processor(action);

            case 3:
              result = _context.sent;

              if (result) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return");

            case 6:
              if (action.broadcast) broadcast(result);
              next(result);
              _context.next = 14;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);

              console.info("Error occured in processor: " + processor + ": " + _context.t0);
              next({ error: _context.t0 });

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 10]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};