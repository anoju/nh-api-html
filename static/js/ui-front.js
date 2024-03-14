/********************************
 * UI 스크립트 *
 * 작성자 : 안효주 *
 ********************************/
/** polyfill **/
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {
    if (this === null) throw new TypeError('this is null or not defined');
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
    var array = Object(this);
    var length = array.length >>> 0;
    for (var i = 0; i < length; i++) {
      if (i in array) callback.call(thisArg, array[i], i, array);
    }
  };
}
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

/** init **/
const ui = {
  pageWidth: 1800,
  className: {
    lock: '.lock',
    wrap: '.page',
    mainWrap: '.page',
    header: '.page-head',
    headerInner: '.head-inner',
    headerLeft: '.head-left',
    headerRight: '.head-right',
    title: '.head-title',
    body: '.page-body',
    contents: '.page-contents',
    btnTop: '.btn-page-top',
    floatingBtn: '.floating-btn',
    popup: '.popup',
    topFixed: '.top-fixed'
  },
  basePath: function () {
    let rtnVal = '/static';
    if (location.pathname.indexOf('/nh-api-html/') > -1) rtnVal = '/nh-api-html' + rtnVal;
    // else rtnVal = '/portal' + rtnVal;
    return rtnVal;
  },
  isInit: false,
  init: function () {
    if (ui.isInit) {
      ui.reInit();
    } else {
      ui.isInit = true;
      Loading.ready();
      ui.common.init();
      ui.util.init();
      ui.button.init();
      ui.tooltip.init();
      ui.form.init();
      ui.list.init();
      ui.scroll.init();
      ui.animation.init();
      ui.animation.splitting();
      Layer.init();
    }
  },
  reInit: function () {
    ui.common.reInit();
    ui.util.reInit();
    ui.button.reInit();
    ui.tab.reInit();
    ui.tooltip.reInit();
    ui.form.reInit();
    ui.list.reInit();
    ui.animation.init();
    ui.animation.splitting();
    Layer.reInit();
  },
  isLoadInit: false,
  loadInit: function () {
    if (ui.isLoadInit) return;
    ui.isLoadInit = true;
    ui.common.loadInit();
    ui.button.loadInit();
    ui.form.loadInit();
    ui.list.loadInit();
  }
};

$(function () {
  ui.device.check();

  const $elements = $.find('*[data-include-html]');
  if ($elements.length) {
    ui.html.include().done(ui.init);
  } else {
    ui.init();
  }
});

$(window).on('load', function () {
  ui.loadInit();

  $(window).resize();
});
$(window).on('scroll resize', function () {
  ui.common.fixedInit();
  ui.common.fixedResize();
});
$(window).on('resize', function () {
  ui.tab.resize();
  ui.form.selectResize();
  // ui.tooltip.resize();
  Layer.resizeUI();
});

//Html include
ui.html = {
  include: function () {
    const dfd = $.Deferred();
    const $elements = $.find('*[data-include-html]');
    if ($elements.length) {
      if (location.host) {
        $.each($elements, function (i) {
          const $this = $(this);
          $this.empty();
          const $html = $this.data('include-html');
          const $htmlAry = $html.split('/');
          const $htmlFile = $htmlAry[$htmlAry.length - 1];
          const $docTitle = document.title;
          let $title = null;
          if ($docTitle.indexOf(' | ') > -1) {
            $title = $docTitle.split(' | ')[0];
          }
          $this.load($html, function (res, sta, xhr) {
            if (sta == 'success') {
              if (!$this.attr('class') && !$this.attr('id')) $this.children().unwrap();
              else $this.removeAttr('data-include-html');
            }
            if (i === $elements.length - 1) {
              dfd.resolve();
              $(window).trigger('includHtml');
            }
          });
        });
      } else {
        dfd.resolve();
        $(window).trigger('includHtml');
      }
    } else {
      dfd.resolve();
      $(window).trigger('includHtml');
    }
    return dfd.promise();
  }
};

/** 디바이스 확인 **/
ui.device = {
  screenH: window.screen.height,
  screenW: window.screen.width,
  check: function () {
    ui.mobile.check();
    ui.pc.check();
    if (ui.mobile.any()) {
      const $pixelRatio = Math.round(window.devicePixelRatio);
      if (!!$pixelRatio) $('html').addClass('pixel-ratio-' + $pixelRatio);

      //가로, 세로 회전시
      if (window.screen.orientation.angle == 0) $('html').removeClass('landscape');
      else $('html').addClass('landscape');
      $(window).on('orientationchange', function () {
        if (window.screen.orientation.angle == 0) {
          $('html').removeClass('landscape');
        } else {
          $('html').addClass('landscape');
        }
      });

      // 최소기준 디바이스(가로)크기보다 작으면 meta[name="viewport"] 수정
      const deviceMinWidth = 320;
      if ($(window).width() < deviceMinWidth) {
        const $viewport = $('meta[name="viewport"]');
        const $newContent = 'width=' + deviceMinWidth + ',user-scalable=no,viewport-fit=cover';
        $viewport.attr('content', $newContent);
      }
    }
  }
};
//PC
ui.pc = {
  window: function () {
    return navigator.userAgent.match(/windows/i) == null ? false : true;
  },
  mac: function () {
    return navigator.userAgent.match(/macintosh/i) == null ? false : true;
  },
  chrome: function () {
    return navigator.userAgent.match(/chrome/i) == null ? false : true;
  },
  firefox: function () {
    return navigator.userAgent.match(/firefox/i) == null ? false : true;
  },
  opera: function () {
    return navigator.userAgent.match(/opera|OPR/i) == null ? false : true;
  },
  safari: function () {
    return navigator.userAgent.match(/safari/i) == null ? false : true;
  },
  oldedge: function () {
    return navigator.userAgent.match(/edge/i) == null ? false : true;
  },
  edge: function () {
    return navigator.userAgent.match(/edg/i) == null ? false : true;
  },
  msie: function () {
    return navigator.userAgent.match(/rv:11.0|msie/i) == null ? false : true;
  },
  ie11: function () {
    return navigator.userAgent.match(/rv:11.0/i) == null ? false : true;
  },
  ie10: function () {
    return navigator.userAgent.match(/msie 10.0/i) == null ? false : true;
  },
  ie9: function () {
    return navigator.userAgent.match(/msie 9.0/i) == null ? false : true;
  },
  ie8: function () {
    return navigator.userAgent.match(/msie 8.0/i) == null ? false : true;
  },
  any: function () {
    return ui.pc.window() || ui.pc.mac();
  },
  check: function () {
    if (ui.pc.any()) {
      $('html').addClass('pc');
      if (ui.pc.window()) $('html').addClass('window');
      if (ui.pc.mac()) $('html').addClass('mac');
      if (ui.pc.msie()) $('html').addClass('msie');
      if (ui.pc.ie11()) $('html').addClass('ie11');
      if (ui.pc.ie10()) $('html').addClass('ie10');
      if (ui.pc.ie9()) $('html').addClass('ie9');
      if (ui.pc.ie8()) $('html').addClass('ie8');
      if (ui.pc.oldedge()) {
        $('html').addClass('old-edge');
      } else if (ui.pc.edge()) {
        $('html').addClass('edge');
      } else if (ui.pc.opera()) {
        $('html').addClass('opera');
      } else if (ui.pc.chrome()) {
        $('html').addClass('chrome');
      } else if (ui.pc.safari()) {
        $('html').addClass('safari');
      } else if (ui.pc.firefox()) {
        $('html').addClass('firefox');
      }
    }
  }
};
//모바일
ui.mobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i) == null ? false : true;
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
  },
  iPhone: function () {
    return navigator.userAgent.match(/iPhone/i) == null ? false : true;
  },
  iPad: function () {
    return navigator.userAgent.match(/iPad/i) == null ? false : true;
  },
  iPhoneVersion: function () {
    const $sliceStart = navigator.userAgent.indexOf('iPhone OS') + 10;
    const $sliceEnd = $sliceStart + 2;
    const $version = parseFloat(navigator.userAgent.slice($sliceStart, $sliceEnd));
    return $version;
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
  },
  tabletCheckWidth: 760,
  tablet: function () {
    if (ui.mobile.any()) {
      if (window.screen.width < window.screen.height) {
        return window.screen.width > ui.mobile.tabletCheckWidth ? true : false;
      } else {
        return window.screen.height > ui.mobile.tabletCheckWidth ? true : false;
      }
    }
  },
  any: function () {
    return ui.mobile.Android() || ui.mobile.iOS() || ui.mobile.BlackBerry() || ui.mobile.Opera() || ui.mobile.Windows();
  },
  check: function () {
    if (ui.mobile.any()) {
      $('html').addClass('mobile');
      if (ui.mobile.tablet()) $('html').addClass('tablet');
    }
    if (ui.mobile.iOS()) $('html').addClass('ios');
    if (ui.mobile.Android()) $('html').addClass('android');
    //if(ui.mobile.iPhoneVersion() >= 12)$('html').addClass('ios12');
  }
};

/** common **/
ui.common = {
  init: function () {
    ui.common.imgSrc();
    ui.common.fixedInit();
    ui.common.UI();
    ui.common.menu();
    ui.common.menuActive();
  },
  reInit: function () {
    ui.common.imgSrc();
    ui.common.fixedInit();
    ui.common.lottie();
  },
  loadInit: function () {
    ui.common.menuActive();
    ui.common.lottie();
  },
  fixedInit: function () {
    ui.common.fixed('.page-title-wrap');
    ui.common.fixed('.tab-fixed');
    // ui.common.fixed('.page-lnb-inner.active');
    ui.common.fixed('.page-quick');
    ui.common.fixedResize();
  },
  fixed: function (target, isBottom, isConfine) {
    if (isBottom === undefined) isBottom = false;
    if (isConfine === undefined) isConfine = false;
    const $target = $(target);
    if (!$target.length) return;
    $target.each(function () {
      const $this = $(this);
      if ($('html').hasClass(ui.className.lock.slice(1))) return false;
      const $scrollTop = $(window).scrollTop();
      if ($this.closest(ui.className.popup).length) return;
      $this.addClass('__top-fixed');
      // const $topMargin = getTopFixedHeight($this);
      let $topEl = $this;
      const $offsetTop = $this.data('top') !== undefined ? $this.data('top') : Math.max(0, getOffset(this).top);
      const $thisH = $this.outerHeight();
      // const $isFixed = isBottom ? $scrollTop + $topMargin > $offsetTop + $thisH : $scrollTop + $topMargin > $offsetTop;
      const $isFixed = isBottom ? $scrollTop > $offsetTop + $thisH : $scrollTop > $offsetTop;
      if ($isFixed) {
        $this.data('top', $offsetTop);
        $this.addClass(ui.className.topFixed.slice(1));
        if ($topEl.css('position') !== 'fixed' && $topEl.css('position') !== 'sticky') $topEl = $topEl.children();
        //if ($topMargin > parseInt($topEl.css('top')) && $topEl.css('position') === 'fixed') $topEl.css('top', $topMargin);
      } else {
        $this.removeData('top');
        if ($topEl.css('position') !== 'fixed' && $topEl.css('position') !== 'sticky') $topEl = $topEl.children();
        // $topEl.removeCss('top');
        $this.removeClass(ui.className.topFixed.slice(1));
      }
    });
  },
  fixedResize: function () {
    const winWidth = $(window).width();
    const winScrollLeft = $(window).scrollLeft();
    const $el = $('.__top-fixed');
    $el.each(function () {
      const $this = $(this);
      if ($this.css('position') === 'sticky') return;
      let $target = $this.data('target');
      if ($target === undefined) {
        $target = $this;
        if ($this.css('position') !== 'fixed' && $this.children().length === 1) $target = $this.children();
        $this.data('target', $target);
      }
      if (winWidth < ui.pageWidth && $this.hasClass('top-fixed') && winScrollLeft > 0) {
        $target.css('transform', 'translateX(-' + winScrollLeft + 'px)');
      } else {
        $target.removeCss('transform');
      }
    });
  },
  lottie: function (readyEvt, completeEvt) {
    const $lottie = $('[data-lottie]');
    if (!$lottie.length) return;
    if (!location.host) {
      return console.log('lottie는 서버에서만 지원됩니다.');
    }
    const $lottieInit = function () {
      $lottie.each(function () {
        const _this = this;
        const $this = $(this);
        // $this.empty();
        if (!$this.hasClass('lottie__init')) {
          const $data = $this.data('lottie');
          $this.addClass('lottie__init').removeAttr('data-lottie').aria('hidden', true);
          const $loopOpt = $this.hasClass('_loop');
          const $stopOpt = $this.hasClass('_stop');
          const $sclAnimation = $this.data('animation');
          let $autoplayOpt = true;
          if ($sclAnimation || $stopOpt) {
            $autoplayOpt = false;
          }
          const $lottieOpt = lottie.loadAnimation({
            container: this,
            renderer: 'svg',
            loop: $loopOpt,
            autoplay: $autoplayOpt,
            path: $data
          });
          $this.data('lottie-opt', $lottieOpt);
          $lottieOpt.addEventListener('config_ready', function () {
            if (!!readyEvt) readyEvt(_this, $lottieOpt);
          });
          if ($loopOpt) {
            $lottieOpt.addEventListener('loopComplete', function () {
              if (!!completeEvt) completeEvt(_this, $lottieOpt);
            });
          } else {
            $lottieOpt.addEventListener('complete', function () {
              if (!!completeEvt) completeEvt(_this, $lottieOpt);
            });
          }
        }
      });
    };
    if (typeof lottie === 'undefined') {
      const $url = '/js/lib/lottie.5.11.0.min.js';
      ui.util.loadScript($url).then($lottieInit);
    } else {
      $lottieInit();
    }
  },
  menuActive: function () {
    const $menuHtml = $('[data-menu-active]');
    const $menuIdHtml = $('[data-menu-id-view]');
    let $gnb = $('#gnb .page-gnb');
    let $lnb = $('#lnb');
    const $activeClassName = 'active';
    const $breadcrumb = $('.breadcrumb');
    const $breadcrumbArry = [];
    let clfMhnm = getUrlParams().clfMhnm;
    if (!!clfMhnm) clfMhnm = decodeURI(decodeURIComponent(clfMhnm));

    function gnbFindTxt(str) {
      $findMenu = $('#gnb .page-gnb, #lnb');
      $findMenu.find('a').each(function () {
        const $this = $(this);
        if ($this.text() === str) $this.parent('li').addClass($activeClassName);
      });
    }

    if ($menuIdHtml.length) {
      function menuIdFn() {
        if (!!clfMhnm) gnbFindTxt(clfMhnm);
        let menuID = $menuIdHtml.data('menu-id-view');
        const $meunID = $("[data-menu-id='" + menuID + "']");
        $meunID.each(function () {
          const $this = $(this);
          $this.addClass($activeClassName).parents('li').addClass($activeClassName);
          const $lnb = $this.closest('.page-lnb-inner');
          if ($lnb.length) $lnb.removeClass('hide').addClass('active').siblings('.page-lnb-inner').remove();
        });
        const $gnbActive = $gnb.find('.' + $activeClassName);
        if ($gnbActive.length) {
          $gnbActive.each(function () {
            const $this = $(this);
            $breadcrumbArry.push($this.children('a').text());
          });
        }
        const $menuTitEl = $('[data-menu-title]');
        if ($menuTitEl.length) {
          const $menuTit = $menuTitEl.data('menu-title');
          $breadcrumbArry.push($menuTit);
        }
        if ($('.page-title h2').length) {
          let $title = $breadcrumbArry.length ? $breadcrumbArry[$breadcrumbArry.length - 1] : '타이틀';
          if (menuID.indexOf('API_MGMT') > -1) {
            const keyNo = getUrlParams().keyNo;
            const $subTxt = !!keyNo ? ' 상세' : ' 목록';
            $title = $title + ' - ' + $breadcrumbArry[0] + $subTxt;
          }
          $('.page-title h2').html($title);
        }
      }

      menuIdFn();
      makeBreadcrumb();
      ui.common.menu();
    } else if ($menuHtml.length) {
      let menuActive = $menuHtml.data('menu-active');
      menuActive = menuActive.split(',');
      const dep1 = menuActive[0] === undefined ? -1 : Number($.trim(menuActive[0]));
      const dep2 = menuActive[1] === undefined ? -1 : Number($.trim(menuActive[1]));
      const dep3 = menuActive[2] === undefined ? -1 : Number($.trim(menuActive[2]));
      function menuActiveFn(type, dep1Selector, dep2Selector, dep3Selector) {
        $gnb = $('#gnb .page-gnb');
        $lnb = $('#lnb');
        let $dep1;
        let $dep2;
        let $dep3;
        if (dep1 >= 0) {
          if (type === 'gnb') {
            if (!$gnb.length) return;
            $dep1 = $gnb.find(dep1Selector).eq(dep1);
            if ($dep1.length) {
              $breadcrumbArry.push($dep1.children('a').text());
              $dep1.addClass($activeClassName);
            }
          } else if (type === 'lnb') {
            if (!$lnb.length) return;
            const $lnbInner = $lnb.find(dep1Selector);
            if ($lnbInner.length === 1) {
              $dep1 = $lnbInner;
            } else {
              $dep1 = $lnbInner.eq(dep1);
              $dep1.removeClass('hide').addClass('active').siblings().remove();
            }
          }
        }
        if (dep2 >= 0 && $dep1.length) {
          $dep2 = $dep1.find(dep2Selector).eq(dep2);
          if ($dep2.length) {
            if (type === 'gnb') $breadcrumbArry.push($dep2.children('a').text());
            $dep2.addClass($activeClassName);
          }
        }
        if (dep3 >= 0 && $dep2.length) {
          $dep3 = $dep2.find(dep3Selector).eq(dep3);
          if ($dep3.length) {
            if (type === 'gnb') $breadcrumbArry.push($dep3.children('a').text());
            $dep3.addClass($activeClassName);
          }
        }
      }

      let menuTimer = 0;
      if (!$gnb.length || !$lnb.length) menuTimer = ui.pc.msie() ? 300 : 50;
      setTimeout(function () {
        if (!!clfMhnm) gnbFindTxt(clfMhnm);
        menuActiveFn('gnb', '> li', '.depth2 > li', '.depth3 > li');
        menuActiveFn('lnb', '.page-lnb-inner', '.page-lnb-menu > li', '.depth3 > li');
        makeBreadcrumb();
        ui.common.menu();
      }, menuTimer);
    }

    function makeBreadcrumb() {
      if (!$breadcrumb.length || !$breadcrumbArry.length || $breadcrumb.data('init')) return;
      $breadcrumb.data('init', true);
      let $etcLi = '';
      if ($breadcrumb.children('li').length > 1) $etcLi = $breadcrumb.children('li').first().next();
      $.each($breadcrumbArry, function () {
        const $appendHtml = '<li>' + this + '</li>';
        if (!$etcLi) {
          $breadcrumb.append($appendHtml);
        } else {
          $etcLi.before($appendHtml);
        }
      });
    }
  },
  menu: function () {
    //gnb depth3
    function menuSetToggle(target) {
      const $target = $(target);
      if (!$target.length) return;
      $target.find('li').each(function () {
        const $this = $(this);
        if ($this.hasClass('not-toggle')) return;
        const $btn = $this.children('a');
        if ($this.children('.depth3').length) {
          $btn.addClass('toggle');
          if ($this.hasClass('active')) $btn.addClass('open');
        }
      });
    }
    menuSetToggle('.page-gnb');
    menuSetToggle('.page-lnb-menu');
    if ($('.page-lnb-inner.active').length) $('.page-lnb-wrap').removeClass('hide');
    else if ($('.page-lnb-inner').length === $('.page-lnb-inner.hide').length) $('.page-lnb-wrap').addClass('hide');
  },
  imgSrc: function () {
    const $img = document.querySelectorAll('img');
    if ($img.length) {
      $img.forEach(function (img) {
        const $src = img.getAttribute('src');
        if (location.protocol !== 'file:' && $src.indexOf('../') === 0 && $src.indexOf('/static') > 0) {
          let $newSrc = ui.basePath() + $src.split('/static').pop();
          img.setAttribute('src', $newSrc);
        }
      });
    }
  },
  UI: function () {
    // gnb, lnb, head-info-btn
    $(document).on('click', '.page-gnb a.toggle, .page-lnb-menu a.toggle, .head-info-btn', function (e) {
      e.preventDefault();
      const $this = $(this);
      $this.toggleClass('open');
    });

    // 전체메뉴
    $(document).on('click', '.page-gnb-btn', function (e) {
      e.preventDefault();
      const $this = $(this);
      $this.toggleClass('open');
      const $wrap = $('.all-menu-inner');
      const $gnb = $('.page-gnb');
      if (!$wrap.find('.all-menu').length) {
        const $clone = $gnb.clone();
        $clone.removeClass('page-gnb').addClass('all-menu');
        $wrap.prepend($clone);
      }
      if ($this.hasClass('open')) Body.lock();
      else Body.unlock();
    });
    $(document).on('click', '.all-menu-close', function (e) {
      e.preventDefault();
      Body.unlock();
      $('.page-gnb-btn').removeClass('open').focus();
    });

    // gnb
    let focusTimer;
    $(document).on('focusin', '.page-gnb a', function (e) {
      const $this = $(this);
      let $li = $this.closest('li');
      if ($this.closest('.depth3').length) $li = $this.closest('li').closest('li').closest('li');
      else if ($this.closest('.depth2').length) $li = $this.closest('li').closest('li');
      clearTimeout(focusTimer);
      $li.addClass('focus').siblings('li').removeClass('focus');
    });
    $(document).on('focusout', '.page-gnb a', function (e) {
      let $li = $('.page-gnb li');

      focusTimer = setTimeout(function () {
        $li.removeClass('focus');
      }, 10);
    });

    $(document).on('click', ui.className.mainWrap, function (e) {
      if (!$('html').hasClass(ui.className.lock.slice(1))) $(window).scroll();
    });

    //footer
    $(document).on('click', '.foot-link-btn', function (e) {
      e.preventDefault();
      const $linkSelect = $('.foot-link-select select');
      const $linkSelectVal = $linkSelect.val();
      if (!$linkSelectVal) return;
      window.open($linkSelectVal);
    });
  }
};
ui.util = {
  init: function () {
    ui.util.lazyImg();
  },
  reInit: function () {
    ui.util.lazyImg();
  },
  path: function (type) {
    let $path = location.pathname;
    let $returnVal = $path;
    if ($.isNumeric(type)) {
      if ($path.indexOf('/') >= 0) {
        $path = $path.split('/');
        $returnVal = $path[type];
      }
    } else if (type === 'file') {
      if ($path.indexOf('/') >= 0) $returnVal = $path.split('/').pop();
    } else if (type === 'fileName') {
      if ($path.indexOf('/') >= 0) $path = $path.split('/').pop();
      if ($path.indexOf('.') >= 0) {
        $returnVal = $path.split('.').shift();
      } else {
        $returnVal = $path;
      }
    } else if (type === 'fileType') {
      if ($path.indexOf('/') >= 0) $path = $path.split('/').pop();
      if ($path.indexOf('.') >= 0) {
        $returnVal = $path.split('.').pop();
      } else {
        $returnVal = null;
      }
    }
    return $returnVal;
  },
  loadCss: function (url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = ui.basePath() + url;
    document.getElementsByTagName('head')[0].appendChild(link);
  },
  loadScript: function (url) {
    const dfd = $.Deferred();
    const isString = typeof url === 'string';
    let i = 0;
    const $length = isString ? 1 : url.length;
    function appendTag() {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      const $url = isString ? url : url[i];
      if (!$url) return;
      script.src = ui.basePath() + $url;
      document.getElementsByTagName('head')[0].appendChild(script);
      if (script.readyState) {
        //IE
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null;
            if (i === $length - 1) {
              dfd.resolve();
            } else {
              i += 1;
              appendTag();
            }
          }
        };
      } else {
        //Others
        script.onload = function () {
          if (i === $length - 1) {
            dfd.resolve();
          } else {
            i += 1;
            appendTag();
          }
        };
      }
    }

    appendTag();
    return dfd.promise();
  },
  lazyImg: function () {
    let lazyloadImages;
    let lazyloadThrottleTimeout;
    lazyloadImages = document.querySelectorAll('.lazy');
    if (!lazyloadImages.length) return false;
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const image = entry.target;
            if (image.dataset.src) image.src = image.dataset.src;
            image.classList.remove('lazy');
            imageObserver.unobserve(image);
          }
        });
      });

      lazyloadImages.forEach(function (image) {
        imageObserver.observe(image);
      });
    } else {
      const lazyload = function () {
        if (lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout);
        }

        lazyloadThrottleTimeout = setTimeout(function () {
          const scrollTop = window.scrollY;
          lazyloadImages.forEach(function (img) {
            if (img.offsetTop < window.innerHeight + scrollTop) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
            }
          });
          if (lazyloadImages.length == 0) {
            document.removeEventListener('scroll', lazyload);
            window.removeEventListener('resize', lazyload);
            window.removeEventListener('orientationChange', lazyload);
          }
        }, 20);
      };

      document.addEventListener('scroll', lazyload);
      window.addEventListener('resize', lazyload);
      window.addEventListener('orientationChange', lazyload);
    }
  }
};
ui.etc = {
  console: function (txt, delay) {
    if (delay == undefined) delay = 3000;
    const $consoles = $('.console');
    let $top = 0;
    let $last = '';
    if ($consoles.length) {
      $last = $('.console').last();
      $top = parseInt($last.css('top')) + $last.outerHeight();
    }
    const $wrap = $(ui.className.mainWrap + ':visible').length ? $(ui.className.mainWrap + ':visible') : $('body');
    $wrap.append('<div class="console">' + txt + '</div>');
    $last = $('.console').last();
    if ($top > 0) $last.css('top', $top);
    $last.delay(delay).fadeOut(500, function () {
      $(this).remove();
    });
  }
};

