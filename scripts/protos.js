﻿// A few convenience methods for HTML elements.

export const isFirefox = typeof InstallTrigger !== 'undefined';

export function injectNewDOMMethods() {
    Element.prototype.show = function () {
        this.style.display = "";
    };

    Element.prototype.hide = function () {
        this.style.display = "none";
    };

    Element.prototype.lock = function () {
        this.disabled = "disabled";
    };

    Element.prototype.unlock = function () {
        this.disabled = "";
    };

    HTMLCanvasElement.prototype.resize = function () {
        this.width = this.clientWidth * devicePixelRatio;
        this.height = this.clientHeight * devicePixelRatio;
    };

    const oldAddEventListener = HTMLInputElement.prototype.addEventListener;

    HTMLInputElement.prototype.addEventListener = function (evtName, func, bubbles) {
        if (evtName === "enter") {
            oldAddEventListener.call(this, "keypress", function (evt) {
                if (evt.key === "Enter") {
                    func(evt);
                }
            });
        }
        else {
            oldAddEventListener.call(this, evtName, func, bubbles);
        }
    };
}

export function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

export function lerp(a, b, p) {
    return (1 - p) * a + p * b;
}

export function project(v, min, max) {
    return (v - min) / (max - min);
}

export function unproject(v, min, max) {
    return v * (max - min) + min;
}