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

function addBreaks(input) {
  let output = input.replace(/\n/g, `<br class="break-up"> `)
  // output = input;
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
    mishnaNumFontSize += increment/2
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

var coll = document.getElementsByClassName("expand");
var i;
// console.log(coll.length);

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
      // content.style.display = "none";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      // content.style.display = "block";
    } 
  });
}


const switchButton = document.getElementById("switch-button");
switchButton.addEventListener("click", makeAcronym)

const plusButton = document.getElementById("plus-button");
plusButton.addEventListener("click", () => {changeFontSize(2)})

const minusButton = document.getElementById("minus-button");
minusButton.addEventListener("click", () => {changeFontSize(-2)})

function mouseOutside(mouse, left, right, top, bottom) {
  return ( !(mouse.clientX > left & mouse.clientX < right & mouse.clientY > top & mouse.clientY < bottom) );
}

// hover to reveal and conceal options for text size.
const optionsButton = document.getElementById("options-button");

optionsButton.addEventListener("mouseover", () => {
  // it'll be changed to true in showOptions() in next line.
  showing = false; 
  showOptions();
});
const optionsContainer = document.getElementById("option-container");
document.getElementById("option-container").addEventListener("mouseleave", () => {
  // it'll be changed to false in showOptions() in next line.
  showing = true; 
  showOptions();
});

optionsButton.addEventListener("click", showOptions);

function displayEntirePerek(perek) {
  // perek.mishnayot.forEach( mishna => {
    
    // document.getElementById("mishna-content").innerHTML = ""
    Object.keys(perek).forEach( key => {
      let mishna = perek[key]
    // console.log(mishna);
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

    // MISHNA TEXT
    const mishnaTextDiv = document.createElement('div');
    mishnaTextDiv.innerHTML = addBreaks(acronymizer(mishna));
    mishnaTextDiv.classList.add("mishna-text");

    // MISHNA TEXT
    const mishnaPrintDiv = document.createElement('div');
    mishnaPrintDiv.innerHTML = addBreaks(acronymizer(mishna));
    mishnaPrintDiv.classList.add("mishna-text");
    mishnaPrintDiv.classList.add("mishna-print");

    document.getElementById("mishna-content").appendChild(mishnaUnitDiv);
    if (key != '') mishnaUnitDiv.appendChild(mishnaNumDiv);
    mishnaUnitDiv.appendChild(mishnaTextDiv);
    mishnaUnitDiv.appendChild(mishnaPrintDiv);
  });

  // ADJUST new elements to current font size
  let mishnas = document.querySelectorAll('.mishna-text');
  for (let mishna of mishnas) {
    mishna.style.fontSize = (mishnaFontSize) + 'px';
  } // END ADJUST
}

