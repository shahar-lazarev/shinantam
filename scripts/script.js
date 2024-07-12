// TODO print option
// TODO acronym maker option

function isHebrewLetter(letter) {
	if (isHebrewVowel(letter)) return false; // vowel
	if ((/[\u0590-\u05FF]/).test(letter)) return true; // letters and vowels
}

function textIsHebrew(text) {
	for (let letter of text) {
		if (letter) {
			if (isHebrewLetter(letter)) { // Hebrew Unicode range
				return true;
			} else if (!isPunctuation(letter)) return false;
		} 
	}
	// reached the end - so only punctuation --> return true (so default is rtl)
	return true;
}

function isHebrewVowel(letter) {
	return (/[\u0591-\u05C7]/.test(letter));
}

function isPunctuation(letter) {
	return [' ', ',', '.', ':', ';', '?', '!', '-', '–',
		'(', ')', '[', ']', '\n', '"', "'", '“', '”',
		 "‘", "’", "״"].indexOf(letter) >= 0;
}

function isPossibleLetter(letter) {
	return letter == '"' || letter == "'";
}
	
function isLetter(letter) {
	return !isHebrewVowel(letter) && !isPunctuation(letter);
}

function acronymizer(text) {
	var output = "";
	let prevWasLetter = false;
	let prevFirstLetter = false;
	for (let i = 0; i < text.length; i++) {
		const cur = text[i];
		if (isHebrewVowel(cur)) { // if it's a Hebrew vowel
			output += cur;

		} else if ((!isPunctuation(cur)) || (isPossibleLetter(cur) && prevWasLetter && i+1 < text.length && isLetter(text[i+1]))) {
			if (!prevWasLetter) { // it's right now a first letter
				output += cur;
				prevFirstLetter = true;
			}
			else { // if the prev was a letter - then now it's not a first letter
				if (prevFirstLetter) {
					output += `<span class="nonFirst">`;
					prevFirstLetter = false;
				}
				output += cur;
			}
			prevWasLetter = true; // for the next loop

		} else if (isPunctuation(cur)) { 
			// currently not a letter			
			if (prevWasLetter) {
				output += `</span>`
			}
			output += cur;
			prevWasLetter = false; // for the next loop
		}
	}
	return output;
}

function addBreaks(input) {
	let output = input.replace(/\n/g, `<br class="break-up"> `)
	// output = input;
	return output;
}


let mishnaFontSize = 26;
let mishnaNumFontSize = 16;
let mishnaNumRMargin = 5;
let minMishnaFontSize = 12;
let maxMishnaFontSize = 40;

function changeFontSize(increment) {
	// MISHNA TEXT
	if (!(increment > 0 && mishnaFontSize >= maxMishnaFontSize) &&
		!(increment < 0 && mishnaFontSize <= minMishnaFontSize)) {
		mishnaFontSize += increment;
		let mishnas = document.querySelectorAll('.mishna-text');
		for (let mishna of mishnas) {
			mishna.style.fontSize = (mishnaFontSize) + 'px';
		}

	}

	// MISHNA NUM
	if (increment > 0 && mishnaNumFontSize <= 20 ||
		increment < 0 && mishnaNumFontSize >= 14) {
		mishnaNumFontSize += increment / 2
		let mishnaNums = document.querySelectorAll('.mishna-num');
		for (let mn of mishnaNums) {
			mn.style.fontSize = (mishnaNumFontSize) + 'px';
			// mn.style.right = (26-mishnaNumFontSize) + 'px';
		}
	}

	// MISHNA UNIT PADDING & MARGINS
	// let padding = (12/26*mishnaFontSize) + 'px';
	// let margin = (12/26*mishnaFontSize) + 'px';
	// console.log(padding);
	// for (let mishna of mishnas) {
	//   mishna.style.padding = padding  + ' 15px ' + padding +  ' 5px';
	//   mishna.style.marginBottom = margin;
	// }
}


