/** Highlights input keyword */
var mark = function(words, location, keyword) {
    var options = {'accuracy': "complementary"};
    
	location.unmark({
	    done: function() {
	    	if (keyword != "") {
	    		var str = "";
	    		index = words.indexOf(keyword);
	    		if (index < 0) {
	    			words.push(keyword);
	    			str = words.join(" ");
	    		}
	    		else {
	    			words.splice(keyword, 1)
	    		}
	    	}
	    	var tmpArr = str == "" ? "" : str.split(" ");
	    	console.log(tmpArr);
	    	$(location).mark(tmpArr, options);
	    }
	});

	return words
	};


	/*	Removes punctation and spaces	*/
function cleanString(str) {
	if (typeof(str) == 'string' && str != "" && str != " ") {
		if (!isLetter(str[0])) {str = str.substring(1);}	
		if (!isLetter(str[str.length-1])) {
			str = str.substring(0, str.length-1);
		}
		return str;
	}
}

function isLetter(c) {return c.toLowerCase() != c.toUpperCase();}

