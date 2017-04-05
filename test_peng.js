

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

	var colours = {'O': [255, 255, 255]}


	var mark = function(keyword) {
    	// Determine selected options
	    //var options = {'accuracy': "exactly", 'exclude': [',', '.']};
	    var options = {'accuracy': "complementary"};

	    $("input[name='opt[]']").each(function() {	
	    	options[$(this).val()] = $(this).is(":checked");
	    }); 
	    
		$(".context").unmark({
		    done: function() {
		    	if (keyword != "") {
		    		words.push(keyword);
		    	}
		    	console.log(words)
		        $(".context").mark(words, options);
		    }
		});
		
  	};


	$(".context").mouseup(function(event) {

		if (highlightUnlocked) {
			var token = cleanString(window.getSelection().toString());
			//var token = window.getSelection().toString();
			if (token != undefined) {
				var r = confirm('Wound you like to highlight '+token);
				if (r == true) {
				    mark(token);
				} 
			}
			
			$("#classname").focus();
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
			// random color
			var r = className != 'O' ? Math.floor(Math.random() * (256)) : 255;
			var g = className != 'O' ? Math.floor(Math.random() * (256)) : 255;
			var b = className != 'O' ? Math.floor(Math.random() * (256)) : 255;
			colours[className] = className != 'O' ? [r,g,b] : [255,255,255];
			var colour = "rgb("+r+","+g+","+b+")";	
			var fontColour = isColorDark(r,g,b) ? 'white' : 'black';
			$("#buttonArea").append('<button class="classButtons" style="width:100%; background-color:'+colour+'; color:'+fontColour+'; margin: 5px; border-radius: 4px; outline:none;">'+className+'</button>');
			$('.classButtons').click(function() {
				addTokensToClass(className);
		  		updateText();
		  		console.log("here");
			});
			numOfButtons++;
			$("[name='my-checkbox']").bootstrapSwitch('disabled',false);
			$("#classname").val('');
		}
	}

	function updateText() {

		var str = ""
		for (var i = 0; i < annotatedDataReal.length; i++) {
			r = colours[annotatedDataReal[i][0]][0];
			g = colours[annotatedDataReal[i][0]][1];
			b = colours[annotatedDataReal[i][0]][2];
			var colour = "rgb("+r+","+g+","+b+")";	
			var fontColour = isColorDark(r,g,b) ? 'white' : 'black';

			str += "<span class='someToken' style='color:" + fontColour+ "; background-color: "+colour + "'>"+annotatedDataReal[i][1]+"</span> ";
		}
		$(".context").html(str);
	}

	$(document).on('dblclick','.someToken',function(){
		if (typeof window.getSelection != "undefined" && highlightUnlocked) {
   			mark($(this).html());
   		}
   		else {
   			$("#classname").focus();
   		}
	});    	
	

	function isColorDark(r, g, b){
    	var darkness = 1-(0.299*r + 0.587*g + 0.114*b)/255;
    	if(darkness < 0.5) {
        	return false;
    	}
    	else {
        	return true; 
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
		mark("");
		//console.log("go here3: "+annotatedDataOrganised[classAnnot]);
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






