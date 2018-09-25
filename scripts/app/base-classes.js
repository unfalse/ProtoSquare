define(function(require) {
    const constants = require('./constants');
    const { NOTHING } = constants;
    var MapObject = function(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.hide = false;
      };
    MapObject.prototype.enabled = true;

    var NothingObject = function(x, y) {
        MapObject.apply(this, [NOTHING.ID, x, y]);
      }
    NothingObject.prototype = Object.create(MapObject.prototype);
    NothingObject.prototype.constructor = NothingObject;

    return {
        MapObject: MapObject
        ,NothingObject: NothingObject
    }
});