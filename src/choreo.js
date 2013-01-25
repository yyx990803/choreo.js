;(function (window, undefined) {

    var pub = window.CHOREO || {};

    // parse url args for debugging

    var scenes              = [],
        templates           = {};

    // state vars
    var lock                = false,
        currentScene        = null,
        currentSceneIndex   = -1,
        numTotalSteps       = 0,
        currentStepIndex    = 0;

    // cache dom elements
    var $progressBar        = $('#progress'),
        $leftButton         = $('#nav-left'),
        $rightButton        = $('#nav-right');

        init: function () {

            if (window.screen.width <= 1280 || window.screen.height <= 800) {
                document.body.classList.add('small-screen');
            }

            CS.loadTemplates(function () {

                // init the scenes
                // & count steps
                for (var i = 0, j = CS.scenes.length; i < j; ++i) {
                    CS.scenes[i].init();
                    CS.totalSteps += CS.scenes[i].steps.length + 1;
                }

                // load first scene
                CS.currentSceneIndex = 0;
                var s = CS.currentScene = CS.scenes[0];
                s.show();
                CS.caption.set(s.caption);
                setTimeout(function () {
                    s.onEnter();
                });

                // key events
                window.addEventListener('keyup', function (e) {
                    if (CS.lock) return;
                    switch (e.keyCode) {
                        case 39:
                            CS.next();
                            break;
                        case 37:
                            CS.prev();
                        default:
                            break;
                    }
                });

                CS.leftButton.addEventListener('click', function() {
                    CS.prev();
                }, false);

                CS.rightButton.addEventListener('click', function() {
                    CS.next();
                }, false);

            });

        },

        loadTemplates: function (callback) {

            var total = this.scenes.length;
            for (var i = 0, j = this.scenes.length; i < j; ++i) {
                CS.getTemplate(this.scenes[i].id, function (data, id) {
                    CS.templates[id] = data;
                    total--;
                    if (total === 0) {
                        callback();
                    }
                });
            }

        },

        getTemplate: function (id, callback) {

            var url = 'templates/' + id + '.html';

            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.addEventListener('load', function (e) {
                if (request.status === 200) {
                    callback(request.responseText, id);
                }
            });
            request.send();

        },

        next: function () {
            if (!CS.currentScene.next()) {
                if (CS.nextScene()) {
                    CS.updateProgress(1);
                }
            } else {
                CS.updateProgress(1);
            }
        },

        prev: function () {
            if (!CS.currentScene.prev()) {
                if (CS.prevScene()) {
                    CS.updateProgress(-1);
                }
            } else {
                CS.updateProgress(-1);
            }
        },

        nextScene: function () {

            if (CS.currentSceneIndex >= CS.scenes.length - 1) return false;

            var newScene = CS.scenes[CS.currentSceneIndex + 1];

            CS.currentScene.hide('prev');
            newScene.show();
            CS.currentSceneIndex++;
            CS.currentScene = newScene;
            CS.caption.set(newScene.caption);

            return true;

        },

        prevScene: function () {

            if (CS.currentSceneIndex <= 0) return false;

            var newScene = CS.scenes[CS.currentSceneIndex - 1];
            CS.currentScene.hide('next');
            newScene.show();
            CS.currentSceneIndex--;
            CS.currentScene = newScene;

            var cap = newScene.getPrevCaption(newScene.currentStepIndex);
            CS.caption.set(cap, 'prev');

            return true;

        },

        updateProgress: function (inc) {

            this.currentStep += inc;
            this.progressBar.style.width = ~~(this.currentStep / (this.totalSteps - 1) * 100) + '%';

            if (this.currentStep == this.totalSteps-1) {
                CS.rightButton.classList.add('hidden');
            } else { 
                CS.rightButton.classList.remove('hidden');
            }

            if (this.currentStep == 0) {
                CS.leftButton.classList.add('hidden');
            } else { 
                CS.leftButton.classList.remove('hidden');
            }

        },

        log: function (msg) {
            if (CS.debug) {
                console.log(msg);
            }
        }

    };

    window.CHOREO = pub;

    // Helper functions, hoisted

    function $ (selector) {
        return window.document.querySelector(selector);
    }

    function $$ (selector) {
        return window.document.querySelectorAll(selector);
    }

})(window);

window.onload = CHOREO.init;