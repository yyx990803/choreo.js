// Choreo Core
// provides minimal sequence control

;(function (window, undefined) {

    // TODO: parse url args for debugging =====================================

    var _debugLevel          = 0

    // Private variables ======================================================

    var _scenes              = []

    var _lock                = false,
        _keyboardEnabled     = true

    var _totalScenes,
        _currentScene,
        _currentSceneIndex

    var _totalSteps,
        _currentStep,
        _currentStepIndex

    // Event System ===========================================================
    // - thanks to: https://github.com/aralejs/events

    var eventSplitter = /\s+/

    var Events = function () {}

    Events.prototype.on = function (events, callback, context) {
        var cache, event, list
        if (!callback) return this

        cache = this.__events || (this.__events = {})
        events = events.split(eventSplitter)

        while (event = events.shift()) {
            list = cache[event] || (cache[event] = [])
            list.push(callback, context)
        }

        return this
    }

    Events.prototype.off = function (events, callback, context) {
        var cache, event, list, i

        if (!(cache = this.__events)) return this
        if (!(events || callback || context)) {
            delete this.__events
            return this
        }

        events = events ? events.split(eventSplitter) : Object.keys(cache)

        while (event = events.shift()) {
            list = cache[event]
            if (!list) continue

            if (!(callback || context)) {
                delete cache[event]
                continue
            }

            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback ||
                        context && list[i + 1] !== context)) {
                    list.splice(i, 2)
                }
            }
        }

        return this
    }

    Events.prototype.trigger = function(events) {
        var cache, event, all, list, i, len, rest = [], args
        if (!(cache = this.__events)) return this

        events = events.split(eventSplitter)

        for (i = 1, len = arguments.length; i < len; i++) {
            rest[i - 1] = arguments[i]
        }

        while (event = events.shift()) {
            if (all = cache.all) all = all.slice()
            if (list = cache[event]) list = list.slice()

            if (list) {
                for (i = 0, len = list.length; i < len; i += 2) {
                    list[i].apply(list[i + 1] || this, rest)
                }
            }

            if (all) {
                args = [event].concat(rest)
                for (i = 0, len = all.length; i < len; i += 2) {
                    all[i].apply(all[i + 1] || this, args)
                }
            }
        }

        return this
    }

    Events.mixTo = function(receiver) {
        receiver = receiver.prototype || receiver
        var proto = Events.prototype

        for (var p in proto) {
            if (proto.hasOwnProperty(p)) {
                receiver[p] = proto[p]
            }
        }
    }

    // Scene ==================================================================

    var Scene = function (id) {

        this.id                 = id
        this.caption            = ''
        this.steps              = []
        this.exports            = {}

        this.currentStep        = null
        this.currentStepIndex   = 0

    }

    Events.mixTo(Scene)

    Scene.prototype.addSteps = function (stepsArr) {
        for (var i = 0, j = stepsArr; i < j; i++) {
            this.steps.push(new Step(stepsArr[i]))
        }
    }

    Scene.prototype.nextStep = function () {

    }

    Scene.prototype.prevStep = function () {

    }

    Scene.prototype.hasNextStep = function () {

    }

    Scene.prototype.hasPrevStep = function () {

    }

    // Step ===================================================================

    var Step = function (options) {

    }

    Events.mixTo(Step)

    // Private methods ========================================================

    function _nextScene () {
        choreo.trigger('next-scene')
        _currentScene.trigger('exit', 1) // +1 means going forward
        _currentSceneIndex += 1
        _currentScene = _scenes[_currentSceneIndex]
        _currentScene.trigger('enter', 1)
    }

    function _prevScene () {
        choreo.trigger('prev-scene')
        _currentScene.trigger('exit', -1) // -1 means going backwards
        _currentSceneIndex -= 1
        _currentScene = _scenes[_currentSceneIndex]
        _currentScene.trigger('enter', -1)
    }

    function _hasNextScene () {
        return _currentSceneIndex + 1 < _totalScenes
    }

    function _hasPrevScene () {
        return _currentSceneIndex > 0
    }

    function _log (msg) {
        
    }

    // Public API object ======================================================

    var choreo = window.CHOREO || {
        get totalSteps () {
            return _totalSteps
        },
        get isLocked () {
            return _lock
        },
        get currentStep () {
            return _currentStep
        },
        get currentStepIndex () {
            return _currentStepIndex
        },
        get currentScene () {
            return _currentScene
        },
        get currentSceneIndex () {
            return _currentSceneIndex
        }
    }

    Events.mixTo(choreo)

    choreo.addScene = function (id, setupFunc) {
        var scene = new Scene(id)
        _scenes.push(scene)
        setupFunc(scene)
    }

    choreo.start = function () {
        // count stuff
        _totalScenes = _scenes.length
        _totalSteps  = 0
        _scenes.forEach(function (scene) {
            _totalSteps += scene.steps.length
        })

        // listen for keyboard events
        window.addEventListener('keyup', function (e) {
            if (!_keyboardEnabled) return
            switch (e.keyCode) {
                case 39:
                    choreo.next()
                    break
                case 37:
                    choreo.prev()
                default:
                    break
            }
        })

        // set to first step
        _currentSceneIndex  = 0
        _currentStepIndex   = 0
        _currentScene       = _scenes[0]
        _currentStep        = _currentScene.steps[0]
        
    }

    choreo.next = function () {
        if (_lock) return
        if (_currentScene.hasNextStep()) {
            choreo.trigger('next')
            _currentScene.nextStep()
        } else if (_hasNextScene()) {
            choreo.trigger('next')
            _nextScene()
        }
    }

    choreo.prev = function () {
        if (_lock) return
        if (_currentScene.hasPrevStep()) {
            choreo.trigger('prev')
            _currentScene.prevStep()
        } else if (_hasPrevScene()) {
            choreo.trigger('prev')
            _prevScene()
        }
    }

    choreo.getScene = function (id) {
        for (var i = 0, j = _scenes.length; i < j; i++) {
            if (_scenes[i].id === id) {
                return _scenes[i]
            }
        }
    }

    choreo.lock = function () {
        _lock = true
    }

    choreo.unlock = function () {
        _lock = false
    }

    choreo.enableKeyboard = function () {
        _keyboardEnabled = true
    }

    choreo.disableKeyboard = function () {
        _keyboardEnabled = false
    }

    choreo.setDebugLevel = function (level) {
        _debugLevel = level;
    }

    window.CHOREO = choreo

}) (window)