define(function(require) {
    const constants = require('./constants');
    const { FIELD_HEIGHT, FIELD_WIDTH } = constants;

    var RenderImgs = function(options) {
        this.TRANSPARENT = 'transparent';
        this.TILES = [
            this.TRANSPARENT
            ,'006' // 1
            ,'008'
            ,'021' // 3
            ,'023'
            ,'036' // 5
            ,'037'
            ,'024' // 7
            ,'007'
            ,'025' // 9
            ,'038'
            ,'009' //11
            ,'187' // 12 <-- water
            ,'black' // 13
            ,'white' // 14
        ];
        this.ground_land = [
            [1, 2, 0, 0,  1,  2, 0, 0,  0],
            [3, 4, 0, 0,  3,  4, 0, 1,  2],
            [3, 4, 0, 0,  3,  4, 0, 3,  4],
            [3, 4, 0, 0,  3,  4, 0, 3,  4],
            [3, 4, 0, 1,  9,  4, 0, 3,  4],
            [3, 7, 8, 9, 11, 10, 0, 3,  4],
            [5, 6, 6, 6, 10,  0, 0, 5, 10],
        ];
        this.background = [
            [0, 12, 12, 12, 12, 13, 13, 13, 13],
            [0, 12, 12, 12, 12, 13, 13, 13, 13],
            [0, 12, 12, 12, 12, 13, 13, 13,  0],
            [0, 12, 12, 12, 12, 13, 13, 13,  0],
            [0, 12, 12, 12, 12, 13, 13, 13,  0],
            [0, 12, 12, 12, 13, 13, 13, 13,  0],
            [0,  0,  0,  0, 13, 13, 13, 13,  0],
        ];
        this.land = options.land;
        this.square = {};
        this.square = options.square;
        this.objects = options.objects;
        this.imagesSurface = document.getElementsByClassName('imgs-container')[0];
        this.imagesBackSurface = document.getElementsByClassName('imgs-back-container')[0];
    }
    RenderImgs.prototype.constructor = RenderImgs;
    RenderImgs.prototype.Init = function() {
        function cleanSurfaces(surfaceNode) {
            while (surfaceNode.firstChild) surfaceNode.removeChild(surfaceNode.firstChild);
        }
        cleanSurfaces(this.imagesSurface);
        cleanSurfaces(this.imagesBackSurface);
        this.background.forEach(function(line, y) {
            this.background[y].forEach(function(num, x) {
                this.DrawBack(num, x, y);
            }, this);
        }, this);
        this.ground_land.forEach(function(line, y) {
            this.ground_land[y].forEach(function(num, x) {
                this.Draw(num, x, y);
            }, this);
        }, this);
    }
    RenderImgs.prototype.Draw = function(num, x, y) {
        const img = document.createElement('img');
        const tile = this.TILES[num];
        const fileName = tile !== this.TRANSPARENT ? tile : 'black';
        img.src = 'assets/mappack_PNG/mapTile_' + fileName + '.png';
        if (tile === this.TRANSPARENT) img.className = 'transparent-img';
        this.imagesSurface.appendChild(img);
    }
    RenderImgs.prototype.DrawBack = function(num, x, y) {
        const img = document.createElement('img');
        const tile = this.TILES[num];
        const fileName = tile !== this.TRANSPARENT ? tile : 'black';
        img.src = 'assets/mappack_PNG/mapTile_' + fileName + '.png';
        if (tile === this.TRANSPARENT) img.className = 'transparent-img';
        this.imagesBackSurface.appendChild(img);
    }
    RenderImgs.prototype.Render = function() {}
    
    return {
        RenderImgs
    }
});