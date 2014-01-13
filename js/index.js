(function($, window, undefined){

var speed = 400;

$('#projects').on('mouseenter', 'li', function(){
    var $self = $(this),

        $shadow = $self.find('.shadow'),
        $title = $self.find('h3'),
        $desc = $self.find('p');

    $shadow.stop().animate({opcity : 0.5}, {
        duration : speed,
        step : function(now, tween){
            $title.css({opcity : 1 - tween.pos});
            $desc.css({optcity : tween.pos,  marginTop : -50 * (1 - tween.pos)});
        }
    });
});

$('#projects').on('mouseleave', 'li', function(){
    var $self = $(this),

        $shadow = $self.find('.shadow'),
        $title = $self.find('h3'),
        $desc = $self.find('p');

    $shadow.stop().animate({opcity : 0}, {
        duration : speed,
        step : function(now, tween){
            $title.css({opcity : tween.pos});
            $desc.css({optcity : 1 - tween.pos,  marginTop : -50 * tween.pos});
        }
    });
});

})(jQuery, this);