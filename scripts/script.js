// TODO print option
// TODO acronym maker option


function acronymizer(input) {
	var output = "";
	let prevWasLetter = false;
	let prevFirstLetter = false;
	for (const cur of input) {
		if (/[\u0591-\u05C7]/.test(cur)) {
			output += cur;
		}
		else if ([' ', ',', '.', ':', ';', '?', '!', '-', '–',
			'(', ')', '[', ']', '\n', '"', "'", '“', '”', "‘", "’"].indexOf(cur) >= 0) {
			// currently not a letter
			if (prevWasLetter) {
				output += `</span>`
			}
			output += cur;
			prevWasLetter = false; // for the next loop
		}
		else { // it's a letter
			if (!prevWasLetter) { // it's a first letter
				output += cur;
				prevFirstLetter = true;
			}
			else { // it's not a first letter
				if (prevFirstLetter) {
					output += `<span class="nonFirst">`;
					prevFirstLetter = false;
				}
				output += cur;
			}
			prevWasLetter = true; // for the next loop
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



