(function ($, undefined) {
  $.fn.dustyDrag = function (options) {
    options = $.extend({
      swipedClass: 'swiped',
      swipeBlockClass: 'swipeBlock',
      speed: 500,
      threshold: 0,
      callback: function(){

      }
    }, options || {});

    return this.each(function () {
        var $slider = $(this);
        var $swipeBlock = $('<div></div>').addClass(options.swipeBlockClass);
        var locked = false;

        var swipeOptions = {
          triggerOnTouchEnd: true,
          swipeStatus: swipeStatus,
          allowPageScroll:"vertical",
          threshold: options.threshold
        }
        $slider.append($swipeBlock).swipe(swipeOptions);

        $slider.on('reset', unlockSlider);

        /**
        * Catch each phase of the swipe.
        * move : we drag the div.
        * cancel : we animate back to where we were
        * end : we finish the animation and run the callback
        */
        function swipeStatus(event, phase, direction, distance) {
          if (locked) {
            return;
          }
          if(phase==="move" && direction==="right"){
            slideBlock(distance, 0);
            if (distance > getEndPos()){
              return false;
            }
          } else {
            releaseBlockHandler();
          }
        }

        /**
        * Manually update the position of the slider on drag
        */
        function slideBlock(distance, duration){
          $swipeBlock.css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
          $swipeBlock.css("-webkit-transform", "translate3d(" + distance + "px,0px,0px)");
        }

        function releaseBlockHandler(){
          if ($swipeBlock.position().left > getEndPos()){
            lockSlider();
          } else {
            unlockSlider();
          }
        }

        function unlockSlider(){
          locked = false;
          var distance = 0;
          slideBlock(distance, options.speed);
          $swipeBlock.removeClass(options.swipedClass);
        }

        function lockSlider(){
          var endPos = getEndPos();
          locked = true;
          slideBlock(endPos, 0);
          $swipeBlock.addClass(options.swipedClass);
          options.callback();
        }

        function getEndPos(){
          return $slider.width() - $swipeBlock.width();
        }

    });
  }
})(jQuery);