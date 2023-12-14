function redirectToIndex() {
  window.location.href = 'index.html';
}

// Add click event listeners to the img and h1 elements
const navbarImg = document.querySelector('.navbar-title img');
const navbarHeading = document.querySelector('.navbar-title h1');

navbarImg.addEventListener('click', redirectToIndex);
navbarHeading.addEventListener('click', redirectToIndex);
//-----------------------------------------------------//
const currentDate = new Date(); 
const currentYear = currentDate.getFullYear(); 
document.getElementById('currentYear').innerHTML = currentYear;
//----------------------------------------------------------//

//-------------------------------------------------//
function showLoadingAnimation() {
  const loaderContainer = document.querySelector('.loader-container');
  if (loaderContainer) {
      loaderContainer.style.display = 'flex'; // Display the loader container
  }
}

function hideLoadingAnimation() {
  const loaderContainer = document.querySelector('.loader-container');
  if (loaderContainer) {
      loaderContainer.style.display = 'none'; // Hide the loader container
  }
}
//------------------------------------------------------//
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModal");
var closeBtn = document.getElementById("closeModal");
var closeBtn2 = document.getElementById("closeModalBtn");


// Function to set the text in the modal body
function setModalText(title, text) {
    let modalTitle = document.querySelector(".modal-header h2");
    let modalBody = document.querySelector(".modal-body");

    modalTitle.innerHTML = "";
    modalBody.innerHTML = "";

    modalTitle.innerHTML = title;
    modalBody.innerHTML = text;
    showModal();
}

function showModal() {
    modal.style.display = "block";
    setTimeout(function() {
        modal.querySelector('.modal-content').style.transform = "scale(1)";
    }, 50);
}

function hideModal(){
  modal.querySelector('.modal-content').style.transform = "scale(0)";
  setTimeout(function() {
      modal.style.display = "none";
  }, 300);
}

closeBtn.onclick = function() {
    modal.querySelector('.modal-content').style.transform = "scale(0)";
    setTimeout(function() {
        modal.style.display = "none";
    }, 300);
}

closeBtn2.onclick = function() {
    modal.querySelector('.modal-content').style.transform = "scale(0)";
        setTimeout(function() {
            modal.style.display = "none";
        }, 300);
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.querySelector('.modal-content').style.transform = "scale(0)";
        setTimeout(function() {
            modal.style.display = "none";
        }, 300);
    }
}

//--------------------------------------------------//