document.body.addEventListener("click", function(e) {
  if (mouseOutside(e, 0, 60, window.innerHeight-180, window.innerHeight)) {
    // console.log("OUTSIDE");
    if (showing) { // if currently showing, then it will unshow
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
function currentPage() {return currentMasechet + ' ' + currentPerek} // e.g. אבות ג

function fetchData(masechet) {
  return new Promise((resolve, reject) => {
      // Step 1: Retrieve JSON data from the URL using $.getJSON
      url = `https://raw.githubusercontent.com/shahar-lazarev/shinantam/data/data/${masechet}.json`

      $.getJSON(url, function(jsonData) {
      // Step 2: Use JSON.parse to convert the JSON data to a JavaScript object
      const parsedData = JSON.parse(JSON.stringify(jsonData));

      // Step 3: Resolve the Promise with the parsed data
      resolve(parsedData);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
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
const zraim = [["ברכות", 9], ["פאה", 8], ["דמאי", 7], ["כלאים", 9], ["שביעית", 10], ["תרומות", 11], ["מעשרות", 5], ["מעשר שני", 5], ["חלה", 4], ["ערלה", 3], ["בכורים", 4]]
const moed = [["שבת", 24], ["עירובין", 10], ["פסחים", 10], ["שקלים", 8], ["יומא", 8], ["סוכה", 5], ["ביצה", 5], ["ראש השנה", 4], ["תענית", 4], ["מגילה", 4], ["מועד קטן", 3], ["חגיגה", 3]]
const nashim = [["יבמות", 16], ["כתובות", 13], ["נדרים", 11], ["נזיר", 9], ["סוטה", 9], ["גיטין", 9], ["קידושין", 4]]
const nezikin = [["בבא קמא", 10], ["בבא מציעא", 10], ["בבא בתרא", 10], ["סנהדרין", 11], ["מכות", 3], ["שבועות", 8], ["עדייות", 8], ["עבודה זרה", 5], ["אבות", 6], ["הוריות", 3]]
const kodshim = [["זבחים", 14], ["מנחות", 13], ["חולין", 12], ["בכורות", 9], ["ערכין", 9], ["תמורה", 7], ["כרתות", 6], ["מעילה", 6], ["תמיד", 7], ["מידות", 5], ["קינים", 3]]
const taharot = [["כלים", 30], ["אוהלות", 18], ["נגעים", 14], ["פרה", 12], ["טהרות", 10], ["מקוות", 10], ["נידה", 10], ["מכשירין", 6], ["זבים", 5], ["טבול יום", 4], ["ידיים", 4], ["עוקצים", 3]]
let masechetToPerekAmount = {};
for (let masechet of [zraim, moed, nashim, nezikin, kodshim, taharot]) {
  for (let entry of masechet) { masechetToPerekAmount[entry[0]] = entry[1]; }
}
let nums_eng_to_heb = {1: "א", 2: "ב", 3: "ג", 4: "ד", 5: "ה", 6: "ו", 7: "ז", 8: "ח", 9: "ט", 10: "י",  
                      11: "יא", 12: "יב", 13: "יג", 14: "יד", 15: "טו", 16: "טז", 17: "יז", 18: "יח", 19: "יט", 20: "כ",
                      21: "כא", 22: "כב", 23: "כג", 24: "כד", 25: "כו", 26: "כז", 27: "כז", 28: "כח", 29: "כט", 30: "ל"}

let selectingMasechet = currentMasechet;
let selectingPerek = currentPerek;

function togglePane() {
  var pane = document.getElementsByClassName("nav-pane")[0];
  pane.classList.toggle("nav-pane--hide");
  document.body.classList.toggle("disable-scroll");
  document.querySelector(".nav-pane__l-section.nav-pane__b-section").classList.remove("nav-pane__section--active");  
}

// clicking a masechet button in the pane
paneMishnasBtns = document.querySelectorAll(".nav-pane__seder .nav-pane__item");
for (let masechetBtn of paneMishnasBtns) {
  masechetBtn.onclick = function() {
    selectingMasechet = masechetBtn.innerHTML; // set the currentMasechet

    // make perek section in pane have active focus
    document.querySelector(".nav-pane__l-section.nav-pane__b-section").classList.add("nav-pane__section--active");
    
    document.querySelector(".nav-pane__item--select").classList.toggle("nav-pane__item--select");
    masechetBtn.classList.toggle("nav-pane__item--select");

    showPanePerekOptions(masechetToPerekAmount[masechetBtn.innerHTML]);
    ListenPerekBtns();
  }
}
// clicking a perek button in the pane
function ListenPerekBtns() {
  panePerekBtns = document.querySelectorAll(".nav-pane__l-section .nav-pane__item");
  for (let perekBtn of panePerekBtns) {
    perekBtn.onclick = function() {
      selectingPerek = perekBtn.innerHTML;

      let x = document.querySelector(".nav-pane__l-section .nav-pane__item--select")
      if (x !== null) x.classList.toggle("nav-pane__item--select");
      perekBtn.classList.toggle("nav-pane__item--select");

      currentMasechet = selectingMasechet;
      currentPerek = selectingPerek;
      switchPerek(currentMasechet, currentPerek);
    }
  }
}
ListenPerekBtns();

// In the left section of the pane generate all the perek buttons
// (after selecting a masechet)
function showPanePerekOptions(num) {
  let section = document.querySelector(".nav-pane__b-section.nav-pane__l-section");
  section.innerHTML = "";
  for (let i = 1; i <= num; i++) {
    let perekBtn = document.createElement("div");
    perekBtn.classList.add("nav-pane__item");

    if (currentMasechet==selectingMasechet && nums_eng_to_heb[i] == currentPerek) {
      perekBtn.classList.add("nav-pane__item--select")
    }
    else perekBtn.classList.add("nav-pane__item--unselect");

    perekBtn.innerHTML = nums_eng_to_heb[i];

    section.appendChild(perekBtn);
  }
  let blank = document.createElement("div");
  // blank.style.float = "right";
  // blank.style.width = "80%";
  // blank.style.height = "40px";
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
