CHOREO.setDebugLevel(2); // 0 ~ 3 larger number = more verbose

// Init a scene
CHOREO.addScene('first', function (scene) {

    // do private work...
    function doSomething () {
        console.log('do something');
    }

    // set caption
    scene.caption = 'this is a caption';

    // The scene has the chainable Events API mixed in
    // so you can trigger and listen for both built-in and custom events
    // default events: enter | exit
    scene
        .on('enter', function (dir) {
            // dir = 1 -> going forward
            // dir = -1 -> going backward
            console.log(this.id); // `this` is bound to the scene object!
            console.log('entering ' + this.id + ' from ' + dir);
        })
        .on('cool', function (arg) {
            console.log('cool event triggered with extra argument:' + arg);
        })
        .addSteps([

            {
                caption: 'this is a caption for a step', // caption is optional
                events: {

                    enter: function (dir) {
                        // trigger something on the scene
                        scene.trigger('cool', dir);
                    },

                    exit: function (dir) {
                        // this is bound to the step object, but not this plain object...
                        console.log(this.caption);
                    },

                    // for
                    fromPrev: function () {
                        // it's wrapped with the events API too.
                        this.trigger('lol');
                    },
                    fromNext: function () {

                    },
                    toPrev: function () {

                    },
                    toNext: function () {

                    },

                    // a custom event handler
                    lol: function () {
                        console.log('lol I triggered an event on myself');
                    }
                }
            },

            {
                caption: 'this is a caption for a step',
                events: {
                    enter: function (dir) {
                        scene.trigger('cooler', dir);
                    },
                    exit: function () {

                    }
                }
            }

        ]);

    // Use scene.exports to expose public stuff
    // you can actually attach any thing to the scene object
    // this is just for keeping it a bit cleaner
    var someData = '12345';
    scene.exports.data = someData;

});

CHOREO.addScene('second', function (scene) {

    scene.caption = 'this is the second scene!!!';
    scene.on('enter', function (dir) {
        console.log(this.caption);
    });

});

// Start listening for input
CHOREO.start();

// Useful for debugging, prints info to console
CHOREO.inspect();

// Query the state, get only

// CHOREO.totalSteps;
// CHOREO.isLocked;
// CHOREO.currentStep;
// CHOREO.currentScene;

// CHOREO.getScene('first'); // get scene by id

// Navigate

// CHOREO.next();
// CHOREO.prev();

// Lock - disable next and prev

// CHOREO.lock();
// CHOREO.unlock();

// Input management

// CHOREO.enableKeyboard();
// CHOREO.disableKeyboard();

// The global object also triggers events

CHOREO.on('change', function (dir) {
    console.log('change ' + (dir > 0 ? '+1' : '-1'));
})