// document.getElementById("mishna-content").innerHTML = "";
let showingInputUI = false; // initialization (when website opens)
function displayInputUI() {
	if (!showingInputUI) { // it will now enter the input-UI
		document.getElementById("mishna-content").innerHTML = "";

		const textArea = document.createElement('textarea');
		textArea.id = "textarea";
		textArea.placeholder = "הוסף כל טקסט שתרצה...  ...Add any text you want"
		

		const submitTextArea = document.createElement('button');
		submitTextArea.id = "textarea-submit-btn";
		submitTextArea.addEventListener("click", submitTextAreaInput)
		submitTextArea.innerText = "שלח / Submit"

		const mishnaUnitDiv = document.createElement('div');
		mishnaUnitDiv.classList.add("mishna-unit");

		mishnaUnitDiv.appendChild(textArea);
		// mishnaUnitDiv.appendChild(document.createElement("br"));
		mishnaUnitDiv.appendChild(submitTextArea);

		document.getElementById("mishna-content").appendChild(mishnaUnitDiv);
		// document.getElementById("mishna-content").appendChild(textArea);
		// document.getElementById("mishna-content").appendChild(document.createElement("br"));
		// document.getElementById("mishna-content").appendChild(submitTextArea);

		adjustTextAreaDirection();


		for (entry of currentSessionInputs) {
			submitTextAreaInputWithText(entry);
		}

		showingInputUI = true;
		document.getElementById("personal-button").classList.add("personal-button--active");

	} else { // it will now exit the input-UI
		document.getElementById("mishna-content").innerHTML = "";
		fetchData(currentMasechet)
		.then(masechet => {
			displayEntirePerek(masechet[currentPage()]) // currentPage() = e.g. אבות א
		})
		.catch(error => {
			console.error(error);
		});

		showingInputUI = false;
		document.getElementById("personal-button").classList.remove("personal-button--active");

	}

}

let currentSessionInputs = []

function submitTextAreaInput() {
	let inputText = document.getElementById("textarea").value;
	if (inputText == "") return;

	currentSessionInputs.push(inputText);

	submitTextAreaInputWithText(inputText);
}

function submitTextAreaInputWithText(text) {
	if (nowIsAcronym) makeAcronym(); // change away from acronym to make sure everything is in the 'standard state' when adding a new text

	const mishnaUnitDiv = document.createElement('div');
	mishnaUnitDiv.classList.add("mishna-unit");

	const mishnaTextDiv = document.createElement('div');
	mishnaTextDiv.innerHTML = addBreaks(acronymizer(text));
	mishnaTextDiv.classList.add("mishna-text");
	if (!textIsHebrew(text)) { //
		console.log("HELLO")
		mishnaTextDiv.style.direction = "ltr";
		mishnaTextDiv.style.paddingLeft = "15px";
	}

	// MISHNA TEXT PRINT
	const mishnaPrintDiv = document.createElement('div');
	mishnaPrintDiv.innerHTML = addBreaks(acronymizer(text));
	mishnaPrintDiv.classList.add("mishna-text");
	mishnaPrintDiv.classList.add("mishna-print");
	if (!isHebrewLetter(text.charAt(0))) mishnaPrintDiv.style.direction = "ltr";

	// mishna-content --> misha-unit --> div (mishnaText)
	mishnaUnitDiv.appendChild(mishnaTextDiv);
	mishnaUnitDiv.appendChild(mishnaPrintDiv);

	document.getElementById("mishna-content").appendChild(mishnaUnitDiv);

	// ADJUST new elements to current font size
	let mishnas = document.querySelectorAll('.mishna-text');
	for (let mishna of mishnas) {
		mishna.style.fontSize = (mishnaFontSize) + 'px';
	} // END ADJUST

	document.getElementById("textarea").value = "";
}

function adjustTextAreaDirection() {
	const textarea = document.getElementById('textarea');
	console.log("FOUND");
	console.log(textarea);

	textarea.addEventListener('input', function() {
		console.log("RUNNINGGGGG");
		if (textIsHebrew(textarea.value.trim())) textarea.style.direction = 'rtl';
		else textarea.style.direction = 'ltr';
		// const text = textarea.value.trim();
		// for (let letter of text) {
		// 	if (letter) {
		// 		if (isHebrewLetter(letter)) { // Hebrew Unicode range
		// 			textarea.style.direction = 'rtl';
		// 			return;
		// 		} else if (!isPunctuation(letter)) {
		// 			textarea.style.direction = 'ltr';
		// 			return;
		// 		}
		// 	} else {
		// 		textarea.style.direction = 'ltr'; // Default to ltr if empty or no valid first char
		// 	}

		// }
	})

}

function addMishnaUnitBlocks(text) {
	const mishnaUnitDiv = document.createElement('div');
	mishnaUnitDiv.classList.add("mishna-unit");

	const mishnaTextDiv = document.createElement('div');
	mishnaTextDiv.innerHTML = addBreaks(acronymizer(t));
	mishnaTextDiv.classList.add("mishna-text");

	if (!textIsHebrew) mishnaTextDiv.style.direction = "ltr";

	mishnaUnitDiv.appendChild(mishnaTextDiv);

	document.getElementById("mishna-content").appendChild(mishnaUnitDiv);
}

