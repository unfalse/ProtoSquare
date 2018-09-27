define(function(require) {
    const constants = require('./constants');
    const baseClasses = require('./base-classes');
    const abilityClasses = require('./ability-classes');
    const landClasses = require('./land-classes');
    const { SQUARE } = constants;
    const { MapObject } = baseClasses;
    const { Boat } = abilityClasses;
    const { GroundObject } = landClasses;

    var SquareObject = function(x, y) {
        this.dx = 0; // direction variables
        this.dy = 0;
        this.move = false;
        this.moved = false;
        MapObject.apply(this, [SQUARE.ID, x, y]);
      }
    SquareObject.prototype = new Boat(); // Object.create(Boat.prototype);
    SquareObject.prototype.constructor = SquareObject;
    // TODO: is it ok if SquareObject will know about ProtoSquare ?
    SquareObject.prototype.Update = function(protoTank) {
        const nx = this.x + this.dx,
                ny = this.y + this.dy;
        const smoothMoves = protoTank.smoothControls || !this.moved;
        if (this.move && smoothMoves && protoTank.GetObjectId(nx, ny) &&
                !this.Collide(protoTank.GetObject(nx, ny))) {
            this.x = nx;
            this.y = ny;
            this.moved = true;
        }
    }
    SquareObject.prototype.Collide = function(obj) {
        let collisionResult = !(obj instanceof GroundObject);
        let nextProto = this.__proto__;
        // debugger;
        // if (obj.Enhance) {
        //   obj.Enhance(this);
        // }
        while(nextProto && nextProto.__proto__.Collide) {
            const enabled = nextProto.enabled;
            collisionResult = collisionResult && 
            nextProto.__proto__.Collide.call(nextProto, obj);
            nextProto = nextProto.__proto__;
        }
        return collisionResult;
    };
    SquareObject.prototype.GoUp = function() {
        this.dy = -1; this.dx = 0;
    }
    SquareObject.prototype.GoDown = function() {
        this.dy = 1; this.dx = 0; 
    }
    SquareObject.prototype.GoLeft = function() {
        this.dy = 0; this.dx = -1;
    }
    SquareObject.prototype.GoRight = function() {
        this.dy = 0; this.dx = 1;
    }

    return {
        SquareObject
    }
});