(function($) {

  var app = Sammy('#container', function() {
    this.use('Couch')
        .use('Mustache');

    this.template_engine = 'mustache';

    var current = {nodes: []};

    this.get('/add/:type', function() {
      var node = {
        id: current.nodes.length,
        type: this.params.type,
        width: Math.floor(Math.random() * 100)
      };
      this.render($('#imagenode'), node)
          .appendTo('#rapture');
      this.redirect('');
    });

    this.get('', function() {

    });
  });

  $(function() {
    app.run();
  });

})(jQuery);
