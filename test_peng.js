

$(function() {
	// ADD CONTENT IN BODY

	var html = " My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruf My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember."
	$( ".context" ).html(html);

	var annotatedData = [];
	var annotatedDataOrganised = {'O': []};
	var annotatedDataReal = [];

	var editMode = false; // NEEDS TO FALSE
	var numOfButtons = 0;
	var words = [];

	var colours = {'O': [255, 255, 255]}
	var tempWords = [];


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
		    	var tmpArr = str.split(" ");
		    	$(".context").mark(tmpArr, options);
		    }
		});
		
  	};


	$(".context").mouseup(function(event) {
		if (Object.size(colours) > 1 && !editMode) {
			var token = cleanString(window.getSelection().toString());
			//var token = window.getSelection().toString();
			if (token != undefined) {
				mark(token); 
			}
			
			$("#classname").focus();
		}

		 // removes auto-highlight caused from initial highlight
	});




	function cleanString(str) {
		/*
		Removes punctation and spaces
		*/
		if (typeof(str) == 'string' && str != "" && str != " ") {

			if (!isLetter(str[0])) {
				str = str.substring(1);
			}
						
			if (!isLetter(str[str.length-1])) {
				str = str.substring(0, str.length-1);
			}
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


	// NEED FOR TABS
	$('.collapse').on('shown.bs.collapse', function(){
	      $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
	}).on('hidden.bs.collapse', function(){
	      $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
	});

	

	function create_a_class_button(className) {
		if (className != null) {
			// random color
			var r = className != 'O' ? Math.floor(Math.random() * (256)) : 255;
			var g = className != 'O' ? Math.floor(Math.random() * (256)) : 255;
			var b = className != 'O' ? Math.floor(Math.random() * (256)) : 255;
			colours[className] = className != 'O' ? [r,g,b] : [255,255,255];
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
			$("#classname").val('');
		}
	}

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
		$(".context").html(str);
	}


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
	$("[name='my-checkbox']").bootstrapSwitch({
    	disabled:true
	});
	$("[name='my-checkbox']").bootstrapSwitch(); //initialized somewhere
	$("[name='my-checkbox']").bootstrapSwitch('disabled',true);
	$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
		if (state) {
			createDeleteButtons();
		} 
		else {
			returnButtonsBackToNormal();
		}
		editMode = state;
	});


	function createDeleteButtons() {
		$(".classButtons").css('background-color', 'red');
		$(".classButtons").css('color', 'white');
	}


	function deleteButton(obj, className) {
		// NEED TO DO A CONFIRMATION DELETE
		var tmp = {};
		if (confirm("Are you sure you want to delete "+className)) {
			for (var i = 0; i  < annotatedDataReal.length; i++) {
				if (annotatedDataReal[i][0] == className) {
					annotatedDataReal[i][0] = "O";
				}
			}
			delete colours[className];
			updateText();
			$(obj).remove();
		}
	}
	

	function returnButtonsBackToNormal() {
		var htmlReg = new RegExp(/&<button.*button>&/); 
		htmlArr = $("#buttonArea").html().split("</button>");
		for (var i = 0; i < htmlArr.length; i++) {
			for (key in colours) {
				if (htmlArr[i].includes(key)) {
					var altClassName = "."+key.replace(/\s/g, '');
					var fontColour = isColorDark(r,g,b) ? 'white' : 'black';
					$(altClassName).css('color', fontColour);
					$(altClassName).css('background-color', makeRGBString(key));
				}
			}
		}
		//$("#buttonArea").html(htmlArr.join(""));
	}

	function makeRGBString(className) {
		var r = colours[className][0];
		var g = colours[className][1];
		var b = colours[className][2];
		return "rgb("+r+","+g+","+b+")";	
	}

	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};


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






