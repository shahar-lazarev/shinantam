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
    else if ([' ', ',', '.', ':', ';', '?', '!', '-', '–',')', '(', '\n'].indexOf(cur) >= 0) {
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
          output += `<span class="hid">`;
          prevFirstLetter = false;
        }
        output += cur;
      }
      prevWasLetter = true; // for the next loop
    }
  }
  return output;
}
let opacityState = "100%";
let displayState = "inline;"
let bgColor = "black";
function makeAcronym() {
  const invLetters = document.querySelectorAll(".hid");
  if (opacityState == "100%") {
    opacityState = "0%";
    // displayState = "none"
  } else {
    opacityState = "100%"
    // displayState = "inline"
  }
  invLetters.forEach(letter => {
    letter.style.opacity = opacityState;
    // letter.style.display = displayState;
  })

  // const mishnas = document.querySelectorAll(".mishna");
  // mishnas.forEach(mish => {
  //   console.log(mish.offsetHeight);
  // })
}

let mishnaFontSize = 26;
let mishnaNumFontSize = 16;
let mishnaNumRMargin = 5;

function changeFontSize(increment) {
  if (increment > 0 && mishnaFontSize >= 40) return;
  if (increment < 0 && mishnaFontSize <= 20) return;
  mishnaFontSize += increment;
  let mishnas = document.querySelectorAll('.mishna-text');
  for (let mishna of mishnas) {
    mishna.style.fontSize = (mishnaFontSize) + 'px';
  }

  if (increment > 0 && mishnaNumFontSize >= 20) return;
  if (increment < 0 && mishnaNumFontSize <= 14) return;
  mishnaNumFontSize += increment/2
  let mishnaNums = document.querySelectorAll('.mishna-num');
  for (let mn of mishnaNums) {
    mn.style.fontSize = (mishnaNumFontSize) + 'px';
    mn.style.right = (26-mishnaNumFontSize) + 'px';
  }
}

let showingPerakim = false;
function showPerakim() {
  if (!showingPerakim) {
    // document.getElementById("all-perek").style.width = "100%";
    // document.getElementById("all-perek").style.height = "auto";
    document.getElementById("all-perek").style.display = "inline";
    showingPerakim = true;
  } else {
    // document.getElementById("all-perek").style.width = "0";
    // document.getElementById("all-perek").style.height = "0";
    document.getElementById("all-perek").style.display = "none";
    showingPerakim = false;
  }
}

let showing = false;
function showOptions() {
  let plus, minus;
  if (!showing) {
    plus = "130px";
    minus = "80px";
  } else {
    plus = minus = "20px";
  }
  showing = !showing;
  document.getElementById("plus-button").style.bottom = plus;
  document.getElementById("minus-button").style.bottom = minus;
}


const switchButton = document.getElementById("switch-button");
switchButton.addEventListener("click", makeAcronym)

const plusButton = document.getElementById("plus-button");
plusButton.addEventListener("click", () => {changeFontSize(2)})

const minusButton = document.getElementById("minus-button");
minusButton.addEventListener("click", () => {changeFontSize(-2)})

const optionsButton = document.getElementById("options-button");
optionsButton.addEventListener("click", showOptions);

function displayEntirePerek(perek) {
  perek.mishnayot.forEach( mishna => {
    // mishna unit
    // mishna num
    // mishna text
    const mishnaUnitDiv = document.createElement('div');
    mishnaUnitDiv.classList.add("mishna-unit");

    const mishnaNumDiv = document.createElement('div');
    mishnaNumDiv.innerText = mishna.num;
    if (mishna.num != '') {
      mishnaNumDiv.classList.add("mishna-num");
    }

    const mishnaTextDiv = document.createElement('div');
    mishnaTextDiv.innerHTML = acronymizer(mishna.text);
    mishnaTextDiv.classList.add("mishna-text");

    document.getElementById("mishna-content").appendChild(mishnaUnitDiv);
    if (mishna.num != '') mishnaUnitDiv.appendChild(mishnaNumDiv);
    mishnaUnitDiv.appendChild(mishnaTextDiv);
  });
}

function switchPerek(text) {
  console.log(text);
  document.getElementById("mishna-content").innerHTML = "";

  currentPerek = text;
  console.log(currentPage())
  displayEntirePerek(mishnaData[currentPage()]);
  showPerakim();

  document.getElementById("perek-nav").innerText = text;
}

function mouseOutside(mouse, left, right, top, bottom) {
  return ( !(mouse.clientX > left & mouse.clientX < right & mouse.clientY > top & mouse.clientY < bottom) );
}

document.body.addEventListener("click", function(e) {
  if (mouseOutside(e, 0, 60, window.innerHeight-180, window.innerHeight)) {
    // console.log("OUTSIDE");
    if (showing) {
      showOptions();
    }
  }
  if (showingPerakim) {
    const rect = document.getElementById("all-perek").getBoundingClientRect();
    if (mouseOutside(e, rect.left, rect.right, 0, rect.bottom)) {
      showPerakim();
    }
  }
});

window.addEventListener("scroll", function(e) {
  if (mouseOutside(e, 0, 60, window.innerHeight-180, window.innerHeight)) {
    // console.log("OUTSIDE");
    if (showing) {
      showOptions();
    }
  }
  if (showingPerakim) {
    const rect = document.getElementById("all-perek").getBoundingClientRect();
    if (mouseOutside(e, rect.left, rect.right, 0, rect.bottom)) {
      showPerakim();
    }
  }
});

var doubleTouchStartTimestamp = 0;
document.addEventListener("touchstart", function(event){
    var now = +(new Date());
    if (doubleTouchStartTimestamp + 500 > now){
        event.preventDefault();
    };
    doubleTouchStartTimestamp = now;
});

let currentPerek = 'א';
let currentMasechet = 'אבות';
function currentPage() {return currentMasechet + ' ' + currentPerek}

displayEntirePerek(mishnaData[currentPage()]);

