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
        var ctx = this, key = hex_sha1(JSON.stringify(current));
        Sammy.log('saveState', key, current);
        NodeStore.set(key, current, function() {
          current_key = key;
          if (Sammy.isFunction(callback)) {
            callback(key);
          }
          ctx.redirect('state', key);
        });
      },
      getState: function(key, callback) {
        NodeStore.get(key, callback);
      },
      buildNode: function(node) {
        var ctx = this;
        return this.render($('#imagenode'), node)
        .appendTo('#rapture')
        .then(function(inode) {
          inode.draggable({stop: function() {
            ctx.setNodePosition(inode.attr('data-id'), inode.css('top'), inode.css('left'));
            ctx.saveState();
          }});
        })
        .send(ctx.setNodePosition, node.id, node.top, node.left);
      },
      buildState: function() {
        $('#rapture').html('');
        var ctx = this;
        var i = 0, l = current.nodes.length, node;
        Sammy.log('buildState', current);
        for (; i < l; i++) {
          node = current.nodes[i];
          this.buildNode(node);
        }
      },
      setNodePosition: function(id, top, left, callback) {
        var node = current.nodes[id];
        Sammy.log('setNodePosition', id, node, top, left);
        $.extend(node, {top: top, left: left});
        $('#imagenode_' + id).css({top: top, left: left}).show();
        if (Sammy.isFunction(callback)) callback(node);
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
        top: randomIn($('#rapture').height()),
        left: randomIn($('#rapture').innerWidth()),
        width: randomIn(130)
      };
      current.nodes.push(node);
      this.buildNode(node)
      .then('saveState');
    });


    this.get('', function() {

    });

    this.bind('node-drag', function(e, data) {
      Sammy.log('node-drag', e, data);

    });
  });

  $(function() {
    app.run();
  });

})(jQuery);