/** button **/
ui.button = {
  init: function () {
    ui.button.default();
    ui.button.reset();
    ui.button.effect();
    ui.tab.init();
    ui.button.UI();
  },
  reInit: function () {
    ui.button.loadInit();
  },
  loadInit: function () {
    ui.tab.loadInit();

    //링크없는 a태그 role=button 추가
    $('a').each(function (e) {
      const $href = $(this).attr('href');
      const $role = $(this).attr('role');
      if (!$(this).hasClass('no-button')) {
        if ($href == undefined || $href == '#' || $href == '#none') {
          if ($href == undefined || $href == '#') $(this).attr({ href: '#none' });
          $(this).removeAttr('target');
          if ($role == undefined) $(this).attr('role', 'button');
        } else {
          // if (($href.startsWith('#') || $href.startsWith('javascript')) && $role == undefined) $(this).attr('role', 'button');
          if (($href.indexOf('#') === 0 || $href.indexOf('javascript') === 0) && $role == undefined) $(this).attr('role', 'button');
        }
      }

      if ($(this).attr('title') === undefined) {
        if ($(this).attr('target') === '_blank') $(this).attr('title', '새창열림');
        // if ($(this).hasClass('tel') || ($href != undefined && $href.startsWith('tel'))) $(this).attr('title', '전화걸기');
        if ($(this).hasClass('tel') || ($href != undefined && $href.indexOf('tel') === 0)) $(this).attr('title', '전화걸기');
      }
    });

    //type없는 button들 type 추가
    $('button').each(function (e) {
      const $type = $(this).attr('type');
      if ($type == undefined) $(this).attr('type', 'button');
    });
  },
  default: function () {
    //href가 #시작할때 a태그 클릭 시 기본속성 죽이기
    $(document).on('click', 'a', function (e) {
      const $href = $(this).attr('href');
      if (!$(this).hasClass('no-button') && $href != undefined) {
        //기본속성 살리는 클래스(스킵네비 등)
        // if ($href.startsWith('#')) {
        if ($href === '#' || $href.indexOf('#') === 0) {
          e.preventDefault();
        }
      }
    });
  },
  reset: function () {
    if ($('.btn-click-in').length) $('.btn-click-in').remove();
  },
  effect: function () {
    //버튼 클릭 효과
    const btnInEfList = '.button, .btn-click, .btn-click-outer, .radio.btn input, .checkbox.btn input, .ui-folding-btn, .ui-folding .folding-head .folding-btn';
    $(document).on('click', btnInEfList, function (e) {
      const $this = $(this);
      let $btnEl = $this;
      if (!$btnEl.is('a') && !$btnEl.is('button') && !$btnEl.is('input')) return;
      if ($btnEl.hasClass('not-click-ef')) return;
      if ($btnEl.is('input')) $btnEl = $btnEl.siblings('.lbl');
      if ($btnEl.hasClass('btn-click-outer')) $btnEl = $btnEl.offsetParent();
      const $delay = 650;
      if ($btnEl.is('.disabled') || $btnEl.is('.btn-heart') || $btnEl.is('.btn-click-not') || $btnEl.css('position') === 'static') return;
      if (!$btnEl.find('.btn-click-in').length) $btnEl.addClass('btn-clicking-active').append('<i class="btn-click-in"></i>');
      const $btnIn = $btnEl.find('.btn-click-in').last();
      const $btnMax = Math.max($btnEl.outerWidth(), $btnEl.outerHeight());

      const $btnX = e.pageX - $btnEl.offset().left - $btnMax / 2;
      const $btnY = e.pageY - $btnEl.offset().top - $btnMax / 2;
      // const $btnX = e.offsetX - $btnMax / 2;
      // const $btnY = e.offsetY - $btnMax / 2;
      $btnIn
        .css({
          left: $btnX,
          top: $btnY,
          width: $btnMax,
          height: $btnMax
        })
        .addClass('animate')
        .delay($delay)
        .queue(function (next) {
          $btnIn.remove();
          $btnEl.removeClass('btn-clicking-active');
          next();
        });
    });
  },
  loading: function (element, show) {
    const loadingElClass = '.loading-svg';
    const activeClass = '.loading';
    const $element = $(element);
    if (show === undefined) show = true;
    if (!$element) return;
    const $elW = $element.outerWidth();
    const $elH = $element.outerHeight();
    const $min = $elW < $elH ? $elW / 2 : $elH / 2;
    // const $max = $elW < $elH ? $elH : $elW;
    let $html = '<div class="' + loadingElClass.slice(1) + '" role="img">';
    $html += '<svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">';
    $html += '<circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>';
    $html += '</svg>';
    $html += '</div>';
    if (show) {
      $element.addClass(activeClass.slice(1));
      $element.append($html);
    } else {
      console.log('loading false', $element);
      $element.find(loadingElClass).remove();
      $element.removeClass(activeClass.slice(1));
    }
  },
  UI: function () {
    $(document).on('click', ui.className.btnTop, function (e) {
      e.preventDefault();
      const $page = $(this).closest(ui.className.wrap);
      ui.scroll.top(0, 200).then(function () {
        // console.log('페이지 스크롤');
      });
      $page.find($focusableEl).first().focus();
    });

    $(document).on('click', 'a[data-pop-size]', function (e) {
      e.preventDefault();
      const $this = $(this);
      const $href = $this.attr('href');
      let $popsize = $this.data('pop-size');

      if ($popsize && $popsize.indexOf(',') > 0) {
        $popsize = $popsize.split(',');
        const $popWidth = parseInt($.trim($popsize[0]));
        const $popHeight = parseInt($.trim($popsize[1]));
        winPop($href, $popWidth, $popHeight);
      } else {
        winPop($href);
      }
    });

    $(document).on('click', '.ui-pop-print', function (e) {
      e.preventDefault();
      const $this = $(this);
      const $popWrap = $this.closest('.' + Layer.className.wrap);
      $popWrap.printThis({
        debug: true
      });
    });
  }
};

