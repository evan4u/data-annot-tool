
$(function() {

/** Highlights clicked or highlighted word */
$contentArea.mouseup(function(event) {
	if (!editMode) {
		var token = cleanString(window.getSelection().toString());
		if (token != undefined) {
			if (selection_mode == "relation") {

				if (words.length <= 1) {
					mark(words, $contentArea, token); 
				} else {
					alert("Only "+(words.length+1)+" tokens were selection. You must highlight 2 unique tokens.");
				}
			}
			else {
				mark(words, $contentArea, token); 
			}
		}
		$buttonClassInput.focus();
	}
});

/** Gets size of a javascript object */
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
        if (validClassInput($(this).val()) && selection_mode == "class") {
        	create_a_class_button($(this).val());
        } else if (validClassInput($(this).val())){
        	create_a_relation_button($(this).val());
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

// SIMULATION

function loadAnnotedText(str) {
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


// switch
$("[name='my-checkbox']").bootstrapSwitch(); //initialized somewhere
$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
	editMode = state;
});


$("#uploadinput").change(function(event) {
	this.form.submit();
});



$('.collapse').on('shown.bs.collapse', function() {
	get_annotated_results();
	$(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
}).on('hidden.bs.collapse', function() {
	$(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
});


function get_annotated_results() {
	console.log("results...");
	$.ajax({
		url: '/annotated_results',
		type: 'GET',
		contentType: 'application/json',
		success: function(annot_results) {
			$result.html(annot_results);
		},
		error: function() {
			alert("SOMETHING IS NOT RIGHT");
		}
	});
}

$(".undo").on('click', function() {
	words.pop();
	mark(words, $contentArea, ""); 
});


$("#download").on('click', function() {
	get_annotated_results();
	
	var a = document.createElement("a");
	document.body.appendChild(a);
	
	// DELAY IS SET SO RESULT IS UPDATED FIRST
	setTimeout(function sample() {
		var annot_output = $("#result").html();	
	  	var file = new Blob([annot_output], {type: 'text/plain'});
	  	a.href = window.URL.createObjectURL(file);
	  	a.download = "result.txt"
	  	a.click()
	  	window.URL.revokeObjectURL(a.href);
	}, 1000)
});


$("#relationmode").on('click', function() {
	selection_mode = "relation"
	$("label[for='classname']").text("Add Relation:");
	$.ajax({
		url: '/switch_to_relation',
		type: 'GET',
		contentType: 'application/json',
		success: function(json) {
			$buttonArea.html(json['buttons']);
		},
		error: function() {
			alert("SOMETHING IS NOT RIGHT");
		}
	});});

$("#classmode").on('click', function() {
	selection_mode = "class"
	$("label[for='classname']").text("Add Class:");
	$.ajax({
		url: '/switch_to_class',
		type: 'GET',
		contentType: 'application/json',
		success: function(json) {
			console.log(json['content'])
			$contentArea.html(json['content']);
			$buttonArea.html(json['buttons']);
		},
		error: function() {
			alert("SOMETHING IS NOT RIGHT");
		}
	});	
});



});

function saveButton() {
	var filename = prompt("Save as....");
	if (filename != "") {
		annot_output = $result.html()

		json = {'filename': filename, 'annot_output': annot_output}

		$.ajax({
			url: '/save',
			type: 'POST',
			data: JSON.stringify(json),
			contentType: 'application/json',
			success: function(annot_results) {
				alert("Save Complete")
			},
			error: function() {
				alert("SOMETHING IS NOT RIGHT");
			}
		});
	}
}



