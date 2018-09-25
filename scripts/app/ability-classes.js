define(function(require) {
    const constants = require('./constants');
    const baseClasses = require('./base-classes');
    const landClasses = require('./land-classes');
    const { HELI, BOAT } = constants;
    const { MapObject } = baseClasses;
    const { AbyssObject, WaterObject } = landClasses;

    var Heli = function(x, y) {
        MapObject.apply(this, [HELI.ID, x, y]);
        this.enabled = false;
    }
    Heli.prototype = Object.create(MapObject.prototype);
    Heli.prototype.constructor = Heli;
    Heli.prototype.Enhance = function(obj) {
        var nextProto = obj;
        while(nextProto) {
            if(nextProto instanceof Heli) nextProto.enabled = true;
            nextProto = nextProto.__proto__;
        }
    }
    // If true then square cannot move
    Heli.prototype.Collide = function(obj) {
        return this.enabled ? !(obj instanceof AbyssObject) : true;
    }

    var Boat = function(x, y) {
        MapObject.apply(this, [BOAT.ID, x, y]);
        this.enabled = false;
    }
    Boat.prototype = new Heli(); // Object.create(Heli.prototype);
    Boat.prototype.constructor = Boat;
    Boat.prototype.Enhance = function(obj) {
        var nextProto = obj;
        while(nextProto) {
            if(nextProto.id === BOAT.ID) nextProto.enabled = true;
            nextProto = nextProto.__proto__;
        }
    }
    // If true then square cannot move
    Boat.prototype.Collide = function(obj) {
        return this.enabled ? !(obj instanceof WaterObject) : true;
    }

    return {
        Heli
        ,Boat
    }
});