// 탭
ui.tab = {
  init: function () {
    ui.tab.tabInfo();
    ui.tab.ariaSet();
    ui.tab.UI();
    ui.tab.ready();
  },
  reInit: function () {
    ui.tab.ariaSet();
    ui.tab.ready();
  },
  loadInit: function () {
    ui.tab.ready();
  },
  className: {
    inner: '.tab-inner',
    list: '.tab-list',
    item: '.tab',
    line: '.tab-line',
    lineIng: '.tab-line-moving',
    active: '.active',
    panels: '.tab-panels',
    panel: '.tab-panel'
  },
  aria: function (element) {
    if ($(element).length) {
      $(element).each(function () {
        const $this = $(this);
        let $tablist = null;
        let isFirst = false;
        if ($this.is('ul') || $this.hasClass(ui.tab.className.list)) {
          $tablist = $this;
        } else if ($this.find(ui.tab.className.list).length) {
          $tablist = $this.find(ui.tab.className.list);
        } else {
          $tablist = $this.find('ul');
        }
        if ($tablist.attr('role') != 'tablist') isFirst = true;
        if (isFirst) $tablist.attr('role', 'tablist');

        let $tab = $(this).find(ui.tab.className.item);
        if (!$tab.length) $tab = $(this).find('li');
        $tab.each(function (f) {
          const _a = $(this).find('a');
          if (_a.length) {
            if (isFirst) $(this).attr('role', 'presentation');
            if (isFirst) _a.attr('role', 'tab');
            if ($(this).hasClass(ui.tab.className.active.slice(1))) {
              _a.attr('aria-selected', true);
            } else {
              _a.attr('aria-selected', false);
            }
          }
        });
      });
    }
  },
  ariaSet: function () {
    if ($('.tab-navi-menu').length) ui.tab.aria('.tab-navi-menu');
    if ($('.tab-box-menu').length) ui.tab.aria('.tab-box-menu');
    if ($('.is-tab').length) ui.tab.aria('.is-tab');
    if ($('.ui-tab').length) ui.tab.aria('.ui-tab');
  },
  line: function (wrap, isAni) {
    if (isAni === undefined) isAni = true;
    let $wrap = $(wrap);
    if ($wrap.hasClass(ui.tab.className.inner.slice(1))) $wrap = $wrap.parent();
    if ($wrap.hasClass(ui.tab.className.list.slice(1))) $wrap = $wrap.closest(ui.tab.className.inner).parent();

    const $delay = $wrap.is(':visible') ? 0 : 10;
    setTimeout(function () {
      const $line = $wrap.find(ui.tab.className.line);
      if (!$line.length) return;
      const $LastLeft = $line.data('left') === undefined ? 0 : $line.data('left');
      const $LastWidth = $line.data('width') === undefined ? 0 : $line.data('width');
      const $inner = $wrap.find(ui.tab.className.inner);
      const $innerSclWidth = $inner.get(0).scrollWidth;
      const $innerSclGap = $innerSclWidth - $inner.outerWidth();
      // const $innerSclLeft = $inner.get(0).scrollLeft;
      const $isTy2 = $line.hasClass('ty2');
      const $list = $wrap.find(ui.tab.className.list);
      const $listLeft = parseInt($list.css('margin-left'));
      const $active = $wrap.find(ui.tab.className.active);
      const $tabBtn = $active.find('a');
      // const $tabWidth = $tabBtn.get(0).offsetWidth;
      // const $tabLeft = $active.get(0).offsetLeft + $tabBtn.get(0).offsetLeft;
      const $tabWidth = $tabBtn.outerWidth();
      const $tabLeft = $listLeft + $active.position().left + parseInt($active.css('margin-left')) + $tabBtn.position().left;
      const $tabRight = $innerSclWidth - $tabLeft - $tabWidth - $innerSclGap;

      const $activeColor = $active.data('color');
      if (!!$activeColor) $line.attr('data-color', $activeColor);
      else $line.removeAttr('data-color');

      if ($LastLeft === $tabLeft && $LastWidth === $tabWidth) return;
      if ($isTy2) {
        if (isAni) {
          const $delay = $innerSclGap < 10 ? 0 : 200;
          if ($LastLeft < $tabLeft) {
            $line
              .stop(true, false)
              .delay($delay)
              .animate(
                {
                  right: $tabRight
                },
                200,
                function () {
                  $wrap.addClass(ui.tab.className.lineIng.slice(1));
                  $line.css({
                    left: $tabLeft
                  });
                }
              );
          } else {
            $line
              .stop(true, false)
              .delay($delay)
              .animate(
                {
                  left: $tabLeft
                },
                200,
                function () {
                  $wrap.addClass(ui.tab.className.lineIng.slice(1));
                  $line.css({
                    right: $tabRight
                  });
                }
              );
          }
        } else {
          $line.css({
            left: $tabLeft,
            right: $tabRight
          });
        }
      } else {
        if (isAni) $wrap.addClass(ui.tab.className.lineIng.slice(1));
        $line.css({
          width: $tabWidth,
          left: $tabLeft
        });
      }
      if (isAni) {
        const transitionEndEvt = function () {
          $wrap.removeClass(ui.tab.className.lineIng.slice(1));
          $line.off('transitionend', transitionEndEvt);
        };
        $line.on('transitionend', transitionEndEvt);
      }
      $line.data('left', $tabLeft);
      $line.data('width', $tabWidth);
    }, $delay);
  },
  getInnerTxt: function (wrap) {
    let $wrap = $(wrap);
    if ($wrap.hasClass(ui.tab.className.inner.slice(1))) $wrap = $wrap.parent();
    if ($wrap.hasClass(ui.tab.className.list.slice(1))) $wrap = $wrap.parent().parent();
    const $firstClass = $wrap.attr('class').split(' ')[0];
    let $innerTxt = $firstClass;
    $wrap.find(ui.tab.className.item).each(function () {
      $innerTxt += ',' + $(this).text();
    });
    return $innerTxt;
  },
  tabInfoAry: null,
  tabInfo: function () {
    const $tabInfoSaveString = uiStorage.get('tabInfoSave');
    if ($tabInfoSaveString !== null) ui.tab.tabInfoAry = JSON.parse($tabInfoSaveString);

    const _tabInfoSave = function () {
      if (!$(ui.tab.className.inner).length) {
        uiStorage.remove('tabInfoSave');
      } else {
        const $saveAry = [];
        $(ui.tab.className.inner).each(function () {
          const stateObj = {};
          const $innerTxt = ui.tab.getInnerTxt(this);
          const $sclLeft = $(this).scrollLeft();
          const $line = $(this).find(ui.tab.className.line);
          const $lineLeft = parseInt($line.css('left'));
          const $lineWidth = parseInt($line.css('width'));
          stateObj.innerText = $innerTxt;
          stateObj.lineLeft = $lineLeft;
          stateObj.lineWidth = $lineWidth;
          stateObj.sclLeft = $sclLeft;
          $saveAry.push(stateObj);
        });
        if ($saveAry.length) uiStorage.set('tabInfoSave', JSON.stringify($saveAry));
      }
    };
    window.addEventListener('beforeunload', _tabInfoSave); // 안드로이드 크롬
    // window.addEventListener('unload', _tabInfoSave);
    if (ui.mobile.iOS()) {
      window.addEventListener('pagehide', _tabInfoSave); //ios safari
    }
  },
  scrolledCheck: function (wrap) {
    if (!$(wrap).length) return;
    $(wrap).each(function () {
      const $this = $(this);
      const $children = $this.children();
      const $isScrollX = ui.scroll.is($children).x;
      const $btnClass = 'tab-expand-btn';
      const $btn = '<div class="' + $btnClass + '"><button type="button" aria-label="펼쳐보기" aria-expanded="false"></button></div>';
      if ($isScrollX) {
        $this.addClass('scroll-able');
        if ($this.hasClass('tab-navi-menu') && !$this.find('.' + $btnClass).length) $this.append($btn);
      } else {
        $this.removeClass('scroll-able');
        if ($this.hasClass('tab-navi-menu') && $this.find('.' + $btnClass).length) $this.find('.' + $btnClass).remove();
      }
    });
  },
  activeCenter: function () {
    if ($(ui.tab.className.inner).length) {
      $(ui.tab.className.inner).each(function (i) {
        const $this = $(this);
        if (i === $(ui.tab.className.inner).length - 1) {
          setTimeout(function () {
            ui.tab.isTabInit = true;
          }, 5);
        }
        if ($this.closest('.ui-tab').length) return;

        const $line = $this.find(ui.tab.className.line);
        let isMove = false;
        let $delay = 1;

        if ($line.length) {
          const $innerTxt = ui.tab.getInnerTxt(this);
          $.each(ui.tab.tabInfoAry, function () {
            if (this.innerText === $innerTxt) {
              isMove = true;
              $delay = 50;
              $line.css({
                left: this.lineLeft,
                width: this.lineWidth
              });
              $this.scrollLeft(this.sclLeft);
            }
          });
        }

        if ($this.closest('.tab-navi-menu').length || $this.closest('.tab-box-menu').length) $delay = 50;
        setTimeout(function () {
          const $active = $this.find(ui.tab.className.active);
          if ($active.length) {
            ui.scroll.center($active, $delay * 10);
            ui.tab.line($this, isMove);
          }
        }, $delay);
      });
    }
  },
  active: function (target) {
    ui.tab.tabActive(target);
    const $target = $(target);
    const $btn = $target.is('a') ? $target : $target.find('a');
    const $href = $btn.attr('href');
    ui.tab.panelActive($href);
  },
  tabActive: function (target) {
    const $target = $(target);
    const $closest = $target.closest(ui.tab.className.inner).length ? $target.closest(ui.tab.className.inner) : $target.closest(ui.tab.className.list);
    const $btn = $target.is('a') ? $target : $target.find('a');
    const $tab = $btn.closest(ui.tab.className.item).length ? $btn.closest(ui.tab.className.item) : $btn.closest('li');

    $tab.addClass(ui.tab.className.active.slice(1)).siblings().removeClass(ui.tab.className.active.slice(1)).find('a').removeAttr('title').attr('aria-selected', false);
    $btn.attr('aria-selected', true);
    if ($closest.length) ui.tab.line($closest);
  },
  panelActive: function (panel, siblings, isAni, isScroll) {
    if (isAni === undefined) isAni = false;
    if (isScroll === undefined) isScroll = false;
    if (panel === '#') return;
    const $panel = $(panel);
    const $siblings = $(siblings);
    const $target = $panel.length ? $panel : $siblings;
    if (!$target.length) return;
    const $isPanel = $target.hasClass(ui.tab.className.panel.slice(1));
    let $panelWrap = $target.closest(ui.tab.className.panels);
    const $panelWrapH = $panelWrap === null ? 0 : $panelWrap.outerHeight();
    const $panelWrapGap = $panelWrap === null ? 0 : $panelWrapH - $panelWrap.height();
    if ((siblings === undefined || siblings === false || siblings === '') && $panel.length) {
      if ($isPanel) {
        $panel.siblings(ui.tab.className.panel).attr('aria-expanded', false).removeClass(ui.tab.className.active.slice(1));
        $panel.addClass(ui.tab.className.active.slice(1)).attr('aria-expanded', true);
      } else {
        $panel.show();
      }
    } else {
      if ($isPanel) {
        if ($siblings.length) $siblings.attr('aria-expanded', false).removeClass(ui.tab.className.active.slice(1));
        if ($panel.length) $panel.addClass(ui.tab.className.active.slice(1)).attr('aria-expanded', true);
      } else {
        if ($siblings.length) $siblings.hide();
        if ($panel.length) $panel.show();
      }
    }
    if ($isPanel && isAni && $panelWrap.length) {
      let $setHeight = $panelWrapGap;
      $panelWrap.find(ui.tab.className.panel + ui.tab.className.active).each(function () {
        $setHeight += $(this).outerHeight();
      });
      if ($panelWrapH !== $setHeight) {
        $panelWrap.css('height', $panelWrapH).animate({ height: $setHeight }, 300, function () {
          $panelWrap.removeCss('height');
          if ($panel.length && isScroll) {
            const $tabBtn = $('[href="#' + panel + '"]');
            const $tab = $tabBtn.length ? $tabBtn.closest(ui.tab.className.inner) : panel;
            ui.scroll.inScreen($tab, panel);
          }
        });
      }
    }
  },
  select: function () {
    if ($('.ui-tab-select').length) {
      $('.ui-tab-select').each(function () {
        const $tarAry = [];
        let $panel;
        $(this)
          .find('option')
          .each(function () {
            const $tar = $(this).data('show');
            if ($tarAry.indexOf($tar) < 0 && !!$tar) $tarAry.push($tar);
            if ($(this).is(':selected')) {
              $panel = $tar;
            }
          });
        const $siblings = $tarAry.join(',');
        $(this).data('hide', $siblings);
        ui.tab.panelActive($panel, $siblings);
      });
    }
  },
  radio: function () {
    if ($('.ui-tab-radio').length) {
      $('.ui-tab-radio').each(function () {
        let $panel;
        const $tarAry = [];
        $(this)
          .find('input[type=radio]')
          .each(function () {
            const $tar = $(this).data('show');
            if ($tarAry.indexOf($tar) < 0 && !!$tar) $tarAry.push($tar);
            if ($(this).prop('checked')) {
              $panel = $tar;
            }
          });
        const $siblings = $tarAry.join(',');
        $(this).data('hide', $siblings);
        if ($panel) ui.tab.panelActive($panel, $siblings);
      });
    }
  },
  checkbox: function () {
    if ($('.ui-tab-checkbox').length) {
      $('.ui-tab-checkbox').each(function () {
        const $tarAry = [];
        const $showAry = [];
        $(this)
          .find('input[type=checkbox]')
          .each(function () {
            const $tar = $(this).data('show');
            if ($tarAry.indexOf($tar) < 0 && !!$tar) $tarAry.push($tar);
            if ($(this).prop('checked')) {
              if ($showAry.indexOf($tar) < 0 && !!$tar) $showAry.push($tar);
            }
          });
        const $siblings = $tarAry.join(',');
        $(this).data('hide', $siblings);
        if ($showAry.length) {
          const $panel = $showAry.join(',');
          ui.tab.panelActive($panel, $siblings);
        }
      });
    }
  },
  isTabInit: false,
  ready: function () {
    // if ($('.tab-navi-menu').length) ui.tab.scrolledCheck('.tab-navi-menu');
    ui.tab.activeCenter();

    const $uiTab = $('.ui-tab');
    const $hash = location.hash;
    if ($uiTab.length) {
      $uiTab.each(function (e) {
        const $this = $(this);
        let $hashActive = null;
        const $tarAry = [];
        let $tab = $this.find(ui.tab.className.item);
        if (!$tab.length) $tab = $this.find('li');
        $tab.each(function (f) {
          const _a = $(this).find('a');
          let _aId = _a.attr('id');
          const _href = _a.attr('href');
          if (_a.length) {
            if (!_aId) _aId = 'tab_btn_' + e + '_' + f;
            _a.attr({
              id: _aId,
              'aria-controls': _href.substring(1)
            });
            if (_href !== '' && _href !== '#') {
              $tarAry.push(_href);
              if (_href === $hash || $(_href).find($hash).length) {
                $hashActive = _a;
              }
              if ($(_href).length) {
                $(_href).attr({
                  role: 'tabpanel',
                  'aria-labelledby': _aId
                });
              }
            }
          }
        });
        if ($tarAry.length) $this.data('target', $tarAry.join(','));

        let $active;
        if ($hashActive) {
          $active = $hashActive;
        } else if ($this.find(ui.tab.className.active.slice(1)).length) {
          $active = $this.find(ui.tab.className.active.slice(1)).find('a');
        } else {
          $active = $this.find('li').eq(0).find('a');
        }
        ui.tab.tabActive($active);
        const $href = $active.attr('href');
        ui.tab.panelActive($href);
      });
    }

    ui.tab.select();
    ui.tab.radio();
    ui.tab.checkbox();
  },
  resize: function () {
    //if ($('.tab-navi-menu').length) ui.tab.scrolledCheck('.tab-navi-menu');
    if ($(ui.tab.className.line).length && ui.tab.isTabInit) {
      $(ui.tab.className.line).each(function () {
        const $this = $(this);
        // if (parseInt($this.css('left')) === 0) return;
        const $parent = $this.closest(ui.tab.className.inner).parent();
        ui.tab.line($parent, false);
      });
    }
  },
  UI: function () {
    $(document).on('click', '.ui-tab a', function (e) {
      e.preventDefault();
      const $this = $(this);
      const $href = $this.attr('href');
      const $closest = $this.closest('.ui-tab');
      const $siblings = $closest.data('target');
      const $tab = $(this).closest(ui.tab.className.item).length ? $(this).closest(ui.tab.className.item) : $(this).closest('li');
      const $tabInner = $tab.closest(ui.tab.className.inner);
      ui.tab.tabActive($this);
      if ($tabInner.parent().hasClass('tab-scroll')) {
        ui.tab.panelActive($href, $siblings, true, true);
      } else {
        ui.tab.panelActive($href, $siblings, true);
      }
      if ($tabInner.length) {
        const isScroll = ui.scroll.is($tabInner).x;
        if (isScroll) ui.scroll.center($tab);
      }

      let $winScrollTop = $(window).scrollTop();

      const $topFixed = $this.closest(ui.className.topFixed);
      if ($topFixed.length) {
        const $topMargin = getTopFixedHeight($this);
        const $scrollMove = getOffset($topFixed[0]).top;
        if ($winScrollTop + $topMargin > $scrollMove) ui.scroll.top($scrollMove - $topMargin);
      }

      if ($($href).length) {
        //ui.animation
        if ($($href).find('.animate__animated').length) {
          setTimeout(function () {
            $($href).find('.animate__animated').addClass('paused');
            $(window).scroll();
          }, 100);
        }
        if ($($href).find('.rolling-number').length) {
          $($href)
            .find('.rolling-number')
            .each(function () {
              const $this = $(this);
              const $thisH = $this.height();
              $this.css({
                height: '',
                'line-height': ''
              });
              const $in = $this.find('.rolling__in').first().children().first();
              const $inH = $in.height();
              const $setH = $thisH < $inH ? $inH : $thisH;
              $this.css({
                height: $setH,
                'line-height': $setH + 'px'
              });
            });
        }
      }
    });

    $(document).on('click', '.tab-expand-btn button', function (e) {
      e.preventDefault();
      const $closest = $(this).closest('.tab-expand-btn');
      const $wrap = $closest.parent();
      const $list = $closest.siblings(ui.tab.className.inner).find(ui.tab.className.list).clone();
      if ($(this).hasClass('on')) {
        $(this).removeClass('on');
        $wrap.removeClass('is-expand');
        $closest.next('.tab-expand').remove();
      } else {
        $(this).addClass('on');
        if (!$wrap.find('.tab-expand').length) {
          $closest.after('<div class="tab-expand"></div>');
          const $expand = $closest.next('.tab-expand');
          $expand.append($list);
          $expand.find(ui.tab.className.list).removeClass(ui.tab.className.list.slice(1));
          $expand.find(ui.tab.className.item).removeClass(ui.tab.className.item.slice(1));
        }
        $wrap.addClass('is-expand');
      }
    });

    //select tab
    $(document).on('change', '.ui-tab-select', function (e) {
      const $show = $(this).find(':selected').data('show');
      const $hide = $(this).data('hide');
      ui.tab.panelActive($show, $hide, true);
    });

    //radio tab
    $(document).on('change click', '.ui-tab-radio input', function (e) {
      const $show = $(this).data('show');
      const $hide = $(this).closest('.ui-tab-radio').data('hide');
      ui.tab.panelActive($show, $hide, true, true);
    });

    //checkbox tab
    $(document).on('change', '.ui-tab-checkbox input', function (e) {
      const $closest = $(this).closest('.ui-tab-checkbox');
      const $hide = $closest.data('hide');
      const $showAry = [];
      $closest.find('input[type=checkbox]').each(function () {
        const $tar = $(this).data('show');
        if ($(this).prop('checked')) {
          if ($showAry.indexOf($tar) < 0 && !!$tar) $showAry.push($tar);
        }
      });
      if ($showAry.length) {
        const $panel = $showAry.join(',');
        ui.tab.panelActive($panel, $hide, true);
      } else {
        ui.tab.panelActive(false, $hide, true);
      }
    });

    //scrollto
    $(document).on('click', '.ui-tab-scrollto a', function (e) {
      e.preventDefault();
      const $this = $(this);
      const $href = $this.attr('href');
      const $wrap = $(ui.className.mainWrap + ':visible');
      const $header = $wrap.find(ui.className.header);
      const $headH = $header.length ? $header.outerHeight() : 0;
      const $top = $($href).offset().top - $headH;
      ui.scroll.top($top);
    });
  }
};
//툴팁
ui.tooltip = {
  className: {
    wrap: '.tooltip-wrap',
    btn: '.tooltip-btn',
    active: '.on',
    body: '.tooltip-body',
    inner: '.tooltip-inner',
    arrow: '.tooltip-arr',
    closeBtn: '.tooltip-close'
  },
  resize: function () {
    if (!$(ui.tooltip.className.btn + ui.tooltip.className.active).length) return;
    $(ui.tooltip.className.btn + ui.tooltip.className.active).each(function () {
      const $btn = $(this);
      const $wrap = $btn.closest(ui.tooltip.className.wrap);
      const $body = $wrap.find(ui.tooltip.className.body);
    });
  },
  position: function (btn, wrap) {
    const $btn = $(btn);
    const $wrap = $(wrap);
    const $body = $wrap.find(ui.tooltip.className.body);
    let $inner = $body.find(ui.tooltip.className.inner);
    let $arrow = $body.find(ui.tooltip.className.arrow);
    let $closeBtn = $body.find(ui.tooltip.className.closeBtn);
    if (!$inner.length) $body.wrapInner('<div class="' + ui.tooltip.className.inner.slice(1) + '"></div>');
    $inner = $body.find(ui.tooltip.className.inner);
    if (!$arrow.length) $body.prepend('<i class="' + ui.tooltip.className.arrow.slice(1) + '" aria-hidden="true"></i>');
    $arrow = $body.find(ui.tooltip.className.arrow);
    if (!$closeBtn.length) $inner.append('<a href="#" class="' + ui.tooltip.className.closeBtn.slice(1) + '" role="button" aria-label="툴팁닫기"></a>');
    $closeBtn = $body.find(ui.tooltip.className.closeBtn);

    const $contents = $(ui.className.contents);
    const $contentsL = $contents.offset().left;
    const $contentsW = $contents.outerWidth();
    const $btnL = $btn.offset().left;
    const $btnW = $btn.outerWidth();
    const $bodyL = $body.offset().left;
    const $bodyW = $body.outerWidth();
    let $left = $bodyW / 2 - $btnW / 2;
    const $left2 = $btnL - $contentsL;
    if ($btnL - $left < $contentsL) $left = $left2;
    const $left3 = $btnL - $contentsL - $contentsW + $bodyW;
    console.log($contentsW, $bodyW, $left3);
    if ($btnL - $left + $bodyW > $contentsL + $contentsW) $left = $left3;
    $body.children(ui.tooltip.className.arrow).css({
      left: $left + $btnW / 2
    });
    $body.css({
      left: -$left
    });
  },
  aria: function (element) {
    $(element).each(function (e) {
      const $btn = $(this).find(ui.tooltip.className.btn);
      const $body = $(this).find(ui.tooltip.className.body);
      let $bodyId = $body.attr('id');
      const $closeBtn = $(this).find(ui.tooltip.className.closeBtn);
      if (!$bodyId) $bodyId = 'ttCont-' + e;
      $btn.attr({
        role: 'button'
        // 'aria-describedby': $bodyId
      });
      $body.attr({
        // id: $bodyId,
        role: 'tooltip'
      });
      $closeBtn.attr('role', 'button');
    });
  },
  jqTooltip: function () {
    if ($('.jq-tooltip').length) {
      $('.jq-tooltip').tooltip({
        position: {
          my: 'left-50% bottom-5',
          at: 'center top'
        }
      });
    }
  },
  reInit: function () {
    ui.tooltip.aria(ui.tooltip.className.wrap);
    ui.tooltip.jqTooltip();
  },
  init: function () {
    ui.tooltip.aria(ui.tooltip.className.wrap);
    ui.tooltip.jqTooltip();

    //열기
    $(document).on('click', ui.tooltip.className.wrap + ' ' + ui.tooltip.className.btn, function (e) {
      e.preventDefault();
      const $this = $(this);
      const $wrap = $this.closest(ui.tooltip.className.wrap);
      const $body = $wrap.find(ui.tooltip.className.body);
      if ($this.hasClass('is-pop')) {
        const $popContent = $body.html();
        const $popTitle = $body.attr('title');
        if ($popTitle !== undefined) {
          Layer.tooltip($popContent, $popTitle);
        } else {
          Layer.tooltip($popContent);
        }
      } else {
        if ($this.hasClass(ui.tooltip.className.active.slice(1))) {
          $body.stop(true, false).fadeOut();
          $this.removeClass(ui.tooltip.className.active.slice(1));
        } else {
          $(ui.tooltip.className.btn).removeClass(ui.tooltip.className.active.slice(1));
          $(ui.tooltip.className.body).fadeOut();
          $this.addClass(ui.tooltip.className.active.slice(1));
          $body.stop(true, false).fadeIn();
          setTimeout(function () {
            ui.tooltip.position($this, $wrap);
          }, 30);
        }
      }
    });
    //닫기
    $(document).on('click', ui.tooltip.className.closeBtn, function (e) {
      e.preventDefault();
      const $body = $(this).closest(ui.tooltip.className.body);
      const $btn = $body.siblings(ui.tooltip.className.btn);
      $btn.removeClass(ui.tooltip.className.active.slice(1));
      $body.stop(true, false).fadeOut(500, function () {
        $btn.focus();
      });
    });
    $(document)
      .on('click touchend', function (e) {
        $(ui.tooltip.className.body).stop(true, false).fadeOut();
        $(ui.tooltip.className.wrap + ' ' + ui.tooltip.className.btn).removeClass(ui.tooltip.className.active.slice(1));
      })
      .on('click touchend', ui.tooltip.className.wrap, function (e) {
        e.stopPropagation();
      });
  }
};

