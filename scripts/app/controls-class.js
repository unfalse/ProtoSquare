define(function() {
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
                const aquaSpan = document.getElementById('aqua');
                water = true;
                aquaSpan.innerText = 'enabled';
            }
            if(event.type=="keydown" && keyCodeValue==='enable_air_ability') { 
                const airSpan = document.getElementById('air');
                air = true;
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

    return {
        Controls
    }
});