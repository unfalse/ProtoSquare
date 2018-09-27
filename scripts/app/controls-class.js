// TODO: maybe call it Movement class as it has a move variable ?
// Or maybe use move in other place, ProtoSquare for example ?
// Also move changing span on document to the ProtoSquare or somewhere else
define(function() {
    var Controls = function({ keyLeft, keyUp, keyRight, keyDown, key_s, key_a, eventName }) {
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
        const controlsEvent = new CustomEvent(this.eventName, {
            'detail': {
                keyStr: this.keyCodes[event.keyCode],
                keyCode: event.keyCode,
                keydown: event.type === "keydown",
                keyup: event.type === "keyup",
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