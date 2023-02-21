
/*
 *
 * Menu animation
 * 
 */

// Captures menu related elements.
const menuBtn = document.querySelector('.menu-icon');       // Menu button
const menu = document.querySelector('.menu');               // Menu nav tag
const closeBtn = document.querySelector('.close-menu');     // Close button

// Displays menu when clicking the hamburger button by adding the 'open' class
menuBtn.addEventListener('click', function() {
  menu.classList.add('open');
});

// Hides menu when clicking the close button by removing the 'open' class
closeBtn.addEventListener('click', function() {
  menu.classList.remove('open');
});