/** form **/
ui.form = {
  init: function () {
    ui.form.focusUI();
    ui.form.selectUI();
    ui.form.inputUI();
    ui.form.input();
    ui.form.select();
    ui.form.textarea();
    ui.form.textareaUI();
    ui.form.textCountInit();
    ui.form.textCountUI();
    ui.form.byteCountInit();
    ui.form.byteCountUI();
    ui.form.fileDrag();

    ui.form.spinnerUI();
    ui.form.spinner();
    ui.form.jqRange();
    ui.form.jqCalendar('input.datepicker');
    ui.form.jqTimepicker('input.timepicker');
  },
  reInit: function () {
    ui.form.loadInit();
    ui.form.input();
    ui.form.select();
    ui.form.textarea();
    ui.form.textCountInit();

    ui.form.spinner();
    ui.form.jqRange();
    ui.form.jqCalendar('input.datepicker');
    ui.form.jqTimepicker('input.timepicker');
  },
  loadInit: function () {
    ui.form.inputStateCheck();
  },
  focusUI: function () {
    const $inpEls = 'input:not(:checkbox):not(:radio):not(:hidden), select, textarea';
    $(document).on('focusin', $inpEls, function (e) {
      const $this = $(this);
      if ($this.closest('.inp-focus').length) $this.closest('.inp-focus').addClass('focus');
      if ($this.closest('.input').length) $this.closest('.input').addClass('focus');
      if ($this.closest('.textarea').length) $this.closest('.textarea').addClass('focus');
    });
    $(document).on('focusout', $inpEls, function (e) {
      const $this = $(this);
      if ($this.closest('.inp-focus').length) $this.closest('.inp-focus').removeClass('focus');
      if ($this.closest('.input').length) $this.closest('.input').removeClass('focus');
      if ($this.closest('.textarea').length) $this.closest('.textarea').removeClass('focus');
    });
  },
  stateChk: function (element) {
    const $el = $(element);
    const $closestName = $el[0].tagName === 'INPUT' ? '.input' : $el[0].tagName === 'SELECT' ? '.select' : $el[0].tagName === 'TEXTAREA' ? '.textarea' : null;
    if (!$closestName) return;
    const $closest = $el.closest($closestName);
    if (!$closest.length) return;
    if ($el.prop('readonly')) $closest.addClass('readonly');
    else $closest.removeClass('readonly');
    if ($el.prop('disabled')) $closest.addClass('disabled');
    else $closest.removeClass('disabled');
  },
  selectSetVal: function (target, value) {
    const val = value === 0 ? '0' : value;
    const $target = $(target);
    let $val = $target.val();
    if (val && $val === val) {
      return;
    } else if (val && $val !== val) {
      $target.val(val);
      $val = val;
    }
    let $selectTxt = $target.find(':selected').text();
    if (!$target.children().length) $selectTxt = '항목 없음';
    else if ($selectTxt === '') $selectTxt = '선택';
    const $btnVal = $target.siblings('.btn-select').find('.btn-select-val');
    if ($selectTxt === $btnVal.text()) return;
    $btnVal.html($selectTxt);
    ui.form.selectOff(target);
  },
  selectOff: function (select) {
    const $select = $(select);
    const $val = $select.val();
    if ($select.data('reset') !== undefined || $select.data('off') !== undefined) return;
    if ($val === '' || $val === null) $select.closest('.select').addClass('off');
    else $select.closest('.select').removeClass('off');
  },
  select: function () {
    const $select = $('.select').not('.not');
    if ($select.length) {
      $select.each(function (e) {
        const $this = $(this);
        const $sel = $this.find('select');

        ui.form.stateChk($sel);

        // if ($this.hasClass('ui-select')) return;
        if (!$sel.siblings('.btn-select').length) {
          let $selId = $sel.attr('id');
          let $title = $sel.attr('title');

          if ($selId == undefined) $selId = 'none';
          if ($title == undefined) $title = '선택';
          const $btnTitle = $title;
          const $btnHtml = '<a href="#' + $selId + '" class="btn-select ui-select-open" title="' + $btnTitle + '" role="button"><span class="btn-select-val"></span></a>';

          $sel.hide().after($btnHtml);
          const $forLbl = $('label[for="' + $selId + '"]');
          if ($forLbl.length) $forLbl.addClass('ui-select-lbl').attr('title', $btnTitle);
        }
        if (!$this.hasClass('ui-select')) $this.addClass('ui-select');
        ui.form.selectSetVal($sel);
      });
    }
  },
  selectOpen: function (el) {
    const $el = $(el);
    const $sel = $el.siblings('select');
    const $closest = $el.closest('.select');
    const $elTxt = $.trim($el.text());
    const $class = $closest.data('class');

    // console.log('click', $openSelect.length, $openSelect.not(this).length);
    if (!$sel.length) return;
    if ($sel.prop('disabled')) return;
    function optionHtml(target) {
      let itemLength = 0;
      let rtnHtml = '<div class="select-option-wrap">';
      rtnHtml += '<div class="select-option-inner">';
      target.children().each(function () {
        const $val = $(this).attr('value');
        const $text = $(this).text();
        const $selected = $elTxt === $text ? ' selected' : '';
        if ($val !== '' || target.data('reset') !== undefined) {
          itemLength += 1;
          rtnHtml += '<button type="button" class="option ui-select-option' + $selected + '" data-val="' + $val + '">' + $text + '</button>';
        }
      });
      if (itemLength === 0) {
        rtnHtml += '<div class="option-none">선택 가능한 옵션이 없습니다.</div>';
      }
      rtnHtml += '</div>';
      rtnHtml += '</div>';
      // return itemLength ? rtnHtml : null;
      return rtnHtml;
    }

    let $wrap = $('.select-option-wrap');
    if ($wrap.length) $wrap.remove();

    if ($el.hasClass('open')) {
      $el.removeClass('open');
    } else {
      const $openSelect = $('.ui-select .btn-select.open');
      if ($openSelect.length) $openSelect.removeClass('open');

      const $optionHtml = optionHtml($sel);
      /*
      if (!$optionHtml) {
        const $msg = '<strong>선택 할 정보가 없습니다.</strong><p class="fz-14 mt-10">관련 문의가 필요하신 경우 <br />중앙회 IT기획부 담당자(031-727-3454, 3455)로 문의해주시기 바랍니다</p>';
        Layer.alert($msg);
        return;
      }
      */
      $el.addClass('open');
      const $popBody = $el.closest('.' + Layer.className.body);
      const $popup = $el.closest('.' + Layer.className.popup);
      let $body = $popBody.length && $popup.length ? $popBody : $('body');
      $body.append($optionHtml);
      $wrap = $('.select-option-wrap');
      if ($class) $wrap.addClass($class);
      $wrap.data('select', $closest);
      ui.form.selectPosition($wrap);

      const $selected = $wrap.find('.selected');
      let $sclTop = 0;
      if ($selected.length) $sclTop = $selected.position().top;
      const $inner = $wrap.find('.select-option-inner');
      if ($sclTop && $inner[0].scrollHeight > $inner.outerHeight()) {
        $inner.scrollTop($sclTop - $selected.outerHeight());
      }
    }
  },
  selectPosition: function (el) {
    const $el = $(el);
    const $elH = $el.outerHeight();
    const $bodyH = $('body').height();
    const $popup = $el.closest('.' + Layer.className.popup);
    const $popBody = $el.closest('.' + Layer.className.body);
    const $isPop = $popBody.length && $popup.length ? true : false;
    const $select = $el.data('select');
    if (!$select) return;
    const $btn = $select.find('.btn-select');
    const $fontSize = $btn.css('font-size');
    const $width = $btn.outerWidth();
    const $btnH = $btn.outerHeight();
    const $btnTop = $btn.offset().top;
    let $left = 0;
    let $top = 0;
    if ($isPop) {
      const $popBodyLeft = $popBody.offset().left;
      const $popBodyTop = $popBody.offset().top;
      const $popBodySclTop = $popBody.scrollTop();
      const $popBodyH = $popBody.outerHeight();
      $left = $btn.offset().left - $popBodyLeft;
      $top = $btnTop + $btnH - $popBodyTop + $popBodySclTop;
      if ($top + $elH > $popBodySclTop + $popBodyH - 20) {
        $top = $top - $btnH - $elH;
        $el.addClass('to-up');
      }
    } else {
      $left = $btn.offset().left;
      $top = $btnTop + $btnH;
      if ($top + $elH > $bodyH - 20) {
        $top = $top - $btnH - $elH;
        $el.addClass('to-up');
      }
    }
    $el.css({
      left: $left,
      top: $top,
      minWidth: $width,
      fontSize: $fontSize
    });
    const $inner = $el.find('.select-option-inner');
    const $option = $inner.find('.ui-select-option').first();
    const $showOptionLength = 8;
    if ($option.length) {
      const $optionH = $option.outerHeight();
      const $innerPaddig = parseInt($inner.css('padding-top')) + parseInt($inner.css('padding-bottom'));
      const $maxHeight = $optionH * $showOptionLength;
      $inner.css({
        maxHeight: $maxHeight + $innerPaddig
      });
    }
  },
  selectReset: function () {
    let $wrap = $('.select-option-wrap');
    if ($wrap.length) $wrap.remove();
    const $openSelect = $('.ui-select .btn-select.open');
    if ($openSelect.length) $openSelect.removeClass('open');
  },
  selectResize: function () {
    const $option = $('.select-option-wrap');
    if ($option.length) {
      $option.each(function () {
        ui.form.selectPosition(this);
      });
    }
  },
  selectUI: function () {
    $(document).on('change', 'select', function () {
      const $this = $(this);
      if ($this.siblings('.btn-select').length) {
        ui.form.selectSetVal(this);
      } else {
        ui.form.selectOff(this);
      }
    });

    $(document).on('click', '.ui-select-open', function (e) {
      e.preventDefault();
      ui.form.selectOpen(this);
    });

    $(document).on('click', '.ui-select-option', function (e) {
      e.preventDefault();
      const $this = $(this);
      const $val = $this.data('val');
      const $wrap = $this.closest('.select-option-wrap');
      const $closest = $wrap.data('select');
      const $btn = $closest.find('.btn-select');
      const $sel = $closest.find('select');

      $sel.val($val).change();
      $btn.removeClass('open');
      $wrap.remove();
    });

    $(document)
      .on('click touchend', function (e) {
        ui.form.selectReset();
      })
      .on('click touchend', '.ui-select, .select-option-wrap', function (e) {
        e.stopPropagation();
      });
  },
  inputNumber: function (elem) {
    const $elem = $(elem);
    let $decimal = $elem.data('number');
    if (!$decimal) $decimal = 0;
    const $val = $elem.val();
    const isPoint = $val.indexOf('.') >= 0;
    let $newVal;
    if (isPoint) {
      const $split = $val.split('.');
      $newVal = onlyNumber($split[0]) + '.';
      if ($split[1]) $newVal = $newVal + onlyNumber($split[1]);
    } else {
      $newVal = onlyNumber($val);
    }
    $newVal = removeComma($newVal);
    $newVal = addComma($newVal, $decimal);
    $elem.val($newVal);
  },
  inputOnlyNumber: function (elem) {
    const $elem = $(elem);
    const $val = $elem.val();
    let $newVal = onlyNumber($val);
    $elem.val($newVal);
  },
  inputOnlyEngNumber: function (elem) {
    const $elem = $(elem);
    const $val = $elem.val();
    let $newVal = onlyEngNumber($val);
    $elem.val($newVal);
  },
  inputOnlyEngKor: function (elem) {
    const $elem = $(elem);
    const $val = $elem.val();
    let $newVal = onlyEngKor($val);
    $elem.val($newVal);
  },
  inputOnlyKorean: function (elem) {
    const $elem = $(elem);
    const $val = $elem.val();
    let $newVal = onlyKorean($val);
    console.log($newVal);
    $elem.val($newVal);
  },
  inputCompanyNumber: function (elem) {
    const $elem = $(elem);
    const $type = $elem.data('company-number');
    const $val = $elem.val();
    let $newVal = onlyNumber($val);
    $newVal = $type ? autoCompanyNumberFormat($newVal, $type) : autoCompanyNumberFormat($newVal);
    $elem.val($newVal);
  },
  inputDate: function (elem) {
    const $elem = $(elem);
    const $val = $elem.val();
    const $newVal = autoDateFormat($val);
    $elem.val($newVal);
  },
  inputTime: function (elem) {
    const $elem = $(elem);
    const $val = $elem.val();
    const $newVal = autoTimeFormat($val);
    $elem.val($newVal);
  },
  inputUI: function () {
    //list input[type=checkbox]
    $(document).on('change', '.chk-item input', function () {
      const $this = $(this);
      if ($this.prop('checked') == true) {
        $this.closest('.chk-item').addClass('checked');
        if ($this.attr('type') == 'radio') $this.closest('.chk-item').siblings('.chk-item').removeClass('checked');
      } else {
        $this.closest('.chk-item').removeClass('checked');
      }
    });

    $(document).on('click', '.ui-inp-del', function () {
      const $inp = $(this).siblings('input');
      $inp.val('').change().focus();
    });
    $(document).on('click', '.btn-inp-pwd', function () {
      const $inp = $(this).siblings('input');
      if ($inp.attr('type') === 'password') {
        $inp.attr('type', 'text');
      } else {
        $inp.attr('type', 'password');
      }
    });

    $(document).on('keyup focusin change', '.input.delete input', function () {
      ui.form.insertDel(this);
    });

    $(document).on('input change', 'input[data-only-number]', function () {
      ui.form.inputOnlyNumber(this);
    });
    $(document).on('input change', 'input[data-only-engnum]', function () {
      ui.form.inputOnlyEngNumber(this);
    });
    $(document).on('input change', 'input[data-only-engkor]', function () {
      ui.form.inputOnlyEngKor(this);
    });
    $(document).on('input change', 'input[data-only-korean]', function () {
      ui.form.inputOnlyKorean(this);
    });

    $(document).on('input change', 'input[data-number]', function () {
      ui.form.inputNumber(this);
    });
    $(document).on('input change', 'input[data-date], input.datepicker', function () {
      ui.form.inputDate(this);
    });
    $(document).on('input change', 'input[data-time], input.timepicker', function () {
      ui.form.inputTime(this);
    });
    $(document).on('input change', 'input[data-company-number]', function () {
      ui.form.inputCompanyNumber(this);
    });

    $(document).on('input change', '.input.file input[type=file]', function () {
      const $this = $(this);
      const $val = $this.val();
      const $input = $this.siblings('input');
      $input.val($val);
    });

    $(document).on('change', 'select, input[type=checkbox],input[type=radio]', function () {
      ui.form.inputStateCheck();
    });
    $(document).on('click', 'a, button', function () {
      ui.form.inputStateCheck();
    });

    //핸드폰
    // $(document).on('input', '.inp-phone input', function () {
    //   $(this).val(getHpFormat($(this).val()));
    // });

    // 조회기간, 기간선택 버튼 UI
    function calendarBtnSet(el) {
      const $el = $(el);
      const $wrap = $el.closest('.dual-calendar');
      const $firstCal = $wrap.find('.datepicker').first();
      const $lastCal = $wrap.find('.datepicker').last();
      const $month = $el.data('month') ? parseInt($el.data('month')) * -1 : 0;
      const $day = $el.data('day') ? parseInt($el.data('day')) * -1 : 1;
      const $firstVal = autoDateFormat($addDate($day, $month));
      const $lastVal = autoDateFormat($nowDateDay);

      $firstCal.val($firstVal);
      $lastCal.val($lastVal);
    }

    $('.dual-calendar.ui-calendar-btn')
      .on('click', '.button', function () {
        const $this = $(this);
        calendarBtnSet(this);
        $this.addClass('blue').siblings('.button').removeClass('blue');
      })
      .on('input change', 'input.datepicker', function () {
        const $this = $(this);
        const $wrap = $this.closest('.dual-calendar');
        const $btn = $wrap.find('.button');
        $btn.removeClass('blue');
      });

    const $calendarFirst = $('.dual-calendar.ui-calendar-btn ._first');
    if ($calendarFirst.length) {
      calendarBtnSet($calendarFirst);
      $calendarFirst.addClass('blue');
    }
  },
  inputStateCheck: function () {
    setTimeout(function () {
      ui.form.input();
      ui.form.select();
      ui.form.textarea();
    }, 10);
  },
  input: function () {
    $('.input input').each(function () {
      const $this = $(this);
      const $closest = $this.closest('.input');

      ui.form.stateChk(this);

      if ($closest.hasClass('delete')) {
        ui.form.insertDel(this);
      }
      if ($closest.hasClass('password') && !$closest.find('.btn-inp-pwd').length) {
        $closest.append('<a href="#" class="btn-inp-pwd" role="button" aria-label="비밀번호 입력확인"></a>');
      }
    });
    $('input[data-number]').each(function () {
      ui.form.inputNumber(this);
    });
    $('input[data-date]').each(function () {
      ui.form.inputDate(this);
    });
    $('input[data-company-number]').each(function () {
      ui.form.inputCompanyNumber(this);
    });
    $('input._today').each(function () {
      // console.log($nowDateDay);
      const $val = autoDateFormat($nowDateDay);
      $(this).val($val);
    });
    $('input[data-date-set]').each(function () {
      const $this = $(this);
      const $set = $this.data('date-set');
      if ($set === null || $set === undefined) return;
      let $val = '';
      if ($set === 'today' || $set === '0') {
        $val = $nowDateDay;
      } else {
        const $setAry = $set.split(',');
        if ($setAry.length === 1) $val = $addDate(parseInt($setAry[0]));
        else if ($setAry.length === 2) $val = $addDate(parseInt($setAry[0]), parseInt($setAry[1]));
        else $val = $addDate(parseInt($setAry[0]), parseInt($setAry[1]), parseInt($setAry[2]));
      }

      if ($val) $this.val(autoDateFormat($val));
    });
  },
  insertDel: function (el) {
    //input 삭제버튼
    const $this = $(el);
    const $val = $this.val();
    if ($this.data('removeDelBtn') !== undefined) clearTimeout($this.data('removeDelBtn'));

    if (
      // prettier-ignore
      $this.prop('readonly') ||
      $this.prop('disabled') ||
      $this.hasClass('hasDatepicker') ||
      $this.hasClass('time') ||
      $this.attr('type') === 'date' ||
      $this.hasClass('t-right') ||
      $this.hasClass('t-center')
    ) {
      return false;
    }
    if ($val != '') {
      if (!$this.siblings('.ui-inp-del').length && !$this.siblings('.datepicker').length) {
        $this.after('<a href="#" class="btn-inp-del ui-inp-del" role="button" aria-label="입력내용삭제"></a>');
      }
    } else {
      if ($this.siblings('.ui-inp-del').length) {
        const removeDelBtn = setTimeout(function () {
          $this.siblings('.ui-inp-del').remove();
          $this.removeData('removeDelBtn');
        }, 10);
        $this.data('removeDelBtn', removeDelBtn);
      }
    }
  },
  textareaHeight: function (elem) {
    const $val = $(elem).val();
    const $lines = $val.split(/\r|\r\n|\n/);
    const $count = $lines.length;
    const $lineH = parseInt($(elem).css('line-height'));
    const $pd = parseInt($(elem).css('padding-top')) + parseInt($(elem).css('padding-bottom'));
    const $bdw = parseInt($(elem).css('border-top-width')) + parseInt($(elem).css('border-bottom-width'));
    $(elem).css('height', $count * $lineH + $pd + $bdw);
  },
  textarea: function () {
    $('.textarea textarea').each(function () {
      ui.form.stateChk(this);
    });

    $('.auto-height-textarea textarea').each(function () {
      ui.form.textareaHeight(this);
    });
  },
  textareaUI: function () {
    $(document).on('keyup keydown keypress change', '.auto-height-textarea textarea', function () {
      ui.form.textareaHeight(this);
    });
  },
  success: function (element, messege) {
    const $el = $(element);
    let $closest = $el;
    if ($el.closest('.validate-item').length) $closest = $el.closest('.validate-item');
    else if ($el.closest('.inp-flex').length) $closest = $el.closest('.inp-flex');
    $closest.removeClass('is-error').addClass('is-success');
    if ($closest.next('.validate-txt').length) {
      $closest.next('.validate-txt').removeClass('is-error').addClass('is-success').html(messege);
    } else {
      $closest.after('<div class="validate-txt is-success">' + messege + '</div>');
    }
  },
  error: function (element, messege, isFocus) {
    if (isFocus === undefined) isFocus = false;
    const $el = $(element);
    let $closest = $el;
    if ($el.closest('.validate-item').length) $closest = $el.closest('.validate-item');
    else if ($el.closest('.inp-flex').length) $closest = $el.closest('.inp-flex');

    if (messege === false) {
      $closest.removeClass('is-error');
      if ($closest.siblings('.validate-txt.is-error').length) $closest.siblings('.validate-txt.is-error').remove();
    } else {
      $closest.removeClass('is-success').addClass('is-error');
      if ($closest.next('.validate-txt').length) {
        $closest.next('.validate-txt').removeClass('is-success').addClass('is-error').html(messege);
      } else {
        $closest.after('<div class="validate-txt is-error">' + messege + '</div>');
      }
      if (isFocus && !$el.is(':focus') && !$(':focus').closest('.is-error').length) $el.focus();
    }
  },
  textCount: function (element, e) {
    const $el = $(element);
    let $target = $el.data('text-count');
    if ($target == true) {
      $target = $el.siblings('.byte').find('strong');
    } else {
      $target = $('#' + $target);
    }
    if (!$target.length) return;
    const $max = $el.attr('maxlength');
    let $val = $el.val();
    let $length = $val.length;
    if (!!e && (e.type == 'keyup' || e.type == 'keypress' || e.type == 'paste' || e.type == 'cut')) {
      setTimeout(function () {
        $val = $el.val();
        $length = $val.length;
        if ($max === undefined) {
          $target.text(addComma($length));
        } else {
          $target.text(addComma(Math.min($max, $length)));
        }
      }, 1);
    } else {
      if ($val != '') $target.text(addComma(Math.min($max, $length)));
    }
  },
  textCountEl: '[data-text-count]',
  textCountInit: function () {
    $(ui.form.textCountEl).each(function (e) {
      ui.form.textCount(this);
    });
  },
  textCountUI: function () {
    $(document).on('keypress keyup', ui.form.textCountEl, function (e) {
      ui.form.textCount(this, e);
    });
    $(document).on('paste cut', ui.form.textCountEl, function (e) {
      if (e.originalEvent.clipboardData) {
        ui.form.textCount(this, e);
      }
    });
  },
  byteCount: function (element, e) {
    const $el = $(element);
    let $target = $el.data('byte-count');
    if ($target == true) {
      $target = $el.siblings('.byte').find('strong');
    } else {
      $target = $('#' + $target);
    }
    if (!$target.length) return;
    const $max = parseInt($el.attr('maxlength'));
    let $val = $el.val();

    function byteChk() {
      let $length = $val.length;
      let _byte = 0;
      let strLength = 0;
      if ($length > 0) {
        const $valArr = $val.split('');
        for (let i = 0; i < $valArr.length; i += 1) {
          let txt = $valArr[i];
          if (ui.pc.msie()) txt = unescape(encodeURIComponent(txt));
          else txt = new TextEncoder().encode(txt);
          _byte += txt.length;
          if (_byte <= $max) {
            strLength += 1;
          }
        }
      }

      if ($max === undefined) {
        $target.text(addComma(_byte));
      } else {
        $target.text(addComma(Math.min($max, _byte)));
        if (_byte > $max) {
          const cutStr = $val.substring(0, strLength);
          $el.val(cutStr);
        }
      }
    }

    if (!!e && (e.type == 'keyup' || e.type == 'keypress' || e.type == 'paste' || e.type == 'cut')) {
      setTimeout(function () {
        byteChk();
      }, 1);
    } else {
      if ($val != '') byteChk();
    }
  },
  byteCountEl: '[data-byte-count]',
  byteCountInit: function () {
    $(ui.form.byteCountEl).each(function (e) {
      ui.form.byteCount(this);
    });
  },
  byteCountUI: function () {
    $(document).on('keypress keyup', ui.form.byteCountEl, function (e) {
      ui.form.byteCount(this, e);
    });
    $(document).on('paste cut', ui.form.byteCountEl, function (e) {
      if (e.originalEvent.clipboardData) {
        ui.form.byteCount(this, e);
      }
    });
  },
  spinner: function () {
    const $spinner = $('.spinner');
    if ($spinner.length) {
      $spinner.each(function () {
        const $this = $(this);
        const $input = $this.find('input');
        $input.change();
      });
    }
  },
  spinnerUI: function () {
    $(document).on('click', '.spinner .button', function (e) {
      e.preventDefault();
      const $this = $(this);
      const $spinner = $this.closest('.spinner');
      const $input = $spinner.find('input');
      const $val = parseInt($input.val());
      if ($this.hasClass('minus')) {
        $input.val($val - 1).change();
      } else if ($this.hasClass('plus')) {
        $input.val($val + 1).change();
      }
    });
    $(document).on('change', '.spinner input', function () {
      const $this = $(this);
      const $spinner = $this.closest('.spinner');
      const $min = $spinner.data('min') !== undefined ? $spinner.data('min') : 1;
      const $max = $spinner.data('max') !== undefined ? $spinner.data('max') : 999;
      let $val = parseInt($this.val());
      if ($this.val() === '' || $val < $min) {
        $val = $min;
        $this.val($min);
      } else if ($val > $max) {
        $val = $max;
        $this.val($max);
      }
      const $btnMinus = $spinner.find('.minus');
      const $btnPlus = $spinner.find('.plus');
      if ($val <= $min) {
        $btnMinus.prop('disabled', true);
      } else {
        $btnMinus.prop('disabled', false);
      }
      if ($val >= $max) {
        $btnPlus.prop('disabled', true);
      } else {
        $btnPlus.prop('disabled', false);
      }
    });
  },
  jqRange: function () {
    if ($('.jq-range-slider').length) {
      $('.jq-range-slider').each(function () {
        const $this = $(this);
        if ($this.hasClass('_inited')) return;
        const isMutilple = $this.hasClass('multiple') ? true : false;
        const $slider = $this.find('.slider');
        const $list = $this.find('.list');
        let $dot;
        const $inp = $this.find('input[type=hidden]');
        const $unit = $list.data('unit') !== undefined ? $list.data('unit').split(',') : '';
        //const $unit = $list.data('unit') !== undefined ? $list.data('unit') : '';
        const $title = $list.attr('title');
        const noHandle = $this.hasClass('no-handle-tip') ? false : true;
        let $min = parseInt($slider.data('min'));
        let $max = parseInt($slider.data('max'));
        let $val = isMutilple ? $slider.data('value') : parseInt($slider.data('value'));
        let $step = parseInt($slider.data('step'));

        if (!$min) $min = 0;
        if (!$max) $max = 10;
        if (!$step) $step = 1;
        if (!$val) $val = $min;

        if ($list.length) {
          $list.empty();
          $slider.find('.dot').remove();
          if (!!$title) $list.removeAttr('title').append('<strong class="blind">' + $title + '</strong>');
          const $total = ($max - $min) / $step;
          const $stepLeft = 100 / $total;
          let $listHtml = '<ul>';
          let $dotHtml = '<ul class="dot">';
          for (let i = 0; i <= $total; i++) {
            const $setLeft = $stepLeft * i;
            $dotHtml += '<li style="left:' + $setLeft + '%"></li>';
            if (isMutilple) {
              $listHtml += '<li style="left:' + $setLeft + '%"><span>' + ($unit.length > 1 ? $unit[i] : i * $step + $min + $unit) + '</span></li>';
            } else {
              $listHtml += '<li style="left:' + $setLeft + '%"><a href="#">' + ($unit.length > 1 ? $unit[i] : i * $step + $min + $unit) + '</a></li>';
            }
          }
          $listHtml += '</ul>';
          $dotHtml += '</ul>';
          $list.append($listHtml);
          if ($list.hasClass('append-dot')) {
            $slider.prepend($dotHtml);
            $dot = $slider.find('.dot');
          }
        }

        if ($inp.length) $inp.val($val);
        const range = $slider.slider({
          range: isMutilple ? true : 'min',
          min: $min,
          max: $max,
          value: isMutilple ? null : $val,
          values: isMutilple ? $val : null,
          step: $step,
          create: function (e) {
            $this.addClass('_inited');
            if (isMutilple) {
              if (noHandle) {
                $slider
                  .find('.ui-slider-handle')
                  .first()
                  .html('<i>' + ($unit.length > 1 ? $unit[$val[0]] : $val[0] + $unit) + '</i>');
                $slider
                  .find('.ui-slider-handle')
                  .last()
                  .html('<i>' + ($unit.length > 1 ? $unit[$val[1]] : $val[1] + $unit) + '</i>');
              }
              $list
                .find('li')
                .eq(($val[0] - $min) / $step)
                .addClass('on')
                .find('a')
                .attr('title', '현재선택');
              $list
                .find('li')
                .eq(($val[1] - $min) / $step)
                .addClass('on')
                .find('a')
                .attr('title', '현재선택');
              if ($dot) {
                $dot
                  .find('li')
                  .eq(($val[0] - $min) / $step)
                  .addClass('on');
                $dot
                  .find('li')
                  .eq(($val[1] - $min) / $step)
                  .addClass('on');
              }
            } else {
              if (noHandle) {
                $slider.find('.ui-slider-handle').html('<i>' + ($unit.length > 1 ? $unit[$val] : $val + $unit) + '</i>');
              }
              $list
                .find('li')
                .eq(($val - $min) / $step)
                .addClass('on')
                .find('a')
                .attr('title', '현재선택');
              if ($dot) {
                $dot
                  .find('li')
                  .eq(($val - $min) / $step)
                  .addClass('on');
              }
            }
          },
          stop: function (event, ui) {
            if (isMutilple) {
              if ($inp.length) $inp.val(ui.values).change();
              if (noHandle) {
                $slider.data('value', ui.values);
                $slider
                  .find('.ui-slider-handle')
                  .eq(ui.handleIndex)
                  .find('i')
                  .html($unit.length > 1 ? $unit[ui.value] : ui.value + $unit);
              }
              $list.find('li').removeClass('on').find('a').removeAttr('title');
              if ($dot) $dot.find('li').removeClass('on');
              $list
                .find('li')
                .eq((ui.values[0] - $min) / $step)
                .addClass('on')
                .find('a')
                .attr('title', '현재선택');
              $list
                .find('li')
                .eq((ui.values[1] - $min) / $step)
                .addClass('on')
                .find('a')
                .attr('title', '현재선택');
              if ($dot) {
                $dot
                  .find('li')
                  .eq((ui.values[0] - $min) / $step)
                  .addClass('on');
                $dot
                  .find('li')
                  .eq((ui.values[1] - $min) / $step)
                  .addClass('on');
              }
            } else {
              if ($inp.length) $inp.val(ui.value).change();
              if (noHandle) {
                $slider.data('value', $unit.length > 1 ? $unit[ui.value] : ui.value);
              }
              $(ui.handle)
                .find('i')
                .html(ui.value + $unit);
              $list
                .find('li')
                .eq((ui.value - $min) / $step)
                .siblings()
                .removeClass('on')
                .find('a')
                .removeAttr('title');
              $list
                .find('li')
                .eq((ui.value - $min) / $step)
                .addClass('on')
                .find('a')
                .attr('title', '현재선택');

              if ($dot) {
                $dot
                  .find('li')
                  .eq((ui.value - $min) / $step)
                  .addClass('on');
              }
            }
          }
        });

        if (!isMutilple) {
          $list.find('a').click(function (e) {
            e.preventDefault();
            const $txt = parseInt($(this).text());
            range.slider('value', $txt);
            $slider.find('.ui-slider-handle i').text($txt + $unit);
            if ($inp.length) $inp.val($txt).change();
            $(this).parent().addClass('on').find('a').attr('title', '현재선택');
            $(this).parent().siblings().removeClass('on').find('a').removeAttr('title');
          });
        }
      });
    }
  },
  jqCalendar: function (element, defaultDate) {
    //jquery UI datepicker
    const $disabledClass = 'ui-state-disabled';
    const $focusClass = 'ui-datepicker-btn';
    const prevYrBtn = $('<a href="#" role="button" class="ui-datepicker-prev-y ' + $focusClass + '" aria-label="이전년도 보기"><span>이전년도 보기</span></a>');
    const nextYrBtn = $('<a href="#" role="button" class="ui-datepicker-next-y ' + $focusClass + '" aria-label="다음년도 보기"><span>다음년도 보기</span></a>');
    const $monthName = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const $dayName = ['일', '월', '화', '수', '목', '금', '토'];
    const $dayNameFull = $dayName.map((day) => day + '요일');

    const calendarOpen = function (target, ob) {
      const $focus = $(':focus');
      let prevFocusClass = '';
      if ($focus.hasClass($focusClass)) {
        const $class = $focus.attr('class').split(' ');
        prevFocusClass = $class[0];
      }
      setTimeout(function () {
        const $isInline = ob.inline ? true : false;
        const $calendar = $isInline ? '#' + ob.id : '#' + ob.dpDiv[0].id;
        const $header = $($calendar).find('.ui-datepicker-header');
        const $container = $($calendar).find('.ui-datepicker-calendar');
        const $min = $.datepicker._getMinMaxDate(target.data('datepicker'), 'min');
        const $minY = $min.getFullYear();
        const $max = $.datepicker._getMinMaxDate(target.data('datepicker'), 'max');
        const $maxY = $max.getFullYear();
        const $selectedYear = ob.selectedYear;
        const $inlineInpClass = 'ui-datepicker-inline-inp';
        if ($isInline) {
          //인라인달력
          if (!$($calendar).find('.' + $inlineInpClass).length && !$($calendar).closest('.calendar-swiper').length) $($calendar).append('<div class="input mt10 blind"><input type="text" class="ui-datepicker-inline-inp" readonly></div>');
          const $getDate = $(target).datepicker('getDate');
          const $date = $.datepicker.formatDate('yy.mm.dd', $getDate);
          const $input = $($calendar).find('.ui-datepicker-inline-inp');
          if ($input.length) $input.val($date);
        } else {
          //팝업달력
        }

        $header.find('select.ui-datepicker-year').addClass($focusClass);
        $header.find('select.ui-datepicker-month').addClass($focusClass);
        $container.find('td>a').attr('role', 'button');
        if ($container.find('.ui-state-highlight').length) $container.find('.ui-state-highlight').attr('title', '오늘 일자');
        if ($container.find('.ui-state-active').length) $container.find('.ui-state-active').attr('title', '현재 달력에서 선택된 일자');

        const $prevMonthBtn = $header.find('.ui-datepicker-prev');
        const $nextMonthBtn = $header.find('.ui-datepicker-next');
        $prevMonthBtn
          .attr({
            role: 'button',
            'aria-label': '이전달 보기'
          })
          .addClass($focusClass)
          .before(prevYrBtn);
        if ($selectedYear <= $minY) {
          prevYrBtn.addClass($disabledClass).attr('aria-disabled', true);
        } else {
          prevYrBtn.removeClass($disabledClass).removeAttr('aria-disabled');
        }
        $nextMonthBtn
          .attr({
            role: 'button',
            'aria-label': '다음달 보기'
          })
          .addClass($focusClass)
          .after(nextYrBtn);

        if ($selectedYear >= $maxY) {
          nextYrBtn.addClass($disabledClass).attr('aria-disabled', true);
        } else {
          nextYrBtn.removeClass($disabledClass).removeAttr('aria-disabled');
        }
        if ($prevMonthBtn.hasClass($disabledClass)) {
          $prevMonthBtn.attr('aria-disabled', true);
        } else {
          $prevMonthBtn.removeAttr('aria-disabled');
        }
        if ($nextMonthBtn.hasClass($disabledClass)) {
          $nextMonthBtn.attr('aria-disabled', true);
        } else {
          $nextMonthBtn.removeAttr('aria-disabled');
        }

        // $header.find('.ui-datepicker-prev, .ui-datepicker-next').attr('href', '#');
        if (!$isInline) {
          if (ui.mobile.any()) {
            $($calendar).find('.title').attr('tabindex', -1).focus();
            if ($(ui.className.mainWrap + ':visible').length) $(ui.className.mainWrap + ':visible').attr('aria-hidden', true);
          } else {
            if (prevFocusClass)
              $($calendar)
                .find('.' + prevFocusClass)
                .focus();
            else $($calendar).attr('tabindex', 0).focus();
            Layer.focusMove($calendar);
          }
        }

        prevYrBtn.unbind('click').bind('click', function () {
          if (!$(this).hasClass($disabledClass)) $.datepicker._adjustDate(target, -1, 'Y');
        });
        nextYrBtn.unbind('click').bind('click', function () {
          if (!$(this).hasClass($disabledClass)) $.datepicker._adjustDate(target, +1, 'Y');
        });
      }, 5);
    };
    const calendarClose = function (ob, date) {
      const $isInline = ob.inline ? true : false;
      const $calendar = $isInline ? '#' + ob.id : '#' + ob.dpDiv[0].id;
      const $cal = $($calendar);
      let $input = $(ob.input);
      const $prevVal = $input.data('prevVal');
      const $val = $input.val();
      if ($isInline) {
        //인라인달력
        $input = $cal.find('.ui-datepicker-inline-inp');
        if ($input.length) $input.val(date);
      } else {
        //팝업달력
        if ($(ui.className.mainWrap + ':visible').length) $(ui.className.mainWrap + ':visible').removeAttr('aria-hidden');
        $cal.find('.title').removeAttr('tabindex');
        if ($val === '' || $val === $prevVal) {
          $input.next('.ui-datepicker-trigger').focus();
        } else {
          $input.focus();
        }
        // if ($(target).data('isReadonly') != true) $(target).prop('readonly', false);
        $input.data('prevVal', $input.val()).change();
      }
    };

    if ($(element).length) {
      $(element).each(function () {
        const $this = $(this);
        if ($this.hasClass('_inited')) return;
        let $minDate = $this.data('min');
        if ($minDate == undefined) $minDate = '-100y';
        let $maxDate = $this.data('max');
        if ($maxDate == undefined) $maxDate = '+100y';
        let $range = $this.data('range');
        if ($range == undefined) $range = '-100:+100';
        const $setDate = $this.data('setdate');
        const $inlineTag = 'div, span';
        let $isInline = false;
        if ($this.is($inlineTag)) $isInline = true;
        const $datepickerOption = {
          minDate: $minDate,
          maxDate: $maxDate,
          yearRange: $range,
          closeText: '닫기',
          prevText: '이전달 보기',
          nextText: '다음달 보기',
          currentText: '오늘',
          buttonText: '기간조회',
          monthNames: $monthName,
          monthNamesShort: $monthName,
          dayNames: $dayNameFull,
          dayNamesMin: $dayName,
          dateFormat: 'yy-mm-dd',
          yearSuffix: ' ',
          showMonthAfterYear: true,
          showButtonPanel: true,
          showOn: 'button',
          changeMonth: true,
          changeYear: true,
          showOtherMonths: true,
          selectOtherMonths: true,
          beforeShow: function (el, ob) {
            //열때
            /*
            if (!$isInline) {
              if ($this.prop('readonly') == true) {
                $this.data('isReadonly', true);
              } else {
                $this.prop('readonly', true);
              }
            }
            */
            if ($setDate && $this.val() === '') $this.datepicker('setDate', $setDate);

            //기간 선택
            const $closest = $this.closest('.date_wrap');
            if ($closest.length && $closest.find(element).length == 2) {
              const $idx = $closest.find(element).index(this);
              const $first = $closest.find(element).eq(0);
              const $last = $closest.find(element).eq(1);
              if ($idx == 0 && $last.val() != '') $first.datepicker('option', 'maxDate', $last.val());
              if ($idx == 1 && $first.val() != '') $last.datepicker('option', 'minDate', $first.val());
            }

            calendarOpen($this, ob);
          },
          onChangeMonthYear: function (y, m, ob) {
            //달력 바뀔때
            calendarOpen($this, ob);
          },
          onSelect: function (d, ob) {
            //선택할때
            if ($isInline) {
              calendarClose(ob, d);
              calendarOpen($this, ob);
            }
          },
          onClose: function (d, ob) {
            //닫을때
            calendarClose(ob, d, true);
          }
        };
        $this.data('prevVal', $this.val());
        $this.datepicker($datepickerOption);
        $this.addClass('_inited');
        if ($isInline) {
          const $ob = $.datepicker._getInst($this[0]);
          calendarOpen($this, $ob);
        }
      });

      $(element).focusin(function () {
        if ($(this).hasClass('ui-date')) {
          const $val = $(this).val();
          $(this).val(onlyNumber($val));
        }
      });
      $(element).focusout(function () {
        if ($(this).hasClass('ui-date')) {
          const $val = $(this).val();
          $(this).val(autoDateFormat($val, '.'));
        }
      });
    }
  },
  jqTimepicker: function (el) {
    const $el = $(el);
    if (!$el.length) return;
    $el.each(function () {
      const $this = $(this);
      if ($this.hasClass('_inited')) return;
      $this.addClass('_inited');
      const $opt = {
        timeFormat: 'HH:mm',
        interval: !!$this.data('step') ? parseInt($this.data('step')) : 60,
        minTime: !!$this.data('min') ? $this.data('min') : '00:00',
        maxTime: !!$this.data('max') ? $this.data('max') : '23:59',
        dynamic: false,
        dropdown: true,
        scrollbar: true
      };
      const $default = $this.data('default');
      if (!!$default) $opt.defaultTime = $default;
      const $start = $this.data('start');
      if (!!$start) $opt.startTime = $start;

      $this.timepicker($opt);
    });
  },
  fileDrag: function () {
    const $fileWrap = document.querySelectorAll('.file-item-wrap .file-btn');
    if ($fileWrap.length) {
      $fileWrap.forEach(function (item) {
        item.addEventListener('dragover', function () {
          item.classList.add('dragover');
        });
        item.addEventListener('dragleave', function () {
          item.classList.remove('dragover');
        });
        item.addEventListener('drop', function () {
          item.classList.remove('dragover');
        });
      });
    }
  }
};

