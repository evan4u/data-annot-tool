

$(function() {
	// ADD CONTENT IN BODY
	var html = " My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruf My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember."
	$( ".context" ).html(html);

	var annotatedData = [];

	var words = [];

	var mark = function(keyword) {
    	// Determine selected options
	    var options = {};
	    
	    $("input[name='opt[]']").each(function() {	
	    	options[$(this).val()] = $(this).is(":checked");
	    }); 


	  //  options = {
	   // 	'Evan': {'debug': false,
	   // 			'separateWordSearch':true, }, 
	    //	'My': { 'debug': false,
	    //			'separateWordSearch':true, }, 
	    //}
	    //console.log($(this).val());
	    // Updates highlited keywords
	    
	    $(".context").unmark({
	    	done: function() {
	    		console.log(words)
	        	$(".context").mark(words, options);
	    	}
	    });
  	};


	$(".context").mouseup(function() {
		var token = removeSpaces(window.getSelection().toString());
		//var token = window.getSelection().toString();
		if (token != undefined) {

			var r = confirm('Wound you like to highlight '+token);
			if (r == true) {
				
			    words.push(token);
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
			    words.push(str);
			    mark(str);
			}
		}

		$(".input-sm").focus(); // removes auto-highlight caused from initial highlight
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
	        console.log($(this).val());
	        addClassButton($(this).val());
	    } 
	    else if (event.keyCode == 32){
	    	console.log(annotatedData);
	    }
	});

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
	}

	function addTokensToClass(classAnnot) {
		annotatedData.push({classAnnot: words});
	
	}


});
