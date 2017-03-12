var CoverLetter = {
  settings: {
    stars: 50,
    clouds: 3,
    ships: 2
  },

  init: function() {
    this.emitBackgroundElements();
    this.scenesCount = $('#scenes-container .scene').length;
    this.enableScrollMagic();
  },

  emitBackgroundElements: function() {
    this.emitStars();
    this.emitMovingElements($('#clouds'), 'cloud', this.settings.clouds);
    this.emitMovingElements($('#ships'), 'ship', this.settings.ships, {
      speed: 120,
      minTopPosition: -30,
      maxTopPosition: 20
    });
  },

  emitStars: function() {
    var $starsContainer = $('#stars'),
    starLeftPercentPosition = 0;
    for (var i = 0; i < this.settings.stars; i ++) {
      starLeftPercentPosition = Math.floor(starLeftPercentPosition + (100 / this.settings.stars));
      $('<div class="star"></div>').css({
        left: starLeftPercentPosition + "%",
        top: 5 + Math.floor(Math.random() * 30) + "%"
      }).appendTo($starsContainer);
    }
  },

  emitMovingElements: function(container, elementClass, count, params) {
    params = params || {};
    var defaults = {
      speed: 60,
      minTopPosition: 0,
      maxTopPosition: 30
    };
    $.extend(params, defaults);

    var leftPercentPosition = 0;
    for (var i = 0; i < count; i ++) {
      leftPercentPosition = Math.floor(leftPercentPosition + (100 / count));
      var element = $('<div class="' + elementClass + '"></div>').css({
        left: leftPercentPosition + "%",
        top: params.minTopPosition + Math.floor(Math.random() * params.maxTopPosition) + "%",
        opacity: 0
      }).appendTo(container);

      var leftRoRightTimeline = new TimelineMax({paused: true, repeat: -1})
        .set(element, {left: "0"})
        .to(element, 1, {opacity:1})
        .to(element, params.speed, {left: "100%", ease:Linear.easeNone}, 0);

      var firstLeftToRightDuration = params.speed * ((100 - leftPercentPosition) / 100);
      var cloudRandomToRightTimeline = new TimelineMax()
        .to(element, 1, {opacity:1})
        .to(element, firstLeftToRightDuration, {left: "100%", ease:Linear.easeNone}, 0)
        .to(element, 0.5, {opacity:0})
        .add(leftRoRightTimeline.play());
    }
  },

  enableScrollMagic: function() {
    TweenMax.to($('.bubble'), 0, {scale: 0});
    var scrollController = new ScrollMagic.Controller();
    this.moveSunOnScroll(scrollController);
    this.sunsetOnScroll(scrollController);
    this.displayBubblesOnScroll(scrollController);
  },

  moveSunOnScroll: function(scrollController) {
    new ScrollMagic.Scene({triggerElement: "#scenes-container", duration: (this.scenesCount * 100) + "%", triggerHook: "onLeave"})
      .setTween(TweenMax.to("#sun", 1, {right: "100%"}))
      .addTo(scrollController);
    new ScrollMagic.Scene({triggerElement: "#scenes-container", duration: ((this.scenesCount - 1) * 100) + "%", triggerHook: "onLeave"})
      .setTween(new TimelineMax().to("#sun", 1, {bottom: "60%"}).to("#sun", 1, {bottom: "10%"}))
      .addTo(scrollController);
  },

  sunsetOnScroll: function(scrollController) {
    new ScrollMagic.Scene({triggerElement: "#scene-" + this.scenesCount, triggerHook: "onLeave"})
      .setTween(new TimelineMax()
        .to("#sun", 0.25, {opacity: 0})
        .set("#moon", {visibility: "visible"})
        .set("#stars", {visibility: "visible"})
        .to("#sky", 0.5, {backgroundColor: "#2e4482"})
        .to("#water", 0.5, {backgroundColor: "#011825"}, 0)
        .to("#skyline-windows", 0.5, {fill: "#ecbe68"}, 0)
        .to($("#clouds"), 0.5, {opacity: 0}, 0)
        .to("#stars", 1, {opacity: 1}, '-=0.5')
        .to("#moon", 1, {opacity: 1}, '-=1.5')
      ).addTo(scrollController);
  },

  displayBubblesOnScroll: function(scrollController) {
    for (var i = 1; i <= this.scenesCount; i++) {
      new ScrollMagic.Scene({triggerElement: "#scene-"+i, triggerHook: "onLeave"})
        .setTween(TweenMax.to("#bubble-"+i, 0.5, {scale: 1, ease: Elastic.easeInOut}))
        .addTo(scrollController);

      new ScrollMagic.Scene({triggerElement: "#scene-"+i, duration: "100%", triggerHook: "onLeave"})
        .setTween(new TimelineMax().to("#bubble-"+i, 1, {opacity: 1}).to("#bubble-"+i, 1, {opacity: 0}))
        .addTo(scrollController);
    }
  }
};

$(document).ready(function() {
  CoverLetter.init();
});
