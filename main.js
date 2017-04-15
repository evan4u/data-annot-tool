

$(function() {
	var html = " My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruf My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember."
	$( ".context" ).html(html);

	var annotatedData = [];
	var annotatedDataOrganised = {'O': []};
	var annotatedDataReal = [];
	var $buttonClassInput = $("#classname")
	var $contextArea = $(".context")

	var editMode = false; // NEEDS TO FALSE
	var numOfButtons = 0;
	var words = [];

	var colours = {'O': [255, 255, 255]}
	var tempWords = [];


  	/** Highlights clicked or highlighted word */
	$contextArea.mouseup(function(event) {
		if (Object.size(colours) > 1 && !editMode) {
			var token = cleanString(window.getSelection().toString());
			if (token != undefined) {
				mark(words, $contextArea, token); 
			}
			$buttonClassInput.focus();
		}
	});

	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};

	/* When user submits a new button name, it creates it here  */
  	$buttonClassInput.keyup(function(event){  		
	    if(event.keyCode == 13){
	        if (validClassInput($(this).val())) {
	        	create_a_class_button($(this).val());
	        }
	    }
	});


  	/* Input is valid if it is not all spaces or empty */	
	function validClassInput(str) {
		if (str == "") { return false; }
		var count = 0;
		for (var i = 0; i < str.length; i++) {
			if (str[i] == ' ') {count++;}
		}
		return count != str.length;
	}


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
		  		}
		  		
			});
			$("[name='my-checkbox']").bootstrapSwitch('disabled',false);
			$buttonClassInput.val('');
		}
	}

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

	/* helper function that checks if the colour made by (r,g,b) is a dark colour */
	function isColorDark(r, g, b){
    	var darkness = 1-(0.299*r + 0.587*g + 0.114*b)/255;
    	return (darkness < 0.5) ? false : true;
	}


	/* maps word to a class, called when class button click */
	function addTokensToClass(classAnnot) {
		annotatedData.push({classAnnot: words});
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



	// SIMULATION
	var str = 'B-Peop	Dole\nO	is\nO	at\nO	an\nO	organizational\nO	disadvantage\nO	in\nO	the\nO	South\nO	but\nO	has\nO	had\nO	his\nO	wife\nO	","\nB-Peop	Evan\nO	","\nO	a\nO	native\nO	of\nB-Loc	Macquarie University\nO	","\nO	working\nO	the\nO	region\nO	for\nO	him\nO	.'

	function loadAnnotedText() {
		var classSet = new Set();
		var lines = str.split('\n');
		for(var i = 0;i < lines.length;i++){ // READS LINE BY LINE
			var tokens = lines[i].split(/\t/); // SPLIT INTO TABS
	    	classSet.add(tokens[0]);
	    	if (!annotatedDataOrganised.hasOwnProperty(tokens[0])) {
	    		annotatedDataOrganised[tokens[0]] = [];
	    		annotatedDataOrganised[tokens[0]].push(tokens[1]);
	    	} else {
	    		annotatedDataOrganised[tokens[0]].push(tokens[1]);
	    	}
		}
		
		classSet.forEach(function(value) {
  			create_a_class_button(value);
  		});

		

	}


	function stringToToken(str) {
		var regex = /[^\s\.,:!?]+/g; // This is "multiple not space characters, which should be searched not once in string"
		var tokens = str.replace(/[^\w\s]|_/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ').split(' ');
		return tokens.splice(1,tokens.length-1);
	}

	/*  Default refers to putting making everything as object */
	function stringToAnnotDataDefault(str) {
		var token = stringToToken(str);
		for (var i = 0; i < token.length; i++) {
			annotatedDataReal.push(['O', token[i]]);
		}
	}


	function outputAnnotatedData() {
		var str = "";
		for (var i = 0; i < annotatedDataReal.length; i++) {
			str += annotatedDataReal[i][0]+"\t"+annotatedDataReal[i][1]+'\n';
		}
		$('#entity-result').html(str);
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

	// switch
	$("[name='my-checkbox']").bootstrapSwitch({
    	disabled:true
	});
	$("[name='my-checkbox']").bootstrapSwitch(); //initialized somewhere
	$("[name='my-checkbox']").bootstrapSwitch('disabled',true);
	$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
		editMode = state;
	});

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
			updateText();
			outputAnnotatedData(); 
			$(obj).remove();
		}
	}

	// SIMULATIONS
	// no preprocess
	function demo1() {
		stringToAnnotDataDefault(html);
		updateAllAnnotatedData();
		outputAnnotatedData();
	}

	// with preprocess
	function demo2() {
		loadAnnotedText();
		stringToAnnotDataDefault(html);
		updateAllAnnotatedData();
		outputAnnotatedData(); 
		updateText();
	}

	demo2();

});


