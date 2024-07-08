
function showPanePerekOptions(num, makeGlow=true) {
	let section = document.querySelector(".nav-pane__b-section.nav-pane__l-section");
	section.innerHTML = "";
	for (let i = 1; i <= num; i++) {
		let perekBtn = document.createElement("div");
		perekBtn.classList.add("nav-pane__item");

		if (currentMasechet == selectedMasechetBtnName && nums_eng_to_heb[i] == currentPerek) {
			perekBtn.classList.add("nav-pane__item--select")
		} else perekBtn.classList.add("nav-pane__item--unselect");

		perekBtn.innerHTML = nums_eng_to_heb[i];
		section.appendChild(perekBtn);

		if (makeGlow) {
			setTimeout(function() { perekBtn.classList.toggle("nav-pane__item--glow"); }, 90);
			setTimeout(function() { perekBtn.classList.toggle("nav-pane__item--glow"); }, 700);
		}
	}
	let blank = document.createElement("div");
	blank.style.cssText = "float: right; width: 80%; height: 40px;";
	section.appendChild(blank);
	listenPerekBtns();
}

// switch to the perek indicated by "thisMasechet" & "perek"
function switchPerek(thisMasechet, perek) {
	document.getElementById("mishna-content").innerHTML = "";
	currentPerek = perek;

	fetchData(thisMasechet)
		.then(masechet => {
			displayEntirePerek(masechet[currentPage()]) // currentPage() = e.g. אבות א
		})
		.catch(error => {
			console.error(error);
		});


	document.getElementById("mishna-nav").innerHTML = thisMasechet;
	document.getElementById("perek-nav").innerText = perek;
	if (paneIsOpen()) togglePane();

	if (currentPerek == "א" & currentMasechet == "ברכות") {
		let prev = document.getElementsByClassName("arrow-btn")[0];
		prev.classList.add("arrow-btn--off");
	} else {
		let prev = document.getElementsByClassName("arrow-btn")[0];
		prev.classList.remove("arrow-btn--off");
	}
	if (currentPerek == "ג" & currentMasechet == "עוקצים") {
		let prev = document.getElementsByClassName("arrow-btn")[1];
		prev.classList.add("arrow-btn--off");
	} else {
		let prev = document.getElementsByClassName("arrow-btn")[1];
		prev.classList.remove("arrow-btn--off");
	}
	// TODO: SHOW THE NEW CONTENT
}

// checks if a perek button in the pane is pressed
function listenPerekBtns() {
	panePerekBtns = document.querySelectorAll(".nav-pane__l-section .nav-pane__item");
	for (let perekBtn of panePerekBtns) {
		perekBtn.onclick = function () {
			selectedPerekBtnName = perekBtn.innerHTML;

			// let x = document.querySelector(".nav-pane__l-section .nav-pane__item--select")
			// if (x !== null) x.classList.toggle("nav-pane__item--select");
			perekBtn.classList.toggle("nav-pane__item--select");

			currentMasechet = selectedMasechetBtnName;
			currentPerek = selectedPerekBtnName;
			switchPerek(currentMasechet, currentPerek);
			return;
		}
	}
}

// clicking a masechet button in the pane
function listenMasechetBtns() {
	let paneMishnasBtns = document.querySelectorAll(".nav-pane__seder .nav-pane__item");
	for (let masechetBtn of paneMishnasBtns) {
		masechetBtn.onclick = function () { // if a masechet is clicked in the pane
			selectedMasechetBtnName = masechetBtn.innerHTML; // set the currentMasechet

			// FIX MAYBE
			// make perek section in pane have active focus
			// document.querySelector(".nav-pane__l-section.nav-pane__b-section").classList.add("nav-pane__section--active");

			document.querySelector(".nav-pane__item--select").classList.remove("nav-pane__item--select");
			masechetBtn.classList.add("nav-pane__item--select"); // select the new perek

			showPanePerekOptions(masechetToPerekAmount[masechetBtn.innerHTML]);
			// listenPerekBtns();
			return;
		}
	}
}

function deselectCurrentMasechetAndPerekInPane() {
	let currentSelectedBtns = document.querySelectorAll(".nav-pane__item--select");
	for (let btn of currentSelectedBtns) {
		btn.classList.remove("nav-pane__item--select");
	}
}

function selectPaneMasechet (masechet) {
	let paneMishnasBtns = document.querySelectorAll(".nav-pane__seder .nav-pane__item");
	for (let masechetBtn of paneMishnasBtns) {
		if (masechetBtn.innerHTML == masechet) {
			masechetBtn.classList.add("nav-pane__item--select");
			showPanePerekOptions(masechetToPerekAmount[masechetBtn.innerHTML], false);
			return;
		}
	}
}

function selectPanePerek(perek) {
	panePerekBtns = document.querySelectorAll(".nav-pane__l-section .nav-pane__item");
	for (let perekBtn of panePerekBtns) {
		if (perekBtn.innerHTML==perek) {
			perekBtn.classList.add("nav-pane__item--select");
			return;
		}
	}
}

function selectPaneMasechetAndPerek(masechet, perek) {
	selectPaneMasechet(masechet);
	selectPanePerek(perek);
}

function getNextMasechet() {
	for (let i = 0; i < allMasechtot.length; i++) { 
		if (allMasechtot[i] == currentMasechet) return allMasechtot[i+1];
	}
}

function switchToNextPerek() {
	if (nums_eng_to_heb[masechetToPerekAmount[currentMasechet]] == currentPerek) { // last perek in current masechet
		if (currentMasechet == "עוקצים") {} // do nothing // last masechet
		else {
			currentMasechet = getNextMasechet()
			currentPerek = "א";
			switchPerek(currentMasechet, currentPerek);
		}
	} else {
		currentPerek = nums_eng_to_heb[heb_to_nums[currentPerek] + 1];
		switchPerek(currentMasechet, currentPerek);
	}
}

function getPrevMasechet() {
	for (let i = 0; i < allMasechtot.length; i++) { 
		if (allMasechtot[i] == currentMasechet) return allMasechtot[i-1];
	}
}

function switchToPrevPerek() {

	if (currentPerek == "א") { // first perek in current masechet
		if (currentMasechet == "ברכות") {} // last masechet
		else {
			currentMasechet = getPrevMasechet()
			currentPerek = nums_eng_to_heb[masechetToPerekAmount[currentMasechet]];
			switchPerek(currentMasechet, currentPerek);
		}
	} else {
		currentPerek = nums_eng_to_heb[heb_to_nums[currentPerek] - 1];
		switchPerek(currentMasechet, currentPerek);
	}
}



