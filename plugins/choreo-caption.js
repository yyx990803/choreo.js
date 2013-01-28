// Provides animated caption text (non-intrusive)

// options:
//   - position: top | bottom

;(function () {

    CS.caption = {

        el: document.getElementById('caption'),

        currentEls: [],

        set: function (msg, dir) {

            if (!msg) return;
            if (this.currentEls.length > 0) {
                var curMsg = this.currentEls[this.currentEls.length - 1].innerText;
                if (msg === curMsg) return;
            }

            dir = dir || 'next';

            // create new element
            var newMsg = document.createElement('span');
            newMsg.innerText = msg;
            newMsg.classList.add('caption-text');
            newMsg.classList.add(dir);

            // remove existing
            var opposite = dir === 'prev' ? 'next' : 'prev';
            var els = this.currentEls,
                i = els.length,
                el;
            while (i--) {
                remove(els[i], i, dir, opposite);
            }

            // move new one in
            this.currentEls.push(newMsg);
            this.el.appendChild(newMsg);
            setTimeout(function () {
                newMsg.classList.remove(dir);
            }, 0);

        }

    };

    function remove (el, i, dir, opposite) {
        el.classList.remove(dir);
        el.classList.add(opposite);
        var callback = function () {
            el.removeEventListener('webkitTransitionEnd', callback);
            el.parentNode.removeChild(el);
        }
        el.addEventListener('webkitTransitionEnd', callback);
        CS.caption.currentEls.splice(i, 1);
    }

}());