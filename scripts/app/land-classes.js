define(function(require) {
    const baseClasses = require('./base-classes');
    const constants = require('./constants');
    const { MapObject } = baseClasses;
    const { ABYSS, GROUND, TARGET, WALL, WATER } = constants;

    var GroundObject = function(x, y) {
        MapObject.apply(this, [GROUND.ID, x, y]);
    }
    GroundObject.prototype = Object.create(MapObject.prototype);
    GroundObject.prototype.constructor = GroundObject;

    var WaterObject = function(x, y) {
        MapObject.apply(this, [WATER.ID, x, y]);
    }
    WaterObject.prototype = Object.create(MapObject.prototype);
    WaterObject.prototype.constructor = WaterObject;

    var AbyssObject = function(x, y) {
        MapObject.apply(this, [ABYSS.ID, x, y]);
    }
    AbyssObject.prototype = Object.create(MapObject.prototype);
    AbyssObject.prototype.constructor = AbyssObject;

    var WallObject = function(x, y) {
        MapObject.apply(this, [WALL.ID, x, y]);
    }
    WallObject.prototype = Object.create(MapObject.prototype);
    WallObject.prototype.constructor = WallObject;

    var TargetObject = function(x, y) {
        MapObject.apply(this, [TARGET.ID, x, y]);
    }
    TargetObject.prototype = Object.create(MapObject.prototype);
    TargetObject.prototype.constructor = TargetObject;

    return {
        GroundObject
        ,WaterObject
        ,AbyssObject
        ,WallObject
        ,TargetObject
    }
});