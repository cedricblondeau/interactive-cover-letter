var CoverLetter = {
  settings: {
    clouds: 3,
    ships: 2
  },

  init: function() {
    this.emitBackgroundElements();
  },

  emitBackgroundElements: function() {
    this.emitMovingElements($('#clouds'), 'cloud', this.settings.clouds);
    this.emitMovingElements($('#ships'), 'ship', this.settings.ships, {
      speed: 120,
      minTopPosition: -30,
      maxTopPosition: 20
    });
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
  }
};

$(document).ready(function() {
  CoverLetter.init();
});
