
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

// Detect initial page load
window.addEventListener('load', onHashChange);

// Detect back/forward navigation
window.addEventListener('hashchange', onHashChange);

let prevHash = window.location.hash;
function navigateTo(hash) {
	prevHash = window.location.hash; // set the previous hash
	window.location.hash = hash; // new hash

	if (hash == "") {
		currentMasechet = "אבות";
		currentPerek = "א";
		switchPerek(currentMasechet, currentPerek);
	}
}

function onHashChange()	{
	const url = decodeURI(window.location.href);
	// http://127.0.0.1:5501/#/אבות-ש
	let hash = window.location.hash;

	if (hash == "#/custom") {
		if (!showingInputUI) displayInputUI();
		return;
	}

	if (hash != "" && hash.substring(0,2) != "#/") {
		// window.history.replaceState(null, "", "");
		// window.location.href = "";
		navigateTo("");
		return;
	}

	hash = decodeURIComponent(hash.substring(2));

	if (hash == "") {
		navigateTo("");
	}
	else {
		let masechet = hash.split("-")[0];
		let perek = hash.split("-")[1];

		if (allMasechtot.includes(masechet)) {

			if (!heb_to_nums[perek]|| masechetToPerekAmount[masechet] < heb_to_nums[perek]) { // abnormal perek
				// window.location.href = "";
				navigateTo("");

			} else { // normal masechet & normal perek
				// console.log(`${currentMasechet} == ${masechet} && ${currentPerek} == ${perek}`);
				// if (currentMasechet == masechet && currentPerek == perek) return;
				currentMasechet = masechet;
				currentPerek = perek;
				
				// navigateTo(`#/${masechet}-${perek}`);
				switchPerek(currentMasechet, currentPerek);
			}
		} else { 
			// window.history.pushState({additionalInformation: `Update to home`}, "", "");
			navigateTo("");
		}
	}
	
}

// switch to the perek indicated by "thisMasechet" & "perek"
function switchPerek(thisMasechet, perek) {
	fetchData(thisMasechet)
		.then(masechet => {
			document.getElementById("mishna-content").innerHTML = "";
			currentPerek = perek;
			document.getElementById("loading").style.display="none";
			displayEntirePerek(masechet[currentPage()]) // currentPage() = e.g. אבות א
		})
		.catch(error => {
			console.error(error);
		});


	document.getElementById("mishna-nav").innerHTML = thisMasechet;
	document.getElementById("perek-nav").innerText = perek;
	if (paneIsOpen()) togglePane();
	if (showingInputUI) displayInputUI();

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

	const currentHash = decodeURI(window.location.hash);
	const nextURL = `#/${thisMasechet}-${perek}`;
	if (!(currentHash == "" && nextURL == "#/אבות-א")) {
		const nextTitle = 'Shinantam';
		const nextState = { additionalInformation: `Update to ${thisMasechet} ${perek}` };
	
		// window.history.pushState(nextState, `${thisMasechet} ${perek}`, nextURL);
		navigateTo(nextURL);
	}
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
			navigateTo(`#/${currentMasechet}-${currentPerek}`);
			// switchPerek(currentMasechet, currentPerek);
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
			navigateTo(`#/${currentMasechet}-${currentPerek}`);
			// switchPerek(currentMasechet, currentPerek);
		}
	} else {
		currentPerek = nums_eng_to_heb[heb_to_nums[currentPerek] + 1];
		navigateTo(`#/${currentMasechet}-${currentPerek}`);
		// switchPerek(currentMasechet, currentPerek);
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
			navigateTo(`#/${currentMasechet}-${currentPerek}`);
			// switchPerek(currentMasechet, currentPerek);
		}
	} else {
		currentPerek = nums_eng_to_heb[heb_to_nums[currentPerek] - 1];
		navigateTo(`#/${currentMasechet}-${currentPerek}`);
		// switchPerek(currentMasechet, currentPerek);
	}
}



