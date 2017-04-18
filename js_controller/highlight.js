/** Highlights input keyword */
var mark = function(words, location, keyword) {
    var options = {'accuracy': "exactly"};
    
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
	    		var tmpArr = str == "" ? "" : str.split(" ");
	    		$(location).mark(tmpArr, options);
	    	}
	    	else {
	    		$(location).mark(words, options);
	    	}

	    	
	    }
	});
};


/* Updates context by highlighting text to appropriate class colours */
function updateText() {
	var str = "";
	for (var i = 0; i < annotatedDataReal.length; i++) {
		r = colours[annotatedDataReal[i][0]][0];
		g = colours[annotatedDataReal[i][0]][1];
		b = colours[annotatedDataReal[i][0]][2];
		var colour = "rgb("+r+","+g+","+b+")";	
		var fontColour = isColorDark(r,g,b) ? 'white' : 'black';
		str += "<span class='someToken' style='color:" + fontColour+ "; background-color: "+colour + "'>"+annotatedDataReal[i][1]+"</span> ";
	}
	$contextArea.html(str);
}

function outputAnnotatedData() {
	var str = "";
	for (var i = 0; i < annotatedDataReal.length; i++) {
		str += annotatedDataReal[i][0]+"\t"+annotatedDataReal[i][1]+'\n';
	}
	$('#entity-result').html(str);
}

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




