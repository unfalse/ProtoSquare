// TODO: maybe call it Movement class as it has a move variable ?
// Or maybe use move in other place, ProtoSquare for example ?
// Also move changing span on document to the ProtoSquare or somewhere else
define(function() {
    var Controls = function({ keyLeft, keyUp, keyRight, keyDown, key_s, key_a, eventName }) {
        // TODO: use constants class
        this.eventName = eventName;
        this.keys = {
            left:   keyLeft,
            up:     keyUp,
            right:  keyRight,
            down:   keyDown,
            key_s:  key_s,
            key_a:  key_a
        };
        this.keyCodes = {
            '37': this.keys.left,
            '38': this.keys.up,
            '39': this.keys.right,
            '40': this.keys.down,
            '83': this.keys.key_s,
            '65': this.keys.key_a
        };
        document.addEventListener('keydown', this.KeysHandler.bind(this));
        document.addEventListener('keyup', this.KeysHandler.bind(this));
    }
    Controls.prototype.KeysHandler = function(event) {
        let keyNum = -1;
        let move = false;
        let water = false;
        let air = false;
        const keyCodeValue = this.keyCodes[event.keyCode];
        if(event.type==="keydown" &&
            ([
                this.keys.left,
                this.keys.right,
                this.keys.up,
                this.keys.down
            ].indexOf(keyCodeValue) >= 0)) {
                move = true;
                keyNum = keyCodeValue;
        }
        if(!(water && air)) {
            if(event.type === "keydown" && keyCodeValue === this.keys.key_s) {
                // TODO: move to ProtoSquare!
                const aquaSpan = document.getElementById('aqua');
                water = true;
                aquaSpan.innerText = 'enabled';
            }
            if(event.type === "keydown" && keyCodeValue === this.keys.key_a) {
                // TODO: move to ProtoSquare!
                const airSpan = document.getElementById('air');
                air = true;
                airSpan.innerText = 'enabled';
            }
        }
        if(event.type === "keyup") {
            move = false;
            water = false;
        }
        let controlsEvent = new CustomEvent(this.eventName, {
            // TODO: remove air, water
            // TODO: use 'move' in another class, maybe ProtoSquare
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