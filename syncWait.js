Promise .all([ iteratorGet( [ 1, 2, 3 ] 
	, q => q > 1 ? new Promise( res => setTimeout( r => res( q + 1 ), 1000 ) ) 
		: q 
	) ]) 
.then( pa => console .log( ... pa ) ) 
	; 
Promise .all( [ Array( 1000001 ), Array( 10 ) ] .map( aa => 
	iteratorGet( 
		  iMap100( [ ... aa ], v => v, { count : 500000 } ) 
		, async q => ( console .log( await delivery( 0, q ), aa ), q ) 
		) 
	.then( a => a .flatMap( aa => aa ) ) 
	) ) 
.then( v => console .log( v ) ) 
	; 

function * iMap100( a, F = v => v, { count = 100 } = {} ) { 
	let 
		  ooa = [] 
		, iput = { 
			  [ Symbol .iterator ] : function *(){ 
				let ii = this .ii; 
				yield a[ ii ]; yield ii; yield a; 
				} 
			, foundProperty ( ii ) { return a .hasOwnProperty( 
				this .ii = ii 
				); } 
			, set value( v ) { this .oa[ this .ii ] = v; } 
			, set max( m ) { pipe( m, v => this .oa .length = v > count ? count : v ); } 
			, ii : 0 
			, oa : [] 
			} 
		; 
	for ( let ai = 0; ai < a .length; ai += count ) { 
		iput .oa = []; 
		for ( let i = 0; i < count; i += 1 ) { if ( iput .foundProperty( ai + i ) ) { 
			iput .value = F( ... iput ); 
			} } 
		iput .max = a .length - ai; 
		yield iput .oa; 
		ooa .push( iput .oa ); 
		} 
	return ooa .flatMap( v => v ); // done with final 
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