function displayEntirePerek(perek) {

	Object.keys(perek).forEach(key => {
		let mishna = perek[key]
		// mishna unit
		// mishna num
		// mishna text

		// MISHNA UNIT
		const mishnaUnitDiv = document.createElement('div');
		mishnaUnitDiv.classList.add("mishna-unit");

		// MISHNA NUM
		const mishnaNumDiv = document.createElement('div');
		mishnaNumDiv.innerText = key;
		if (key != '') {
			mishnaNumDiv.classList.add("mishna-num");
		}

		// MISHNA TEXT WEBSITE
		const mishnaTextDiv = document.createElement('div');
		mishnaTextDiv.innerHTML = addBreaks(acronymizer(mishna));
		mishnaTextDiv.classList.add("mishna-text");
		// mishnaTextDiv.classList.add("mishna-site");

		// MISHNA TEXT PRINT
		const mishnaPrintDiv = document.createElement('div');
		mishnaPrintDiv.innerHTML = addBreaks(acronymizer(mishna));
		mishnaPrintDiv.classList.add("mishna-text");
		mishnaPrintDiv.classList.add("mishna-print");
		
		// // MISHNA TEXT PRINT 2
		// const mishnaPrintDiv2 = document.createElement('div');
		// mishnaPrintDiv2.innerHTML = addBreaks((mishna));
		// mishnaPrintDiv2.classList.add("mishna-text");
		// mishnaPrintDiv2.classList.add("mishna-print");

		document.getElementById("mishna-content").appendChild(mishnaUnitDiv);
		if (key != '') mishnaUnitDiv.appendChild(mishnaNumDiv);
		mishnaUnitDiv.appendChild(mishnaTextDiv);
		mishnaUnitDiv.appendChild(mishnaPrintDiv);
		// mishnaUnitDiv.appendChild(mishnaPrintDiv2);
	});

	// ADJUST new elements to current font size
	let mishnas = document.querySelectorAll('.mishna-text');
	for (let mishna of mishnas) {
		mishna.style.fontSize = (mishnaFontSize) + 'px';
	} // END ADJUST
}

var doubleTouchStartTimestamp = 0;
document.addEventListener("touchstart", function (event) {
	var now = +(new Date());
	if (doubleTouchStartTimestamp + 1000 > now) {
		event.preventDefault();
	};
	doubleTouchStartTimestamp = now;
});

// Make sure the right-handed text is "full" and not Rashei Teivot before print
// window.addEventListener("beforeprint", () => {
// 	if (document.querySelector(".hid").style.opacity == "0") {
// 		makeAcronym();
// 		onafterprint = () => { makeAcronym(); };
// 	} else { onafterprint = () => {}; }
// })


/* data: {Brachot A: {A: מאימתי..., B: מאימיתי קורין...,.}, 
					Brachot B: {A: הָיָה קוֹרֵא בַתּוֹרָה..., B: אֵלּוּ הֵן בֵּין...,},
					...
				} */
function fetchData(masechet) {
	return new Promise((resolve, reject) => {
		// Step 1: Retrieve JSON data from the URL using $.getJSON
		url = `https://raw.githubusercontent.com/shahar-lazarev/shinantam/data/data/${masechet}.json`;

		$.getJSON(url, function (jsonData) {
			// Step 2: Use JSON.parse to convert the JSON data to a JavaScript object
			const parsedData = JSON.parse(JSON.stringify(jsonData));

			// Step 3: Resolve the Promise with the parsed data
			resolve(parsedData);
		})
			.fail(function (jqXHR, textStatus, errorThrown) {
				// Step 4: Reject the Promise with the error information
				reject(`Error: ${textStatus}, ${errorThrown}`);
			});
	});
}


fetchData("אבות")
	.then(masechet => {
		displayEntirePerek(masechet[currentPage()]) // currentPage = e.g. אבות ג
	})
	.catch(error => {
		console.error(error);
	});


window.addEventListener("load", () => {
	document.getElementById("cover").style.display = "none";
});

//////////////////////////
// PANE & MISHNA SELECTION

listenMasechetBtns();
listenPerekBtns();

// In the left section of the pane generate all the perek buttons
// (after selecting a masechet)



