iteratorGet( [ 1, 2, 3 ], { 
	  checker : q => q > 1 ? delivery( 1000, q + 1 ) : q 
	, res : v => console .log( v, '123' ) 
	} ); 

[ 1000001, 10 ] 
.map( n => Array( n ) ) 
.map( aa => iteratorGet( iMap100( aa, v => v, { count : 500000 } ), { 
	  checker : async q => ( 
		  console .log( await delivery( 0, q ), aa, 'checker' ) 
		, q 
		) 
	, res : v => console .log( v, 'res' ) 
	} ) ) 
	; 

function * iMap100( a, F = v => v, { count = 100 } = {} ) { 
	if ( count < 1 ) { 
		count = 1; // guard about no result 
		} 
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
	return [] .concat( ... ooa ); // done with final 
	} 

function iteratorGet( itv, { checker = v => v, res } = {} ) { 
	if ( ! ( itv .next instanceof Function ) ) { 
		itv = itv[ Symbol .iterator ](); // error or catch iterator obj 
		} 
	let oa = []; 
	for( 
			  let value, done
			; { value, done } = itv .next()
			, done && res && res( [] .concat( ... oa ) ) 
			, ! done
			; 
			) { 
		let v = checker( value ); 
		if ( v instanceof Promise ) { return ( async ( 
				  itnF = Pres => async ( { value, done } = itv .next() ) => ( 
					  done ? ( res && res( [] .concat( ... oa ) ), Pres( oa ) ) 
					: ( oa .push( await checker( value ) ), itn() ) 
					) 
				, itn 
				) => (  
			  oa .push( await v ) 
			, new Promise( Pres => ( itn = itnF( Pres ), itn() ) ) 
			) )(); } // push catched value & next.. 
		oa .push( v ); 
		} 
	return oa;  
	} 

function delivery( delay, v = delay ) { return new Promise( res => 
	setTimeout( q => res( v ), delay ) 
	); } 

function pipe( ... ar ) { return ar .reduce( ( o, F ) => F( o ) ); } 
