"use strict";

/*;
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
*/

var budge = require("budge");
var called = require("called");
var clazof = require("clazof");
var depher = require("depher");
var doubt = require("doubt");
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

	if (truly(iterator) && !protype(iterator, FUNCTION)) {
		throw new Error("invalid iterator");
	}

	if (truly(delay) && !protype(delay, NUMBER)) {
		throw new Error("invalid delay");
	}

	delay = delay || 0;

	var self = zelf(this);

	iterator = iterator || function iterator(callback) {
		return callback.apply(self, budge(arguments));
	};

	var trace = pringe.bind(self)([condition, iterator, delay]);

	if (kein(whyle.cache, trace) && !whyle.cache[trace].done()) {
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
					return catcher;
				}

				if (!doubt(result, ARRAY)) {
					result = [result];
				}

				execute.apply(self, [null].concat(result));
			} catch (error) {
				return stop(error);
			}

			return catcher;
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

		if (kein(whyle.cache, trace)) {
			delete whyle.cache[trace];
		}
	});

	whyle.cache[trace] = catcher;

	return catcher;
};

harden("cache", whyle.cache || {}, whyle);

module.exports = whyle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndoeWxlLmpzIl0sIm5hbWVzIjpbImJ1ZGdlIiwicmVxdWlyZSIsImNhbGxlZCIsImNsYXpvZiIsImRlcGhlciIsImRvdWJ0IiwiaGFyZGVuIiwiaW1wZWwiLCJrZWluIiwibGV0Z28iLCJvcHRmb3IiLCJwcmluZ2UiLCJwcm90eXBlIiwicmF6ZSIsInNuYXBkIiwidHJ1bHkiLCJ6ZWxmIiwiRE9ORSIsIndoeWxlIiwiY29uZGl0aW9uIiwiaXRlcmF0b3IiLCJkZWxheSIsIkZVTkNUSU9OIiwiRXJyb3IiLCJOVU1CRVIiLCJzZWxmIiwiY2FsbGJhY2siLCJhcHBseSIsImFyZ3VtZW50cyIsInRyYWNlIiwiYmluZCIsImNhY2hlIiwiZG9uZSIsImNhdGNoZXIiLCJsb29wIiwic3RvcCIsInBhcmFtZXRlciIsImNvbmNhdCIsImFjY3VtdWxhbnQiLCJyZWxlYXNlIiwiZmFjdG9yeSIsImV4ZWN1dGUiLCJlcnJvciIsInJlc3VsdCIsIkJPT0xFQU4iLCJvblRpbWVvdXQiLCJ0ZXN0Iiwib3V0cHV0IiwicHVzaCIsIkFSUkFZIiwibGVuZ3RoIiwicG9wIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdGQSxJQUFNQSxRQUFRQyxRQUFTLE9BQVQsQ0FBZDtBQUNBLElBQU1DLFNBQVNELFFBQVMsUUFBVCxDQUFmO0FBQ0EsSUFBTUUsU0FBU0YsUUFBUyxRQUFULENBQWY7QUFDQSxJQUFNRyxTQUFTSCxRQUFTLFFBQVQsQ0FBZjtBQUNBLElBQU1JLFFBQVFKLFFBQVMsT0FBVCxDQUFkO0FBQ0EsSUFBTUssU0FBU0wsUUFBUyxRQUFULENBQWY7QUFDQSxJQUFNTSxRQUFRTixRQUFTLE9BQVQsQ0FBZDtBQUNBLElBQU1PLE9BQU9QLFFBQVMsTUFBVCxDQUFiO0FBQ0EsSUFBTVEsUUFB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QSxTQUFRRCxJQUFSLENBQWMsU0FBU0EsSUFBVCxHQUFnQjtBQUM3QixTQUFPQyxRQUFRaEIsSUFBUixLQUFpQkEsSUFBeEI7QUFDQSxFQUZEOztBQUlBZ0IsU0FBUU0sT0FBUixDQUFpQixTQUFTQSxPQUFULEdBQW1CO0FBQ25DLFNBQU9OLFFBQVFLLFVBQVIsQ0FBbUJZLE1BQTFCLEVBQWtDO0FBQ2pDakIsV0FBUUssVUFBUixDQUFtQmEsR0FBbkI7QUFDQTs7QUFFRCxNQUFJM0MsS0FBTVUsTUFBTWEsS0FBWixFQUFtQkYsS0FBbkIsQ0FBSixFQUFnQztBQUMvQixVQUFPWCxNQUFNYSxLQUFOLENBQWFGLEtBQWIsQ0FBUDtBQUNBO0FBQ0QsRUFSRDs7QUFVQVgsT0FBTWEsS0FBTixDQUFhRixLQUFiLElBQXVCSSxPQUF2Qjs7QUFFQSxRQUFPQSxPQUFQO0FBQ0EsQ0F4S0Q7O0FBMEtBM0IsT0FBUSxPQUFSLEVBQWlCWSxNQUFNYSxLQUFOLElBQWUsRUFBaEMsRUFBcUNiLEtBQXJDOztBQUVBa0MsT0FBT0MsT0FBUCxHQUFpQm5DLEtBQWpCIiwiZmlsZSI6IndoeWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyo7XG5cdEBtb2R1bGUtbGljZW5zZTpcblx0XHRUaGUgTUlUIExpY2Vuc2UgKE1JVClcblx0XHRAbWl0LWxpY2Vuc2VcblxuXHRcdENvcHlyaWdodCAoQGMpIDIwMTcgUmljaGV2ZSBTaW9kaW5hIEJlYmVkb3Jcblx0XHRAZW1haWw6IHJpY2hldmUuYmViZWRvckBnbWFpbC5jb21cblxuXHRcdFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcblx0XHRvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5cdFx0aW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuXHRcdHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcblx0XHRjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcblx0XHRmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5cdFx0VGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5cdFx0Y29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuXHRcdFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcblx0XHRJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcblx0XHRGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcblx0XHRBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5cdFx0TElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcblx0XHRPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuXHRcdFNPRlRXQVJFLlxuXHRAZW5kLW1vZHVsZS1saWNlbnNlXG5cblx0QG1vZHVsZS1jb25maWd1cmF0aW9uOlxuXHRcdHtcblx0XHRcdFwicGFja2FnZVwiOiBcIndoeWxlXCIsXG5cdFx0XHRcInBhdGhcIjogXCJ3aHlsZS93aHlsZS5qc1wiLFxuXHRcdFx0XCJmaWxlXCI6IFwid2h5bGUuanNcIixcblx0XHRcdFwibW9kdWxlXCI6IFwid2h5bGVcIixcblx0XHRcdFwiYXV0aG9yXCI6IFwiUmljaGV2ZSBTLiBCZWJlZG9yXCIsXG5cdFx0XHRcImVNYWlsXCI6IFwicmljaGV2ZS5iZWJlZG9yQGdtYWlsLmNvbVwiLFxuXHRcdFx0XCJyZXBvc2l0b3J5XCI6IFwiaHR0cHM6Ly9naXRodWIuY29tOnZvbGtvdmFzeXN0ZW1zL3doeWxlLmdpdFwiLFxuXHRcdFx0XCJ0ZXN0XCI6IFwid2h5bGUtdGVzdC5qc1wiLFxuXHRcdFx0XCJnbG9iYWxcIjogdHJ1ZVxuXHRcdH1cblx0QGVuZC1tb2R1bGUtY29uZmlndXJhdGlvblxuXG5cdEBtb2R1bGUtZG9jdW1lbnRhdGlvbjpcblx0XHRBc3luY2hyb25vdXMgd2hpbGUuXG5cdEBlbmQtbW9kdWxlLWRvY3VtZW50YXRpb25cblxuXHRAaW5jbHVkZTpcblx0XHR7XG5cdFx0XHRcImJ1ZGdlXCI6IFwiYnVkZ2VcIixcblx0XHRcdFwiY2FsbGVkXCI6IFwiY2FsbGVkXCIsXG5cdFx0XHRcImNsYXpvZlwiOiBcImNsYXpvZlwiLFxuXHRcdFx0XCJkZXBoZXJcIjogXCJkZXBoZXJcIixcblx0XHRcdFwiZG91YnRcIjogXCJkb3VidFwiLFxuXHRcdFx0XCJoYXJkZW5cIjogXCJoYXJkZW5cIixcblx0XHRcdFwiaW1wZWxcIjogXCJpbXBlbFwiLFxuXHRcdFx0XCJrZWluXCI6IFwia2VpblwiLFxuXHRcdFx0XCJsZXRnb1wiOiBcImxldGdvXCIsXG5cdFx0XHRcIm9wdGZvclwiOiBcIm9wdGZvclwiLFxuXHRcdFx0XCJwcmluZ2VcIjogXCJwcmluZ2VcIixcblx0XHRcdFwicHJvdHlwZVwiOiBcInByb3R5cGVcIixcblx0XHRcdFwicmF6ZVwiOiBcInJhemVcIixcblx0XHRcdFwic25hcGRcIjogXCJzbmFwZFwiLFxuXHRcdFx0XCJ0cnVseVwiOiBcInRydWx5XCIsXG5cdFx0XHRcInplbGZcIjogXCJ6ZWxmXCJcblx0XHR9XG5cdEBlbmQtaW5jbHVkZVxuXG5cdEB1c2FnZTpcblx0XHRUaGUgY29uZGl0aW9uIG1heSByZXR1cm4gYW4gYXJyYXkgb2YgcmVzdWx0IHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBpdGVyYXRvci5cblx0XHRUaGUgaXRlcmF0b3IgbWF5IHBhc3MgZGF0YSB0byB0aGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlXG5cdFx0XHRwYXNzZWQgb24gdGhlIG5leHQgY2FsbCBvZiB0aGUgY29uZGl0aW9uLlxuXG5cdFx0UGFzc2luZyBlcnJvciBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyIGluIHRoZSBjYWxsYmFjayBpcyBvcHRpb25hbC5cblxuXHRcdFBhc3NpbmcgaW5pdGlhbCBwYXJhbWV0ZXIgdG8gdGhlIGNhdGNoZXIgYWZ0ZXIgdGhlIGxhc3RseSBjYWxsYmFjayB3aWxsXG5cdFx0XHRwYXNzIGl0IHRvIHRoZSBmaXJzdCBjYWxsIG9mIHRoZSBjb25kaXRpb24uXG5cblx0XHRJdGVyYXRvciBtYXkgcmV0dXJuIHJlc3VsdCB0aGF0IHdpbGwgYmUgYWNjdW11bGF0ZWQuXG5cblx0XHRcdHdoeWxlKCBmdW5jdGlvbiBjb25kaXRpb24oIGNhbGxiYWNrLCAuLi5wYXJhbWV0ZXIgKXtcblxuXHRcdFx0fSwgZnVuY3Rpb24gaXRlcmF0b3IoIGNhbGxiYWNrLCAuLi5wYXJhbWV0ZXIgKXtcblxuXHRcdFx0fSApKCBmdW5jdGlvbiBsYXN0bHkoIGVycm9yLCAuLi5wYXJhbWV0ZXIgKXtcblxuXHRcdFx0fSApO1xuXHRAZW5kLXVzYWdlXG4qL1xuXG5jb25zdCBidWRnZSA9IHJlcXVpcmUoIFwiYnVkZ2VcIiApO1xuY29uc3QgY2FsbGVkID0gcmVxdWlyZSggXCJjYWxsZWRcIiApO1xuY29uc3QgY2xhem9mID0gcmVxdWlyZSggXCJjbGF6b2ZcIiApO1xuY29uc3QgZGVwaGVyID0gcmVxdWlyZSggXCJkZXBoZXJcIiApO1xuY29uc3QgZG91YnQgPSByZXF1aXJlKCBcImRvdWJ0XCIgKTtcbmNvbnN0IGhhcmRlbiA9IHJlcXVpcmUoIFwiaGFyZGVuXCIgKTtcbmNvbnN0IGltcGVsID0gcmVxdWlyZSggXCJpbXBlbFwiICk7XG5jb25zdCBrZWluID0gcmVxdWlyZSggXCJrZWluXCIgKTtcbmNvbnN0IGxldGdvID0gcmVxdWlyZSggXCJsZXRnb1wiICk7XG5jb25zdCBvcHRmb3IgPSByZXF1aXJlKCBcIm9wdGZvclwiICk7XG5jb25zdCBwcmluZ2UgPSByZXF1aXJlKCBcInByaW5nZVwiICk7XG5jb25zdCBwcm90eXBlID0gcmVxdWlyZSggXCJwcm90eXBlXCIgKTtcbmNvbnN0IHJhemUgPSByZXF1aXJlKCBcInJhemVcIiApO1xuY29uc3Qgc25hcGQgPSByZXF1aXJlKCBcInNuYXBkXCIgKTtcbmNvbnN0IHRydWx5ID0gcmVxdWlyZSggXCJ0cnVseVwiICk7XG5jb25zdCB6ZWxmID0gcmVxdWlyZSggXCJ6ZWxmXCIgKTtcblxuY29uc3QgRE9ORSA9IFwiZG9uZVwiO1xuXG5jb25zdCB3aHlsZSA9IGZ1bmN0aW9uIHdoeWxlKCBjb25kaXRpb24sIGl0ZXJhdG9yLCBkZWxheSApe1xuXHQvKjtcblx0XHRAbWV0YS1jb25maWd1cmF0aW9uOlxuXHRcdFx0e1xuXHRcdFx0XHRcImNvbmRpdGlvbjpyZXF1aXJlZFwiOiBcImZ1bmN0aW9uXCIsXG5cdFx0XHRcdFwiaXRlcmF0b3JcIjogXCJmdW5jdGlvblwiLFxuXHRcdFx0XHRcImRlbGF5XCI6IFwibnVtYmVyXCJcblx0XHRcdH1cblx0XHRAZW5kLW1ldGEtY29uZmlndXJhdGlvblxuXHQqL1xuXG5cdGlmKCAhcHJvdHlwZSggY29uZGl0aW9uLCBGVU5DVElPTiApICl7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcImludmFsaWQgY29uZGl0aW9uXCIgKTtcblx0fVxuXG5cdGlmKCB0cnVseSggaXRlcmF0b3IgKSAmJiAhcHJvdHlwZSggaXRlcmF0b3IsIEZVTkNUSU9OICkgKXtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiaW52YWxpZCBpdGVyYXRvclwiICk7XG5cdH1cblxuXHRpZiggdHJ1bHkoIGRlbGF5ICkgJiYgIXByb3R5cGUoIGRlbGF5LCBOVU1CRVIgKSApe1xuXHRcdHRocm93IG5ldyBFcnJvciggXCJpbnZhbGlkIGRlbGF5XCIgKTtcblx0fVxuXG5cdGRlbGF5ID0gZGVsYXkgfHwgMDtcblxuXHRsZXQgc2VsZiA9IHplbGYoIHRoaXMgKTtcblxuXHRpdGVyYXRvciA9IGl0ZXJhdG9yIHx8IGZ1bmN0aW9uIGl0ZXJhdG9yKCBjYWxsYmFjayApe1xuXHRcdHJldHVybiBjYWxsYmFjay5hcHBseSggc2VsZiwgYnVkZ2UoIGFyZ3VtZW50cyApICk7XG5cdH07XG5cblx0bGV0IHRyYWNlID0gcHJpbmdlLmJpbmQoIHNlbGYgKSggWyBjb25kaXRpb24sIGl0ZXJhdG9yLCBkZWxheSBdICk7XG5cblx0aWYoIGtlaW4oIHdoeWxlLmNhY2hlLCB0cmFjZSApICYmICF3aHlsZS5jYWNoZVsgdHJhY2UgXS5kb25lKCApICl7XG5cdFx0cmV0dXJuIHdoeWxlLmNhY2hlWyB0cmFjZSBdO1xuXHR9XG5cblx0bGV0IGNhdGNoZXIgPSBsZXRnby5iaW5kKCBzZWxmICkoIGZ1bmN0aW9uIGxvb3AoIGNhY2hlICl7XG5cdFx0bGV0IHN0b3AgPSBmdW5jdGlvbiBzdG9wKCApe1xuXHRcdFx0aW1wZWwoIFwiRE9ORVwiLCBET05FLCBjYXRjaGVyICk7XG5cblx0XHRcdGxldCBwYXJhbWV0ZXIgPSByYXplKCBhcmd1bWVudHMgKTtcblxuXHRcdFx0c25hcGQuYmluZCggc2VsZiApKCBmdW5jdGlvbiBjYWxsYmFjayggKXtcblx0XHRcdFx0Y2FjaGUuY2FsbGJhY2suYXBwbHkoIHNlbGYsIHBhcmFtZXRlci5jb25jYXQoIFsgY2F0Y2hlci5hY2N1bXVsYW50IF0gKSApO1xuXG5cdFx0XHRcdGNhdGNoZXIucmVsZWFzZSggKTtcblx0XHRcdH0gKS5yZWxlYXNlKCApO1xuXG5cdFx0XHRyZXR1cm4gY2F0Y2hlcjtcblx0XHR9O1xuXG5cdFx0Lyo7XG5cdFx0XHRAbm90ZTpcblx0XHRcdFx0VGhpcyBpcyBpbnRlbnRpb25hbGx5IHZhciBkb24ndCBjaGFuZ2UgdGhpcy5cblx0XHRcdEBlbmQtbm90ZVxuXHRcdCovXG5cdFx0dmFyIGZhY3RvcnkgPSBmdW5jdGlvbiBmYWN0b3J5KCApe1xuXHRcdFx0cmV0dXJuIGNhbGxlZC5iaW5kKCBzZWxmICkoIGZ1bmN0aW9uIGV4ZWN1dGUoIGVycm9yLCByZXN1bHQgKXtcblx0XHRcdFx0aWYoIGNhdGNoZXIuZG9uZSggKSApe1xuXHRcdFx0XHRcdHJldHVybiBjYXRjaGVyO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHBhcmFtZXRlciA9IHJhemUoIGFyZ3VtZW50cyApO1xuXG5cdFx0XHRcdGVycm9yID0gb3B0Zm9yKCBwYXJhbWV0ZXIsIEVycm9yICk7XG5cdFx0XHRcdGlmKCB0cnVseSggZXJyb3IgKSAmJiBjbGF6b2YoIGVycm9yLCBFcnJvciApICl7XG5cdFx0XHRcdFx0cmV0dXJuIHN0b3AuYXBwbHkoIHNlbGYsIHBhcmFtZXRlciApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzdWx0ID0gZGVwaGVyKCBwYXJhbWV0ZXIsIEJPT0xFQU4sIHRydWUgKTtcblx0XHRcdFx0aWYoIHByb3R5cGUoIHJlc3VsdCwgQk9PTEVBTiApICYmICFyZXN1bHQgKXtcblx0XHRcdFx0XHRyZXR1cm4gc3RvcC5hcHBseSggc2VsZiwgWyBudWxsIF0uY29uY2F0KCBwYXJhbWV0ZXIgKSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c25hcGQuYmluZCggc2VsZiApKCBmdW5jdGlvbiBvblRpbWVvdXQoICl7XG5cdFx0XHRcdFx0bGV0IGNhbGxiYWNrID0gY2FsbGVkLmJpbmQoIHNlbGYgKSggdGVzdCApO1xuXG5cdFx0XHRcdFx0aGFyZGVuKCBcInN0b3BcIiwgc3RvcCwgY2FsbGJhY2sgKTtcblxuXHRcdFx0XHRcdHRyeXtcblx0XHRcdFx0XHRcdGxldCBvdXRwdXQgPSBpdGVyYXRvci5hcHBseSggc2VsZiwgWyBjYWxsYmFjayBdLmNvbmNhdCggYnVkZ2UoIHBhcmFtZXRlciApICkgKTtcblx0XHRcdFx0XHRcdGNhdGNoZXIuYWNjdW11bGFudC5wdXNoKCBvdXRwdXQgKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIG91dHB1dDtcblxuXHRcdFx0XHRcdH1jYXRjaCggZXJyb3IgKXtcblx0XHRcdFx0XHRcdHJldHVybiBzdG9wLmFwcGx5KCBzZWxmLCBbIGVycm9yIF0uY29uY2F0KCBwYXJhbWV0ZXIgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LCBkZWxheSApLnJlbGVhc2UoICk7XG5cblx0XHRcdFx0cmV0dXJuIGNhdGNoZXI7XG5cdFx0XHR9ICk7XG5cdFx0fTtcblxuXHRcdC8qO1xuXHRcdFx0QG5vdGU6XG5cdFx0XHRcdFRoaXMgaXMgaW50ZW50aW9uYWxseSB2YXIgZG9uJ3QgY2hhbmdlIHRoaXMuXG5cdFx0XHRAZW5kLW5vdGVcblx0XHQqL1xuXHRcdHZhciB0ZXN0ID0gZnVuY3Rpb24gdGVzdCggZXJyb3IgKXtcblx0XHRcdGlmKCBjYXRjaGVyLmRvbmUoICkgKXtcblx0XHRcdFx0cmV0dXJuIGNhdGNoZXI7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBwYXJhbWV0ZXIgPSByYXplKCBhcmd1bWVudHMgKTtcblxuXHRcdFx0ZXJyb3IgPSBvcHRmb3IoIHBhcmFtZXRlciwgRXJyb3IgKTtcblx0XHRcdGlmKCBjbGF6b2YoIGVycm9yLCBFcnJvciApICl7XG5cdFx0XHRcdHJldHVybiBzdG9wLmFwcGx5KCBzZWxmLCBwYXJhbWV0ZXIgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGV4ZWN1dGUgPSBmYWN0b3J5KCApO1xuXG5cdFx0XHRoYXJkZW4oIFwic3RvcFwiLCBzdG9wLCBleGVjdXRlICk7XG5cblx0XHRcdHRyeXtcblx0XHRcdFx0bGV0IHJlc3VsdCA9IGNvbmRpdGlvbi5hcHBseSggc2VsZiwgWyBleGVjdXRlIF0uY29uY2F0KCBwYXJhbWV0ZXIgKSApO1xuXG5cdFx0XHRcdGlmKCBjYXRjaGVyLmRvbmUoICkgKXtcblx0XHRcdFx0XHRyZXR1cm4gY2F0Y2hlcjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCAhZG91YnQoIHJlc3VsdCwgQVJSQVkgKSApe1xuXHRcdFx0XHRcdHJlc3VsdCA9IFsgcmVzdWx0IF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRleGVjdXRlLmFwcGx5KCBzZWxmLCBbIG51bGwgXS5jb25jYXQoIHJlc3VsdCApICk7XG5cblx0XHRcdH1jYXRjaCggZXJyb3IgKXtcblx0XHRcdFx0cmV0dXJuIHN0b3AoIGVycm9yICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjYXRjaGVyO1xuXHRcdH07XG5cblx0XHR0ZXN0LmFwcGx5KCBzZWxmLCBjYWNoZS5wYXJhbWV0ZXIgKTtcblxuXHRcdHJldHVybiBjYXRjaGVyO1xuXHR9ICk7XG5cblx0aGFyZGVuKCBcInRyYWNlXCIsIHRyYWNlLCBjYXRjaGVyICk7XG5cblx0Lyo7XG5cdFx0QG5vdGU6XG5cdFx0XHRUaGlzIHdpbGwgY2FjaGUgcmVzdWx0cyBmcm9tIGl0ZXJhdG9yLlxuXHRcdEBlbmQtbm90ZVxuXHQqL1xuXHRoYXJkZW4oIFwiYWNjdW11bGFudFwiLCBbIF0sIGNhdGNoZXIgKTtcblxuXHRjYXRjaGVyLmRvbmUoIGZ1bmN0aW9uIGRvbmUoICl7XG5cdFx0cmV0dXJuIGNhdGNoZXIuRE9ORSA9PT0gRE9ORTtcblx0fSApO1xuXG5cdGNhdGNoZXIucmVsZWFzZSggZnVuY3Rpb24gcmVsZWFzZSggKXtcblx0XHR3aGlsZSggY2F0Y2hlci5hY2N1bXVsYW50Lmxlbmd0aCApe1xuXHRcdFx0Y2F0Y2hlci5hY2N1bXVsYW50LnBvcCggKTtcblx0XHR9XG5cblx0XHRpZigga2Vpbiggd2h5bGUuY2FjaGUsIHRyYWNlICkgKXtcblx0XHRcdGRlbGV0ZSB3aHlsZS5jYWNoZVsgdHJhY2UgXTtcblx0XHR9XG5cdH0gKTtcblxuXHR3aHlsZS5jYWNoZVsgdHJhY2UgXSA9IGNhdGNoZXI7XG5cblx0cmV0dXJuIGNhdGNoZXI7XG59O1xuXG5oYXJkZW4oIFwiY2FjaGVcIiwgd2h5bGUuY2FjaGUgfHwgeyB9LCB3aHlsZSApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdoeWxlO1xuIl19
