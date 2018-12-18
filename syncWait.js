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
iGet( ( function * () { yield 1; yield 2; yield 3; } )(), { 
	  checker : v => ( delivery( 1000 ), v ) 
	, res : v => console .log( v, 'async iterator' ) 
	} ); 

var module = module || {}; 
Object .assign( module .exports = module .exports || {}, { 
	iMap100, iGet, switchtoPromise 
	} ); 

function * iMap100( a, F = v => v, { splitcount = 100 } = {} ) { 
	   ( splitcount >= 1 ) 
	|| ( splitcount = 1 ) // guard about no result 
		; 
	let ooa = []; 
	for ( let ai = 0; ai < a .length; ai += splitcount ) { 
		let oa = []; 
		for ( let i = 0; i < splitcount; i += 1 ) { if ( a .hasOwnProperty( ai + i ) ) { 
			oa[ i ] = F( a[ ai + i ] ); 
			} } 
		pipe( 
			  a .length - ai 
			, oal => oa .length = oal > splitcount ? splitcount : oal 
			); 
		yield oa; 
		ooa .push( oa ); 
		} 
	return [] .concat( ... ooa ); // done with final 
	} // -- iMap100() 

function iGet( itv, { checker = v => v, res } = {} ) { 
	// res = v => console .log( v ) 
	   ( itv .next instanceof Function ) 
	|| ( itv = itv[ Symbol .iterator ]() ) // error or catch iterator obj 
		; 
	let oa = [], itvn; 
	for( 
			  let value, done 
			; itvn = itv .next() 
			, { value, done } = itvn 
			, done && res ? res( [] .concat( ... oa ) ) 
				: done !== false && switchtoPromise({ // for // async function *(){} 
					whileF 
					}) // break with return  
			, done === false // continue 
			; 
			) { 
		let v = checker( value ); 
		if ( v instanceof Promise ) { return switchtoPromise({ 
			  preF : async q => ( 
				  oa .push( await v ) 
				, itvn = itv .next() 
				) 
			, whileF 
			}); } 
		oa .push( v ); 
		} 
	return oa;  
	
	async function whileF( Pres, Perr ) { // use outer // res, oa, itv, itvn, checker 
		let value, done; 
		try { 
			( { value, done } = await itvn ); 
			  done ? ( // when no more 
				  res && res ( [] .concat( ... oa ) ) 
				, Pres( oa ) 
				) 
			: done === false ? ( // continue 
				  oa .push( await checker( value ) ) 
				, itvn = itv .next() // get next pre 
				) 
			: ( 
				  console .error( 'sorry.. iterator stoped.', done, value, itv ) 
				, Perr( itv ) 
				) 
				; 
			} 
		catch( errv ) { 
			console .error( 'catched', errv ); 
			Perr( errv ); 
			return; 
			} 
		return done === false; 
		} // -- whileF() 
	
	} // -- iGet() 

async function switchtoPromise({ 
			  preF = q => q // missing on while 
			, whileF // ( iterator || generator ) .next() 
			}) { 
	let  
		  itnF = ( res, err ) => ( itn = ( async q => 
			( await whileF( res, err ) ) && itn() 
			) )() 
		, itn 
		; 
	await preF(); 
	return new Promise( itnF ); 
	} // -- switchtoPromise() 

function delivery( delay, v = delay ) { return new Promise( res => 
	setTimeout( q => res( v ), delay ) 
	); } // -- delivery() 

function pipe( ... ar ) { return ar .reduce( ( o, F ) => F( o ) ); } // -- pipe() 
