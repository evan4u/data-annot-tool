/* Helper function used to create class buttons */
function create_a_class_button(className, random=true) {
	if (className != null) {
		var r,g,b;
		if (random) {
			r = className != 'O' ? Math.floor(Math.random() * (256)) : 255;
			g = className != 'O' ? Math.floor(Math.random() * (256)) : 255;
			b = className != 'O' ? Math.floor(Math.random() * (256)) : 255;
			colours[className] = className != 'O' ? [r,g,b] : [255,255,255];
		}
		else {
			colours[className] = className != 'O' ? [r,g,b] : [255,0,0];
		}
		r = colours[className][0], g = colours[className][1], b = colours[className][2];
		var colour = "rgb("+r+","+g+","+b+")";	
		var fontColour = isColorDark(r,g,b) ? 'white' : 'black';
		var altClassName = className.replace(/\s/g, '');
		$("#buttonArea").append('<button class="classButtons '+altClassName+'" style="width:100%; background-color:'+colour+'; color:'+fontColour+'; margin: 5px; border-radius: 4px; outline:none;">'+className+'</button>');
		$('.classButtons.'+altClassName).click(function() {
			if (!editMode) {
				addTokensToClass(className);
		  		updateText();
	  		}
	  		else {
	  			deleteButton(this, className);
	  			updateText();
	  			outputAnnotatedData();
	  		}
	  		
		});
		$("[name='my-checkbox']").bootstrapSwitch('disabled',false);
		$buttonClassInput.val('');
	}
}

/* maps word to a class, called when class button click */
function addTokensToClass(classAnnot) {
	if (classAnnot in annotatedDataOrganised) {
		annotatedDataOrganised[classAnnot] = annotatedDataOrganised[classAnnot].concat(words);
		
	} else {
		annotatedDataOrganised[classAnnot] = words;
	}
	words = [];
	updateAllAnnotatedData();
	outputAnnotatedData();
	$("#settings-div").focus();
}

/* UPDATES THE KEY OF A HIGHLIGHTING STRING IN OUR ANNOTATION */
function updateAnnotedData(key, str) {
	arrStr = str.split(" ");
	var tmpArr = [];
	for (var i = 0; i < annotatedDataReal.length; i++) {
		var count = 0;
		if (arrStr[0] == annotatedDataReal[i][1]) {
			var tmpStr = ""
			// CHECKS FOR MULTIPLE WORD TOKENS
			for (var j = i; j < annotatedDataReal.length && count < arrStr.length; j++) {
				if(annotatedDataReal[j][1] != arrStr[count]) {
					break;
				} 
				count++;	
			}
			// IF MULTIPLE WORDS FOUND
			annotatedDataReal[i] = [key, str]; // PUTS INTO ONE ELEMENT
			annotatedDataReal.splice(i+1, arrStr.length-1); // REMOVES REMAINING
		}
	}
}

function updateAllAnnotatedData() {
	for (var key in annotatedDataOrganised) {
		if (key != "O") {
			var tmp = annotatedDataOrganised[key];
			for (var i = 0; i < tmp.length; i++) {
				updateAnnotedData(key, tmp[i]);
			}
		}
	}
}


/* Deletes a button */
function deleteButton(obj, className) {
	var tmp = {};
	if (confirm("Are you sure you want to delete "+className)) {
		for (var i = 0; i  < annotatedDataReal.length; i++) {
			if (annotatedDataReal[i][0] == className) {
				annotatedDataReal[i][0] = "O";
			}
		}
		delete colours[className];
		
		
		$(obj).remove();
	}
}


	/* helper function that checks if the colour made by (r,g,b) is a dark colour */
function isColorDark(r, g, b){
	var darkness = 1-(0.299*r + 0.587*g + 0.114*b)/255;
	return (darkness < 0.5) ? false : true;
}