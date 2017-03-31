"use strict"; /*;
              	@module-license:
              		The MIT License (MIT)
              		@mit-license
              
              		Copyright (@c) 2017 Richeve Siodina Bebedor
              		@email: richeve.bebedor@gmail.com
              
              		Permission is hereby granted, free of charge, to any person obtaining a copy
              		of this software and associated documentation files (the "Software"), to deal
              		in the Software without restriction, including without limitation the rights
              		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              		copies of the Software, and to permit persons to whom the Software is
              		furnished to do so, subject to the following conditions:
              
              		The above copyright notice and this permission notice shall be included in all
              		copies or substantial portions of the Software.
              
              		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              		SOFTWARE.
              	@end-module-license
              
              	@module-configuration:
              		{
              			"package": "whyle",
              			"path": "whyle/whyle.js",
              			"file": "whyle.js",
              			"module": "whyle",
              			"author": "Richeve S. Bebedor",
              			"contributors": [
              				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
              			],
              			"eMail": "richeve.bebedor@gmail.com",
              			"repository": "https://github.com:volkovasystems/whyle.git",
              			"test": "whyle-test.js",
              			"global": true
              		}
              	@end-module-configuration
              
              	@module-documentation:
              		Asynchronous while.
              	@end-module-documentation
              
              	@include:
              		{
              			"budge": "budge",
              			"called": "called",
              			"clazof": "clazof",
              			"depher": "depher",
              			"doubt": "doubt",
              			"falzy": "falzy",
              			"harden": "harden",
              			"impel": "impel",
              			"kein": "kein",
              			"letgo": "letgo",
              			"optfor": "optfor",
              			"pringe": "pringe",
              			"protype": "protype",
              			"raze": "raze",
              			"snapd": "snapd",
              			"truly": "truly",
              			"zelf": "zelf"
              		}
              	@end-include
              
              	@usage:
              		The condition may return an array of result which will be passed to the iterator.
              		The iterator may pass data to the callback that will be
              			passed on the next call of the condition.
              
              		Passing error as the first parameter in the callback is optional.
              
              		Passing initial parameter to the catcher after the lastly callback will
              			pass it to the first call of the condition.
              
              		Iterator may return result that will be accumulated.
              
              			whyle( function condition( callback, ...parameter ){
              
              			}, function iterator( callback, ...parameter ){
              
              			} )( function lastly( error, ...parameter ){
              
              			} );
              	@end-usage
              
              	@todo:
              		Add capability to return on condition.
              	@end-todo
              */

var budge = require("budge");
var called = require("called");
var clazof = require("clazof");
var depher = require("depher");
var doubt = require("doubt");
var falzy = require("falzy");
var harden = require("harden");
var impel = require("impel");
var kein = require("kein");
var letgo = require("letgo");
var optfor = require("optfor");
var pringe = require("pringe");
var protype = require("protype");
var raze = require("raze");
var snapd = require("snapd");
var truly = require("truly");
var zelf = require("zelf");

var DONE = "done";

var whyle = function whyle(condition, iterator, delay) {
	/*;
                                                        	@meta-configuration:
                                                        		{
                                                        			"condition:required": "function",
                                                        			"iterator": "function",
                                                        			"delay": "number"
                                                        		}
                                                        	@end-meta-configuration
                                                        */

	if (!protype(condition, FUNCTION)) {
		throw new Error("invalid condition");
	}

	delay = depher(arguments, NUMBER, 0);

	if (truly(delay) && !protype(delay, NUMBER)) {
		throw new Error("invalid delay");
	}

	var self = zelf(this);

	if (falzy(iterator) || truly(iterator) && !protype(iterator, FUNCTION)) {
		iterator = function iterator(callback) {
			return callback.apply(self, budge(arguments));
		};
	}

	var trace = pringe.bind(self)([condition, iterator, delay]);

	if (kein(trace, whyle.cache) && !whyle.cache[trace].done()) {
		return whyle.cache[trace];
	}

	var catcher = letgo.bind(self)(function loop(cache) {
		var stop = function stop() {
			impel("DONE", DONE, catcher);

			var parameter = raze(arguments);

			snapd.bind(self)(function callback() {
				cache.callback.apply(self, parameter.concat([catcher.accumulant]));

				catcher.release();
			}).release();

			return catcher;
		};

		/*;
     	@note:
     		This is intentionally var don't change this.
     	@end-note
     */
		var factory = function factory() {
			return called.bind(self)(function execute(error, result) {
				if (catcher.done()) {
					return catcher;
				}

				var parameter = raze(arguments);

				error = optfor(parameter, Error);
				if (truly(error) && clazof(error, Error)) {
					return stop.apply(self, parameter);
				}

				result = depher(parameter, BOOLEAN, true);
				if (protype(result, BOOLEAN) && !result) {
					return stop.apply(self, [null].concat(parameter));
				}

				snapd.bind(self)(function onTimeout() {
					var callback = called.bind(self)(test);

					harden("stop", stop, callback);

					try {
						var output = iterator.apply(self, [callback].concat(budge(parameter)));
						catcher.accumulant.push(output);

						callback.apply(self, [null].concat(output));

						return output;

					} catch (error) {
						return stop.apply(self, [error].concat(parameter));
					}

				}, delay).release();

				return catcher;
			});
		};

		/*;
     	@note:
     		This is intentionally var don't change this.
     	@end-note
     */
		var test = function test(error) {
			if (catcher.done()) {
				return catcher;
			}

			var parameter = raze(arguments);

			error = optfor(parameter, Error);
			if (clazof(error, Error)) {
				return stop.apply(self, parameter);
			}

			var execute = factory();

			harden("stop", stop, execute);

			try {
				var result = condition.apply(self, [execute].concat(parameter));

				if (catcher.done()) {
					return result;
				}

				execute.apply(self, [null].concat(result));

				return result;

			} catch (error) {
				return stop(error);
			}
		};

		test.apply(self, cache.parameter);

		return catcher;
	});

	harden("trace", trace, catcher);

	/*;
                                  	@note:
                                  		This will cache results from iterator.
                                  	@end-note
                                  */
	harden("accumulant", [], catcher);

	catcher.done(function done() {
		return catcher.DONE === DONE;
	});

	catcher.release(function release() {
		while (catcher.accumulant.length) {
			catcher.accumulant.pop();
		}

		if (kein(trace, whyle.cache)) {
			delete whyle.cache[trace];
		}
	});

	whyle.cache[trace] = catcher;

	return catcher;
};

harden("cache", whyle.cache || {}, whyle);

module.exports = whyle;

//# sourceMappingURL=whyle.support.js.map