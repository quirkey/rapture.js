(function($) {

  var app = Sammy('#container', function() {
    this.use('Mustache');

    this.template_engine = 'mustache';

    var current = {nodes: []};
    var randomIn = function(max) {
      return Math.floor(Math.random() * max);
    };

    this.get('/add/:type', function() {
      var node = {
        id: current.nodes.length,
        type: this.params.type,
        width: randomIn(100)
      };
      this.render($('#imagenode'), node)
      .appendTo('#rapture')
      .then(function(inode) {
        // place randomly
        Sammy.log($(inode));
        $(inode).css({
          top: randomIn($('#rapture').height()),
          left: randomIn($('#rapture').innerWidth())
        }).draggable();
      })
      this.redirect('');
    });

    this.get('', function() {

    });
  });

  $(function() {
    app.run();
  });

})(jQuery);
