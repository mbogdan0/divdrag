/* global define */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module !== "undefined" && module.exports) {
        // CommonJS/Node module
        module.exports = factory();
    } else {
        // Browser globals
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
        var _options = {opacityOnMove: 0.5, marginWindow: 3};
        this.options = Object.assign({}, _options, options || {});
        this.element = document.querySelectorAll(options.element)[0];
        if (this.options.moveElement) {
            this.moveElement = document.querySelectorAll(options.moveElement)[0];
        } else {
            this.moveElement = this.element;
        }

        this.dragObject = null;
        this.mouseOffset = null;

        function outOfWindow() {
            var obj = _this.element.getBoundingClientRect();
            var margin = _this.options.marginWindow;
            var h = window.innerHeight,
                w = window.innerWidth;

            if (obj.top + obj.height + margin > h) {
                _this.dragObject.style.top = (h - obj.height - margin) + 'px';
            }
            if (obj.top < margin) {
                _this.dragObject.style.top = (margin) + 'px';
            }
            if (obj.left < margin) {
                _this.dragObject.style.left = (margin) + 'px';
            }
            if (obj.left + obj.width + margin > w) {
                _this.dragObject.style.left = (w - obj.width - margin) + 'px';
            }
        }

        function mouseMove(e) {
            if (!(_this.dragObject && _this.mouseOffset)) return false;
            var x = e.pageX - _this.mouseOffset.x;
            var y = e.pageY - _this.mouseOffset.y;
            _this.dragObject.style.top = y + 'px';
            _this.dragObject.style.left = x + 'px';
            return false;
        }

        function mouseDown (event) {
            if (event.which !== 1) return false;
            console.log(this);

            _this.dragObject = _this.element;
            _this.mouseOffset = getMouseOffset(_this.dragObject, event);
            _this.dragObject.style.opacity = _this.options.opacityOnMove;
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
            _this.dragObject.style.opacity = 1;
            _this.dragObject = null;
            _this.mouseOffset = null;
            document.onmousemove = null;
            document.onmouseup = null;
            document.ondragstart = null;
            document.body.onselectstart = null;
        }

        this.moveElement.onmousedown = mouseDown;

    };
    return divdrag;
}));