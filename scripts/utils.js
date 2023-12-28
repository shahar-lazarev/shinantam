let currentPerek = 'א';
let currentMasechet = 'אבות';
function currentPage() {return currentMasechet + ' ' + currentPerek} // e.g. אבות ג

let selectedMasechetBtnName = currentMasechet;
let selectedPerekBtnName = currentPerek;

let nums_eng_to_heb = {
	1: "א", 2: "ב", 3: "ג", 4: "ד", 5: "ה", 6: "ו", 7: "ז", 8: "ח", 9: "ט", 10: "י",
	11: "יא", 12: "יב", 13: "יג", 14: "יד", 15: "טו", 16: "טז", 17: "יז", 18: "יח", 19: "יט", 20: "כ",
	21: "כא", 22: "כב", 23: "כג", 24: "כד", 25: "כו", 26: "כז", 27: "כז", 28: "כח", 29: "כט", 30: "ל"
}

const zraim = [["ברכות", 9], ["פאה", 8], ["דמאי", 7], ["כלאים", 9], ["שביעית", 10], ["תרומות", 11], ["מעשרות", 5], ["מעשר שני", 5], ["חלה", 4], ["ערלה", 3], ["בכורים", 4]]
const moed = [["שבת", 24], ["עירובין", 10], ["פסחים", 10], ["שקלים", 8], ["יומא", 8], ["סוכה", 5], ["ביצה", 5], ["ראש השנה", 4], ["תענית", 4], ["מגילה", 4], ["מועד קטן", 3], ["חגיגה", 3]]
const nashim = [["יבמות", 16], ["כתובות", 13], ["נדרים", 11], ["נזיר", 9], ["סוטה", 9], ["גיטין", 9], ["קידושין", 4]]
const nezikin = [["בבא קמא", 10], ["בבא מציעא", 10], ["בבא בתרא", 10], ["סנהדרין", 11], ["מכות", 3], ["שבועות", 8], ["עדייות", 8], ["עבודה זרה", 5], ["אבות", 6], ["הוריות", 3]]
const kodshim = [["זבחים", 14], ["מנחות", 13], ["חולין", 12], ["בכורות", 9], ["ערכין", 9], ["תמורה", 7], ["כרתות", 6], ["מעילה", 6], ["תמיד", 7], ["מידות", 5], ["קינים", 3]]
const taharot = [["כלים", 30], ["אוהלות", 18], ["נגעים", 14], ["פרה", 12], ["טהרות", 10], ["מקוות", 10], ["נידה", 10], ["מכשירין", 6], ["זבים", 5], ["טבול יום", 4], ["ידיים", 4], ["עוקצים", 3]]
let masechetToPerekAmount = {}; // **************
for (let masechet of [zraim, moed, nashim, nezikin, kodshim, taharot]) {
	for (let entry of masechet) { masechetToPerekAmount[entry[0]] = entry[1]; }
} // e.g masechetToPerekAmount["ברכות"] = 9