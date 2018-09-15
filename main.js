(function() {

  const NOTHING = { ID: 0 }; // nothing
  const GROUND = { ID: 1 }; // ground
  const WALL = { ID: 2 }; // wall
  const WATER = { ID: 3 }; // water
  const ABYSS = { ID: 4 }; // abyss
  const TARGET = { ID: 5 }; // target
  const SQUARE = { ID:6 }; // square
  const BOAT = { ID: 7 }; // boat
  const HELI = { ID: 8 }; // helicopter

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

  /* Attempt to write a class wrapper */
  // var CreateClass = function(classConstructor, parentClass) {
  //   classConstructor.prototype = Object.create(parentClass.prototype);
  //   parentClass.prototype.constructor = parentClass;
  // }

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

  var Square = function(x, y) {
    this.dx = 0;
    this.dy = 0;
    this.move = false;
    this.moved = false;
    MapObject.apply(this, [SQUARE.ID, x, y]);
  }
  Square.prototype = new Boat(); // Object.create(Boat.prototype);
  Square.prototype.constructor = Square;
  // TODO: is it ok if Square will know about ProtoSquare ?
  Square.prototype.Update = function(protoTank) {
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
  Square.prototype.Collide = function(obj) {
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
    this.controls = new Controls();
    this.square = new Square(0, 0);
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
    this.Update();
  }
  ProtoSquare.prototype.Update = function() {
    this.square.Update(this);
    this.RenderEngine.Render();
    setTimeout(this.Update.bind(this), 0);
  }
  ProtoSquare.prototype.GetObjectId = function(x, y) {
      return this.land[y] && this.land[y][x];
  }
  ProtoSquare.prototype.GetObject = function(x, y) {
      const objectId = this.GetObjectId(x, y);
      return objectId && this.objects[objectId];
  }
  ProtoSquare.prototype.ControlsHandler = function(eventObj) {
    const keyMap = {
      'up':     function() { this.dy = -1; this.dx = 0; },
      'right':  function() { this.dy = 0; this.dx = 1; },
      'down':   function() { this.dy = 1; this.dx = 0; },
      'left':   function() { this.dy = 0; this.dx = -1; },
    };
    if (eventObj.detail.move) {
      keyMap[eventObj.detail.keyNum].apply(this.square);
      this.square.move = true;
    } else if (eventObj.detail.water) {
      // TODO: Adding prototype to get an ability to pass the water
      //       Maybe it's not possible?
      // debugger;
      // this.square.__proto__ = new Boat();
      // /*  OR  */
      // this.square.__proto__ = Object.create(WaterObject.prototype);
      // debugger;
      // debugger;
      Boat.prototype.Enhance(this.square);
    } else if (eventObj.detail.air) {
      Heli.prototype.Enhance(this.square);
    } else {
      this.square.move = false;
      this.square.moved = false;
    }
  };

  var RenderBase = function(){};
  RenderBase.prototype.FIELD_WIDTH = 64;
  RenderBase.prototype.FIELD_HEIGHT = 64;
  RenderBase.prototype.MAP_WIDTH = 9;
  RenderBase.prototype.MAP_HEIGHT = 7;

  var Render = function(options) {
    // this.FIELD_WIDTH = 64;
    // this.FIELD_HEIGHT = 64;
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
  Render.prototype = Object.create(RenderBase.prototype);
  Render.prototype.constructor = Render;
  Render.prototype.Init = function() {}
  Render.prototype.Draw = function(obj, x, y) {
    if (obj.hide) return;
    var drawX = typeof x === 'number' ? x : obj.x;
    var drawY = typeof y === 'number' ? y : obj.y;
    this.drawContext.fillStyle = this.COLORS[obj.id];
    this.drawContext.fillRect(
      drawX * this.FIELD_WIDTH,
      drawY * this.FIELD_HEIGHT,
      this.FIELD_WIDTH,
      this.FIELD_HEIGHT
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

  var RenderImgs = function(options) {
    this.TILES = [
      ''
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
      ,'188' // 12 <-- water
      ,'black' // 13
    ];
    this.ground_land = [
      [1, 2, 13, 13,  1,  2, 13, 13, 13],
      [3, 4, 13, 13,  3,  4, 13,  1,  2],
      [3, 4, 13, 13,  3,  4, 13,  3,  4],
      [3, 4, 13, 13,  3,  4, 13,  3,  4],
      [3, 4, 13,  1,  9,  4, 13,  3,  4],
      [3, 7,  8,  9, 11, 10, 13,  3,  4],
      [5, 6,  6,  6, 10, 13, 13,  5, 10],
    ];
    this.land = options.land;
    this.square = {};
    this.square = options.square;
    this.objects = options.objects;
    this.imagesSurface = document.getElementsByClassName('imgs-container')[0];
  }
  RenderImgs.prototype = Object.create(RenderBase.prototype);
  RenderImgs.prototype.constructor = RenderImgs;
  RenderImgs.prototype.Init = function() {
    this.ground_land.forEach(function(line, y) {
      this.ground_land[y].forEach(function(num, x) {
        this.Draw(num, x, y);
      }, this);
    }, this);
  }
  RenderImgs.prototype.Draw = function(num, x, y) {
    // debugger;
    // if (obj.hide) return;
    // var drawX = typeof x === 'number' ? x : obj.x;
    // var drawY = typeof y === 'number' ? y : obj.y;
    const img = document.createElement('img');
    img.src = 'mappack_PNG/mapTile_' + 
      this.TILES[num] + '.png';
    this.imagesSurface.appendChild(img);
    // this.imagesSurface.
    // this.drawContext.fillStyle = this.COLORS[obj.id];
    // this.drawContext.fillRect(
    //   drawX * this.FIELD_WIDTH,
    //   drawY * this.FIELD_HEIGHT,
    //   this.FIELD_WIDTH,
    //   this.FIELD_HEIGHT
    // );
  }
  RenderImgs.prototype.Render = function() {
    // this.Draw(this.square);
  }

  var protoTank = new ProtoSquare(Render, RenderImgs);
  protoTank.Launch();

  const setRadioGroupHandlers = function() {
    render_switch();
    layout_switch();

    function render_switch() {
      const radios = document.getElementsByName('render');
      const canvas_container = document.getElementsByClassName('canvas-container')[0];
      const imgs_container = document.getElementsByClassName('imgs-container')[0];
      const radioHandler = function() {
        if (this.value === 'canvas') {
          canvas_container.style.display = 'inline-block';
          imgs_container.style.display = 'none';
          protoTank = new ProtoSquare(Render);
          protoTank.Launch();
        } else {
          canvas_container.style.display = 'none';
          imgs_container.style.display = 'inline-block';
          protoTank = new ProtoSquare(RenderImgs);
          protoTank.Launch();
        }
      };
      for(let i = 0; i < radios.length; i++) {
        radios[i].addEventListener('click', radioHandler);
      }
    }

    function layout_switch() {
      const radios = document.getElementsByName('layout_switcher');
      const render_switch_inside = document.getElementsByClassName('render-switch-inside')[0];
      const render_switch = document.getElementsByClassName('render-switch')[0];
      const radioHandler = function() {
        if (this.value === 'va-top') {
          render_switch_inside.className =
            'render-switch-inside';
        } else if (this.value === 'flex') {
          render_switch_inside.className =
            'render-switch-inside render-switch-inside_flex';
        } else if (this.value === 'flex') {
          render_switch_inside.className =
            'render-switch-inside render-switch-inside_grid';
        }
      };
      for(let i=0; i < radios.length; i++) {
        radios[i].addEventListener('click', radioHandler);
      }
    }
  };

  setRadioGroupHandlers();

  // var crocodile = document.getElementById("crocodile");
  // crocodile.style.top = 0;
  // crocodile.style.left = 0;
  // crocodile.style.display = '';
  // this.draw = function() {
  //   this.crocodile.style.top = this.y * FIELD_HEIGHT;
  //   this.crocodile.style.left = this.x * FIELD_WIDTH;
  // }

  // TODO:
  /*
    next steps:
    4. Add code for collides
    5. Add code for working with water and air protos
  */
})()