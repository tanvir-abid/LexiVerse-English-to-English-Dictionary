const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  showLoadingAnimation();
  const searchInput = document.getElementById("search");
  const word = searchInput.value.trim(); // Trim to remove leading/trailing spaces
  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  // Check for empty input
  if (!word) {
    hideLoadingAnimation();
    setModalText('Error', 'Please enter a word.');
    return;
  }

  // Regular expression to check for English word (alphabets only)
  const englishWordRegex = /^[A-Za-z]+$/;
  if (!englishWordRegex.test(word)) {
    hideLoadingAnimation();
    setModalText('Error', 'Please enter a valid English word.');
    return;
  }

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Handle the data here
      console.log(data);
      displayWordInfo(data);
    })
    .catch(error => {
      // Handle errors here
      console.error('Error fetching data:', error);
      hideLoadingAnimation();
      let errorMessage = 'An error occurred.';
      if (error instanceof TypeError) {
        errorMessage = 'Network error occurred. Please check your internet connection.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Failed to fetch data from the server.';
      } else if (error.message.includes('HTTP error!')) {
        errorMessage = `HTTP error! ${error.message.split('Status:')[1]}`;
      }
      setModalText('Error', errorMessage);
    });
});


// function to display word's details //
function displayWordInfo(word) {
  // Append the word container to the result-container
  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "";
  // Assuming 'word' is an array of entries
  word.forEach(entry => {
  // Create a container for each word entry
  const wordContainer = document.createElement("div");
  wordContainer.classList.add("word-container");

  let wordBasicContainer = document.createElement("div");
  wordBasicContainer.classList.add("word-basic-container");
  // Display word and phonetic
  const wordTitle = document.createElement("h2");
  wordTitle.innerHTML = `Word: <span>${entry.word}</span>`;
  wordBasicContainer.appendChild(wordTitle);

  if(entry.phonetic){
    const phoneticParagraph = document.createElement("p");
    phoneticParagraph.textContent = `Phonetic: ${entry.phonetic}`;
    wordBasicContainer.appendChild(phoneticParagraph);
  }
  wordContainer.appendChild(wordBasicContainer);

  // Display phonetics
  let phoneticsContainer = document.createElement("div");
  phoneticsContainer.classList.add("phonetics-container");

  if(entry.phonetics.length > 0){
    const phoneticsTitle = document.createElement("h3");
  phoneticsTitle.textContent = "Phonetics:";
  phoneticsContainer.appendChild(phoneticsTitle);

    const phoneticsList = document.createElement("ul");
  entry.phonetics.forEach((phonetic) => {
  const phoneticItem = document.createElement("li");

  if (phonetic.text) {
    phoneticItem.textContent = `IPA: ${phonetic.text} `; // Note the space after ${phonetic.text}
  }

  // Display audio if available
  if (phonetic.audio) {
    const audioListItem = document.createElement("li");
    const audioElement = document.createElement("audio");
    audioElement.controls = true;
    audioElement.src = phonetic.audio;

    // Create a label for the audio
    const audioLabel = document.createElement("span");
    audioLabel.textContent = "Audio: ";

    // Append the label and audio element to the list item
    audioListItem.appendChild(audioLabel);
    audioListItem.appendChild(audioElement);
    phoneticsList.appendChild(audioListItem);
  }

  phoneticsList.appendChild(phoneticItem);
  });

  phoneticsContainer.appendChild(phoneticsList);
  }
  wordContainer.appendChild(phoneticsContainer);


  // Display meanings
  let meaningDiv = document.createElement("div");
  meaningDiv.classList.add("meaningDiv");

  const meaningsTitle = document.createElement("h3");
  meaningsTitle.textContent = "Meanings:";
  meaningDiv.appendChild(meaningsTitle);

  const meaningsList = document.createElement("ul");

  entry.meanings.forEach((meaning) => {
  const meaningItem = document.createElement("li");

  // Display Part of Speech in h2 tag
  const partOfSpeechHeader = document.createElement("h2");
  partOfSpeechHeader.innerHTML = `<strong>Part of Speech:</strong> ${meaning.partOfSpeech}`;
  meaningItem.appendChild(partOfSpeechHeader);

  // Display definitions
  const definitionsList = document.createElement("ul");
  meaning.definitions.forEach((definition) => {
  const definitionItem = document.createElement("li");
  definitionItem.innerHTML = `<strong>Definition:</strong> ${definition.definition}<br>`;
  definitionsList.appendChild(definitionItem);
  });

  // Display synonyms under the respective part of speech
  if (meaning.synonyms && meaning.synonyms.length > 0) {
  const synonymsItem = document.createElement("li");
  synonymsItem.classList.add("sysnonymElm");
  synonymsItem.innerHTML = `<strong>Synonyms:</strong> ${meaning.synonyms.join(', ')}`;
  definitionsList.appendChild(synonymsItem);
  }

  // Display antonyms under the respective part of speech
  if (meaning.antonyms && meaning.antonyms.length > 0) {
  const antonymsItem = document.createElement("li");
  antonymsItem.classList.add("antonymElm")
  antonymsItem.innerHTML = `<strong>Antonyms:</strong> ${meaning.antonyms.join(', ')}`;
  definitionsList.appendChild(antonymsItem);
  }

  meaningItem.appendChild(definitionsList);
  meaningsList.appendChild(meaningItem);
  });

  meaningDiv.appendChild(meaningsList);
  wordContainer.appendChild(meaningDiv);



  resultContainer.appendChild(wordContainer);
  });
  hideLoadingAnimation();
}