/** 리스트 **/
ui.list = {
  init: function () {
    ui.list.allCheck();
    ui.list.table();
    ui.list.tableUI();
  },
  reInit: function () {
    ui.list.table();
    ui.list.loadInit();
  },
  loadInit: function () {
    //토글실행
    ui.folding.list('.ui-folding', '.folding-btn', '.folding-panel');
    ui.folding.btn('.ui-folding-btn');
    ui.folding.close('.ui-folding-close');
  },
  allCheck: function () {
    const $wrapClass = '.ui-chk-wrap';
    const $allChkClass = '.ui-all-chk';
    const $chkClass = '.ui-chk';

    // 전체동의
    $(document).on('change', $wrapClass + ' ' + $allChkClass, function () {
      const $this = $(this);
      const $wrap = $this.closest($wrapClass);
      const $items = $wrap.find($chkClass).not(':disabled');
      if ($this.prop('checked')) {
        if ($this.hasClass('_not_change_event')) $items.prop('checked', true);
        else $items.prop('checked', true).change();
      } else {
        if ($this.hasClass('_not_change_event')) $items.prop('checked', false);
        else $items.prop('checked', false).change();
      }
    });
    $(document).on('change', $wrapClass + ' ' + $chkClass, function () {
      const $this = $(this);
      const $wrap = $this.closest($wrapClass);
      const $allchk = $wrap.find($allChkClass);
      const $items = $wrap.find($chkClass).not(':disabled');
      const $itemsLength = $items.length;
      const $itemsChecked = $wrap.find($chkClass + ':checked').not(':disabled').length;
      if ($itemsLength === $itemsChecked) {
        $allchk.prop('checked', true);
      } else {
        $allchk.prop('checked', false);
      }
    });
  },
  table: function () {
    const $table = $('.table');
    $table.each(function () {
      const $this = $(this);
      if ($this.hasClass('tbl-small') || $this.hasClass('tbl-small2')) return;
      if ($this.hasClass('tbl-left')) {
        if ($this.find('.input').length || $this.find('.select').length) {
          $this.removeClass('tbl-slim');
        } else {
          $this.addClass('tbl-slim');
        }
      }
    });
  },
  tableUI: function () {
    $('.table.col-hover').on('mouseover', 'tbody th,tbody td', function () {
      const $this = $(this);
      const $index = $this.index();
      const $table = $this.closest('.table');
      $table.find('tr').each(function () {
        $(this).children().eq($index).addClass('hover').siblings().removeClass('hover');
      });
    });
    $('.table.col-hover').on('mouseleave', function () {
      const $this = $(this);
      $this.find('.hover').removeClass('hover');
    });
    $('.table[data-hover]').on('mouseover', 'tbody th, tbody td', function () {
      const $this = $(this);
      const $index = $this.index();
      const $table = $this.closest('.table');
      const $hover = $table.data('hover');
      $table.find('.hover').removeClass('hover');
      const $tr = $this.closest('tr');
      let $idx = $tr.index();
      if ($idx % $hover !== 0) $idx = $idx - ($idx % $hover);
      $table
        .find('tbody tr')
        .slice($idx, $idx + $hover)
        .addClass('hover');
    });
    $('.table[data-hover] tbody').on('mouseleave', function () {
      const $this = $(this);
      $this.find('.hover').removeClass('hover');
    });
    $('.tr-check table tr')
      .on('click', function () {
        const $this = $(this);
        const $input = $this.find('.radio input, .checkbox input');
        $input.click();
        $this.addClass('checked');
        if ($input[0].type === 'radio') $this.siblings().removeClass('checked');
      })
      .on('click', '.radio, .checkbox, .select, .textarea, a, button', function (e) {
        e.stopPropagation();
      });
  }
};
//아코디언
ui.folding = {
  listAria: function (list, btn, panel, addClass) {
    if (!addClass) addClass = 'open';
    if ($(list).length) {
      $(list).each(function (e) {
        $(this)
          .children()
          .each(function (f) {
            const $btn = $(this).find(btn);
            let $btnId = $btn.attr('id');
            const $panel = $(this).find(panel);
            let $panelId = $panel.attr('id');
            if ($btn.length && $btn.attr('aria-expanded') == undefined) {
              if ($btnId == undefined) {
                $btnId = 'tglist_btn_' + e + '_' + f;
                $btn.attr('id', $btnId);
              }
              if ($panelId == undefined) {
                $panelId = 'tglist_panel_' + e + '_' + f;
                $panel.attr('id', $panelId);
              }
              $btn.attr({
                role: 'button',
                'aria-expanded': false,
                href: '#' + $panelId,
                'aria-controls': $panelId
              });
              $panel.attr({
                'aria-hidden': 'true',
                'aria-labelledby': $btnId
              });
            }
            if (!$btn.length) {
              $panel.show();
            }
          });
      });
      if ($(list).find('.' + addClass).length) {
        $(list)
          .find('.' + addClass)
          .each(function () {
            $(this).find(btn).attr('aria-expanded', true);
            $(this).find(panel).removeAttr('aria-hidden').show();
            if ($(this).find(btn).children('span').length && $(this).find(btn).children('span').text() == '더보기') {
              $(this).find(btn).children('span').text('닫기');
            }
          });
      }
    }
  },
  list: function (list, btn, panel, addClass, speed) {
    if (!addClass) addClass = 'open';
    if (!speed) speed = 200;
    $(list).each(function (e) {
      const isFolding = $(this).data('folding');
      if (isFolding) return;
      $(this).data('folding', true);
      $(this)
        .find(btn)
        .on('click', function (e) {
          e.preventDefault();
          const $this = $(this);
          const $list = $this.closest(list);
          const $li = $this.closest('li');
          let $openDelay = 0;
          if ($this.closest('.disabled').length || $this.hasClass('disabled')) return false;

          const slideCallback = function () {
            // 없음
          };

          if ($li.hasClass(addClass)) {
            $li.find(btn).attr('aria-expanded', false);
            $li.removeClass(addClass);
            $li
              .find(panel)
              .attr('aria-hidden', true)
              .stop(true, false)
              .slideUp(speed, function () {
                slideCallback();
              });
            if ($this.children('span').length && $this.children('span').text() == '닫기') {
              $this.children('span').text('더보기');
            }
          } else {
            $li.addClass(addClass).find(btn).attr('aria-expanded', true);
            if (!$list.hasClass('not-toggle')) {
              const $siblings = $li.siblings();
              $siblings.removeClass(addClass).find(btn).attr('aria-expanded', false);
              $siblings.find(panel).attr('aria-hidden', true).stop(true, false).slideUp(speed);
              if ($siblings.find(btn).children('span').length && $siblings.find(btn).children('span').text() == '닫기') {
                $siblings.find(btn).children('span').text('더보기');
              }
            }
            if ($li.find(panel).html() == '') $openDelay = 100;
            $li
              .find(panel)
              .removeAttr('aria-hidden')
              .stop(true, false)
              .delay($openDelay)
              .slideDown(speed, function () {
                ui.scroll.inScreen($this, this);
                slideCallback();
              });
            if ($this.children('span').length && $this.children('span').text() == '더보기') {
              $this.children('span').text('닫기');
            }
          }
        });

      ui.folding.listAria(this, btn, panel, addClass);
    });
  },
  btnAria: function (btn, className) {
    if (className == undefined) className = 'open';
    if ($(btn).length) {
      $(btn).each(function (e) {
        const $btn = $(this);
        let $btnId = $btn.attr('id');
        const $href = $btn.attr('href');
        let $panelId = $href === undefined ? null : $btn.attr('href').substring(1);
        let $panel = $('#' + $panelId);
        //if($btn.attr('aria-expanded') != undefined) return false;
        const $closest = $btn.closest('.folding-list').length ? $btn.closest('.folding-list') : $btn.closest('.folding');
        if ((!$panelId || $panelId == 'none') && $closest.length) {
          $panel = $closest.find('.folding-panel');
          if ($panel.attr('id')) $panelId = $panel.attr('id');
        }
        if (!$panel.length) return;
        if (!$btnId) $btnId = 'fdBtn_' + e;
        if ($panelId == '' || $panelId == 'none' || $panelId == null) $panelId = 'fdPanel_' + e;
        $btn.attr({
          id: $btnId,
          role: 'button',
          href: '#' + $panelId,
          'aria-expanded': false,
          'aria-controls': $panelId
        });
        $panel.attr({
          id: $panelId,
          'aria-hidden': 'true',
          'aria-labelledby': $btnId
        });
        //panel이 보이면
        if ($panel.is(':visible')) {
          $(this).addClass(className).attr('aria-expanded', true);
        }
        //btn이 활성화면
        if ($(this).hasClass(className)) {
          $(this).attr('aria-expanded', true);
          $panel.removeAttr('aria-hidden').show();
        }
      });
    }
  },
  btn: function (btn, className, speed) {
    if (!className) className = 'open';
    if (!speed) speed = 200;
    ui.folding.btnAria(btn, className);
    $(btn).each(function () {
      const $btn = $(this);
      if ($btn.data('_ui-init')) return;
      $btn.data('_ui-init', true);
      $btn.on('click', function (e) {
        e.preventDefault();
        const $this = $(this);
        let $panel = $this.attr('href');
        if ($this.closest('.disabled').length || $this.hasClass('disabled')) return false;

        const slideCallback = function () {
          // 없음
        };

        if ($panel == '#' || $panel == '#none') {
          if ($this.closest('.folding-list').length) $panel = $this.closest('.folding-list').find('.folding-panel');
          if ($this.closest('.folding-tail').length) $panel = $this.closest('.folding-tail').find('.folding-tail-panel');
        }
        if ($this.hasClass(className) && !$this.hasClass('_not-folding-hide')) {
          $this.removeClass(className).attr('aria-expanded', false);
          $($panel)
            .attr('aria-hidden', true)
            .stop(true, false)
            .slideUp(speed, function () {
              slideCallback();
            });
        } else if (!$($panel).is(':visible')) {
          $this.addClass(className).attr('aria-expanded', true);
          $($panel)
            .removeAttr('aria-hidden')
            .stop(true, false)
            .slideDown(speed, function () {
              ui.scroll.inScreen($this, $($panel));
              slideCallback();
            });
        }
      });
    });
  },
  close: function (btn, className, speed) {
    if (!className) className = 'open';
    if (!speed) speed = 200;
    $(btn).each(function () {
      const $this = $(this);
      if ($this.data('_ui-init')) return;
      $this.data('_ui-init', true);
      $this.on('click', function (e) {
        e.preventDefault();
        const $closest = $(this).closest('[aria-labelledby]');
        const $btn = $closest.attr('aria-labelledby');
        if ($closest.length) {
          $closest.attr('aria-hidden', true).stop(true, false).slideUp(speed);
          if ($('#' + $btn).length)
            $('#' + $btn)
              .removeClass(className)
              .attr('aria-expanded', false);
        }
      });
    });
  }
};

