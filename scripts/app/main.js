define(function(require) {
    const constants = require('./constants');
    const protoSquareClass = require('./protosquare-class');
    const primitiveRenderClass = require('./primitive-render-class');
    const imgsRenderClass = require('./imgs-render-class');
    const { FIELD_HEIGHT, FIELD_WIDTH } = constants;
    const { Render } = primitiveRenderClass;
    const { RenderImgs } = imgsRenderClass;
    const { ProtoSquare } = protoSquareClass;

    const setRadioGroupHandlers = function() {
        render_switch();
        layout_switch();

        function render_switch() {
            const radios = document.getElementsByName('render');
            const canvas_container = document.getElementsByClassName('canvas-container')[0];
            const imgs_container = document.getElementsByClassName('imgs-container')[0];
            const imgs_back_container = document.getElementsByClassName('imgs-back-container')[0];
            const imgs_surfaces_mount = document.getElementsByClassName('surfaces-mount')[0];
            const radioHandler = function() {
                if (this.value === 'canvas') {
                    canvas_container.style.display = 'inline-block';
                    imgs_container.style.display = 'none';
                    imgs_back_container.style.display = 'none';
                    imgs_surfaces_mount.style.display = 'none';
                    protoTank.SwitchRenderEngine(Render);
                    // protoTank.Launch();
                } else {
                    canvas_container.style.display = 'none';
                    imgs_container.style.display = 'inline-block';
                    imgs_back_container.style.display = 'inline-block';
                    imgs_surfaces_mount.style.display = 'inline-block';
                    protoTank.SwitchRenderEngine(RenderImgs);
                    // protoTank.Launch();
                }
            };
            for(let i = 0; i < radios.length; i++) {
                radios[i].addEventListener('click', radioHandler);
            }
        }

        function layout_switch() {
            const radios = document.getElementsByName('layout_switcher');
            const render_switch_inside = document.getElementsByClassName('render-switch-inside')[0];
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

    var protoTank = new ProtoSquare(Render);
    protoTank.Launch();

    setRadioGroupHandlers();

    var crocodile = document.getElementById("crocodile");
    crocodile.style.top = 0;
    crocodile.style.left = 20;
    crocodile.style.display = 'block';
  
    this.draw = function() {
        this.crocodile.style.top = this.y * FIELD_HEIGHT;
        this.crocodile.style.left = this.x * FIELD_WIDTH;
    }

  // TODO:
  /*
    next steps:
    4. Add code for collides
    5. Add code for working with water and air protos
  */
})