Promise .all([ iteratorGet( [ 1, 2, 3 ] 
	, q => q > 1 ? new Promise( res => setTimeout( r => res( q + 1 ), 1000 ) ) 
		: q 
	) ]) 
.then( pa => console .log( ... pa ) ) 
	; 
Promise .all( [ Array( 10001 ), Array( 10 ) ] .map( aa => 
	iteratorGet( 
		  iMap100( [ ... aa ], v => v, { count : 5000 } ) 
		, async q => ( console .log( await delivery( 500, q ), aa ), q ) 
		) 
	.then( a => a .flatMap( aa => aa ) ) 
	) ) 
.then( v => console .log( v ) ) 
	; 

function * iMap100( a, F = v => v, { count = 100 } = {} ) { 
	let ooa = []; 
	for ( let ai = 0; ai < a .length; ai += count ) { 
		let oa = []; 
		for ( let i = 0; i < count; i += 1 ) { 
			let ii = ai + i; 
			if ( ! ( ii < a .length ) ) 
				{ break; } 
			if ( a .hasOwnProperty( ii ) ) { 
				oa .push( F( a[ ii ], ii, a ) ); 
				continue; 
				} 
			} 
		yield oa; 
		ooa .push( ... oa ); 
		} 
	return ooa; // done with final 
	} 

function iteratorGet( itv, F = v => v ) { 
	if ( ! ( itv .next instanceof Function ) ) { 
		itv = itv[ Symbol .iterator ](); // error or catch iterator obj 
		} 
	let oa = []; 
	for( let value, done; { value, done } = itv .next(), ! done; ) { 
		let v = F( value ); 
		if ( v instanceof Promise ) { return ( async q => (  
			  oa .push( await v ) 
			, new Promise( res => { 
				let itn = async ( { value, done } = itv .next() ) => ( 
					  done ? res( oa ) 
					: ( oa .push( await F( value ) ), itn() ) 
					); 
				itn(); 
				} ) 
			) )(); } // push catched value & next.. 
		oa .push( F( value ) ); 
		} 
	return oa;  
	} 

function delivery( delay, v = delay ) { return new Promise( res => 
	setTimeout( q => res( v ), delay ) 
	); } 

function pipe( ... ar ) { return ar .reduce( ( o, F ) => F( o ) ); } 
