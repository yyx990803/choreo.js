// Init a scene

CHOREO.createScene('first', function (scene) {

    // do private work...

    scene
        .caption('this is a caption')

        .on('init', function () {

        })

        .on('beforeEnter', function () {

        })

        .on('afterEnter', function () {
            
        })

        .on('beforeExit', function () {
            
        })

        .on('afterExit', function () {
            
        })

        .on('beforeEnter', function () {
            
        })

        .steps([

            {
                enter: function (dir) {
                    // dir = 1 -> going forward
                    // dir = -1 -> going backward
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

});