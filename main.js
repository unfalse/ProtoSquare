(function() {
  var FIELD_WIDTH = 80;
  var FIELD_HEIGHT = 80;

  const GROUND = { ID: 1, COLOR: 'green' }; // ground
  const WALL = { ID: 2, COLOR: 'gray' }; // wall
  const WATER = { ID: 3, COLOR: 'aqua' }; // water
  const ABYSS = { ID: 4, COLOR: 'black' }; // abyss
  const TARGET = { ID: 5, COLOR: 'red' }; // target
  const TANK = { ID:6, COLOR: 'purple' }; // tank
  const BOAT = { ID: 7, COLOR: 'blue' }; // boat
  const HELI = { ID: 8, COLOR: 'orange'}

  var MapObject = function(id, color, x, y) {
    var drawingSurface = document.getElementById('drawingSurface');
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;
    this.hide = false;
    // TODO: it must be in Render maybe
    this.drawContext = drawingSurface.getContext('2d');
  };
  MapObject.prototype.enabled = true;
  MapObject.prototype.draw = function(x, y) {
    // TODO: make it more beatiful
    if (this.hide) return;
    var drawX = typeof x === 'number' ? x : this.x;
    var drawY = typeof y === 'number' ? y : this.y;
    this.drawContext.fillStyle = this.color;
    this.drawContext.fillRect(
      drawX * FIELD_WIDTH,
      drawY * FIELD_HEIGHT,
      FIELD_WIDTH,
      FIELD_HEIGHT
    );
  }

  var GroundObject = function(x, y) {
    MapObject.apply(this, [GROUND.ID, GROUND.COLOR, x, y]);
  }
  GroundObject.prototype = Object.create(MapObject.prototype);
  GroundObject.prototype.constructor = GroundObject;

  var WaterObject = function(x, y) {
      MapObject.apply(this, [WATER.ID, WATER.COLOR, x, y]);
  }
  WaterObject.prototype = Object.create(MapObject.prototype);
  WaterObject.prototype.constructor = WaterObject;

  var AbyssObject = function(x, y) {
      MapObject.apply(this, [ABYSS.ID, ABYSS.COLOR, x, y]);
  }
  AbyssObject.prototype = Object.create(MapObject.prototype);
  AbyssObject.prototype.constructor = AbyssObject;

  var WallObject = function(x, y) {
      MapObject.apply(this, [WALL.ID, WALL.COLOR, x, y]);
  }
  WallObject.prototype = Object.create(MapObject.prototype);
  WallObject.prototype.constructor = WallObject;

  var TargetObject = function(x, y) {
      MapObject.apply(this, [TARGET.ID, TARGET.COLOR, x, y]);
  }
  TargetObject.prototype = Object.create(MapObject.prototype);
  TargetObject.prototype.constructor = TargetObject;

  /* Attempt to write a class wrapper */
  // var CreateClass = function(classConstructor, parentClass) {
  //   classConstructor.prototype = Object.create(parentClass.prototype);
  //   parentClass.prototype.constructor = parentClass;
  // }

  var Heli = function(x, y) {
    MapObject.apply(this, [HELI.ID, HELI.COLOR, x, y]);
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
  // If true then tank cannot move
  Heli.prototype.Collide = function(obj) {
    return this.enabled ? !(obj instanceof AbyssObject) : true;
  }

  var Boat = function(x, y) {
    MapObject.apply(this, [BOAT.ID, BOAT.COLOR, x, y]);
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
  // If true then tank cannot move
  Boat.prototype.Collide = function(obj) {
    return this.enabled ? !(obj instanceof WaterObject) : true;
  }

  var Tank = function(x, y) {
    this.dx = 0;
    this.dy = 0;
    this.move = false;
    this.moved = false;
    MapObject.apply(this, [TANK.ID, TANK.COLOR, x, y]);
    this.crocodile = document.getElementById("crocodile");
    this.crocodile.style.top = 0;
    this.crocodile.style.left = 0;
    this.crocodile.style.display = '';
    this.draw = function() {
      //debugger;
      this.crocodile.style.top = this.y * FIELD_HEIGHT;
      this.crocodile.style.left = this.x * FIELD_WIDTH;
      //debugger;
    }
  }
  Tank.prototype = new Boat(); // Object.create(Boat.prototype);
  Tank.prototype.constructor = Tank;
  // TODO: is it ok if Tank will know about ProtoTank ?
  Tank.prototype.Update = function(protoTank) {
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
  Tank.prototype.Collide = function(obj) {
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
  }

  var Controls = function() {
    this.eventName = 'controlsEvent';
    this.keyCodes = {
      '37': 'left',
      '38': 'up',
      '39': 'right',
      '40': 'down',
      '83': 'enable_water_ability',
      '65': 'enable_air_ability'
    };
    document.addEventListener('keydown', this.KeysHandler.bind(this));
    document.addEventListener('keyup', this.KeysHandler.bind(this));
  }
  Controls.prototype.KeysHandler = function(event){
    let keyNum = -1;
    let move = false;
    let water = false;
    let air = false;
    const keyCodeValue = this.keyCodes[event.keyCode];
    if(event.type=="keydown" && (['left', 'right', 'up', 'down'].indexOf(keyCodeValue)>=0)){
      move = true;
      keyNum = keyCodeValue;
    }
    if(!(water && air)) {
      if(event.type=="keydown" && keyCodeValue==='enable_water_ability') {
        water = true;
        const aquaSpan = document.getElementById('aqua');
        aquaSpan.innerText = 'enabled';
      }
      if(event.type=="keydown" && keyCodeValue==='enable_air_ability') { 
        air = true;
        const airSpan = document.getElementById('air');
        airSpan.innerText = 'enabled';
      }
    }
    if(event.type=="keyup") {
      move = false;
      water = false;
    }
    let controlsEvent = new CustomEvent(this.eventName, {
      'detail': {
        keyNum: keyNum,
        move: move,
        water: water,
        air: air
      }
    });
    document.dispatchEvent(controlsEvent);
  };
  Controls.prototype.subscribe = function(handler) {
    document.addEventListener(this.eventName, handler);
  }

  var ProtoTank = function() {
    // TODO: place all other classes inside this class
    console.log('Constructor launched!');
    this.land = [];
    this.objects = [];
    // this.tank = new Tank(1, 1);
    this.tank = new Tank(0, 0);
    this.boatEnhancer = new Boat(0, 4);
    this.move = false;
    this.smoothControls = false;
    this.mainCycleId = setInterval(this.Update.bind(this), 0);
  };
  ProtoTank.prototype.Launch = function() {
    this.Init();
    this.Render();
    //var ground = new GroundObject(0,0);
    //ground.draw();
  }
  ProtoTank.prototype.Init = function() {
    console.log('Init!');
    // TODO: make constants
    this.objects = [
      ,new GroundObject() // ground
      ,new WallObject()   // wall
      ,new WaterObject()  // water
      ,new AbyssObject()  // abyss
      ,new TargetObject() // target
    ];
    this.land = [
      [1, 1, 3, 3, 3, 1, 1, 4, 4],
      [1, 1, 3, 3, 3, 1, 1, 4, 1],
      [1, 3, 3, 3, 3, 1, 1, 4, 1],
      [1, 3, 3, 3, 3, 1, 1, 4, 1],
      [1, 3, 3, 1, 1, 1, 1, 4, 1],
      [1, 3, 3, 1, 1, 1, 4, 4, 1],
      [1, 2, 1, 1, 1, 1, 4, 4, 5],
    ];
    this.controls = new Controls();
    this.controls.subscribe(this.ControlsHandler.bind(this));
  }
  ProtoTank.prototype.Update = function() {
    this.tank.Update(this);
    this.Render();
  }
  ProtoTank.prototype.GetObjectId = function(x, y) {
      return this.land[y] && this.land[y][x];
  }
  ProtoTank.prototype.GetObject = function(x, y) {
      const objectId = this.GetObjectId(x, y);
      return objectId && this.objects[objectId];
  }
  ProtoTank.prototype.ControlsHandler = function(eventObj) {
    const keyMap = {
      'up':     function() { this.dy = -1; this.dx = 0; },
      'right':  function() { this.dy = 0; this.dx = 1; },
      'down':   function() { this.dy = 1; this.dx = 0; },
      'left':   function() { this.dy = 0; this.dx = -1; },
    };
    if (eventObj.detail.move) {
      keyMap[eventObj.detail.keyNum].apply(this.tank);
      this.tank.move = true;
    } else if (eventObj.detail.water) {
      // TODO: Adding prototype to get an ability to pass the water
      //       Maybe it's not possible?
      // debugger;
      // this.tank.__proto__ = new Boat();
      // /*  OR  */
      // this.tank.__proto__ = Object.create(WaterObject.prototype);
      // debugger;
      // debugger;
      Boat.prototype.Enhance(this.tank);
    } else if (eventObj.detail.air) {
      Heli.prototype.Enhance(this.tank);
    } else {
      this.tank.move = false;
      this.tank.moved = false;
    }
  };
  ProtoTank.prototype.Render = function() {
    var x = 0;
    var y = 0;
    this.land.forEach(function(line, y) {
      // debugger;
      // if (x===9) x = 0, y++;
      this.land[y].forEach(function(num, x) {
        this.objects[num].draw(x, y);
      }, this);
      // x++;
    }, this);
    this.tank.draw();
    this.boatEnhancer.draw();
  }

  var protoTank = new ProtoTank();
  protoTank.Launch();

  // TODO:
  /*
    next steps:
    4. Add code for collides
    5. Add code for working with water and air protos
  */
})()