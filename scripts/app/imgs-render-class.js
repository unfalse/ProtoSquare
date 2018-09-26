define(function(require) {
    const constants = require('./constants');
    const landClasses = require('./land-classes');
    const { FIELD_HEIGHT, FIELD_WIDTH } = constants;
    const { AbyssObject, WaterObject, GroundObject } = landClasses;

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

        this.character = document.getElementById("crocodile");
        this.character.style.top = 0;
        this.character.style.left = 20;
        this.character.style.display = 'block';
        this.characterImg = 'ground';
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
                this.Draw(num, x, y, this.imagesBackSurface);
            }, this);
        }, this);
        this.ground_land.forEach(function(line, y) {
            this.ground_land[y].forEach(function(num, x) {
                this.Draw(num, x, y, this.imagesSurface);
            }, this);
        }, this);
    }
    RenderImgs.prototype.Draw = function(num, x, y, imagesSurface) {
        const img = document.createElement('img');
        const tile = this.TILES[num];
        const fileName = tile !== this.TRANSPARENT ? tile : 'black';
        img.src = 'assets/mappack_PNG/mapTile_' + fileName + '.png';
        if (tile === this.TRANSPARENT) img.className = 'transparent-img';
        imagesSurface.appendChild(img);
    }
    RenderImgs.prototype.DrawCharacter = function() {
        this.character.style.top = this.square.y * FIELD_HEIGHT - 50;
        this.character.style.left = this.square.x * FIELD_WIDTH + 20;
    }
    RenderImgs.prototype.UpdateCharacterImg = function(protoSquare) {
        const obj = protoSquare.GetObject(this.square.x, this.square.y);
        if (obj instanceof GroundObject && this.characterImg !== 'ground') {
            this.character.src = "assets/frame-1.png";
            this.characterImg = 'ground';
        } else if (obj instanceof WaterObject && this.characterImg !== 'water') {
            this.character.src = "assets/hat.png"
            this.characterImg = 'water';
        }
    }
    RenderImgs.prototype.Render = function(protoSquare) {
        this.UpdateCharacterImg(protoSquare);
        this.DrawCharacter();
    }
    
    return {
        RenderImgs
    }
});