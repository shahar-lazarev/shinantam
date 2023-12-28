
function showPanePerekOptions(num) {
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

		
		setTimeout(function() { perekBtn.classList.toggle("nav-pane__item--glow"); }, 90);
		setTimeout(function() { perekBtn.classList.toggle("nav-pane__item--glow"); }, 700);
	}
	let blank = document.createElement("div");
	blank.style.cssText = "float: right; width: 80%; height: 40px;";
	section.appendChild(blank);


}

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
	togglePane();

	// TODO: SHOW THE NEW CONTENT
}

// checks if a perek button in the pane is pressed
function listenPerekBtns() {
	panePerekBtns = document.querySelectorAll(".nav-pane__l-section .nav-pane__item");
	for (let perekBtn of panePerekBtns) {
		perekBtn.onclick = function () {
			selectedPerekBtnName = perekBtn.innerHTML;

			let x = document.querySelector(".nav-pane__l-section .nav-pane__item--select")
			if (x !== null) x.classList.toggle("nav-pane__item--select");
			perekBtn.classList.toggle("nav-pane__item--select");

			currentMasechet = selectedMasechetBtnName;
			currentPerek = selectedPerekBtnName;
			switchPerek(currentMasechet, currentPerek);
		}
	}
}

// clicking a masechet button in the pane
function listenMasechetBtns() {
	let paneMishnasBtns = document.querySelectorAll(".nav-pane__seder .nav-pane__item");
	for (let masechetBtn of paneMishnasBtns) {
		masechetBtn.onclick = function () { // if a masechet is clicked in the pane
			selectedMasechetBtnName = masechetBtn.innerHTML; // set the currentMasechet

			// make perek section in pane have active focus
			document.querySelector(".nav-pane__l-section.nav-pane__b-section").classList.add("nav-pane__section--active");

			document.querySelector(".nav-pane__item--select").classList.toggle("nav-pane__item--select");
			masechetBtn.classList.toggle("nav-pane__item--select");

			showPanePerekOptions(masechetToPerekAmount[masechetBtn.innerHTML]);
			listenPerekBtns();
		}
	}
}





