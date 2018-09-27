define(function(require) {
    const constants = require('./constants');
    const baseClasses = require('./base-classes');
    const landClasses = require('./land-classes');
    const squareClass = require('./square-class');
    const controlsClass = require('./controls-class');
    const abilityClasses = require('./ability-classes');
    const { SQUARE, KEYUP, KEYDOWN, KEYLEFT, KEYRIGHT, KEY_S, KEY_A, CONTROLS_EVENT } = constants;
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
        this.controls = new Controls({
             keyLeft: KEYLEFT,
             keyUp: KEYUP,
             keyRight: KEYRIGHT,
             keyDown: KEYDOWN,
             key_s: KEY_S,
             key_a: KEY_A,
             eventName: CONTROLS_EVENT
        });
        this.square = new SquareObject(0, 0);
        this.keyMap = {};
        this.keyMap[KEYUP] = this.square.GoUp;
        this.keyMap[KEYRIGHT] = this.square.GoRight;
        this.keyMap[KEYDOWN] = this.square.GoDown;
        this.keyMap[KEYLEFT] = this.square.GoLeft;

        this.RenderEngine = new this._renderDep({
            land: this.land,
            objects: this.objects,
            square: this.square
        });
        this.RenderEngine.Init();

        this.controls.subscribe(this.ControlsHandler.bind(this));

        this.switchRender = false;
        this.Update();
    }
    ProtoSquare.prototype.Update = function() {
        if (this.switchRender) {
            // TODO: check if memory utilisation will rise when old engine instance
            // TODO: will be overwritten by the new engine instance
            // TODO: (or will garbage collector clean unused objects)
            // ANSWER: no memory utilisation rising
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
        const { keyStr, keydown, keyup } = eventObj.detail;
        if (keydown) {
            if ([ KEYLEFT, KEYRIGHT, KEYUP, KEYDOWN ].indexOf(keyStr) >= 0) {
                this.square.move = true;
            }
            if (keyStr === KEY_S) {
                const aquaSpan = document.getElementById('aqua');
                aquaSpan.innerText = 'enabled';
                // TODO: maybe move it to the Square class
                Boat.prototype.Enhance(this.square);
            }
            if (keyStr === KEY_A) {
                const airSpan = document.getElementById('air');
                airSpan.innerText = 'enabled';
                // TODO: maybe move it to the Square class
                Heli.prototype.Enhance(this.square);
            }
        }
        if (keyup) {
            this.square.move = false;
            this.square.moved = false;
        }
        if (this.square.move) {
            this.keyMap[keyStr].apply(this.square);
        }
    };

    return {
        ProtoSquare
    }
});