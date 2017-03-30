

$(function() {
	// ADD CONTENT IN BODY

	var html = " My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruf My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember."
	$( ".context" ).html(html);

	var annotatedData = [];
	var annotatedDataOrganised = {'O': []};
	var annotatedDataReal = [];

	var highlightUnlocked = false; // NEEDS TO FALSE
	var numOfButtons = 0;
	var words = [];


	var mark = function(keyword) {
    	// Determine selected options
	    //var options = {'accuracy': "exactly", 'exclude': [',', '.']};
	    var options = {'accuracy': "complementary"};

	    $("input[name='opt[]']").each(function() {	
	    	options[$(this).val()] = $(this).is(":checked");
	    }); 
	    
		$(".context").unmark({
		    done: function() {
		    	words.push(keyword);
		    	console.log(words)
		        $(".context").mark(words, options);
		    }
		});
		
  	};


	$(".context").mouseup(function() {

		if (highlightUnlocked) {
			var token = cleanString(window.getSelection().toString());
			//var token = window.getSelection().toString();
			if (token != undefined) {
				var r = confirm('Wound you like to highlight '+token);
				if (r == true) {
				    mark(token);
				} 
			}
			else {
				s = window.getSelection();
	         	var range = s.getRangeAt(0);
	         	var node = s.anchorNode;

	         	while(range.toString().indexOf(' ') != 0 && range.startOffset > 0) {   

	            	range.setStart(node,(range.startOffset -1));
	         	}

	         	range.setStart(node, range.startOffset + 1);
	         	do {
	           		range.setEnd(node,range.endOffset + 1);
	        	} while(range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
	        	
	        	var str = cleanString(range.toString().trim());

	        	var r = confirm('Wound you like to highlights '+str);
				if (r == true) {
				    //words.push(str);
				    mark(str);
				}
			}
			$(".input-sm").focus();
		}

		 // removes auto-highlight caused from initial highlight
	});




	function cleanString(str) {
		/*
		Removes punctation and spaces
		*/
		console.log((typeof(str) == 'string')+ "  "+ (str != ""));
		if (typeof(str) == 'string' && str != "") {

			if (!isLetter(str[0])) {
				str = str.substring(1);
			}
						
			if (!isLetter(str[str.length-1])) {
				str = str.substring(0, str.length-1);
			}
			console.log(!isLetter(str[str.length-1]));
			return str;
		}
	}

	function isLetter(c) {
 		return c.toLowerCase() != c.toUpperCase();
	}

	var $input = $("input[name='keyword']");
  	//$input.on("input", function() {
  	//	console.log($(this).val());
  	//});

  	$("#classname").keyup(function(event){  		
	    if(event.keyCode == 13){
	    	console.log($(this).val());
	        if (validClassInput($(this).val())) {
	        	create_a_class_button($(this).val());
	        }
	    }
	});

	function validClassInput(str) {
	/*
		Input is valid if it is not all spaces or empty
	*/	
		if (str == "") {
			return false;

		}

		var count = 0;
		for (var i = 0; i < str.length; i++) {
			if (str[i] == ' ') {
				count++;
			}
		}
		return count != str.length;
	}

	$("#finishButton").click(function() {
		if (numOfButtons > 0) {
			highlightUnlocked = !highlightUnlocked;
			if (highlightUnlocked) {
				$("#finishButton").text("Add class");
			} else {
				$("#finishButton").text("Start Annotating");
			}
		} else {
			alert("You Have not added a class. Please add a class");
		}
	});


	$("#downloadButton").click(function() {

		writeFile();
		//window.open("output.txt", "_blank");
	});

	function writeFile() {
		formatAnnotatedData();
	}

	function formatAnnotatedData() {
		// put into a single dict
		outputStr = "";
		for (var key in annotatedDataOrganised) {
			outputStr += key+":\n";
  			if (annotatedDataOrganised.hasOwnProperty(key)) {
  				outputStr += annotatedDataOrganised[key]+"\n"
    			
  			}

  			outputStr += "\n\n\n";
		}

		var blob = new Blob([outputStr], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "output.txt");


		// organise by classes
		console.log(annotatedData[0]);
		
	}


	// NEED FOR TABS
	$('.collapse').on('shown.bs.collapse', function(){
	      $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
	}).on('hidden.bs.collapse', function(){
	      $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
	});

	
	

	function addToEntResult() {
		// put into a single dict
		outputStr = "";
		for (var key in annotatedDataOrganised) {
			outputStr += key+":\n";
  			if (annotatedDataOrganised.hasOwnProperty(key)) {
  				outputStr += annotatedDataOrganised[key]+"\n"
    			
  			}

  			outputStr += "\n\n\n";
  			console.log(outputStr);
		}

		$('#entity-result').html(outputStr)
	}

	

	function create_a_class_button(className) {
		if (className != null) {
			$("#buttonArea").append('<button class="classButtons" style="width:100%; background-color:#eb7804; color:white; margin: 5px; border-radius: 4px; outline:none;">'+className+'</button>');
			$('.classButtons').click(function() {
				addTokensToClass(className);
		  		//addToEntResult();
		  		console.log("here");
			});
			numOfButtons++;
			$("[name='my-checkbox']").bootstrapSwitch('disabled',false);
			$("#classname").val('');
		}
	}



	function addTokensToClass(classAnnot) {
		annotatedData.push({classAnnot: words});

		if (classAnnot in annotatedDataOrganised) {
			annotatedDataOrganised[classAnnot] = annotatedDataOrganised[classAnnot].concat(words);
			
		} else {
			annotatedDataOrganised[classAnnot] = words;
			console.log("go here2");
		}

		words = [];
		//console.log("go here3: "+annotatedDataOrganised[classAnnot]);
		updateAllAnnotatedData();
		outputAnnotatedData();
		mark("");
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
		// TO DO THE INVERSE, USE THIS AS REFERENCE:
		// http://stackoverflow.com/questions/8441915/tokenizing-strings-using-regular-expression-in-javascript
	}
	//loadAnnotedText();


	function stringToToken(str) {
		var regex = /[^\s\.,:!?]+/g; // This is "multiple not space characters, which should be searched not once in string"
		var tokens = str.replace(/[^\w\s]|_/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ').split(' ');
		return tokens.splice(1,tokens.length-1);
	}


	function stringToAnnotDataDefault(str) {
		/*  Default refers to putting making everything as object
		*/
		var token = stringToToken(str);
		for (var i = 0; i < token.length; i++) {
								// class | data
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

	

	function updateAnnotedData(key, str) {
		/*
			UPDATES THE KEY OF A HIGHLIGHTING STRING IN OUR ANNOTATION
		*/
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
				console.log("fk: "+key+" "+tmp[i]);
			}
		}
	}
	}

	// switch
	/// for asp toggle (dev mode)
	$("[name='my-checkbox']").bootstrapSwitch({
    	disabled:true
	});
	$("[name='my-checkbox']").bootstrapSwitch(); //initialized somewhere
	$("[name='my-checkbox']").bootstrapSwitch('disabled',true);
	$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
		highlightUnlocked = !highlightUnlocked;
	});


	// SIMULATION
	loadAnnotedText();
	stringToAnnotDataDefault(html);
	updateAllAnnotatedData();
	outputAnnotatedData()
});






