
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