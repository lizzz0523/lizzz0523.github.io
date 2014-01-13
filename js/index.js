(function($, window, undefined){

var speed = 400;

$('#projects').on('mouseenter', 'li', function(){
    var $self = $(this),

        $shadow = $self.find('.shadow'),
        $title = $self.find('h3'),
        $desc = $self.find('p');

    $shadow.stop().animate({opacity : 0.5}, {
        duration : speed,
        step : function(now, tween){
            $title.css({opacity : 1 - tween.pos});
            $desc.css({opacity : tween.pos,  marginTop : 20 * (1 - tween.pos)});
        }
    });
});

$('#projects').on('mouseleave', 'li', function(){
    var $self = $(this),

        $shadow = $self.find('.shadow'),
        $title = $self.find('h3'),
        $desc = $self.find('p');

    $shadow.stop().animate({opacity : 0}, {
        duration : speed,
        step : function(now, tween){
            $title.css({opacity : tween.pos});
            $desc.css({opacity : 1 - tween.pos,  marginTop : 20 * tween.pos});
        }
    });
});

})(jQuery, this);