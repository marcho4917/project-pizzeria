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






/*function Carousel() {  // eslint-disable-next-line no-unused-vars
  const opinion = [];
  
  opinion[0] = {
    title: 'COOL!',
    text: 'Cool cool cool cool cool cool cool cool cool cool cool cool cool cool cool cool cool !',
    author: 'Bolek', 
  };
  opinion[1] = {
    title: 'AWESOME!',
    text: 'Wow wow wow wow wow wow wowwow wow wowwow wow wowwow wow wowwow wow wow!',
    author: 'Wiesiu', 
  };
  opinion[2] = {
    title: 'THE BEST PIZZA!',
    text: 'THE BEST PIZZA! THE BEST PIZZA! THE BEST PIZZA! THE BEST PIZZA! THE BEST PIZZA! THE BEST PIZZA!!',
    author: 'Lolek', 
  };

  let i =0;
  function changeOpinion() {
    const title = document.querySelector('.opinion-title');
    const text = document.querySelector('.opinion-text');
    const author = document.querySelector('.opinion-author');

    const dots = document.querySelectorAll('.carousel-dot');
    //console.log(dots);

    for (let dot of dots) {
      if(dot.id == 'dot' + (i + 1)) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
      title.innerHTML = opinion[i].title;
      text.innerHTML = opinion[i].text;
      author.innerHTML = opinion[i].author;
    }

    if (i < opinion.length - 1 ) {
      i++;
    } else {
      i =0;
    }
  } changeOpinion();

  setInterval(function() {
    changeOpinion();
  }, 3000);
}

Carousel();*/