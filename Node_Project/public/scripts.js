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

//Purpose: retrieves values from html file, triggers get method, then triggers display method
async function findAndDisplayAttractions() {
    const inputProvince = document.getElementById('provinceInput').value;
    const inputCity = document.getElementById('cityInput').value;

    console.log(inputCity); // testing
    console.log(inputProvince); //testing
    
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
async function getAttractions(inputProvince, inputCity) {

    // ON THE BACKEND ONLY RETURN NAME, ID, STAR RATING!
    const url = "XYZYYYXYXYZYXYZXYXZ" // TODO: change url
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error();
    }

    const parsedValue = await response.json();
    return parsedValue;
}

//Inputs required: attractions in form of JSON
//Purpose: Displays JSON data in the main page by adding each object into a row
async function displayAttractionsOnTable(attractions) {
    const attractionTable = document.getElementById('attractionresultstable');
    const tableBody = attractionTable.querySelector('tbody');

    //clear before displaying
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    attractions.forEach(attraction => {

        //create row
        const newRow = tableBody.insertRow();

        const nameCell = newRow.insertCell(0);
        nameCell.textContent = attraction.name; // TODO: NOTE THIS IS JUST A PLACEHOLDER, CHANGE LATER OTHERWISE THERE WILL BE BUGS

        const idCell = newRow.insertCell(1);
        idCell.textContent = attraction.id;  // TODO: NOTE THIS IS JUST A PLACEHOLDER, CHANGE LATER OTHERWISE THERE WILL BE BUGS

        const ratingCell = newRow.insertCell(2);
        ratingCell.textContent = attraction.rating; // TODO: NOTE THIS IS JUST A PLACEHOLDER, CHANGE LATER OTHERWISE THERE WILL BE BUGS
    })
}

//Purpose: Extracts attraction data, triggers POST request
async function addNewAttractionSubmit() {
    const name = document.getElementById('insertName').value;
    const lat = document.getElementById('insertLat').value;
    const long = document.getElementById('insertLon').value;
    const open = document.getElementById('insertOpen').value;
    const close = document.getElementById('insertClose').value;
    const description = document.getElementById('insertDescription').value;
    const category = document.getElementById('chooseCat').value;    

    //is this good for id gen?
    const uniqueInt = Math.floor(Math.random() * 10000);
    const activityId = `${name}_${lat}_${long}_${uniqueInt}`;

    //testing
    console.log(name);
    console.log(lat);
    console.log(long);
    console.log(open);
    console.log(close);
    console.log(description);
    console.log(category);

    // TODO: ensure that these json values are good
    const attractionJson = {
        name : name,
        lat : lat,
        long : long,
        open : open,
        close : close,
        description : description,
        category : category,
        id : activityId
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
    const response = await fetch("XYZCYZYZYZYZYZY", {
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
    const response = await fetch("XYZ");

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
        id : activityId,
        newname : newname,
        newlat : newlat,
        newlong : newlong,
        newopen : newopen,
        newclose : newclose,
        newdescription : newdescription,
        newcategory : newcategory
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


// This function resets or initializes the demotable.
// async function resetDemotable() {
//     const response = await fetch("/initiate-demotable", {
//         method: 'POST'
//     });
//     const responseData = await response.json();

//     if (responseData.success) {
//         const messageElement = document.getElementById('resetResultMsg');
//         messageElement.textContent = "demotable initiated successfully!";
//         fetchTableData();
//     } else {
//         alert("Error initiating table!");
//     }
// }

// Inserts new records into the demotable.
// async function insertDemotable(event) {
//     event.preventDefault();

//     const idValue = document.getElementById('insertId').value;
//     const nameValue = document.getElementById('insertName').value;

//     const response = await fetch('/insert-demotable', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             id: idValue,
//             name: nameValue
//         })
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('insertResultMsg');

//     if (responseData.success) {
//         messageElement.textContent = "Data inserted successfully!";
//         fetchTableData();
//     } else {
//         messageElement.textContent = "Error inserting data!";
//     }
// }

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}
