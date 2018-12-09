iteratorGet( 
	  map100( Array( 1000 ) ) 
	, async q => ( console .log( await delivery( 100, q ) ), q ) 
	) 
.then( v => console .log( v .flatMap( v => v ), 'finished' ) ) 
	; 
iteratorGet( 
	  [ 1, 2, 3 ] 
	, q => q > 1 ? new Promise( res => setTimeout( r => ( console .log( q ), res( q + 1 ) ), 1000 ) ) 
		: q 
	) 
.then( v => console .log( v, 'timed' ) ) 
	; 

function * map100( a, F = v => v, { count = 100n } = {} ) { 
	let ooa = []; 
	for ( let ai = 0n; ai < a .length; ai += count ) { 
		let oa = []; 
		for ( let i = 0n; i < count; i += 1n ) { 
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
		if ( v instanceof Promise ) { return ( async q => { 
			oa .push( await v ); 
			return new Promise( res => { 
				let itn = async ( { value, done } = itv .next() ) => ( 
					  done ? res( oa ) 
					: ( oa .push( await F( value ) ), itn() ) 
					); 
				itn(); 
				} ); 
			} )(); } // push catched value & next.. 
		oa .push( F( value ) ); 
		} 
	return oa;  
	} 

function delivery( delay, v = delay ) { return new Promise( res => 
	setTimeout( q => res( v ), delay ) 
	); } 