/** scroll **/
ui.scroll = {
  init: function () {
    if (ui.pc.msie()) {
      ui.scroll.IEHeight('.address-result-dl > dd');
    }
  },
  is: function (target) {
    const $obj = {
      x: false,
      width: 0,
      y: false,
      height: 0
    };
    const $target = $(target);
    if ($target.outerWidth() < $target.get(0).scrollWidth) {
      $obj.x = true;
      $obj.width = $target.get(0).scrollWidth - $target.outerWidth();
    }
    if ($target.outerHeight() < $target.get(0).scrollHeight) {
      $obj.y = true;
      $obj.height = $target.get(0).scrollHeight - $target.outerHeight();
    }
    return $obj;
  },
  top: function (val, speed) {
    const dfd = $.Deferred();
    ui.scroll.wrapTop('html, body', val, speed).then(function () {
      dfd.resolve();
    });
    return dfd.promise();
  },
  wrapTop: function (wrap, val, speed) {
    const dfd = $.Deferred();
    let $top = 0;
    if (speed == undefined) speed = 300;
    if ($.isNumeric(val)) {
      $top = val;
    } else {
      if ($(val).length) $top = $(val).offset().top;
    }
    $(wrap)
      .stop(true, false)
      .animate({ scrollTop: $top }, speed, function () {
        dfd.resolve();
      });
    return dfd.promise();
  },
  center: function (el, speed, direction) {
    let $parent = $(el).parent();
    while ($parent.css('overflow-x') !== 'auto' && !$parent.is('body')) {
      $parent = $parent.parent();
    }
    if (speed == undefined) speed = 200;
    if (!!direction && direction == 'vertical') {
      const $prtH = $parent.outerWidth();
      const $thisT = Math.round($(el).position().top);
      const $thisH = $(el).outerHeight();
      const $isScrollY = ui.scroll.is($parent).y;
      let $sclT = $thisT - $prtH / 2 + $thisH / 2;
      if ($sclT < 0) $sclT = 0;
      if ($isScrollY) $parent.stop(true, false).animate({ scrollTop: $sclT }, speed);
    } else {
      const $prtW = $parent.outerWidth();
      const $thisL = Math.round($(el).position().left);
      const $thisW = $(el).outerWidth();
      const $isScrollX = ui.scroll.is($parent).x;
      let $sclL = $thisL - $prtW / 2 + $thisW / 2;
      if ($sclL < 0) $sclL = 0;
      if ($isScrollX) $parent.stop(true, false).animate({ scrollLeft: $sclL }, speed);
    }
  },
  loading: function (el, showCallback, hideCallback) {
    const io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (showCallback === false) observer.unobserve(entry.target);
            else if (!!showCallback) showCallback();
          } else {
            if (!!hideCallback) hideCallback();
          }
        });
      },
      {
        threshold: 0.03
      }
    );
    const $items = document.querySelectorAll(el);
    $items.forEach(function (odj) {
      io.observe(odj);
    });
  },
  inScreen: function (topEl, bototomEl) {
    const dfd = $.Deferred();
    if (!bototomEl) bototomEl = topEl;
    const $scrollTop = $(window).scrollTop();
    let $winHeight = $(window).height();
    const $topMargin = getTopFixedHeight(topEl) > 0 ? getTopFixedHeight(topEl) + 10 : 0;
    const $winEnd = $scrollTop + $winHeight;
    const $topElTop = $(topEl).offset().top - $topMargin;
    const $bototomElTop = $(bototomEl).offset().top;
    const $bototomElHeight = $(bototomEl).outerHeight();
    const $bototomElEnd = $bototomElTop + $bototomElHeight;
    let $scroll = '';
    if ($winEnd < $bototomElEnd) {
      $scroll = Math.min($topElTop, $bototomElEnd - $winHeight);
    } else if ($scrollTop > $topElTop) {
      $scroll = $topElTop;
    }

    if ($scroll == '') {
      dfd.resolve();
    } else {
      ui.scroll.top($scroll).then(function () {
        dfd.resolve();
      });
    }

    return dfd.promise();
  },
  IEHeight: function (el) {
    const $el = $(el);
    if (!$el.length) return;
    $el.each(function () {
      const $this = $(this);
      const $thisTop = $this.offset().top;
      const $thisH = $this.outerHeight();
      const $docH = $('body').height();
      const $thisBottom = $docH - $thisTop - $thisH;
      const $windowH = $(window).height();
      const $height = $windowH - $thisTop - $thisBottom;
      $el.css('height', $height);
    });
  }
};

