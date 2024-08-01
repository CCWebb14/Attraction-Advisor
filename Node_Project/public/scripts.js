
//Inputs required: elementID of an element that contains text
//Purpose: sanitize text input from an element
//Returns: element text converted to lowercase
function retrieveAndSanitizeText(elementID) {
    return document.getElementById(elementID).value.toLowerCase();
}


//Purpose: retrieves values from html file, triggers get method, then triggers display method
async function findAndDisplayAttractions() {
    const inputProvince = retrieveAndSanitizeText('provinceInput');
    const inputCity = retrieveAndSanitizeText('cityInput');

    if (!inputProvince || !inputCity) {
        alert("enter province or city");
        return;
    }

    try {
        const attractions = await getAttractions(inputProvince, inputCity);
        displayAttractionsOnTable(attractions);
        alert("Filtered data retrieved");
    } catch (error) {
        alert("problem retrieving info");
    }
}

//Inputs required: province and city
//Purpose: Performs a GET request and returns parsed JSON for diplsaying on main page.Throws error for try-catch if not found
//NOTE: response JSON should only contain attraction Name, ID, and Star Rating
async function getAttractions(provinceInput, cityInput) {

    // ON THE BACKEND ONLY RETURN NAME, ID, STAR RATING!
    const response = await fetch('/get-attractions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            province: provinceInput,
            city: cityInput
        })
    })

    if (!response.ok) {
        throw new Error();
    }

    const parsedValue = await response.json();
    return parsedValue.data;
}

//Inputs required: attractions in form of JSON
//Purpose: Displays JSON data in the main page by adding each object into a row
async function displayAttractionsOnTable(attractions) {
    const attractionTable = document.getElementById('attractionresultstable');
    const tableBody = attractionTable.querySelector('tbody');

    //clear old data before displaying
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    attractions.forEach(attraction => {
        // Destructuring assignment of attraction JSON
        const [attractionID, attractionName] = attraction;

        //create row
        const newRow = tableBody.insertRow();

        const nameCell = newRow.insertCell(0);
        nameCell.textContent = attractionName; // TODO: NOTE THIS IS JUST A PLACEHOLDER, CHANGE LATER OTHERWISE THERE WILL BE BUGS

        const idCell = newRow.insertCell(1);
        idCell.textContent = attractionID;  // TODO: NOTE THIS IS JUST A PLACEHOLDER, CHANGE LATER OTHERWISE THERE WILL BE BUGS
    })
}

//Purpose: Extracts attraction data, triggers POST request
async function addNewAttractionSubmit() {
    const name = retrieveAndSanitizeText('insertName')
    const description = retrieveAndSanitizeText('insertDescription');
    const open = retrieveAndSanitizeText('insertOpen');
    const close = retrieveAndSanitizeText('insertClose');
    const lat = document.getElementById('insertLat').value;
    const long = document.getElementById('insertLon').value;
    const category = retrieveAndSanitizeText('chooseCat');
    const province = retrieveAndSanitizeText('insertProv');
    const city = retrieveAndSanitizeText('insertCity');

    // TODO: checking valid inputs, ex 5 decimal places for lat and long

    const attractionJson = {
        name: name,
        description: description,
        open: open,
        close: close,
        lat: lat,
        long: long,
        category: category,
        province: province,
        city: city
    }

    try {
        addAttraction(attractionJson);
        alert("New attraction added!");
    } catch (error) {
        alert('failed to insert data');
    }
}

//Input: Attraction in JSON format
//Purpose: Deliver a POST request to add into database
async function addAttraction(attraction) {

    //TODO: PLUG IN ROUTING AFTER COMPLETING BACKEND
    const response = await fetch("/add-attraction", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attraction)
    });

    if (!response.ok) {
        throw new Error();
    }

    console.log("add successful"); // debugging purposes
}


//Purpose: Fetch,Repopulate, and display table with .sql file data
async function repopulatedata() {

    //TODO: add path to route for default data
    const response = await fetch("/intiate-table");

    if (!response.ok) {
        alert("Repopulation not completed properly");
        return;
    }
    const responseJson = await response.json();
    displayAttractionsOnTable(responseJson); //HELPER FUNCTION ALREADY DEFINED
    alert("Data repopulated!");
}

//Purpose: Counts number of tuples
async function countAttractions() {
    const response = fetch("XYZ");

    if (!response.ok) {
        alert("Count not completed");
    }

    const responseData = response.json();

    alert(`Theres currently ${responseData} number of attractions`);
}

