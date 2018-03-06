;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-mp-return" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M656.807 220.522h-360.94v-103.93c0-37.82-26.050-52.047-57.862-31.621l-193.632 124.218c-31.867 20.426-31.867 53.822 0 74.22l193.632 124.245c31.84 20.426 57.862 6.172 57.862-31.648v-86.726h343.737c189.863 0 292.181 85.142 292.181 274.978 0 144.015-56.47 274.978-292.181 274.978h-481.226c-0.219 0-0.41 0.137-0.628 0.164-0.518-0.028-1.010-0.164-1.53-0.164-23.729 0-42.954 19.251-42.954 42.98s19.223 42.954 42.954 42.954c0.518 0 1.010-0.137 1.53-0.164 0.219 0 0.41 0.164 0.628 0.164h498.429c189.863 0 343.737-119.521 343.737-309.357v-103.11c0-189.863-153.873-292.181-343.737-292.181v0zM656.807 220.522z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-renwu" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M658.614707 649.777947c-51.479465-12.371772-76.937277-79.836303-31.416524-127.696334 60.920488-58.503439 101.498672-158.347424 101.498672-257.735016 0-153.919579-97.018637-247.654426-216.695321-247.654426-119.677707 0-216.697367 93.734848-216.697367 247.654426 0 99.029434 40.324404 198.621686 100.862175 257.124102l-0.356111 0c46.435589 48.114834 20.570501 116.390847-31.465642 128.510886-201.448058 38.899962-347.651908 150.19986-347.651908 233.498008 0 102.597703 221.73715 123.827213 495.307829 123.827213 273.569656 0 495.305783-21.228487 495.305783-123.827213C1007.307318 800.031019 860.595908 688.527482 658.614707 649.777947z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)