/** animation **/
ui.animation = {
  init: function () {
    let $animations = $('[data-animation]');
    if ($animations.length > 0) {
      ui.animation.sclReady();
      const $boayEl = function () {
        $animations = $('[data-animation]');
        const rtnVal = [];
        $animations.each(function () {
          const $this = $(this);
          if (!$this.closest('.popup').length) rtnVal.push(this);
        });
        return rtnVal;
      };
      if ($boayEl().length) {
        ui.animation.sclCheckIn($boayEl(), window);
        $(window).on(
          'scroll resize',
          _.throttle(function () {
            ui.animation.sclCheckIn($boayEl(), window);
          }, 300)
        );
      }
    }
  },
  sclIdx: 0,
  sclAry: [],
  sclReady: function (target) {
    const $animations = $('[data-animation]');
    $.each($animations, function () {
      const $el = $(this);
      const $delay = parseInt($el.data('delay'));
      const $duration = parseInt($el.data('duration'));
      let $repeat = parseInt($el.data('repeat'));
      const $addClassAry = ['on', 'active', 'checked', 'selected'];
      const $animateClassAry = ['rolling-number', 'count-number'];
      const $dataAnimation = $el.data('animation');
      if ($dataAnimation === 'rolling-number') ui.animation.rollingReady(this);
      if ($dataAnimation === 'count-number') ui.animation.countReady(this);

      let $animationClass = 'animate__' + $dataAnimation;
      if ($addClassAry.indexOf($dataAnimation) >= 0 || $dataAnimation.indexOf('spl-') >= 0) {
        $el.data('animation-type', 2);
        $animationClass = $dataAnimation;
      } else if ($animateClassAry.indexOf($dataAnimation) >= 0) {
        $el.data('animation-type', 3);
        $el.addClass($dataAnimation);
      } else if (!$el.hasClass('animate__animated') && $animationClass.indexOf('animate__') >= 0) {
        $el.data('animation-type', 1);
        if ($delay > 0) {
          $el.css({
            '-webkit-animation-delay': $delay + 'ms',
            'animation-delay': $delay + 'ms'
          });
        }
        if ($duration > 0) {
          $el.css({
            '-webkit-animation-duration': $duration + 'ms',
            'animation-duration': $duration + 'ms'
          });
        }
        if ($repeat > 0) {
          if ($repeat > 5) $repeat = 5;
          $el.addClass('animate__repeat-' + $repeat);
        }
        $el.addClass('animate__animated paused ' + $animationClass);
      }
    });
  },
  sclTypeChk: function (el) {
    let returnVal = null;
    const $el = el;
    const $type = $el.data('animation-type');
    const $dataAnimation = $el.data('animation');
    if ($type == 1) {
      returnVal = 'animate__' + $dataAnimation;
    } else if ($type == 2) {
      returnVal = $dataAnimation;
    } else if ($type == 3) {
      returnVal = 'is-active';
    }
    return returnVal;
  },
  sclCheckIn: function (target, wrap) {
    const $target = target;
    if (!$target.length) return;
    $.each($target, function () {
      const $el = $(this);
      if (!$el.length) return;
      const $isWin = wrap === window ? true : false;
      const $wrap = $(wrap);
      const $wHeight = $wrap.height();
      const $scrollTop = $wrap.scrollTop();
      const $topFixedH = getTopFixedHeight($el);
      const $wrapTop = $scrollTop + $topFixedH;
      const $wrapCenter = $scrollTop + ($wHeight - $topFixedH) / 2;
      const $wrapBottom = $scrollTop + $wHeight - 100;

      const $elHeight = $el.outerHeight();
      const $matrix = $el.css('transform');
      const $matrixAry = $matrix.replace(/[^0-9\-.,]/g, '').split(',');
      let $matrixX = $matrixAry[12] || $matrixAry[4];
      if ($matrixX === undefined) $matrixX = 0;
      let $matrixY = $matrixAry[13] || $matrixAry[5];
      if ($matrixY === undefined) $matrixY = 0;
      let $elTop = $el.offset().top - $matrixY;
      if (!$isWin) $elTop = $elTop + $scrollTop;
      const $elCenter = $elTop + $elHeight / 2;
      const $elBottom = $elTop + $elHeight;

      const $animationClass = ui.animation.sclTypeChk($el);
      if ($el.data('init')) return;
      if (($wrapTop <= $elTop && $elTop <= $wrapBottom) || ($wrapTop <= $elBottom && $elBottom <= $wrapBottom) || ($wrapTop > $elTop && $elBottom > $wrapBottom)) {
        ui.animation.sclAction($el, $elTop);
        if (($el.hasClass('lottie__init'), $el.data('lottie'))) {
          setTimeout(function () {
            const $lottie = $el.data('lottie-opt');
            // if ($el.hasClass('_loop')) $lottie.loop = true;
            $lottie.play();
          }, 100);
        }
      } else {
        const $timer = $el.data('time');
        if ($timer !== undefined) {
          clearTimeout($timer);
          $el.removeData('time');
          if (ui.animation.sclIdx > 0) ui.animation.sclIdx -= 1;
        }
      }
    });
  },
  sclAction: function (el, top) {
    const $el = $(el);
    const $animationClass = ui.animation.sclTypeChk(el);
    const $delay = 200;

    if ($el.data('time') !== undefined) return;
    let $isSameTop = false;
    let timer;
    if (top) {
      const AryIdx = ui.animation.sclAry.indexOf(top);
      if (AryIdx >= 0) {
        $isSameTop = true;
        timer = AryIdx * $delay;
      } else {
        ui.animation.sclAry.push(top);
      }
    }
    if (!$isSameTop) {
      timer = ui.animation.sclIdx * $delay;
      ui.animation.sclIdx += 1;
    }
    const initTimer = setTimeout(function () {
      $el.data('init', true);
      if (ui.animation.sclIdx > 0 || !$isSameTop) ui.animation.sclIdx -= 1;
      if (ui.animation.sclIdx === 0) ui.animation.sclAry = [];
      const $slide = $el.closest('.swiper-slide');
      if ($el.hasClass('animate__animated')) {
        if ($el.closest('.tab-panel').length && !$el.closest('.tab-panel').hasClass('active')) return;
        if ($slide.length) {
          if ($slide.hasClass('swiper-slide-active')) {
            if (!$el.hasClass($animationClass)) $el.addClass($animationClass);
            if ($el.hasClass('paused')) $el.removeClass('paused');
          }
        } else {
          if (!$el.hasClass($animationClass)) $el.addClass($animationClass);
          if ($el.hasClass('paused')) $el.removeClass('paused');
        }
      } else {
        if ($slide.length) {
          if ($slide.hasClass('swiper-slide-active')) $el.addClass($animationClass);
        } else {
          if ($el.hasClass('count-number')) ui.animation.countInit($el);
          $el.addClass($animationClass);
          if ($el.hasClass('ui-tap-item')) {
            const removeEvt = function () {
              $el.remove();
              $el[0].removeEventListener('animationend', removeEvt);
            };
            $el[0].addEventListener('animationend', removeEvt);
          }
        }
      }
      $el.removeData('time');
    }, timer);
    $el.data('time', initTimer);
  },
  rollingReady: function (target) {
    const $this = $(target);
    if ($this.hasClass('is-ready')) return;
    $this.addClass('is-ready');
    const $thisH = $this.height();
    $this.css({
      height: $thisH,
      'line-height': $thisH + 'px'
    });
    const $thisText = $this.text();
    $this.role('img');
    $this.aria('label', $thisText);
    $this.attr('title', $thisText);
    const $textAry = $thisText.split('');
    let $html = '';
    const $space = '<span>&nbsp;</span>';
    const $rotateNum = 3;
    for (let i = 0; i < $textAry.length; i++) {
      const $text = $textAry[i];
      const $number = parseInt($text);
      // console.log($text, $number)
      if ($.isNumeric($number)) {
        $html += '<span class="rolling__in" data-number="' + $number + '" style="top:-' + ($rotateNum * 10 + $number + 1) + '00%;animation-delay:' + i * 5 + '0ms;">';
        $html += $space;
        for (let j = 0; j < $rotateNum; j++) {
          for (let k = 0; k < 10; k++) {
            $html += '<span>' + k + '</span>';
          }
        }
        for (let l = 0; l <= $number; l++) {
          $html += '<span>' + l + '</span>';
        }
        $html += '</span>';
      } else {
        $html += '<span class="rolling__in" style="top:-100%;animation-delay:' + i * 5 + '0ms;">' + $space + '<span>' + $text + '</span></span>';
      }
    }
    $this.html($html);
  },
  countReady: function (target) {
    const $el = $(target);
    const $text = $el.text();
    $el.aria('label', $text);
    $el.attr('title', $text);
    $el.text('0');
  },
  countInit: function (target, duration) {
    const $duration = duration === undefined ? 1000 : duration;
    const $el = $(target);
    const $title = $el.attr('title');
    if ($title === '0') {
      $el.text($title);
      return;
    }
    const $number = onlyNumber($title);
    $el.text(addComma($number));
    const $width = $el.outerWidth();
    const $height = $el.outerHeight();
    $el
      .css({
        overflow: 'hidden',
        'text-align': 'right',
        'min-width': $width,
        height: $height,
        'min-inline-size': $width
      })
      .text(0);
    // const $start = $el.text();
    $({ now: 0 }).animate(
      { now: $number },
      {
        duration: $duration,
        easing: 'easeOutExpo',
        step: function (now, e) {
          $el.text(addComma(Math.floor(now)));
          // if(isComma){
          //   $el.text(addComma(Math.floor(now)));
          // }else{
          //   $el.text(Math.floor(now));
          // }
          if (now === parseInt($number)) {
            $el.removeCss(['overflow', 'text-align', 'min-width', 'height', 'min-inline-size']);
          }
        }
      }
    );
  },
  sclAray: [],
  splitting: function () {
    $('[data-splitting]').each(function () {
      const $el = $(this);
      const $role = $el.attr('role');
      if ($role === undefined) $el.role('img');
      const $text = $el.text();
      const $label = $el.attr('aria-label');
      if ($label === undefined || $text !== $label) $el.aria('label', $text);
    });
    Splitting();
  }
};

ui.swiper = {
  pop: function (target) {
    let uiSwiper;

    function init() {
      const $target = $(target);
      if (!$target.length) return;
      const $container = $target.find('.swiper-container');
      const prevSwiper = $container.data('swiper');
      if (prevSwiper) prevSwiper.destroy(true, true);
      const $slide = $container.find('.swiper-slide');
      if ($slide.length < 2) return;
      let $paginationEl = $container.find('.swiper-pagination');
      let $prevBtn = $container.find('.swiper-button.prev');
      let $nextBtn = $container.find('.swiper-button.next');
      const $popSwiper = $container.parent().closest('.pop-swiper-body');
      if ($popSwiper.length) {
        $paginationEl = $popSwiper.find('.swiper-pagination');
        $prevBtn = $popSwiper.find('.swiper-button.prev');
        $nextBtn = $popSwiper.find('.swiper-button.next');
      }
      let $paginationType = 'bullets';
      if ($paginationEl.hasClass('_fraction')) $paginationType = 'fraction';
      const $pagination = {
        el: $paginationEl,
        type: $paginationType,
        clickable: true
      };

      uiSwiper = new Swiper($container, {
        loop: true,
        autoHeight: true,
        pagination: $pagination
        /* 좌우버튼 비활성화
          on: {
          init: function () {
            if ($prevBtn.length) $prevBtn.prop('disabled', true);
            if ($nextBtn.length) $nextBtn.prop('disabled', false);
          },
          slideChange: function () {
            const $idx = uiSwiper.realIndex;
            if ($prevBtn.length) {
              if ($idx === 0) $prevBtn.prop('disabled', true);
              else $prevBtn.prop('disabled', false);
            }
            if ($nextBtn.length) {
              if ($idx === $slide.length - 1) $nextBtn.prop('disabled', true);
              else $nextBtn.prop('disabled', false);
            }
          }
        }*/
      });
      $container.data('swiper', uiSwiper);

      if ($prevBtn.length) {
        $prevBtn.off('click').on('click', function (e) {
          e.preventDefault();
          if (uiSwiper) {
            uiSwiper.slidePrev();
          }
        });
      }
      if ($nextBtn.length) {
        $nextBtn.off('click').on('click', function (e) {
          e.preventDefault();
          if (uiSwiper) {
            uiSwiper.slideNext();
          }
        });
      }
    }

    if (typeof Swiper === 'function') {
      init();
    } else {
      const $swiperJS = '/js/lib/swiper_4.5.1.min.js'; //IE 지원때문에 낮은버전 사용
      ui.util.loadScript($swiperJS).then(function () {
        init();
      });
    }
  }
};

/********************************
 * front 사용함수 *
 ********************************/
const $focusableEl = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]';

//body scroll lock
const Body = {
  scrollTop: '',
  lock: function () {
    if ($('html').hasClass('lock')) return;

    if (ui.mobile.any()) {
      Body.scrollTop = window.scrollY;
      const $wrap = $(ui.className.mainWrap + ':visible');
      if ($wrap.length) {
        const $wrapTop = $wrap.offset().top;
        const $setTop = Body.scrollTop * -1 + $wrapTop;
        $wrap.addClass('lock-wrap').css('top', $setTop);
      }
    }
    $('html').addClass('lock');
  },
  unlock: function () {
    if (!$('html').hasClass('lock')) return;

    $('html').removeClass('lock');
    if (ui.mobile.any()) {
      $('.lock-wrap').removeClass('lock-wrap').removeAttr('style');
      window.scrollTo(0, Body.scrollTop);
      window.setTimeout(function () {
        Body.scrollTop = '';
      }, 0);
    }
  }
};

//로딩함수
const Loading = {
  className: {
    wrap: '.loading-wrap',
    box: '.loading-lottie'
  },
  speed: 200,
  length: 0,
  ready: function () {
    if ($(Loading.className.wrap).length) return;
    let $html = '<div class="' + Loading.className.wrap.slice(1) + '" class="hide">';
    $html += '<div class="tl">';
    $html += '<div>';
    /* // img 타입
    $h$('body').prepend($html);tml += '<div class="loading-icon" role="img"';
    if (!txt) {
      $html += ' aria-label="화면을 불러오는중입니다."';
    }
    $html += '>';
    $html += '</div>';
    */

    /* // svg 타입
    $html += '<div class="loading-svg" role="img"';
    if (!txt) {
      $html += ' aria-label="화면을 불러오는중입니다."';
    }
    $html += '>';
    $html += '<svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">';
    $html += '<circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>';
    $html += '</svg>';
    $html += '</div>';
    */

    // lottie 타입
    const $file = ui.basePath() + '/lottie/loading.json';
    $html += '<div class="' + Loading.className.box.slice(1) + '" role="img" aria-label="화면을 불러오는중입니다.">';
    $html += '';
    $html += '<div class="lottie _loop" data-lottie="' + $file + '" aria-hidden="true"></div>';
    $html += '</div>';
    $html += '</div>';
    $html += '</div>';
    $html += '</div>';

    $('body').append($html);
    if ($(Loading.className.wrap + ' .lottie').length) {
      ui.common.lottie();
    }
  },
  open: function (txt) {
    let $loading = $(Loading.className.wrap);

    Loading.length += 1;
    if (Loading.length > 0) {
      if (!$loading.hasClass('show')) $loading.addClass('show');
    } else {
      Loading.length = 0;
    }

    if ($(Loading.className.wrap + ' .txt').length) $(Loading.className.wrap + ' .txt').remove();
    if (!!txt) $(Loading.className.wrap + ' ' + Loading.className.box).after('<div class="txt">' + txt + '</div>');
  },
  isClose: false,
  close: function (closeTye) {
    const $loading = $(Loading.className.wrap);
    if ($loading.length) {
      if (closeTye === true) Loading.length = 0;
      else Loading.length -= 1;
      if (Loading.length <= 0) $loading.removeClass('show');
    }
  }
};

