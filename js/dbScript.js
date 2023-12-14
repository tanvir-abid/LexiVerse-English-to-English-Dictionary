import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Your Supabase project details
const supabaseUrl = 'https://axdfzquekxjwlcerwgzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZGZ6cXVla3hqd2xjZXJ3Z3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NDM3NDQsImV4cCI6MjAxNDQxOTc0NH0.Q8OKjG2EeFeVkNFDTIwINem4QyHpp2uuXKkGRQM-62I';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

let searchThisWordBtn = document.getElementById('searchThisWord');
// Function to get a random word from the 'highFrequency300' table
function getRandomWord() {
  try {
    showLoadingAnimation();
    // Check if 'wordOfTheDay' is available in local storage
    const storedWord = localStorage.getItem('wordOfTheDay');

    if(storedWord){
      // If word is available in local storage, check if the date matches the current date
    const wordData = JSON.parse(storedWord);
    const storedDate = new Date(wordData.date);
    const currentDate = new Date();

      if(storedDate.toDateString() === currentDate.toDateString()){
          // If the stored date matches the current date, display the word directly
          const title = "Word of the day";
          const text = `
                <h3><strong>Today's Word: </strong>${wordData.word}</h3>
                <p><strong>Meaning: </strong>${wordData.meaning}</p>
              `;
          hideLoadingAnimation();
          setModalText(title, text);
          searchThisWordBtn.setAttribute('data-search-word', wordData.word);
      }else{
        getWordFromDatabase();
      }
    }else{
      getWordFromDatabase();
    }


  } catch (error) {
    console.error('An error occurred:', error.message);
    setModalText('Error', 'An error occurred: ' + error.message);
  }
}

async function getWordFromDatabase() {
  try {
    const totalRows = await supabase
      .from('highFrequency300')
      .select('count', { count: 'exact' });

    if (totalRows.error) {
      throw new Error('Error fetching total rows: ' + totalRows.error.message);
    }

    const randomOffset = Math.floor(Math.random() * totalRows.data[0].count);

    const { data: randomWord, error } = await supabase
      .from('highFrequency300')
      .select('*')
      .range(randomOffset, randomOffset + 1);

    if (error) {
      throw new Error('Error fetching random word: ' + error.message);
    }

    if (randomWord && randomWord.length > 0) {
      let randomWordIs = randomWord[0];
      let title = 'Word of the day';
      let text = `
        <h3><strong>Today's Word: </strong>${randomWordIs.word}</h3>
        <p><strong>Meaning: </strong>${randomWordIs.meaning}</p>
      `;
      hideLoadingAnimation();
      setModalText(title, text);
      searchThisWordBtn.setAttribute('data-search-word', randomWordIs.word);

      localStorage.removeItem('wordOfTheDay'); // Clear previous data
      // Store word, meaning, and date in local storage
      let todayIs = new Date().toDateString();

      const wordData = {
        word: randomWordIs.word,
        meaning: randomWordIs.meaning,
        date: todayIs,
      };
      localStorage.setItem('wordOfTheDay', JSON.stringify(wordData));
    } else {
      throw new Error('No random word found');
    }
  } catch (err) {
    let title = 'Error';
    let text = `<p>An error occurred: ${err.message}</p>`;
    setModalText(title, text);
  }
}

// Call the function to get a random word
function isFirstTimeOnDay() {
  const storedDate = localStorage.getItem('lastVisitDate');
  const currentDate = new Date().toDateString();

  if (storedDate !== currentDate) {
    localStorage.setItem('lastVisitDate', currentDate);
    return true;
  }

  return false;
}

// Call getWordFromDatabase if it's the first visit of the day
if (isFirstTimeOnDay()) {
  getWordFromDatabase();
}

// Add event listener to 'word-of-the-way' element
const wordOfTheWayElement = document.getElementById('word-of-the-way');
wordOfTheWayElement.addEventListener('click', getRandomWord);


function searchThisWord(){
  let word = searchThisWordBtn.getAttribute('data-search-word');
  //const word = thisWord;
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  
    if (word) {
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
        hideModal();
      })
      .catch(error => {
        // Handle errors here
        console.error('Error fetching data:', error);
      });
    }
}
searchThisWordBtn.addEventListener("click", searchThisWord)