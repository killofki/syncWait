Promise .all([ iteratorGet( [ 1, 2, 3 ], { 
	checker : q => q > 1 ? new Promise( res => setTimeout( r => res( q + 1 ), 1000 ) ) 
		: q 
	} ) ]) 
.then( pa => console .log( ... pa ) ) 
	; 
[ Array( 1000001 ), Array( 10 ) ] .map( aa => iteratorGet( 
	  iMap100( [ ... aa ], v => v, { count : 500000 } ) 
	, { 
		  checker : async q => ( console .log( await delivery( 0, q ), aa ), q ) 
		, res : v => console .log( v, 'con' ) 
		} 
	) ) 
	; 

function * iMap100( a, F = v => v, { count = 100 } = {} ) { 
	let ooa = []; 
	for ( let ai = 0; ai < a .length; ai += count ) { 
		let oa = []; 
		for ( let i = 0; i < count; i += 1 ) { if ( a .hasOwnProperty( ai + i ) ) { 
			oa[ i ] = F( a[ ai + i ] ); 
			} } 
		pipe( 
			  a .length - ai 
			, m => oa .length = m > count ? count : m 
			); 
		yield oa; 
		ooa .push( oa ); 
		} 
	return ooa .flatMap( v => v ); // done with final 
	} 

function iteratorGet( itv, { checker = v => v, res } = {} ) { 
	if ( ! ( itv .next instanceof Function ) ) { 
		itv = itv[ Symbol .iterator ](); // error or catch iterator obj 
		} 
	let oa = []; 
	for( 
			  let value, done
			; { value, done } = itv .next()
			, done && res && res( oa .flatMap( a => a ) ) 
			, ! done
			; 
			) { 
		let v = checker( value ); 
		if ( v instanceof Promise ) { return ( async q => (  
			  oa .push( await v ) 
			, new Promise( Pres => { 
				let itn = async ( { value, done } = itv .next() ) => ( 
					  done ? ( res && res( oa .flatMap( a => a ) ), Pres( oa ) ) 
					: ( oa .push( await checker( value ) ), itn() ) 
					); 
				itn(); 
				} ) 
			) )(); } // push catched value & next.. 
		oa .push( checker( value ) ); 
		} 
	return oa;  
	} 

function delivery( delay, v = delay ) { return new Promise( res => 
	setTimeout( q => res( v ), delay ) 
	); } 

function pipe( ... ar ) { return ar .reduce( ( o, F ) => F( o ) ); } 
