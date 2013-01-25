var Scene = function (mixin) {

    // mix in provided properties
    for (var prop in mixin) {
        if (prop !== 'classes') {
            this[prop] = mixin[prop];
        }
    }

    this.visible = false;
    this.inTransition = false;

    // create dom element
    this.el = document.createElement('div');
    this.el.id = this.id;
    this.el.style.display = 'none';
    this.el.classList.add('scene');
    if (!this.first) this.el.classList.add('next');

    var el = this.el;
    if (mixin.classes) {
        mixin.classes.forEach(function (c) {
            el.classList.add(c);
        });
    }

    // init steps
    if (!this.steps) this.steps = [];
    this.currentStepIndex = -1;
    this.currentStep = null;

    // push self
    CS.scenes.push(this);

};

Scene.prototype = {

    init: function () {

        this.el.innerHTML = CS.templates[this.id];
        document.getElementById('wrapper').appendChild(this.el);

        if (this.onInit) {
            this.onInit();
        }

    },

    show: function () {

        this.visible = true;
        this.inTransition = true;

        this.el.style.display = 'block';
        this.beforeEnter();

        var s = this,
            el = this.el,
            cl = el.classList;

        var callback = function (e) {
            if (e.target !== el) return;
            el.removeEventListener('webkitTransitionEnd', callback);
            if (!s.visible) return;
            s.onEnter();
            s.inTransition = false;
        };

        setTimeout(function () {
            if (cl.contains('next')) {
                cl.remove('next');
            }
            if (cl.contains('prev')) {
                cl.remove('prev');
            }
            el.addEventListener('webkitTransitionEnd', callback);
        }, 0);
    },

    hide: function (dir) {

        this.visible = false;
        this.inTransition = true;

        this.beforeExit();

        this.el.classList.add(dir || 'prev');

        var s = this,
            el = this.el;
        var callback = function (e) {
            if (e.target !== el) return;
            el.removeEventListener('webkitTransitionEnd', callback);
            if (s.visible) return;
            el.style.display = 'none';
            s.onExit();
            s.inTransition = false;
        };
        el.addEventListener('webkitTransitionEnd', callback);

    },

    beforeEnter: function () {
        //CS.log(this.id + ' before enter');
    },

    onEnter: function () {
        //CS.log(this.id + ' entered');
    },

    beforeExit: function () {
        //CS.log(this.id + ' before exit');
    },

    onExit: function () {
        //CS.log(this.id + ' exit');
    },

    next: function () {

        if (this.currentStepIndex >= this.steps.length - 1) {
            return false;
        }

        this.currentStepIndex++;
        var nextStep = this.steps[this.currentStepIndex];
        if (nextStep.onEnter) {
            nextStep.onEnter();
        }
        this.currentStep = nextStep;
        CS.caption.set(nextStep.caption);

        return true;
        
    },

    prev: function () {

        if (this.currentStepIndex < 0) {
            return false;
        }

        this.currentStepIndex--;
        var nextStep = this.steps[this.currentStepIndex];
        if (this.currentStep && this.currentStep.onBack) {
            this.currentStep.onBack();
        }
        this.currentStep = nextStep;

        // caption
        var cap = this.getPrevCaption(this.currentStepIndex);
        CS.caption.set(cap, 'prev');

        return true;
        
    },

    // This allows optional caption in steps.
    // Recursively trace backwards until there is a caption
    getPrevCaption: function (i) {
        var step = this.steps[i];
        if (step) {
            if (step.caption) {
                return step.caption;
            } else {
                return this.getPrevCaption(i - 1);
            }
        } else {
            return this.caption;
        }
    }

};