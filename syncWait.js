Promise .all( 
[ Array( 10000 ), Array( 10 ) ] 
.map( aa => 
	iteratorGet( 
		  map100( [ ... aa ], v => v, { count : 5000 } ) 
		, async q => ( console .log( await delivery( 0, q ), aa ), q ) 
		) 
	.then ( a => a .flatMap( v => v ) ) 
	) ) 
.then( v => console .log( v ) ) 
	; 

function * map100( a, F = v => v, { count = 100 } = {} ) { 
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
