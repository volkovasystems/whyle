const whyle = require( "./whyle.js" );

var x = 0;
whyle( function test( callback ){
		callback( x < 5 );
	},
	function increment( callback ){
		callback( x++ );
	} )
	( function lastly( ){
		console.log( x );
	} )
