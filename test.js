

$(function() {
	// ADD CONTENT IN BODY
	var html = " My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruf My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. My name is Evan and I like to sleep. I study at Macquarie University where I study engineering. Here are some noises animals make: meow, woof, ruff, bark, koo koo, grrrr, moo, ribbit, hsssss, and that is all i can remember."
	$( ".context" ).html(html);


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



  	$("input[name='keyword']").on("input", mark);
  	//$("input[type='checkbox']").on("change", mark);


	$(".context").mouseup(function() {
		var token = removeSpaces(window.getSelection().toString());
		//var token = window.getSelection().toString();
		if (token != undefined) {

			var r = confirm('Wound you like to highlight '+token);
			if (r == true) {
				
			    words.push(" "+token+" ");
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


	// SOMETHING WRONG HERE
	$(".FAKE").click(function(e){
		console.log("here");
        s = window.getSelection();
        var range = s.getRangeAt(0);
        var node = s.anchorNode;
        
        while(range.toString().indexOf(' ') != 0) {                 
        	range.setStart(node,(range.startOffset -1));
        }
         
        range.setStart(node, range.startOffset +1);
        do {
        	range.setEnd(node,range.endOffset + 1);
        } while(range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
        
        var str = range.toString().trim();
        alert(str);
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


});
