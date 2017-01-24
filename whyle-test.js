const whyle = require( "./whyle.js" );

whyle( function test( callback, x ){
		console.log( "condition called!", x );

		callback( x < 5, x );
	},
	function increment( callback, x ){
		console.log( "iterator called!", x );

		x++;
		callback( x );

		return x;
	}, 1000 )
	( function lastly( error, x ){
		console.log( "lastly called", arguments );
	}, 0 )

// whyle( function test( callback, x ){
// 		console.log( "condition called!", x );
//
// 		callback( x < 5, x );
// 	},
// 	function increment( callback, x ){
// 		console.log( "iterator called!", x );
//
// 		x++;
// 		callback( x );
// 	}, 1000 )
// 	( function lastly( error, x ){
// 		console.log( "lastly called", x );
// 	}, 0 )
