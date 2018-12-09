iteratorGet( map100( Array( 100 ), q => q ), v => ( console .log( v ), v ) ); 

function * map100( a, F, { count = 10n } = {} ) { 
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
	console .log( ooa .length ); 
	return ooa; // done with final 
	} 

function iteratorGet( itv, F ) { 
	if ( ! ( itv .next instanceof Function ) ) { 
		itv = itv[ Symbol .iterator ](); // error or catch iterator obj 
		} 
	let oa = []; 
	for ( let value, done; { value, done } = itv .next(), ! done; ) { 
		oa .push( F( value ) ); 
		} 
	return oa; 
	} 
