/* global define */
(function (root, factory) {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
    } else {
        root.divdrag = factory();
    }
}(this, function () {

    function getPosition(e) {
        var left = 0, top = 0;
        while (e.offsetParent) {
            left += e.offsetLeft;
            top += e.offsetTop;
            e = e.offsetParent;
        }
        left += e.offsetLeft;
        top  += e.offsetTop;
        return {x: left, y: top};
    }

    var divdrag = function (options) {
        var _this = this;
        var _options = {
            opacityOnMove: 0.5,
            marginWindow: 3,
            savePosition: true
        };

        this.options = Object.assign({}, _options, options || {});
        if (!this.options.element) {
            throw new Error("A constructor should have an \"element\" option");
        }

        var elem = document.querySelectorAll(options.element);
        if (elem && elem.length && elem[0] instanceof HTMLElement) {
            this.element = elem[0];
        } else {
            throw new Error(options.element + " is not found");
        }

        if (this.options.savePosition) {
            var pos = localStorage.getItem("divdrag" + this.options.element);
            if (pos) {
                try {
                    pos = JSON.parse(pos);
                    this.element.style.top = pos.top;
                    this.element.style.left = pos.left;
                    outOfWindow();
                } catch(e){}
            }
        }


        if (this.options.moveElement) {
            var move = document.querySelectorAll(options.moveElement);
            if (move && move.length && move[0] instanceof HTMLElement) {
                this.moveElement = move[0];
            } else {
                throw new Error(options.moveElement + " is not found");
            }
        } else {
            this.moveElement = this.element;
        }


        this.mouseOffset = null;

        function outOfWindow() {
            var obj = _this.element.getBoundingClientRect();
            var margin = _this.options.marginWindow;
            var h = window.innerHeight,
                w = window.innerWidth;

            if (obj.top + obj.height + margin > h) {
                _this.element.style.top = (h - obj.height - margin) + 'px';
            }
            if (obj.top < margin) {
                _this.element.style.top = (margin) + 'px';
            }
            if (obj.left < margin) {
                _this.element.style.left = (margin) + 'px';
            }
            if (obj.left + obj.width + margin > w) {
                _this.element.style.left = (w - obj.width - margin) + 'px';
            }

            localStorage.setItem("divdrag" + _this.options.element, JSON.stringify({
                top: _this.element.style.top,
                left: _this.element.style.left
            }));
        }

        function mouseMove(e) {
            if (!(_this.element && _this.mouseOffset)) return false;
            var x = e.pageX - _this.mouseOffset.x;
            var y = e.pageY - _this.mouseOffset.y;
            _this.element.style.top = y + 'px';
            _this.element.style.left = x + 'px';
            return false;
        }

        function mouseDown (event) {
            if (event.which !== 1) return false;
            _this.mouseOffset = getMouseOffset(_this.element, event);
            _this.element.style.opacity = _this.options.opacityOnMove;
            document.onmousemove = mouseMove;
            document.onmouseup = mouseUp;

            document.ondragstart = function() { return false };
            document.body.onselectstart = function() { return false };
            return false;
        }

        function getMouseOffset(target, e) {
            var docPos = getPosition(target);
            return {x: e.pageX - docPos.x, y: e.pageY - docPos.y};
        }

        function mouseUp() {
            outOfWindow();
            _this.element.style.opacity = 1;
            _this.mouseOffset = null;
            document.onmousemove = null;
            document.onmouseup = null;
            document.ondragstart = null;
            document.body.onselectstart = null;
        }

        this.moveElement.onmousedown = mouseDown;
        window.onresize = outOfWindow;
    };
    return divdrag;
}));