//Purpose: Handles update button press
async function updateAttractionAction() {
    const activityId = document.getElementById('idModify').value;
    const newname = document.getElementById('newinsertName').value;
    const newlat = document.getElementById('newinsertLat').value;
    const newlong = document.getElementById('newinsertLon').value;
    const newopen = document.getElementById('newinsertOpen').value;
    const newclose = document.getElementById('newinsertClose').value;
    const newdescription = document.getElementById('newinsertDescription').value;
    const newcategory = document.getElementById('newchooseCat').value;


    // TODO: ensure that these json values are good
    const attractionJson = {
        id: activityId,
        newname: newname,
        newlat: newlat,
        newlong: newlong,
        newopen: newopen,
        newclose: newclose,
        newdescription: newdescription,
        newcategory: newcategory
    }

    try {
        updateDbAttraction(attractionJson);
        alert('Attraction info successfully updated');
    } catch (error) {
        alert('Attraction failed to update')
    }
}

//Purpose: Executes PUT request to backend to update
// TODO: COMPLETE THIS METHOD
async function updateDbAttraction(attractionJson) {
    const response = await fetch("XYZ", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

//Purpose: Obtains ID to delete and sends DELETE request
async function deleteAttraction() {
    const attractionToDeleteID = document.getElementById('idToDelete');

    try {
        executeDelete(attractionToDeleteID);
        alert("Attraction deleted!")
    } catch (error) {
        alert("not deleted properly");
    }
}

//Inputs: AttractionID string
async function executeDelete(attractionToDeleteID) {
    //TODO: Fill with correct routing
    const response = await fetch("XYZ", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id : attractionToDeleteID})
    })

    if (!response.ok) {
        throw new Error();
    } 
}

//Purpose: Executes GET request with PROJECTIONS with selected checkboxes
async function projectExperiencesCheckbox() {
    const attractionId = document.getElementById("experienceID");
    console.log(attractionId);
    const experienceCheckboxes = document.querySelectorAll('#experienceFilter .form-check-input');
    //note selectedBoxes is an array that will be sent for projection 
    const selectedBoxes = [];

    experienceCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedBoxes.push(checkbox.value);
        }
    });

    if (experienceCheckboxes.length === 0) {
        alert("Please select at least 1 attribute");
        return;
    }

    try {
        const responseData = fetchProjectionExperiences(attractionId, selectedBoxes);
        addExperiencesToDynamicTable(selectedBoxes, responseData);
    } catch (error) {
        alert("Not filtered properly");
    }

}

//Purpose: Sends JSON attributes for a PROJECTION query
async function fetchProjectionExperiences(attractionId, selectedBoxes) {

    const response = await fetch('/project-tables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: attractionId, toSelect: selectedBoxes })
    })

    if (!response.ok) {
        throw new Error();
    }

    return response.json();
}

//Purpose: adds data to table dynamically
// TODO: COMPLETE LATER
async function addExperiencesToDynamicTable(selectedBoxes, responseData) {

    const experienceHeader = document.getElementById("experienceHeader");
    const experienceBody = document.getElementById("experienceBody");

    experienceHeader.innerHTML = '';
    experienceBody.innerHTML = '';

    const headRow = document.createElement('tr');
    selectedBoxes.forEach(boxOption => {
        const headerCell = document.createElement('th');
        headerCell.textContent = boxOption;
        headRow.appendChild(headerCell);
    })
    experienceHeader.appendChild(headRow);

    // responseData.forEach((data) => {
    //     const row = document.createElement('tr');

    // })

}

// Updates names in the demotable.
// async function updateNameDemotable(event) {
//     event.preventDefault();

//     const oldNameValue = document.getElementById('updateOldName').value;
//     const newNameValue = document.getElementById('updateNewName').value;

//     const response = await fetch('/update-name-demotable', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             oldName: oldNameValue,
//             newName: newNameValue
//         })
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('updateNameResultMsg');

//     if (responseData.success) {
//         messageElement.textContent = "Name updated successfully!";
//         fetchTableData();
//     } else {
//         messageElement.textContent = "Error updating name!";
//     }
// }

// // Counts rows in the demotable.
// // Modify the function accordingly if using different aggregate functions or procedures.
// async function countDemotable() {
//     const response = await fetch("/count-demotable", {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('countResultMsg');

//     if (responseData.success) {
//         const tupleCount = responseData.count;
//         messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
//     } else {
//         alert("Error in count demotable!");
//     }
// }

// TODO: REMOVE. DEV ONLY. 
// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("findAttractions").addEventListener("click", findAndDisplayAttractions);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    // fetchAndDisplayUsers();
}
