let slideIndex = 0;

function showSlides() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.carousel-dot');
  //console.log(slides);
  //console.log(dots);
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active');
  }
  slideIndex++;
  //console.log(slideIndex);
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  //console.log(slideIndex);
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }
  slides[slideIndex - 1].classList.add('active');
  dots[slideIndex - 1].classList.add('active');
  
  setTimeout(showSlides, 3000);
}

showSlides();