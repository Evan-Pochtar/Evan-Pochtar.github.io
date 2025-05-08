document.addEventListener('DOMContentLoaded', function() {
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentLocation.substring(currentLocation.lastIndexOf('/'))) {
      link.classList.add('active');
    }
  });

  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  mobileMenuBtn.addEventListener('click', function() {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.addEventListener('click', function(event) {
    const isClickInside = navMenu.contains(event.target) || mobileMenuBtn.contains(event.target);
    
    if (!isClickInside && navMenu.classList.contains('active')) {
      mobileMenuBtn.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
});
