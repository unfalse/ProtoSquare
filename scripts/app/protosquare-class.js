define(function(require) {
    const constants = require('./constants');
    const baseClasses = require('./base-classes');
    const landClasses = require('./land-classes');
    const squareClass = require('./square-class');
    const controlsClass = require('./controls-class');
    const abilityClasses = require('./ability-classes');
    const { SQUARE } = constants;
    const { MapObject, NothingObject } = baseClasses;
    const { AbyssObject, WaterObject, GroundObject, WallObject, TargetObject } = landClasses;
    const { SquareObject } = squareClass;
    const { Controls } = controlsClass;
    const { Boat, Heli } = abilityClasses;

    var ProtoSquare = function(renderDep) {
        // TODO: place all other classes inside this class
        console.log('Constructor launched!');
        this.land = [];
        this.objects = [];
        // this.boatEnhancer = new Boat(0, 4);
        this.move = false;
        this.smoothControls = false;
        this.mainCycleId = -1;
        this._renderDep = renderDep;
    };
    ProtoSquare.prototype.Launch = function() {
        this.Init();
    }
    ProtoSquare.prototype.Init = function() {
        console.log('Init!');
        // TODO: make constants
        this.objects = [
            NothingObject
            ,new GroundObject() // ground
            ,new WallObject()   // wall
            ,new WaterObject()  // water
            ,new AbyssObject()  // abyss
            ,new TargetObject() // target
        ];
        this.land = [
            [1, 1, 3, 3, 1, 1, 4, 4, 4],
            [1, 1, 3, 3, 1, 1, 4, 1, 1],
            [1, 1, 3, 3, 1, 1, 4, 1, 1],
            [1, 1, 3, 3, 1, 1, 4, 1, 1],
            [1, 1, 3, 1, 1, 1, 4, 1, 1],
            [1, 1, 2, 1, 1, 1, 4, 1, 1],
            [1, 1, 2, 1, 1, 4, 4, 1, 5],
        ];
        this.keyMap = {
            'up':     function() { this.dy = -1; this.dx = 0; },
            'right':  function() { this.dy = 0; this.dx = 1; },
            'down':   function() { this.dy = 1; this.dx = 0; },
            'left':   function() { this.dy = 0; this.dx = -1; },
        };
        this.controls = new Controls();
        this.square = new SquareObject(0, 0);
        this.RenderEngine = new this._renderDep({
            land: this.land,
            objects: this.objects,
            square: this.square
        });
        this.RenderEngine.Init();
        // Temporary for filling with tiles
        // const RenderImgs = new this._renderDep2({
        //   land: this.land,
        //   objects: this.objects,
        //   square: this.square
        // });
        // RenderImgs.Init();
        // ---
        this.controls.subscribe(this.ControlsHandler.bind(this));
        // this.mainCycleId = setInterval(this.Update.bind(this), 0);
        this.switchRender = false;
        this.Update();
    }
    ProtoSquare.prototype.Update = function() {
        if (this.switchRender) {
            // TODO: check if memory utilisation will rise when old engine instance
            // TODO: will be overwritten by the new engine instance
            // TODO: (or will garbage collector clean unused objects)
            this.RenderEngine = new this._renderDep({
                land: this.land,
                objects: this.objects,
                square: this.square
            });
            this.RenderEngine.Init();
            this.switchRender = false;
            this.Update();
            return;
        }
        this.square.Update(this);
        this.RenderEngine.Render(this);
        setTimeout(this.Update.bind(this), 0);
    }
    ProtoSquare.prototype.SwitchRenderEngine = function(renderDep) {
        this._renderDep = renderDep;
        this.switchRender = true;
    }
    ProtoSquare.prototype.GetObjectId = function(x, y) {
        return this.land[y] && this.land[y][x];
    }
    ProtoSquare.prototype.GetObject = function(x, y) {
        const objectId = this.GetObjectId(x, y);
        return objectId && this.objects[objectId];
    }
    ProtoSquare.prototype.ControlsHandler = function(eventObj) {
        if (eventObj.detail.move) {
            // TODO: this is a strange code... keyMap knows about dx and dy but they are in Square class!!
            this.keyMap[eventObj.detail.keyNum].apply(this.square);
            this.square.move = true;
        } else if (eventObj.detail.water) {
            Boat.prototype.Enhance(this.square);
        } else if (eventObj.detail.air) {
            Heli.prototype.Enhance(this.square);
        } else {
            this.square.move = false;
            this.square.moved = false;
        }
    };

    return {
        ProtoSquare
    }
});