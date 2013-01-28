// Init a scene

CHOREO.addScene('first', function (scene) {

    // gives you a closure to do private work...

    // The scene has the Events API mixed in
    // so you can trigger and listen for both built-in and custom events

    // default event list:
    // init | enter | exit

    scene.caption = 'this is a caption';

    scene
        .on('init', function () {

        })
        .on('WOW', function (data) {
            console.log(data);
        })
        .addSteps([

            {
                caption: 'this is a caption for a step',
                enter: function (dir) {
                    // dir = 1 -> going forward
                    // dir = -1 -> going backward
                    scene.trigger('WOW', 'test');
                },
                exit: function () {

                }
            },

            {
                enter: function () {

                },
                exit: function () {
                    
                }
            },

            {
                enter: function () {

                },
                exit: function () {
                    
                }
            }

        ]);

    // Use scene.exports to expose public stuff
    // you can actually attach any thing to the scene object
    // this is just for keeping it a bit cleaner

    var someData = '12345';
    scene.exports.data = someData;

});

// Start listening for input

CHOREO.start();

// Query the state, get only

CHOREO.totalSteps;
CHOREO.isLocked;
CHOREO.currentStep;
CHOREO.currentScene;

CHOREO.getScene('first'); // get scene by id

// Navigate

CHOREO.next();
CHOREO.prev();

// Lock - disable next and prev

CHOREO.lock();
CHOREO.unlock();

// Input management

CHOREO.enableKeyboard(); // default enabled
CHOREO.disableKeyboard();