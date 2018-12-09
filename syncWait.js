iteratorGet( 
	  map100( [ ... Array( 100 ) ] ) 
	, async q => ( console .log( await delivery( 100, q ) ), q ) 
	) 
.then( v => console .log( v .flatMap( v => v ) ) ) 
	; 

function * map100( a, F = v => v, { count = 10n } = {} ) { 
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
		if ( v instanceof Promise ) { 
			return v .then( nv => oa .push( nv ) 
				) .then( q => new Promise( res => { 
				let itn = async q => { 
					let { value, done } = itv .next(); 
					  done ? res( oa ) 
					: ( oa .push( await F( value ) ), itn() ) 
						; 
					}; 
				itn(); 
				} ) ); // push catched value & next.. 
			} 
		oa .push( F( value ) ); 
		} 
	return oa;  
	} 

function delivery( delay, v = delay ) { return new Promise( res => setTimeout( q => res( v ), delay ) ); } 