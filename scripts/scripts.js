/* scripts.js
 * JavaScript functions for slideshow.html.
 * Author: Christina Holden
 * June 2017 */


// Document selectors
var slideshow = document.querySelector("#slideshow");
var sequence = document.querySelector("#sequence");
var control = document.querySelector("#control");
var previous = document.querySelector("#previous");
var next = document.querySelector("#next");
var options = document.querySelector("#options");


// Event listeners
control.addEventListener("click", runSlideshow, false);
previous.addEventListener("click", goBack, false);
next.addEventListener("click", goForward, false);
options.addEventListener("click", toggleMenu, false);

    var ctx = slideshow.getContext("2d"),
        bufferCanvas = document.createElement("canvas"),
        bufferCtx = bufferCanvas.getContext("2d"),
        image = new Image(),
        caption = "",
        nextImage = new Image(), //temparary
        currentSlide = 0,
        play = 0,
        fadeTime = 0,
        isRunning = false,
        isRandom = false,
        x = 0,
        effect = 0;

    // Loads the first slide.
    window.onload = loadSlide;

    // Creates a slide on a buffer canvas, then draws buffer to main canvas.
    function loadSlide() {

        image.onload = function() {

            bufferCtx.canvas.width = ctx.canvas.width;
            bufferCtx.canvas.height = ctx.canvas.height;
            bufferCtx.drawImage(image, 0, 0, slideshow.width, slideshow.height);
            drawCaption(bufferCtx);
            ctx.drawImage(bufferCanvas, 0, 0, slideshow.width, slideshow.height);
        }

        image.src = slides[currentSlide].image;
        caption = slides[currentSlide].caption;
        sequence.innerHTML = (currentSlide + 1) + " / " + slides.length;
    }

    // Runs the slideshow according to effect flag. Called when play is clicked
    function runSlideshow () {
        if (!isRunning) {
            isRunning = true;
            control.className = "fa fa-stop";

            resetCanvas();

            switch (effect) {
                case 0: switchSlide();
                        play = setInterval(switchSlide, 3000);
                        break;

                case 1: fadeSlide();
                        play = setInterval(fadeSlide, 5000);
                        break;

                case 2: slideSlide();

                        play = setInterval(slideSlide, 4000);
                        break;

                default: switchSlide();
                        play = setInterval(switchSlide, 3000);
            }
        } else {
            pauseSlideshow();
        }
    }

    // Stops the slideshow and clears the interval
    function pauseSlideshow () {
        isRunning = false;
        control.className = "fa fa-play";
        clearInterval(play);
        play = 0;
    }

    // Finds the next slide depending on the sequence flag.
    function grabNextSlide() {

        if (!isRandom) {
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
        } else {
            grabRandomSlide();
        }
    }

    // Finds the last slide; ignores sequence flag.
    function grabPreviousSlide() {

            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }
    }

    /* Finds a random slide and ensures the next slide is different than the
    ** current slide. */
    function grabRandomSlide() {
        var temp = Math.floor(Math.random() * ((slides.length-1)+ 1));
            if (temp != currentSlide) {
                currentSlide = temp;
            } else {
                grabRandomSlide();
            }
    }

    /* Ensures sequential is enabled; loads the next slide maintaining effect.
    ** Called when next button is clicked. */
    function goBack() {
        pauseSlideshow();
        isRandom = false;
        toggle_sequence.innerHTML = "Sequential";
        if (effect == 2) {
            slideBack();
        } else {
            grabPreviousSlide();
            loadSlide();
        }

    }

    /* Ensures sequential is enabled; loads the last slide maintaining effect.
    ** Called when previous button is clicked. */
    function goForward() {
        pauseSlideshow();
        isRandom = false;
        toggle_sequence.innerHTML = "Sequential";
        if (effect == 2) {
            slideSlide();
        } else {
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
            loadSlide();
        }
    }

    /* Called when options gear is clicked.
    ** Drops down the options menu and loads listeners */
    function toggleMenu() {
        var dropdown = document.querySelector("#dropdown");
        if (dropdown.classList.contains("hidden")) {
            dropdown.classList.remove("hidden");
            var slide = document.querySelector("#slide");
            var fade = document.querySelector("#fade");
            var snap = document.querySelector("#snap");
            var toggle_sequence = document.querySelector("#toggle_sequence");
            slide.addEventListener("click", effectSlide, false);
            fade.addEventListener("click", effectFade, false);
            snap.addEventListener("click", effectSnap, false);
            toggle_sequence.addEventListener("click", toggleSequence, false);
        } else {
            dropdown.classList.add("hidden");

        }
    }

    /* Called when the sequence/random button is clicked.
    ** Toggles the sequence between random and sequential by changing the flag.*/
    function toggleSequence() {
        if (!isRandom) {
            isRandom = true;
            toggle_sequence.innerHTML = "Random";
        } else {
            isRandom = false;
            toggle_sequence.innerHTML = "Sequential";
        }
    }

    /* Called when Effect:Switch button is clicked.
    ** Clears the interval and sets the effect flag to snap; starts the slides.*/
    function effectSnap () {
        pauseSlideshow();
        effect = 0;
        runSlideshow();
    }

    /* Called when Effect:Fade button is clicked.
    ** Clears the interval and sets the effect flag to fade; starts the slides.*/
    function effectFade () {
        pauseSlideshow();
        effect = 1;
        runSlideshow();
    }

    /* Called when Effect:Slide button is clicked.
    ** Clears the interval and sets the effect flag to slide; starts the slides.*/
    function effectSlide () {
        pauseSlideshow();
        effect = 2;
        runSlideshow();
    }

    // Draws a caption to the canvas.
    function drawCaption (canvas) {
        var center = slideshow.width/2,
            maxWidth = slideshow.width,
            backgroundTop = (slideshow.height/10) * 9,
            backgroundHeight = slideshow.height - backgroundTop,
            verticalCenter = backgroundTop + (backgroundHeight/2);

        canvas.fillStyle = "#000";
        canvas.globalAlpha = 0.4;
        canvas.fillRect(0, backgroundTop, maxWidth, backgroundHeight);

        canvas.font = "1.5em Tahoma";
        canvas.textBaseline = "middle";
        canvas.textAlign = "center";
        canvas.fillStyle = "#fff";
        canvas.globalAlpha = 1.0;
        canvas.fillText(caption, center, verticalCenter, maxWidth);
    }

    // Runs the slideshow in snap mode.
    function switchSlide () {
        grabNextSlide();
        loadSlide();
    }

    /* Runs the slideshow in fade mode.
    ** Sets the variables for the nextslide;
    ** sets a global alpha to transparent;
    ** sets an interval for the fade;
    ** starts transistion. */
    function fadeSlide() {
        grabNextSlide();
        image.src = slides[currentSlide].image;
        caption = slides[currentSlide].caption;
        sequence.innerHTML = (currentSlide + 1) + " / " + slides.length;

        bufferCtx.canvas.width = slideshow.width;
        bufferCtx.canvas.height = slideshow.height;

        ctx.globalAlpha = 0.1;

        clearInterval(fadeTime);
        fadeTime = setInterval(fadeIn, 180);
    }

    // Creates the slide on the buffer and draws it to main canvas.
    function paint() {
        ctx.save();
        bufferCtx.drawImage(image, 0, 0, slideshow.width, slideshow.height);
        drawCaption(bufferCtx);
        ctx.drawImage(bufferCanvas, 0, 0, slideshow.width, slideshow.height);
        ctx.restore();
    }

    /* Fades the slide in by increasing its opacity over the interval until it
    ** is completely opaque. */
    function fadeIn() {

        if (ctx.globalAlpha < 1) {
            ctx.globalAlpha += 0.001;
            paint(); }
    }

    /* Sets the variables for the next slide;
    ** sets the x coordinate offscreen;
    ** starts the transition */
    function slideSlide() {
        grabNextSlide();
        nextImage.src = slides[currentSlide].image;
        caption = slides[currentSlide].caption;
        sequence.innerHTML = (currentSlide + 1) + " / " + slides.length;

        bufferCtx.canvas.width = slideshow.width;
        bufferCtx.canvas.height = slideshow.height;

        x = -bufferCtx.canvas.width;
        draw();
        transition();

    }

    /* Sets the variables for the last slide;
    ** sets the x coordinate offscreen;
    ** starts the transition */
    function slideBack() {
        grabPreviousSlide();
        nextImage.src = slides[currentSlide].image;
        caption = slides[currentSlide].caption;
        sequence.innerHTML = (currentSlide + 1) + " / " + slides.length;

        bufferCtx.canvas.width = slideshow.width;
        bufferCtx.canvas.height = slideshow.height;

        x = slideshow.width;
        draw();
        transitionBack();

    }

    /* Creates the slide on the buffer and draws it to main canvas.
    ** Uses the offscreen x coordinate. */
    function draw() {
        ctx.save();
        bufferCtx.drawImage(nextImage, 0, 0, slideshow.width, slideshow.height);
        drawCaption(bufferCtx);
        ctx.drawImage(bufferCanvas, x, 0, slideshow.width, slideshow.height);
        ctx.restore();
    }

    /* Uses animation function to increase x coordinate to slide the next slide
    ** in from the right. */
    function transition() {

        var animate = requestAnimationFrame(transition);
        if (x <= 0) {
            x += 5;
            draw();
         } else {
            cancelAnimationFrame(animate);
         }
    }

    /* Uses animation function to increase x coordinate to slide the next slide
    ** in from the left. */
    function transitionBack() {
        var animate = requestAnimationFrame(transitionBack);
        if (x >= 0) {
            x -= 5;
            draw();
         } else {
            cancelAnimationFrame(animate);
         }

    }

    // Ensures all variables are reset and canvas is clean.
    function resetCanvas() {
        bufferCtx.clearRect(0, 0, bufferCtx.canvas.width, bufferCtx.canvas.height);
        ctx.clearRect(0,0,ctx.width, ctx.height);
        ctx.globalAlpha = 1.0;
        clearInterval(fadeTime);
        fadeTime = 0;
    }


/*!
 * jQuery Smooth Scroll
 * https://css-tricks.com/snippets/jquery/smooth-scrolling/
 * Chris Coyier, updated April 23, 2017
 */
$(document).ready(function() {
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
});



