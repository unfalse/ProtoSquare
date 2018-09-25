define(function(require) {
    const constants = require('./constants');
    const { FIELD_HEIGHT, FIELD_WIDTH } = constants;

    var Render = function(options) {
        this.COLORS = [
            'white'
            ,'green'
            ,'gray'
            ,'aqua'
            ,'black'
            ,'red'
            ,'purple'
            ,'blue'
            ,'orange'
        ];
        this.land = options.land;
        this.square = {};
        this.square = options.square;
        this.objects = options.objects;
        var drawingSurface = document.getElementById('drawing-surface');
        this.drawContext = drawingSurface.getContext('2d');
    }
    Render.prototype.constructor = Render;
    Render.prototype.Init = function() {}
    Render.prototype.Draw = function(obj, x, y) {
        if (obj.hide) return;
        var drawX = typeof x === 'number' ? x : obj.x;
        var drawY = typeof y === 'number' ? y : obj.y;
        this.drawContext.fillStyle = this.COLORS[obj.id];
        this.drawContext.fillRect(
            drawX * FIELD_WIDTH,
            drawY * FIELD_HEIGHT,
            FIELD_WIDTH,
            FIELD_HEIGHT
        );
    }
    Render.prototype.Render = function() {
        this.land.forEach(function(line, y) {
            this.land[y].forEach(function(num, x) {
                this.Draw(this.objects[num], x, y);
            }, this);
        }, this);
        this.Draw(this.square);
    }
    
    return {
        Render
    }
});