"use module"; 

iGet( [ 1, 2, 3 ], { 
	  checker : q => q > 1 ? delivery( 1000, q + 1 ) : q 
	, res : v => console .log( v, '123' ) 
	} ); 

[ 1000001, 10 ] 
.map( n => Array( n ) ) 
.map( aa => iGet( iMap100( aa, v => v, { splitcount : 500000 } ), { 
	  checker : async q => ( 
		  console .log( await delivery( 0, q ), aa, 'checker' ) 
		, q 
		) 
	, res : v => console .log( v, 'res' ) 
	} ) ) 
	; 

var module = module || {}; 
Object .assign( module .exports = module .exports || {}, { 
	iMap100, iGet, switchtoPromise 
	} ); 

function * iMap100( a, F = v => v, { splitcount = 100 } = {} ) { 
	if ( splitcount < 1 ) { 
		splitcount = 1; // guard about no result 
		} 
	let ooa = []; 
	for ( let ai = 0; ai < a .length; ai += splitcount ) { 
		let oa = []; 
		for ( let i = 0; i < splitcount; i += 1 ) { if ( a .hasOwnProperty( ai + i ) ) { 
			oa[ i ] = F( a[ ai + i ] ); 
			} } 
		pipe( 
			  a .length - ai 
			, m => oa .length = m > splitcount ? splitcount : m 
			); 
		yield oa; 
		ooa .push( oa ); 
		} 
	return [] .concat( ... ooa ); // done with final 
	} // -- iMap100() 

function iGet( itv, { checker = v => v, res } = {} ) { 
	if ( ! ( itv .next instanceof Function ) ) { 
		itv = itv[ Symbol .iterator ](); // error or catch iterator obj 
		} 
	let oa = []; 
	for( 
			  let value, done
			; { value, done } = itv .next()
			, done && res ? ( res( [] .concat( ... oa ) ), false ) 
				: true // continue 
			; 
			) { 
		let v = checker( value ); 
		if ( v instanceof Promise ) { return switchtoPromise({ 
			  preF : async q => oa .push( await v ) 
			, whileF : async ( Pres 
					, value, done 
					) => ( 
				  { value, done } = itv .next() 
				, done ? ( res && res ( [] .concat( ... oa ) ), Pres( oa ) ) 
					: oa .push( await checker( value ) ) 
				, ! done 
				) 
			}); } 
		oa .push( v ); 
		} 
	return oa;  
	
	} // -- iGet() 

async function switchtoPromise({ 
			  preF // missing on press 
			, whileF // ( iterator || generator ) .next() 
			}) { 
	let  
		  itnF = Pres => async ( value, done ) => 
			( await whileF( Pres ) ) && itn() 
		, itn 
		; 
	await preF(); 
	return new Promise( Pres => ( itn = itnF( Pres ) )() ); 
	} // -- switchtoPromise() 

function delivery( delay, v = delay ) { return new Promise( res => 
	setTimeout( q => res( v ), delay ) 
	); } // -- delivery() 

function pipe( ... ar ) { return ar .reduce( ( o, F ) => F( o ) ); } // -- pipe() 
