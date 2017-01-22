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
			"doubt": "doubt",
			"harden": "harden",
			"letgo": "letgo",
			"optfor": "optfor",
			"protype": "protype",
			"raze": "raze",
			"snapd": "snapd",
			"truly": "truly",
			"zelf": "zelf"
		}
	@end-include
*/

const budge = require( "budge" );
const called = require( "called" );
const clazof = require( "clazof" );
const doubt = require( "doubt" );
const harden = require( "harden" );
const letgo = require( "letgo" );
const optfor = require( "optfor" );
const protype = require( "protype" );
const raze = require( "raze" );
const snapd = require( "snapd" );
const truly = require( "truly" );
const zelf = require( "zelf" );

const DONE = "done";

const whyle = function whyle( condition, iterator, delay ){
	/*;
		@meta-configuration:
			{
				"condition:required": "function",
				"iterator": "function",
				"delay": "number"
			}
		@end-meta-configuration
	*/

	if( !protype( condition, FUNCTION ) ){
		throw new Error( "invalid condition" );
	}

	if( truly( iterator ) && !protype( iterator, FUNCTION ) ){
		throw new Error( "invalid iterator" );
	}

	if( truly( delay ) && !protype( delay, NUMBER ) ){
		throw new Error( "invalid delay" );
	}

	delay = delay || 0;

	let self = zelf( this );

	iterator = iterator || function iterator( callback ){
		return callback.apply( self, budge( arguments ) );
	};

	let catcher = letgo.bind( self )( function loop( cache ){
		let stop = function stop( ){
			harden( "DONE", DONE, catcher );

			cache.callback.apply( self, raze( arguments ) );
		};

		var factory = function factory( ){
			return called.bind( self )( function execute( error, result ){
				if( catcher.DONE === DONE ){
					return catcher;
				}

				let parameter = raze( arguments );

				error = optfor( parameter, Error );
				if( clazof( error, Error ) ){
					return cache.callback.apply( self, parameter );
				}

				result = optfor( parameter, BOOLEAN );
				if( protype( result, BOOLEAN ) && !result ){
					return cache.callback.apply( self, parameter );
				}

				snapd.bind( self )( function onTimeout( ){
					let callback = called.bind( self )( test );

					harden( "stop", stop, callback );

					return iterator.apply( self, [ callback ].concat( budge( parameter ) ) );
				}, delay ).release( );

				return catcher;
			} );
		};

		var test = function test( error ){
			if( catcher.DONE === DONE ){
				return catcher;
			}

			let parameter = raze( arguments );

			error = optfor( parameter, Error );
			if( clazof( error, Error ) ){
				cache.callback.apply( self, parameter );

				return catcher;
			}

			let execute = factory( );

			harden( "stop", stop, execute );

			try{
				let result = condition.apply( self, [ execute ].concat( parameter ) );

				if( catcher.DONE === DONE ){
					return catcher;
				}

				if( !doubt( result, ARRAY ) ){
					result = [ result ];
				}

				execute.apply( self, [ null ].concat( result ) );

			}catch( error ){
				execute.call( self, error );
			}

			return catcher;
		};

		return test( );
	} );

	return catcher;
};

module.exports = whyle;
