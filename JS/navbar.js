(function() {
var block, i, j, len, len1, ref, ref1, responsiveMenu, slideToggler, trigger,
  indexOf = [].indexOf;

slideToggler = class slideToggler {
  constructor(el1) {
    this.getHeight = this.getHeight.bind(this);
    this.toggle = this.toggle.bind(this);
    this.el = el1;
    if (!this.el) {
      return;
    }
    window.addEventListener('resize', this.getHeight);
  }

  getHeight() {
    var clone;
    clone = this.el.cloneNode(true);
    clone.style.cssText = 'visibility: hidden; display: block; margin: -999px 0';
    this.height = (this.el.parentNode.appendChild(clone)).clientHeight;
    this.el.parentNode.removeChild(clone);
    return this.height;
  }

  toggle(time) {
    var currHeight, disp, el, end, init, repeat, start;
    this.getHeight();
    time || (time = this.height / 3 + 150);
    currHeight = this.el.clientHeight * (getComputedStyle(this.el).display !== 'none');
    [start, end] = currHeight > this.height / 2 ? [this.height, 0] : [0, this.height];
    disp = end - start;
    el = this.el;
    this.el.classList[end === 0 ? 'remove' : 'add']('open');
    this.el.style.cssText = "overflow: hidden; display: block;";
    init = (new Date).getTime();
    repeat = function() {
      var instance, ref, repeatLoop, step;
      instance = (new Date).getTime() - init;
      step = start + disp * instance / time;
      if (instance <= time) {
        el.style.height = step + 'px'; // if Math.floor(step) in [start..end]
      } else {
        el.style.cssText = `display: ${(end === 0 ? 'none' : 'block')}`;
      }
      repeatLoop = requestAnimationFrame(repeat);
      if (ref = Math.floor(step), indexOf.call((function() {
        var results = [];
        for (var i = start; start <= end ? i <= end : i >= end; start <= end ? i++ : i--){ results.push(i); }
        return results;
      }).apply(this), ref) < 0) {
        return cancelAnimationFrame(repeatLoop);
      }
    };
    return repeat();
  }

};

ref = document.querySelectorAll('.block');
for (i = 0, len = ref.length; i < len; i++) {
  block = ref[i];
  block.toggler = new slideToggler(block);
}

ref1 = document.querySelectorAll('button');
for (j = 0, len1 = ref1.length; j < len1; j++) {
  trigger = ref1[j];
  trigger.addEventListener('click', function() {
    var ref2;
    return (ref2 = this.parentNode.querySelector('.block').toggler) != null ? ref2.toggle() : void 0;
  });
}

responsiveMenu = class responsiveMenu {
  constructor(nav, opt) {
    var base, k, l, len2, len3, len4, m, menu, menuToggle, ref2, ref3, ref4, sub, subMenu, subMenuToggle;
    this.createToggle = this.createToggle.bind(this);
    this.breaking = this.breaking.bind(this);
    this.opt = opt;
    (base = this.opt).breaking || (base.breaking = '640px');
    this.opt.maxBreaking = parseInt(this.opt.maxBreaking) || 1040;
    menu = nav.querySelector('.menu');
    if (!slideToggler) {
      slideToggler = class slideToggler {
        constructor(el1) {
          this.toggle = this.toggle.bind(this);
          this.el = el1;
          if (!this.el) {
            return;
          }
        }

        toggle() {
          this.el.classList.toggle('open');
          return this.el.style.cssText = `display: ${(this.el.classList.contains('open') ? 'block' : 'none')}`;
        }

      };
    }
    ref2 = menu.querySelectorAll('ul');
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      sub = ref2[k];
      sub.toggler = new slideToggler(sub);
    }
    menuToggle = this.createToggle(nav, 'menu-toggle', 'Menu');
    menuToggle.addEventListener('click', function() {
      document.documentElement.classList.toggle('nav-open');
      return menuToggle.menu.classList.toggle('open', document.documentElement.classList.contains('nav-open'));
    });
    ref3 = menu.querySelectorAll('ul');
    for (l = 0, len3 = ref3.length; l < len3; l++) {
      subMenu = ref3[l];
      subMenu.parentNode.classList.add('has-children');
      subMenuToggle = this.createToggle(subMenu, 'sub-menu-toggle', '+');
      subMenuToggle.addEventListener('click', function() {
        var len4, m, open, ref4, results;
        this.menu.toggler.toggle();
        ref4 = this.parentNode.parentNode.querySelectorAll('ul.open');
        results = [];
        for (m = 0, len4 = ref4.length; m < len4; m++) {
          open = ref4[m];
          if (open !== this.menu) {
            results.push(open.toggler.toggle());
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
    }
    ref4 = menu.querySelectorAll('.has-children[class*=current] > ul');
    for (m = 0, len4 = ref4.length; m < len4; m++) {
      sub = ref4[m];
      sub.classList.add('open');
    }
    document.addEventListener('DOMContentLoaded', this.breaking);
    window.addEventListener('resize', this.breaking);
    setTimeout(this.breaking, 3000);
  }

  createToggle(menu, klass, label) {
    var toggle;
    toggle = menu.parentNode.querySelector(`.${klass}`) || document.createElement("button");
    toggle.classList.add(klass);
    toggle.appendChild(document.createTextNode(label));
    toggle.menu = menu.nodeName === 'UL' ? menu : menu.querySelector('.menu');
    return menu.parentNode.insertBefore(toggle, menu.nextSibling);
  }

  breaking() {
    var div, el, isMobile, k, len2, ref2, windowWidth;
    document.body.classList.remove('menu-mobile');
    document.body.classList.add('menu-desktop');
    div = document.createElement('div');
    div.style.cssText = `position: absolute; width: ${this.opt.breaking}`;
    document.body.appendChild(div);
    this.menuBreak = div.clientWidth || 0;
    document.body.removeChild(div);
    ref2 = document.querySelectorAll(`${this.opt.breaking}`);
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      el = ref2[k];
      this.menuBreak += this.getWidth(el);
    }
    isMobile = (windowWidth = document.body.clientWidth) <= Math.min(this.menuBreak, this.opt.maxBreaking);
    document.body.classList.toggle('menu-mobile', isMobile);
    document.body.classList.toggle('menu-desktop', !isMobile);
    if (!isMobile) {
      return document.documentElement.classList.remove('nav-open');
    }
  }

  getWidth(el) {
    var clone, width;
    if (el.clientWidth > 0) {
      return el.clientWidth;
    }
    clone = el.cloneNode(true);
    clone.style.cssText = 'position: absolute; visibility: hidden; display: block;';
    el.parentNode.appendChild(clone);
    width = clone.clientWidth;
    el.parentNode.removeChild(clone);
    return width;
  }

};

new responsiveMenu(document.querySelector('#nav'), {
  breaking: '.logo, .tagline, .menu'
});

}).call(this);
