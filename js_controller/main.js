
$(function() {
$contextArea.html(html);

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



// switch
$("[name='my-checkbox']").bootstrapSwitch({
	disabled:true
});
$("[name='my-checkbox']").bootstrapSwitch(); //initialized somewhere
$("[name='my-checkbox']").bootstrapSwitch('disabled',true);
$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
	editMode = state;
});



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


