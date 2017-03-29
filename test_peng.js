

$(function() {
	// ADD CONTENT IN BODY

	var html = " My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruf My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember."
	$( ".context" ).html(html);

	var annotatedData = [];
	var annotatedDataOrganised = {};

	var highlightUnlocked = false; // NEEDS TO FALSE
	var numOfButtons = 0;
	var words = [];


	var mark = function(keyword) {
    	// Determine selected options
	    var options = {'accuracy': "exactly"};
	    
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

		if (numOfButtons > 0) {
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
		  		addToEntResult();
			});
			numOfButtons++;
			$("[name='my-checkbox']").bootstrapSwitch('disabled',false);
			$("#classname").val('');
		}
	}



	function addTokensToClass(classAnnot) {
		annotatedData.push({classAnnot: words});

		if (classAnnot in annotatedDataOrganised) {
			annotatedDataOrganised[classAnnot] = annotatedDataOrganised[classAnnot] + words;
			console.log(annotatedDataOrganised);
		} else {
			annotatedDataOrganised[classAnnot] = words;
		}

		words = [];
		mark("");
	}



	// SIMULATION
	var str = 'B-Peop	Dole\nO	is\nO	at\nO	an\nO	organizational\nO	disadvantage\nO	in\nO	the\nO	South\nO	but\nO	has\nO	had\nO	his\nO	wife\nO	","\nB-Peop	Elizabeth\nO	","\nO	a\nO	native\nO	of\nB-Loc	North/Carolina\nO	","\nO	working\nO	the\nO	region\nO	for\nO	him\nO	.'

	function convertAnnotToText() {
		var classSet = new Set();
		var lines = str.split('\n');
		for(var i = 0;i < lines.length;i++){ // READS LINE BY LINE
			var tokens = lines[i].split(/\t/); // SPLIT INTO TABS
	    	console.log(tokens[1]);
	    	classSet.add(tokens[0]);
		}
		

		classSet.forEach(function(value) {
  			create_a_class_button(value);
  		});
		// TO DO THE INVERSE, USE THIS AS REFERENCE:
		// http://stackoverflow.com/questions/8441915/tokenizing-strings-using-regular-expression-in-javascript
	}
	//convertAnnotToText();



	// switch
	/// for asp toggle (dev mode)
	$("[name='my-checkbox']").bootstrapSwitch({
    	disabled:true
	});
	$("[name='my-checkbox']").bootstrapSwitch(); //initialized somewhere
	$("[name='my-checkbox']").bootstrapSwitch('disabled',true);
	$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
		alert("You must add a class before you can begin to annotate.");
	});
});






