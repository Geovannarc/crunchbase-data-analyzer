const myCarouselElement = document.querySelector('#carouselExampleControls')

if(window.matchMedia("(min-width:576px)").matches){

const carousel = new bootstrap.Carousel(myCarouselElement, {
  interval: false,
  wrap: true
})

let carouselWidth = $('.carousel-inner')[0].scrollWidth;
let cardWidth = $('.carousel-wrapper').width();

let scrollPosition = 0;


$('.carousel-control-next').on('click', function(){
    if(scrollPosition < (carouselWidth - ((cardWidth) * 3))){
    scrollPosition = scrollPosition + cardWidth+100;
    $('.carousel-inner').animate({scrollLeft: scrollPosition}, 600);
    }
})
$('.carousel-control-prev').on('click', function(){
    if(scrollPosition > 0){
    console.log('click')
    scrollPosition = scrollPosition - cardWidth-100;
    $('.carousel-inner').animate({scrollLeft: scrollPosition}, 600);
    }
})
}else{
    $(myCarouselElement).addClass('slide')
}
