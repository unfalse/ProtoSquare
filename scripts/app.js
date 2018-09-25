requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../scripts/app'
    }
});

requirejs(['app/main']);