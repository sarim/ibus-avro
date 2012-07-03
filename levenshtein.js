/* 
    Javascript Implementation Of Damerau-Levenshtein Distance
    
    Source: 
    1. http://www.dzone.com/snippets/javascript-implementation 

    Based on: 
    1. http://en.wikibooks.org/wiki/Algorithm_implementation/Strings/Levenshtein_distance
    2. http://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance

*/

function levenshtein( a, b )
{
	var i;
	var j;
	var cost;
	var d = new Array();

	if ( a.length == 0 )
	{
		return b.length;
	}

	if ( b.length == 0 )
	{
		return a.length;
	}

	for ( i = 0; i <= a.length; i++ )
	{
		d[ i ] = new Array();
		d[ i ][ 0 ] = i;
	}

	for ( j = 0; j <= b.length; j++ )
	{
		d[ 0 ][ j ] = j;
	}

	for ( i = 1; i <= a.length; i++ )
	{
		for ( j = 1; j <= b.length; j++ )
		{
			if ( a.charAt( i - 1 ) == b.charAt( j - 1 ) )
			{
				cost = 0;
			}
			else
			{
				cost = 1;
			}

			d[ i ][ j ] = Math.min( d[ i - 1 ][ j ] + 1, d[ i ][ j - 1 ] + 1, d[ i - 1 ][ j - 1 ] + cost );

			if(
         i > 1 && 
         j > 1 &&  
         a.charAt(i - 1) == b.charAt(j-2) && 
         a.charAt(i-2) == b.charAt(j-1)
         ){
          d[i][j] = Math.min(
            d[i][j],
            d[i - 2][j - 2] + cost
          )

			}
		}
	}

	return d[ a.length ][ b.length ];
}