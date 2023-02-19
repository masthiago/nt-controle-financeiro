// Captures menu related elements.
const menuBtn = document.querySelector('.menu-icon');       // Menu button
const menu = document.querySelector('.menu');               // Menu nav tag
const closeBtn = document.querySelector('.close-menu');     // Close button

// Displays the menu when clicking the menu button by adding the 'open' class
menuBtn.addEventListener('click', function() {
  menu.classList.add('open');
});

// Hides the menu when clicking the close button by removing the 'open' class
closeBtn.addEventListener('click', function() {
  menu.classList.remove('open');
});
