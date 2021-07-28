$("#login-button").on("click", function () {

  Swal.fire({
    title: 'Comming Soon!!',
    text: 'Login functionality is not yet enabled.\nIt will be started shortly',
    icon: 'success',
    confirmButtonText: 'Cool'
  })
})

$("#blog").on("click", function () {

  Swal.fire({
    title: 'Comming Soon!!',
    text: 'Blog will be started shortly',
    icon: 'success',
    confirmButtonText: 'Okay!'
  })
})

$("#faq").on("click", function () {

  Swal.fire({
    title: 'Comming Soon!!',
    text: "FAQ's will be displayed shortly",
    icon: 'success',
    confirmButtonText: 'Cool'
  })
})

$("#pricing").on("click", function () {

  Swal.fire({
    title: 'Comming Soon!!',
    text: 'Prices will be available within a short time!',
    icon: 'success',
    confirmButtonText: 'Cool'
  })
})
$("#features").on("click", function () {

  Swal.fire({
    title: 'Comming Soon!!',
    text: 'Features will be available within a short time!',
    icon: 'success',
    confirmButtonText: 'Cool'
  })
})
$(document).scroll(function() {
   if($(window).scrollTop() != 0) {
     console.log("asdf");
     $("div.container-fluid").css("background-color", "white");
      $("#section-0").css("background-color", "white");
      $("#login-button").css("background-color", "white");
      $("#logo").attr("src", "logo-2.png");
      $("a.nav-link.active").css("color", "black");
}
else{
  $("div.container-fluid").css("background-color", "#222222");
   $("#section-0").css("background-color", "#222222");
     $("#logo").attr("src", "logo.png");
       $("#login-button").css("background-color", "#222222");

}
});
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 8);
    this.type();
    this.isDeleting = false;
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if(this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Initial Type Speed
    let typeSpeed = 150;

    if(this.isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if(!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}


// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
  const txtElement = document.querySelector('.txt-type');
  const words = JSON.parse(txtElement.getAttribute('data-words'));
  const wait = txtElement.getAttribute('data-wait');
  // Init TypeWriter
  new TypeWriter(txtElement, words, wait);
}
