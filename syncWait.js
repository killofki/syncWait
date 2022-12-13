{ /// 

"use module" 

iGet 
	( [ 1, 2, 3 ] 
	, new class { 
		checker = q => q > 1 ? delivery( 1000, q + 1 ) : q 
		res = v => console .log( v, '123' ) 
		} // -- {} 
	) // -- iGet 

; [ 1000001, 10 ] 
	.map( n => Array( n ) ) 
	.map 
		( aa => iGet 
			( iMap100( aa, v => v, { splitcount : 500000 } ) 
			, 
				{ checker : async q => { 
					console .log( await delivery( 0, q ), aa, 'checker' ) 
					return q 
					} // -- checker() 
				, res : v => console .log( v, 'res' ) 
				} 
			) // -- iGet // -- () 
		) // -- map 

iGet 
	( 
	  ( function * () { 
			yield 1 
			yield 2 
			yield 3 
			} // -- () 
		) () 
	, new class { 
		checker = v => ( delivery( 1000 ), v ) 
		res = v => console .log( v, 'async iterator' ) 
		} // -- {} 
	) // -- iGet 

var module = module || {} 
Object .assign 
	( module .exports = module .exports || {} 
	, { iMap100, iGet, switchtoPromise } 
	) // -- assign 

// .. functions .. 

function * iMap100 
		( a 
		, F = v => v 
		, { splitcount = 100 } = {} 
		) { 
	;  ( splitcount >= 1 ) 
	|| ( splitcount = 1 ) // guard about no result 
	
	const ooa = [] 
	for ( let ai = 0; ai < a .length; ai += splitcount ) { 
		const oa = [] 
		for ( let i = 0; i < splitcount; i += 1 ) { 
			if ( a .hasOwnProperty( ai + i ) ) { 
				const v = a[ ai + i ] 
				oa[ i ] = F( v ) 
				} // -- if has ai + i 
			} // -- for < splitcount 
		const oal = a .length - ai 
		oa .length = oal > splitcount ? splitcount : oal 
		yield oa 
		ooa .push( oa ) 
		} // -- for < length 
	return [] .concat( ... ooa ) // done with final 
	} // -- iMap100() 

function iGet( itv, { checker = v => v, res } = {} ) { 
	// res = v => console .log( v ) 
	;  ( itv .next instanceof Function ) 
	|| ( itv = itv[ Symbol .iterator ]() ) // error or catch iterator obj 
	
	const oa = [] 
	let itvn 
	for( let value, done 
			; itvn = itv .next() 
			, { value, done } = itvn 
			, 
				( done && res ? res( [] .concat( ... oa ) ) 
				: done !== false && switchtoPromise({ whileF }) // for // async function *(){} 
					// break with return  
				, done === false // continue 
				) 
			; ) { 
		const v = checker( value ) 
		if ( v instanceof Promise ) { 
			return switchtoPromise 
				( 
					{ preF : async q => { 
						oa .push( await v ) 
						return itvn = itv .next() 
						} // -- preF() 
					, whileF 
					} 
				) // -- switchtoPromise // -- return 
			} // -- if instanceof Promise 
		oa .push( v ) 
		} // -- for done === false 
	return oa 
	
	// .. functions in iGet 
	
	async function whileF( Pres, Perr ) { // use outer // res, oa, itv, itvn, checker 
		// itvn 
		let value, done 
		try { 
			; ( { value, done } = await itvn ) 
			; 
				( done ? // when no more 
					( res ?.( [] .concat( ... oa ) ) 
					, Pres( oa ) 
					) 
				: done === false ? // continue 
					( oa .push( await checker( value ) ) 
					, itvn = itv .next() // get next pre 
					) 
				: 
					( console .error( 'sorry.. iterator stoped.', done, value, itv ) 
					, Perr( itv ) 
					) 
				) 
			} // -- try 
		catch( errv ) { 
			console .error( 'catched', errv ) 
			Perr( errv ) 
			return 
			} // -- catch() 
		return done === false 
		} // -- whileF() 
	
	} // -- iGet() 

async function switchtoPromise 
		( 
			{ preF = q => q // missing on while 
			, whileF // ( iterator || generator ) .next() 
			} 
		) { 
	let itn 
	const itnF = ( res, err ) => 
		( itn = 
			( async q => 
				( await whileF( res, err ) ) && itn() 
			) // -- itn() 
		) () 
		// -- itnF() 
	
	await preF() 
	return new Promise( itnF ) 
	} // -- switchtoPromise() 

function delivery( delay, v = delay ) { 
	return new Promise ( res => setTimeout( q => res( v ), delay ) ) 
	} // -- delivery() 

function pipeReduce( ... ar ) { return ar .reduce( ( o, F ) => F( o ) ); } // -- pipeReduce() 

} /// 