const Layer = {
  id: 'uiLayer',
  className: {
    popup: 'popup',
    page: 'pop-page',
    wrap: 'pop-wrap',
    header: 'pop-head',
    headerInner: 'pop-head-inner',
    headerLeft: 'pop-head-left',
    headerRight: 'pop-head-right',
    close: 'pop-close',
    body: 'pop-body',
    bodyInner: 'pop-body-inner',
    footer: 'pop-foot',
    footerInner: 'pop-foot-inner',
    active: 'show',
    focused: 'pop__focused',
    focusIn: 'ui-focus-in',
    removePopup: 'ui-pop-remove',
    closeRemove: 'ui-pop-close-remove',
    alert: 'ui-pop-alert',
    lastPopup: 'ui-pop-last',
    bgNoClose: 'bg-no-click',
    bgClose: 'pop-bg-close',
    openUI: 'ui-pop-open',
    closeUI: 'ui-pop-close'
  },
  closeHtml: function () {
    return '<button type="button" class="' + Layer.className.close + ' ' + Layer.className.closeUI + '" aria-label="팝업창 닫기"></button>';
  },
  bgCloseHtml: function () {
    return '<div class="' + Layer.className.bgClose + ' ' + Layer.className.closeUI + '" role="button" aria-label="팝업창 닫기"></div>';
  },
  init: function () {
    Layer.ready();
    Layer.UI();
  },
  reInit: function () {
    Layer.ready();
  },
  ready: function () {
    if ($('.' + Layer.className.popup + '.' + Layer.className.active + '[aria-hidden="true"]').length) {
      Layer.open('.' + Layer.className.popup + '.' + Layer.className.active + '[aria-hidden="true"]');
    }
  },
  reOpen: false,
  openEl: '',
  openPop: [],
  opening: 0,
  open: function (tar) {
    const dfd = $.Deferred();
    const $popup = $(tar);
    const $popWrap = $popup.find('.' + Layer.className.wrap);
    const $popHead = $popup.find('.' + Layer.className.header);
    const $popFoot = $popup.find('.' + Layer.className.footer);

    //만약 팝업 없을때
    if (!$popup.length || !$popWrap.length) {
      if (!Layer.reOpen) {
        Layer.reOpen = true;
        console.log(tar, '팝업없음, 0.5초 후 open 재시도');
        setTimeout(function () {
          Layer.open(tar);
        }, 500);
      } else {
        Layer.reOpen = false;
        console.log(tar, '재시도해도 팝업없음');
        dfd.reject();
      }
      return;
    } else if ($popup.hasClass('op-0')) {
      if (!Layer.reOpen) {
        Layer.reOpen = true;
        console.log(tar, '팝업 투명처리');
        setTimeout(function () {
          Layer.open(tar);
        }, 500);
      } else {
        Layer.reOpen = false;
        console.log(tar, '재시도해도 팝업 투명상태');
        dfd.reject();
      }
      return;
    }

    Layer.opening += 1;

    //id없을때
    let $id = $popup.attr('id');
    const $idx = $popup.index('.' + Layer.className.popup);
    if ($id === undefined) {
      $id = Layer.id + $idx;
      $popup.attr('id', $id);
    }

    //last 체크, z-index
    let $lastPop = '';
    if (Layer.openPop.length) $lastPop = Layer.openPop[Layer.openPop.length - 1];
    if (!$popup.hasClass(Layer.className.alert)) {
      if (Layer.openPop.indexOf($popup[0]) < 0) Layer.openPop.push($popup[0]);
      Layer.setOrder();
    } else {
      const $alertShowLength = $('.' + Layer.className.popup + '.' + Layer.className.active + '.' + Layer.className.alert).length;
      if ($popup.hasClass(Layer.className.alert) && !$alertShowLength) $popup.css('z-index', '+=' + $alertShowLength);
    }

    // bg close
    /*
    if (!$popup.hasClass(Layer.className.alert) && !$popup.hasClass(Layer.className.bgNoClose) && !$popup.find('.' + Layer.className.bgClose).length) {
      $popup.prepend(Layer.bgCloseHtml());
    }
    */

    // delay time
    const $openDelay = 20 * Layer.opening;

    //show
    $popup.attr('aria-hidden', false);
    if (ui.pc.msie()) {
      $popup.show();
    } else {
      $popup.css('display', 'flex');
    }

    Layer.position($popup);

    const $FocusEvt = function () {
      //리턴 포커스
      let $focusEl = '';
      try {
        if (event.currentTarget != document) {
          $focusEl = $(event.currentTarget);
        } else {
          $focusEl = $(document.activeElement);
        }
      } catch (error) {
        $focusEl = $(document.activeElement);
      }

      if (Layer.openEl != '' && !$focusEl.is($focusableEl)) $focusEl = $(Layer.openEl);
      if ($($lastPop).data('returnFocus') == $focusEl) $focusEl = $(Layer.openEl);
      if ($($focusEl).is($focusableEl)) {
        $popup.data('returnFocus', $focusEl);
        $focusEl.addClass(Layer.className.focused);
        if ($focusEl.hasClass('btn-select')) $focusEl.closest('.select').addClass('focused');
      }
      //팝업 in 포커스
      if (!ui.mobile.any()) {
        //PC
        if ($popup.hasClass(Layer.className.alert)) {
          const $firstBtn = $popFoot.find('.button').first();
          setTimeout(function () {
            $firstBtn.focus();
          }, 200);
        } else {
          $popup.attr({ tabindex: 0 }).focus();
        }
      } else {
        let $first = '';
        let $focusInEl = $popup.find('.' + Layer.className.focusIn);
        let $thisTxt = '';
        let $childrenTxt = '';
        //모바일
        if ($popHead.find('h1').length) {
          $popHead.find('h1').attr({ tabindex: 0 }).focus();
        } else if ($popHead.find('.' + Layer.className.close).length) {
          $popHead.find('.' + Layer.className.close).focus();
        } else {
          if (!$focusInEl.length) {
            $focusInEl = $popup.find('.' + Layer.className.body);
            $first = $focusInEl.children().not('br').first();
            if ($first.text() == '' || $first.attr('aria-hidden') == 'true') $first = $first.next();
            $thisTxt = $.trim($focusInEl.text());
            $childrenTxt = $.trim($first.text());
            while ($focusInEl.children().not('br').length && $thisTxt.indexOf($childrenTxt) == 0) {
              $focusInEl = $first;
              $first = $first.children().not('br').first();
              if ($first.text() == '' || $first.attr('aria-hidden') == 'true') $first = $first.next();
              $thisTxt = $.trim($focusInEl.text());
              $childrenTxt = $.trim($first.text());
            }
            $focusInEl.addClass(Layer.className.focusIn);
          }
          if (!$focusInEl.is($focusableEl)) $focusInEl.attr('tabindex', -1);
          $focusInEl.focus();
        }
      }
    };
    $FocusEvt();

    if ($popup.find('.' + Layer.className.footer).length) $popup.find('.' + Layer.className.body).addClass('next-foot');

    setTimeout(function () {
      //웹접근성
      //$(Layer.className.etc).attr('aria-hidden', true);
      if (Layer.openPop.length && $lastPop) $($lastPop).attr('aria-hidden', true);
      const $tit = $popHead.find('h1');
      if ($tit.length) {
        if ($tit.attr('id') == undefined) {
          $tit.attr('id', $id + 'Label');
          $popup.attr('aria-labelledby', $id + 'Label');
        } else {
          $popup.attr('aria-labelledby', $tit.attr('id'));
        }
      }

      //열기
      Body.lock();
      $popup.addClass(Layer.className.active);

      //focus
      if (!ui.mobile.any()) Layer.focusMove(tar);

      //callback
      const transitionEndEvt = function () {
        setTimeout(function () {
          $popup.addClass(Layer.className.active + '-end');
        }, 100);

        if ($popup.hasClass('drag') && $popHead.length && !$popWrap.hasClass('ui-draggable')) {
          $popWrap.draggable({
            // containment: 'window',
            handle: $popHead,
            scroll: false,
            drag: function (event, ui) {
              const $top = ui.position.top;
              const $minTop = ($popup.height() - $popWrap.height()) / 2 + $popHead.outerHeight();
              const $maxTop = $popup.height() - ($popup.height() - $popWrap.height()) / 2;
              ui.position.top = Math.min(Math.max($top, -$minTop), $maxTop);
              const $left = ui.position.left;
              const $minLeft = ($popup.width() - $popWrap.width()) / 2 + $popWrap.width();
              ui.position.left = Math.min(Math.max($left, -$minLeft), $minLeft);
            }
          });
        }

        $popup.trigger('Layer.show');
        dfd.resolve();
        $popup.off('transitionend', transitionEndEvt);
      };
      $popup.on('transitionend', transitionEndEvt);

      Layer.opening -= 1;
      const $showLength = $('.' + Layer.className.popup + '.' + Layer.className.active);
      if (!$showLength) Layer.opening = 0;
    }, $openDelay);

    return dfd.promise();
  },
  close: function (tar) {
    const dfd = $.Deferred();
    const $popup = $(tar);
    const $popWrap = $popup.find('.' + Layer.className.wrap);
    if (!$popup.hasClass(Layer.className.active)) {
      dfd.reject();
      return console.log(tar, '해당팝업 안열려있음');
    }

    if (!$popup.hasClass(Layer.className.alert)) {
      Layer.openPop.splice(Layer.openPop.indexOf($popup[0]), 1);
      Layer.setOrder();
    }

    const $visible = $('.' + Layer.className.popup + '.' + Layer.className.active).length;
    if ($visible == 1) {
      Body.unlock();
      //$(Layer.className.etc).removeAttr('aria-hidden');
    }

    let $lastPop = '';
    if (Layer.openPop.length) $lastPop = Layer.openPop[Layer.openPop.length - 1];
    if (!!$lastPop) $($lastPop).attr('aria-hidden', false);

    //포커스
    const $returnFocus = $popup.data('returnFocus');
    const $focusEvt = function () {
      if ($returnFocus != undefined) {
        $returnFocus.removeClass(Layer.className.focused).focus();
        if ($returnFocus.hasClass('btn-select')) $returnFocus.closest('.select').removeClass('focused');
        //플루팅 버튼
        if ($returnFocus.closest(ui.className.floatingBtn).length && $returnFocus.closest(ui.className.floatingBtn).hasClass('pop-on')) {
          $returnFocus.closest(ui.className.floatingBtn).removeCss('z-index').removeClass('pop-on');
        }
      } else {
        //리턴 포커스가 없을때
        const mainWrap = $(ui.className.mainWrap + ':visible');
        const mainWrapHeader = mainWrap.find(ui.className.header);
        if (mainWrapHeader.length) {
          mainWrapHeader.find('h1 a').focus();
        } else {
          mainWrap.find('.page-title').attr({ tabindex: 0 }).focus();
        }
      }
    };
    setTimeout(function () {
      $focusEvt();
    }, 100);

    //닫기
    $popup.removeClass(Layer.className.active + '-end');

    $popup.removeClass(Layer.className.active).data('focusMove', false).data('popPosition', false);
    $popup.attr('aria-hidden', 'true').removeAttr('tabindex aria-labelledby');

    const $closeAfter = function () {
      $popup.removeAttr('style data-index');
      $popup
        .find('.' + Layer.className.header)
        .removeAttr('style')
        .find('h1')
        .removeAttr('tabindex');
      $popup.find('.' + Layer.className.body).removeAttr('style');
      $popup.find('.' + Layer.className.focusIn).removeAttr('tabindex');
      if ($popup.hasClass('drag')) $popWrap.removeCss(['left', 'top']);

      // 닫을 때 없어져야하는 요소
      if ($popup.find('.' + Layer.className.closeRemove).length) $popup.find('.' + Layer.className.closeRemove).remove();

      // 닫기 후 팝업 자체가 없어지는 케이스
      if ($popup.hasClass(Layer.className.alert) || $popup.hasClass(Layer.selectClass) || $popup.hasClass(Layer.className.removePopup)) {
        if ($popup.hasClass(Layer.selectClass)) Layer.isSelectOpen = false;
        $popup.remove();
      }
    };

    const transitionEndEvt = function () {
      $closeAfter();

      $popup.trigger('Layer.hide');
      dfd.resolve();
      $popup.off('transitionend', transitionEndEvt);
    };
    $popup.on('transitionend', transitionEndEvt);

    return dfd.promise();
  },
  position: function (tar) {
    const $popup = $(tar);
    if (!$popup.length) return;
    const $popH = $popup.height();
    const $head = $popup.find('.' + Layer.className.header);
    const $headH = $head.length ? $head.outerHeight() : 0;
    const $foot = $popup.find('.' + Layer.className.footer);
    const $footH = $foot.length ? $foot.outerHeight() : 0;
    const $body = $popup.find('.' + Layer.className.body);
    const $wrap = $popup.find('.' + Layer.className.wrap);
    $body.css('max-height', $popH - $headH - $footH);

    const $wrapH = $wrap.outerHeight();
    const $wrapMgT = $popH - $wrapH;
    if (ui.pc.msie()) {
      if ($wrapMgT > 0) {
        $wrap.css('margin-top', $wrapMgT / 2);
      } else {
        $wrap.removeCss('margin-top');
      }
    }

    Layer.bodyScrollChk($body);
  },
  bodyScrollChk: function (el) {
    const $el = $(el);
    const $elH = $el.outerHeight();
    const $sclTop = $el.scrollTop();
    const $sclH = $el[0].scrollHeight;
    const $foot = $el.siblings('.' + Layer.className.footer);
    if ($elH === $sclH || !$foot.length) return;
    if ($sclTop >= $sclH - $elH - 5) {
      $foot.removeClass('fixed');
    } else {
      $foot.addClass('fixed');
    }
  },
  setOrder: function () {
    if (!Layer.openPop.length) return;
    $('.' + Layer.className.popup)
      .removeClass(Layer.className.lastPopup)
      .removeCss('z-index');
    $.each(Layer.openPop, function (i) {
      const $this = $(this);
      $this.attr('data-index', i);
      if (i) $this.css('z-index', '+=' + i);
      if (i === Layer.openPop.length - 1) $this.addClass(Layer.className.lastPopup);
    });
  },
  focusMove: function (tar) {
    if (!$(tar).hasClass(Layer.className.active)) return false;
    if ($(tar).data('focusMove') == true) return false;
    $(tar).data('focusMove', true);
    const $tar = $(tar);
    const $focusaEls = $tar.find($focusableEl);
    // let $isFirstBackTab = false;

    $focusaEls.on('keydown', function (e) {
      const $keyCode = e.keyCode ? e.keyCode : e.which;
      const $focusable = $tar.find($focusableEl);
      const $focusLength = $focusable.length;
      const $firstFocus = $focusable.first();
      const $lastFocus = $focusable.last();
      const $index = $focusable.index(this);

      if ($keyCode === 9) {
        if ($focusLength === 1) {
          e.preventDefault();
        } else if (!e.shiftKey && $index === $focusLength - 1) {
          e.preventDefault();
          $firstFocus.focus();
        } else if (e.shiftKey && $index === 0) {
          e.preventDefault();
          $lastFocus.focus();
        }
      }
    });

    $tar.on('keydown', function (e) {
      const $keyCode = e.keyCode ? e.keyCode : e.which;
      const $focusable = $tar.find($focusableEl);
      const $lastFocus = $focusable.last();

      if (e.target == this && $keyCode == 9) {
        if (e.shiftKey) {
          $lastFocus.focus();
          e.preventDefault();
        }
      }
    });
  },
  alertHtml: function (type, popId, btnActionId, btnCancelId) {
    let $html = '<div id="' + popId + '" class="' + Layer.className.popup + ' small alert ' + Layer.className.alert + '" role="dialog" aria-hidden="true">';
    $html += '<article class="' + Layer.className.wrap + '">';
    $html += '<header class="' + Layer.className.header + '"><div class="' + Layer.className.headerInner + '"><div class="' + Layer.className.headerLeft + ' full"><i class="i-ico-warning"></i><h1>안내</h1></div></div></header>';
    $html += '<main class="' + Layer.className.body + '">';
    $html += '<div class="' + Layer.className.bodyInner + '">';
    if (type === 'prompt') {
      $html += '<div class="form-item">';
      $html += '<div class="form-lbl">';
      $html += '<label for="inpPrompt" role="alert" aria-live="assertive"></label>';
      $html += '</div>';
      $html += '<div class="input"><input type="text" id="inpPrompt" placeholder="입력해주세요."></div>';
      $html += '</div>';
    } else {
      $html += '<div class="message">';
      $html += '<i class="i-ico-warning"></i>';
      $html += '<div role="alert" aria-live="assertive"></div>';
      $html += '</div>';
    }
    $html += '</div>';
    $html += '</main>';
    $html += '<footer class="' + Layer.className.footer + '">';
    $html += '<div class="' + Layer.className.footerInner + '">';
    $html += '<button type="button" id="' + btnActionId + '" class="button large action">확인</button>';
    if (type === 'confirm' || type === 'prompt') {
      $html += '<button type="button" id="' + btnCancelId + '" class="button large cancel">취소</button>';
    }
    $html += '</div>';
    $html += '</footer>';
    $html += '</article>';
    $html += '</div>';

    $('body').append($html);
  },
  alertEvt: function (type, option, title, actionTxt, cancelTxt, init) {
    const dfd = $.Deferred();

    const $length = $('.' + Layer.className.alert).length;
    const $popId = Layer.id + 'Alert' + $length;
    const $actionId = $popId + 'ActionBtn';
    const $cancelId = $popId + 'CancelBtn';

    if (typeof option === 'object') {
      Layer.content = option.content;
    } else if (typeof option == 'string') {
      //약식 설절
      Layer.content = option;
    }

    //텍스트가 아닌 배열이나 객체일때 텍스트 변환
    if (typeof Layer.content !== 'string') Layer.content = JSON.stringify(Layer.content);

    //내용있는지 체크
    if ($.trim(Layer.content) == '' || Layer.content == undefined) return false;

    //팝업그리기
    Layer.alertHtml(type, $popId, $actionId, $cancelId);
    const $pop = $('#' + $popId);
    const $header = $pop.find('.' + Layer.className.header);
    if (!!option.title || (typeof title === 'string' && title !== '')) {
      const $insertTit = typeof title === 'string' && title !== '' ? title : option.title;
      $header.find('h1').html($insertTit);
    } else {
      $header.remove();
    }
    let $actionTxt;
    if (!!option.actionTxt) $actionTxt = option.actionTxt;
    if (typeof actionTxt === 'string' && actionTxt !== '') $actionTxt = actionTxt;
    if ($actionTxt) $('#' + $actionId).html($actionTxt);

    let $cancelTxt;
    if (!!option.cancelTxt) $cancelTxt = option.cancelTxt;
    if (typeof cancelTxt === 'string' && cancelTxt !== '') $cancelTxt = cancelTxt;
    if ($cancelTxt) $('#' + $cancelId).html($cancelTxt);
    // if ($actionTxt && $cancelTxt && $actionTxt.length > $cancelTxt.length + 4) $('#' + $cancelId).addClass('w-33fp');

    const $htmlContent = Layer.content;
    if (type === 'prompt') {
      $pop.find('.form-lbl label').html($htmlContent);
    } else {
      const $textAry = $htmlContent.split(' '),
        $textLengthAry = [];
      for (let i = 0; i < $textAry.length; i++) {
        $textLengthAry.push($textAry[i].length);
      }
      const $maxTxtLength = Math.max.apply(null, $textLengthAry);
      if ($maxTxtLength > 20) $pop.find('.message>div').addClass('breakall');
      $pop.find('.message>div').html($htmlContent);
    }
    if (!!option.init) option.init($pop[0]);
    if (typeof init === 'function') init($pop[0]);
    Layer.open('#' + $popId);

    //click
    const $actionBtn = $('#' + $actionId);
    const $cancelBtn = $('#' + $cancelId);
    $actionBtn.on('click', function () {
      const $inpVal = $pop.find('.input input').val();
      const $actionEvt = function () {
        if (type === 'prompt') {
          dfd.resolve($inpVal);
        } else {
          dfd.resolve();
        }
        if (!!option.action && typeof option.action === 'function') option.action();
      };
      Layer.close('#' + $popId).then($actionEvt);
    });
    $cancelBtn.on('click', function () {
      const $cancelEvt = function () {
        dfd.reject();
      };
      if (!!option.cancel && typeof option.cancel === 'function') option.cancel();
      Layer.close('#' + $popId).then($cancelEvt);
    });

    return dfd.promise();
  },
  alert: function (option, title, actionTxt, init) {
    if (option === '' || option === null) return console.log('메세지를 입력해주세요');
    const dfd = $.Deferred();
    Layer.alertEvt('alert', option, title, actionTxt, null, init).then(function () {
      dfd.resolve();
    });
    return dfd.promise();
  },
  confirm: function (option, title, actionTxt, cancelTxt, init) {
    if (option === '' || option === null) return console.log('메세지를 입력해주세요');
    const dfd = $.Deferred();
    Layer.alertEvt('confirm', option, title, actionTxt, cancelTxt, init).then(
      function () {
        dfd.resolve();
      },
      function () {
        dfd.reject();
      }
    );
    return dfd.promise();
  },
  tooltip: function (contents, title) {
    const tooltipPopId = 'uiPopToolTip';
    let $html = '<div id="' + tooltipPopId + '" class="' + Layer.className.popup + ' small tooltip ' + Layer.className.removePopup + '" role="dialog" aria-hidden="true">';
    $html += Layer.bgCloseHtml();
    $html += '<article class="' + Layer.className.wrap + '">';
    if (title !== undefined && title !== '') {
      $html += '<header class="' + Layer.className.header + '">';
      $html += '<div class="' + Layer.className.headerInner + '">';
      $html += '<div class="' + Layer.className.headerLeft + '">';
      $html += '<h1>' + title + '</h1>';
      $html += '</div>';
      $html += '<div class="' + Layer.className.headerRight + '">';
      $html += Layer.closeHtml();
      $html += '</div>';
      $html += '</div>';
      $html += '</header>';
    }
    $html += '<main class="' + Layer.className.body + '">';
    $html += '<div class="' + Layer.className.bodyInner + '">';
    if (title === undefined) {
      $html += Layer.closeHtml();
    }
    $html += contents;
    $html += '</div>';
    $html += '</main>';
    $html += '</article>';
    $html += '</div>';

    $('body').append($html);
    Layer.open('#' + tooltipPopId);
  },
  resizeUI: function () {
    const $show = $('.popup.show');
    if ($show.length) {
      $show.each(function () {
        Layer.position(this);
      });
    }
  },
  UI: function () {
    $(document).on('click', $focusableEl, function (e) {
      Layer.openEl = e.currentTarget;
    });
    setTimeout(function () {
      Layer.openEl = '';
    }, 100);

    //열기
    $(document).on('click', '.' + Layer.className.openUI, function (e) {
      e.preventDefault();
      const $pop = $(this).attr('href');
      const $currentTarget = $(e.currentTarget);
      if (!$pop.length) return;
      if ($($pop).hasClass('morphing')) {
        Layer.morphing.open(this, $pop, function () {
          $($pop).data('returnFocus', $currentTarget);
        });
      } else {
        Layer.open($pop, function () {
          $($pop).data('returnFocus', $currentTarget);
        });
      }
    });

    //닫기
    $(document).on('click', '.' + Layer.className.closeUI, function (e) {
      e.preventDefault();
      let $pop = $(this).attr('href');
      if ($pop == '#' || $pop == '#none' || $pop == undefined) $pop = $(this).closest('.' + Layer.className.popup);
      if ($pop.length) Layer.close($pop);
    });

    //focus
    $(document).on('focus mousedown', '.' + Layer.className.popup + '.' + Layer.className.active, function (e) {
      const $this = $(this);
      const $popup = $this.hasClass(Layer.className.popup) ? $this : $this.closest(Layer.className.popup);

      // z-index 재설정
      Layer.openPop.splice(Layer.openPop.indexOf($popup[0]), 1);
      Layer.openPop.push($popup[0]);
      Layer.setOrder();
    });

    //pop body scroll
    $('.' + Layer.className.body).on('scroll', function (e) {
      e.preventDefault();
      Layer.bodyScrollChk(this);
      ui.form.selectResize();
    });

    // 알람박스 닫기
    $(document).on('click', '.alarm-box .close', function (e) {
      e.preventDefault();
      const $box = $(this).closest('.alarm-box');
      $box.removeClass('on');
      $box.on('transitionend', function () {
        $(this).remove();
      });
    });

    //page
    $('.' + Layer.className.wrap).each(function () {
      const $this = $(this);
      const $layer = $this.closest('.' + Layer.className.popup);
      if (!$layer.length) $this.addClass(Layer.className.page);
    });
  }
};

function winPop(url, map, width, height, name) {
  if (!url) return;
  let $name = !!name ? name : url.split('/').pop();
  if ($name.indexOf('.') >= 0) $name = $name.split('.').shift();
  const $width = width ? width : window.screen.width;
  const $height = height ? height : window.screen.height;
  const $url = encodeURI(url);
  if (map == true || map == 'true') {
    if (ui.pc.msie()) {
      Layer.alert('해당서비스는 <span class="fc-primary">최신 브라우저</span>에<br /><span class="fc-primary">최적화</span> 되어있습니다.<br />확인 버튼을 누르면 <span class="fc-primary">Edge브라우저</span>로<br /> 자동으로 <span class="fc-primary">이동</span>합니다.').then(function () {
        window.location = 'microsoft-edge:' + window.location.origin + $url;
      });
      return;
    }
  }
  return window.open($url, $name, 'width=' + $width + ', height=' + $height + ', scrollbars=yes');
}

function goToEdge() {
  if (ui.pc.msie()) {
    Layer.alert('해당서비스는 <span class="fc-primary">최신 브라우저</span>에<br /><span class="fc-primary">최적화</span> 되어있습니다.<br />확인 버튼을 누르면 <span class="fc-primary">Edge브라우저</span>로<br /> 자동으로 <span class="fc-primary">이동</span>합니다.').then(function () {
      window.location = 'microsoft-edge:' + window.location.href;
    });
  }
}
