(function (context) {
/*jscs:disable validateIndentation*//*jscs:enable validateIndentation*/
// -----------------------------------------------------------------------------

'use strict';

var id = 'prove';
var dependencies = ['is'];

function factory(is) {
  /**
   * A regular expression that identifies series of whitespace characters.
   *
   * @const {RegExp}
   * @private
   */
  var COLLAPSE_SPACE_RE = /\s+/g;

  /**
   * A regular expression that extracts a function’s list of parameters.
   *
   * @const {RegExp}
   * @private
   */
  var PARAMETER_LIST_RE = /^(?:function\s*[^(]*)?\(?([^)]*)\)?\s*(?:=>\s*)?/;

  /**
   * A regular expression that splits out a function’s parameter.
   *
   * @const {RegExp}
   * @private
   */
  var PARAMETER_NAME_RE = /,\s+/;

  /**
   * A regular expression that extracts a function’s return statement.
   *
   * @const {RegExp}
   * @private
   */
  var RETURN_RE = /^(?:.*?=>\{?\s?([^\{;\}]+)\s?;?\s?\}?|function\s?[^(]*\([^)]*?\)\s?\{.*\s?return\s([^\{;\}]+)\s?;?\s?\})$/;

  /**
   * A regular expression used to replace placeholders with argument values.
   *
   * @const {RegExp}
   * @private
   */
  var PLACEHOLDER_RE = /([^\\])?\$\{(\d+?)\}/g;

  /**
   * @private
   */
  function format(string, argv) {
    if (is.array(argv)) {
      return ('' + string).replace(PLACEHOLDER_RE, function (m, $1, $2) {
        var value = argv[$2];
        if (is.string(value)) {
          value = '"' + value + '"';
        } else if (is.function(value)) {
          value = (value.name ? value.name + '()' : 'function ()');
        } else {
          value = '`' + value + '`';
        }

        return (is.string($1) ? $1 : '') + value;
      });
    }

    return string;
  }

  /**
   * @private
   */
  function parameterize(f, argv) {
    var output = {};

    if (is.array(argv)) {
      var m = PARAMETER_LIST_RE.exec(f);
      var keys = [];

      if (m && m[1].length > 0) {
        keys = m[1].split(PARAMETER_NAME_RE);
      }

      for (var x = 0, nx = Math.min(keys.length, argv.length); x < nx; ++x) {
        output[keys[x]] = argv[x];
      }
    }

    return output;
  }

  /**
   * Throws an exception if invoking `predicate()` with the arguments listed in
   * `argv` returns either `false` or an `Error` object.
   *
   * If `predicate()` returns `false`, then an error will be thrown whose
   * message is inferred by coercing `predicate` to a string and replacing
   * occurrences of any parameters therein with the corresponding `argv`
   * values.
   *
   * Richer error messages can be crafted by returning an `Error` object from
   * `predicate()`. The object’s `message` property is aassumed to be string
   * optionally formatted with `${n}` expressions (where `n` is the index of
   * the corresponding element in `argv`).
   *
   * If `predicate()` returns an `Error` object that includes an `argv`
   * property, this property will be used in place of the `argv` parameter
   * passed to `prove()`.
   *
   * @example
   * // Throws an exception unless the predicate `are.equal` holds true given
   * // the arguments `[actual, expected]`.
   * prove([actual, expected], are.equal);
   *
   * @example
   * // Throws:
   * // Error('Assertion failed. { `true` === `false` }');
   * prove([true, false], function (a, b) {
   *   return a === b;
   * });
   *
   * @example
   * // Throws:
   * // Error('Assertion failed. `true` does not equal `false`.');
   * prove([true, false], function (a, b) {
   *   return a === b || new Error('${0} does not equal ${1}.');
   * });
   *
   * @example
   * // Throws:
   * // Error('Assertion failed. `true` did not equal `false` at "Wed Mar 09
   * // 2016 15:08:09 GMT-0800 (PST)".');
   * prove([true, false], function eq(a, b) {
   *   var output = a === b || new Error('${0} did not equal ${1} at ${2}.');
   *
   *   if (output !== true) {
   *     output.argv = [a, b, new Date()];
   *   }
   *
   *   return output;
   * });
   *
   * @example
   * // Manually fail using the `Error` constructor as a predicate. Throws:
   * // Error('Assertion failed. `callback()` should not have been called.');
   * prove(['`callback()` should not have been called.'], Error);
   *
   * @param {Array.<*>} [argv=[]] - Arguments to apply to `predicate()`.
   * @param {function(...*): (boolean|Error)} predicate - A function that
   *     asserts something about the arguments in `argv`. `predicate()` can
   *     expect any number of arguments (including none at all) and should
   *     return `true` if what it asserts is verified; it should return `false`
   *     or an `Error` object otherwise.
   *
   * @throws {Error} If `predicate()` returns `false` or an `Error` object.
   */
  function prove(argv, predicate) {
    if (is.nil(predicate)) {
      predicate = argv;
      argv = [];
    }

    var message;
    var okay = false;
    var parameters = {};

    if (is.function(predicate)) {
      okay = predicate.apply(undefined, argv);
      parameters = parameterize(predicate, argv);

      if (is.error(okay)) {
        message = 'Assertion failed. ' +
            format(okay.message, is.array(okay.argv) ? okay.argv : argv);

        okay = false;
      } else {
        okay = !!okay;
      }
    } else {
      okay = !!predicate;
    }

    if (!okay) {
      if (is.nil(message)) {
        var s = ('' + predicate).replace(COLLAPSE_SPACE_RE, ' ');
        var m = RETURN_RE.exec(s);
        var infix = (m ? m[1] || m[2] : s);

        var x = 0;
        for (var name in parameters) {
          var re = new RegExp('\\b' + name + '\\b', 'g');
          infix = infix.replace(re, '\${' + x + '}');
          x++;
        }

        message = 'Assertion failed. { ' + format(infix, argv) + ' }';
      }

      throw new Error(message);
    }
  }

  return prove;
}

// -----------------------------------------------------------------------------
var n = dependencies.length;
var o = 'object';
var r = /([^-_\s])[-_\s]+([^-_\s])/g;
function s(m, a, b) { return a + b.toUpperCase(); }
context = typeof global === o ? global : typeof window === o ? window : context;
if (typeof define === 'function' && define.amd) {
  define(dependencies, function () {
    return factory.apply(context, [].slice.call(arguments));
  });
} else if (typeof module === o && module.exports) {
  for (; n--;) {dependencies[n] = require(dependencies[n]);}
  module.exports = factory.apply(context, dependencies);
} else {
  for (; n--;) {dependencies[n] = context[dependencies[n]];}
  context[id.replace(r, s)] = factory.apply(context, dependencies);
}
}(this));
