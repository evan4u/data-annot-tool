/* Helper function used to create class buttons */
function create_a_class_button(className, random=true) {
	if (className != null) {
		send_button_data({'className': className,'bcolour': [0,0,0], 'fcolour': [1,1,1]});
		$buttonClassInput.val('');
	}



}

/* maps word to a class, called when class button click */
function addTokensToClass(classAnnot) {
	console.log("here");
	console.log($(this).html())
	if (classAnnot in annotatedDataOrganised) {
		annotatedDataOrganised[classAnnot] = annotatedDataOrganised[classAnnot].concat(words);		
	} else {
		annotatedDataOrganised[classAnnot] = words;
	}
	
	$("#settings-div").focus();
	send_new_annot({'name': classAnnot, 'words': words})
	words = [];
}


function send_button_data(data) {
	$.ajax({
		url: '/default_annotation',
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success: function(json) {
			$("#buttonArea span").html(json['buttons']);
		},
		error: function() {
			alert("SOMETHING IS NOT RIGHT");
		}
	});
}


function send_new_annot(data) {
	$.ajax({
		url: '/update_annotation',
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success: function(json) {
			$(".context").html(json);
		},
		error: function() {
			alert("SOMETHING IS NOT RIGHT");
		}
	});
}

function send_button_delete(data) {
	$.ajax({
		url: '/button_delete',
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success: function(json) {
			//console.log(json)
			console.log(json['buttons']);
			$(".context").html(json['content']);
			$("#buttonArea span").html(json['buttons']);
		},
		error: function() {
			alert("SOMETHING IS NOT RIGHT");
		}
	});
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
		send_button_delete({'name': className})
	}
}


/* helper function that checks if the colour made by (r,g,b) is a dark colour */
function isColorDark(r, g, b){
	var darkness = 1-(0.299*r + 0.587*g + 0.114*b)/255;
	return (darkness < 0.5) ? false : true;
}


function classButtonHandler(obj) {
	if (!editMode) {
		if (words.length > 0) {
			addTokensToClass($(obj).html());
			updateText();
		}
	}
	else {
		if ($(obj).html() != "O") {deleteButton(obj, $(obj).html());}
		else {alert('Deleting default class "O" is not allowed')}
	}

	if ($('.collapse').parent().find(".glyphicon-minus").length == 1) {
		$("#collapseThree").collapse('hide');
	}
}
