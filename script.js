// URL For Dictionary API
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
// Container to display definitions
const result = document.getElementById("result");
// Sound button for each definition
const sound = document.getElementById("sound");
// Search button
const btn = document.getElementById("search-btn");
// Input field for the word
const inputWordElement = document.getElementById("input-word");

// Holds definitions
let definitions = [];

// Event listener for search button
btn.addEventListener("click", () => {
    let inputWord = inputWordElement.value.toLowerCase();
    // Check if the word is already in the definitions array
    if (definitions.some(def => def.word === inputWord)) {
        alert('This word has already been searched for.');
        return;
    }
    // Fetch data from API
    fetch(`${url}${inputWord}`)
        .then((response) => response.json())
        .then((data) => {
            if (!data[0]) {
                throw new Error('Word not found');
            }
            console.log(data);
            definitions.unshift(data[0]);

            // Save definitions to local storage
            localStorage.setItem('definitions', JSON.stringify(definitions));

            // Update definition list
            updateDefinitions();
            sound.setAttribute("src", data[0].phonetics[0].audio);

            // Clear the input field
            inputWordElement.value = ''; 
        })
        // Display error message for invalid word
        .catch(() => {
            const errorMessage = `<h3 class="error">Couldn't Find The Word</h3>`;
            const errorElement = document.createElement('div');
            errorElement.innerHTML = errorMessage;
        
            // Check if an error message already exists
            const existingError = result.querySelector('.error');
            if (existingError) {
                result.removeChild(existingError);
            }
        
            // Add the error message at the top of the result div
            result.insertBefore(errorElement, result.firstChild);
        
            inputWordElement.value = ''; // Clear the input field
        
            // Remove the error message after 3 seconds
            setTimeout(() => {
                if (result.contains(errorElement)) {
                    result.removeChild(errorElement);
                }
            }, 3000);
        });
});

// Add new definition to top of list
function updateDefinitions() {
    result.innerHTML = '';
    definitions.forEach((data, index) => {
        result.innerHTML += `
        <div class="word">
            <h3>${data.word}</h3>
            <button onclick="playSound(${index})">
                <i class="fas fa-volume-up"></i>
            </button>
            <button class="remove" onclick="removeDefinition(${index})">Remove</button>
        </div>
        <div class="details">
            <p>${data.meanings[0].partOfSpeech}</p>
            <p>/${data.phonetic}/</p>
        </div>
        <p class="word-meaning">
            ${data.meanings[0].definitions[0].definition}
        </p>
        <p class="word-example">
            ${data.meanings[0].definitions[0].example || "No example available."}
        </p>
        `;
    });
}

// Remove the selected definition from the definitions array
function removeDefinition(index) {
    definitions.splice(index, 1);

    // Save definitions to local storage
    localStorage.setItem('definitions', JSON.stringify(definitions));

    updateDefinitions();
}

// Play pronunciation sound
function playSound(index) {
    sound.setAttribute("src", definitions[index].phonetics[0].audio);
    sound.play();
}

const darkModeBtn = document.getElementById("dark-mode-btn");
const container = document.querySelector(".container");

// Change to dark mode
darkModeBtn.addEventListener("click", () => {
    container.classList.toggle("dark-mode");
});

// Allow for "Enter" key to complete search query
inputWordElement.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        btn.click();
    }
});

// Load definitions from local storage when the page loads
window.addEventListener('load', () => {
    const savedDefinitions = localStorage.getItem('definitions');
    if (savedDefinitions) {
        definitions = JSON.parse(savedDefinitions);
        updateDefinitions();
    }
});