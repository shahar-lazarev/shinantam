
function togglePane() {
	let pane = document.getElementsByClassName("nav-pane")[0];
	pane.classList.toggle("nav-pane--hide");
	document.body.classList.toggle("disable-scroll");
	document.querySelector(".nav-pane__l-section.nav-pane__b-section").classList.remove("nav-pane__section--active");
	deselectCurrentMasechetAndPerekInPane();
	selectPaneMasechetAndPerek(currentMasechet, currentPerek);
}

function paneIsOpen() {
	let pane = document.getElementsByClassName("nav-pane")[0];
	return !pane.classList.contains("nav-pane--hide");
}

let nowIsAcronym = false;
function makeAcronym() {
	if (showingInputUI & currentSessionInputs.length == 0) {
		return;
	}

	nowIsAcronym = !nowIsAcronym;
	const invLetters = document.querySelectorAll(".nonFirst");
	let newOpacity;
	document.querySelector(".nonFirst").style.opacity == "0" ? newOpacity = "100" : newOpacity = "0";
	invLetters.forEach(letter => {
		letter.classList.toggle("hid");
	})
}

// toggle the (...) button on the bottom left
function toggleOptions() {
	// console.log(window.innerWidth)
	if (window.innerWidth > 550) { return; }
	if (document.getElementById("plus-button").style.bottom == "20px") {
		// if hiding...
		showOptions();
	} else hideOptions();
}

function showOptions() {
	if (window.innerWidth > 550) { return; }
	document.getElementById("personal-button").style.bottom = "230px";
	document.getElementById("print-button").style.bottom = "180px";
	document.getElementById("plus-button").style.bottom = "130px";
	document.getElementById("minus-button").style.bottom = "80px";
}

function hideOptions() {
	if (window.innerWidth > 550) { return; }
	document.getElementById("personal-button").style.bottom = "20px";
	document.getElementById("print-button").style.bottom = "20px";
	document.getElementById("plus-button").style.bottom = "20px";
	document.getElementById("minus-button").style.bottom = "20px";
}

window.addEventListener("resize", function() {
	if (window.innerWidth > 550) {
		document.getElementById("personal-button").style.bottom = "170px";
		document.getElementById("print-button").style.bottom = "120px";
		document.getElementById("plus-button").style.bottom = "70px";
		document.getElementById("minus-button").style.bottom = "20px";
	} else {
		hideOptions();
	}

});

// Expands the text for the "How to use this site" section
var coll = document.getElementsByClassName("expand");
var i;
for (i = 0; i < coll.length; i++) {
	coll[i].addEventListener("click", function () {
		this.classList.toggle("active");

		var content = this.nextElementSibling;
		if (content.style.maxHeight) {
			content.style.maxHeight = null;
		} else { content.style.maxHeight = content.scrollHeight + "px" }
	});
}