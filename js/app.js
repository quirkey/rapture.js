(function($) {

  var app = Sammy('#container', function() {
    this.use('Mustache');

    this.template_engine = 'mustache';

    var current = {nodes: []};
    var current_key = null;
    var randomIn = function(max) {
      return Math.floor(Math.random() * max);
    };

    var NodeStore = new Sammy.Store({name: 'node-store', type: 'local'});

    this.helpers({
      saveState: function(callback) {
        var key = hex_sha1(JSON.stringify(current));
        Sammy.log('saveState', key, current);
        NodeStore.set(key, current, function() {
          current_key = key;
          callback(key);
        });
      },
      getState: function(key, callback) {
        NodeStore.get(key, callback);
      },
      buildState: function() {
        $('#rapture').html('');
        var ctx = this;
        var i = 0, l = current.nodes.length, node;
        Sammy.log('buildState', current);
        for (; i < l; i++) {
          node = current.nodes[i];
          this.render($('#imagenode'), node)
              .appendTo('#rapture')
              .send(ctx.setNodePosition, node.id, node.top, node.left);
        }
      },
      setNodePosition: function(id, top, left) {
        var node = current.nodes[id];
        Sammy.log('setNodePosition', id, node, top, left);
        $.extend(node, {top: top, left: left});
        $('#imagenode_' + id).css({top: top, left: left});
      }
    });

    this.get('/state/:key', function(ctx) {
      if (current_key != this.params.key) {
        this.getState(this.params.key, function(state) {
          if (state) {
            current_key = ctx.params.key;
            current = state;
            ctx.buildState();
          } else {
            ctx.redirect('');
          }
        });
      }
    });
    this.get('/add/:type', function(ctx) {
      var node = {
        id: current.nodes.length,
        type: this.params.type,
        width: randomIn(100)
      };
      current.nodes.push(node);
      this.render($('#imagenode'), node)
      .appendTo('#rapture')
      .then(function(inode) {
        // place randomly
        inode.draggable();
        ctx.setNodePosition(node.id, randomIn($('#rapture').height()), randomIn($('#rapture').innerWidth()));
      })
      .send(ctx.saveState)
      .then(function(key) {
        ctx.redirect('state', key);
      });
    });

    this.get('', function() {

    });
  });

  $(function() {
    app.run();
  });

})(jQuery);
