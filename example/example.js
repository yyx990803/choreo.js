CHOREO.setDebugLevel(2);

// Init a scene

CHOREO.addScene('first', function (scene) {

    // gives you a closure to do private work...

    // The scene has the Events API mixed in
    // so you can trigger and listen for both built-in and custom events

    // default event list:
    // init | enter | exit

    scene.caption = 'this is a caption';

    // chainable events API
    scene
        .on('enter', function (dir) {
            console.log(this.id); // `this` is bound to the scene object!
            console.log('entering ' + this.id + ' from ' + dir);
        })
        .on('cool', function (msg) {
            console.log('cool event triggered from dir:' + msg);
        })
        .on('cooler', function (msg) {
            console.log('cooler event triggered from dir:' + msg);
        })
        .addSteps([

            {
                caption: 'this is a caption for a step',
                events: {
                    enter: function (dir) {
                        // dir = 1 -> going forward
                        // dir = -1 -> going backward
                        scene.trigger('cool', dir);

                        // this is bound to the step object, but not this plain object...
                        console.log(this.caption);
                        // it's wrapped with the events API too!
                        this.trigger('lol');
                    },
                    exit: function () {

                    },
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