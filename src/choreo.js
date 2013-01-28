// Choreo Core
// provides minimal sequence control

;(function (window, undefined) {

    // TODO: parse url args for debugging =====================================

    var _debug               = false

    // Private variables ======================================================

    var _scenes              = []

    var _lock                = false,
        _keyboardEnabled     = true

    var _totalScenes         = 0,
        _currentScene        = null,
        _currentSceneIndex   = -1

    var _totalSteps          = 0,
        _currentStep         = null,
        _currentStepIndex    = 0

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
        var steps = this.steps
        stepsArr.forEach(function (stepOptions) {
            steps.push(new Step(stepOptions))
        })
    }

    Scene.prototype.nextStep = function () {

    }

    Scene.prototype.prevStep = function () {

    }

    // Step ===================================================================

    var Step = function (options) {

    }

    Events.mixTo(Step)

    // The public API object ==================================================

    var pub = window.CHOREO || {
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

    Events.mixTo(pub)

    pub.addScene = function (id, setupFunc) {
        var scene = new Scene(id)
        _scenes.push(scene)
        setupFunc(scene)
    }

    pub.start = function () {
        // count stuff
        _totalScenes = _scenes.length
        _scenes.forEach(function (scene) {
            _totalSteps += scene.steps.length
        })

        // listen for events

    }

    pub.next = function () {
        if (_lock) return
    }

    pub.prev = function () {
        if (_lock) return
    }

    pub.getScene = function (id) {
        for (var i = 0, j = _scenes.length; i < j; i++) {
            if (_scenes[i].id === id) {
                return _scenes[i]
            }
        }
    }

    pub.lock = function () {
        _lock = true
    }

    pub.unlock = function () {
        _lock = false
    }

    pub.enableKeyboard = function () {
        _keyboardEnabled = true
    }

    pub.disableKeyboard = function () {
        _keyboardEnabled = false
    }

    // Hoisted Helpers ========================================================

    function getLastValidCaption (scene) {

    }

    window.CHOREO = pub

}) (window)