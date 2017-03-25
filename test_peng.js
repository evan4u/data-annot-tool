

$(function() {
	// ADD CONTENT IN BODY

	var html = " My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruf My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember."
	$( ".context" ).html(html);

	var annotatedData = [];
	var annotatedDataOrganised = {};

	var highlightUnlocked = true; // NEEDS TO FALSE
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

		if (highlightUnlocked) {
			var token = removeSpaces(window.getSelection().toString());
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
	        	
	        	var str = range.toString().trim();

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




	function removeSpaces(str) {
		if (typeof(str) == 'string' && str != "") {
			if (str[0] == ' ') {
				str = str.substring(1);
			}
			
			if (str[str.length - 1] == ' ') {
				str = str.substring(0, str.length-1);
			}

			return str;
		}
	}

	var $input = $("input[name='keyword']");
  	//$input.on("input", function() {
  	//	console.log($(this).val());
  	//});

  	$("#inputClass").keyup(function(event){  		
	    if(event.keyCode == 13){
	        // NOT SPACES
	        if (validClassInput($(this).val())) {
	        	addClassButton($(this).val())

	        }
	    } 
	    else if (event.keyCode == 32){
	    	console.log(annotatedData);
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

		return count != str.length && !highlightUnlocked;
	}

	function addClassButton(type) {
  		//Create an input type dynamically.   
  		var element = document.createElement("li");
  		//Assign different attributes to the element. 
  		
  		buttonText = document.createTextNode(type);
  		
	  	element.type = type;
	  	element.value = type; // Really? You want the default value to be the type string?
	  	
	  	//element.name = type; // And the name too?
  		element.onclick = function() { // Note this is a function
  			addTokensToClass($(this).val())
  		};
  		element.appendChild(buttonText);
  		var foo = document.getElementById("classList");
  		element.style.color = "red";
  		//Append the element in page (in span).  
  		foo.appendChild(element);
  		
  		numOfButtons++;
	}

	function addClassButton(type) {
  		//Create an input type dynamically.   
  		var element = document.createElement("button");
  		//Assign different attributes to the element. 
  		
  		buttonText = document.createTextNode(type);
  		
	  	element.type = type;
	  	element.value = type; // Really? You want the default value to be the type string?
	  	
	  	//element.name = type; // And the name too?
  		element.onclick = function() { // Note this is a function
  			addTokensToClass($(this).val())
  		};
  		element.appendChild(buttonText);
  		var foo = document.getElementById("buttonClass");
  		//Append the element in page (in span).  
  		foo.appendChild(element);
  		$('#inputClass').val("");
  		numOfButtons++;
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

	

	function create_a_class(className) {
		if (className != null) {
			var noSpace = className.replace(/\s/g, '');
			$(".dropdown ul").prepend('<li><a class="'+"classButtons"+'">'+className+'</a></li><li class="divider"></li>');
			

			$(".searchbox-div").append('<button style="background-color:black; color:white; margin-left: 5px; border-radius: 4px; outline:none;">'+className+'</button>');

			console.log("cdsd: "+noSpace);
			$('.classButtons').click(function() {
				addTokensToClass(className);
		  		addToEntResult();
			});
		}
	}

	$("#edit" ).click(function() {
		var x;
    	var className=prompt("Please enter class:");
	    if (name != null){
	       create_a_class(className);
	   	}


	});
});






