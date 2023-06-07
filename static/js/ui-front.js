/********************************
 * 클럽메타 UI 스크립트 *
 * 작성자 : 안효주 *
 ********************************/

/** init **/
const ui = {
  className: {
    lock: '.lock',
    wrap: '.page',
    mainWrap: '.main-page',
    header: '.page-head',
    headerInner: '.head-inner',
    headerLeft: '.head-left',
    headerRight: '.head-right',
    title: '.head-title',
    body: '.page-body',
    btnTop: '.btn-page-top',
    floatingBtn: '.floating-btn',
    popup: '.popup',
    topFixed: '.top-fixed',
    bottomFixed: '.bottom-fixed',
    bottomFixedSpace: '.bottom-fixed-space'
  },
  basePath: function () {
    let rtnVal = '/to-be/static';
    if (location.hostname.indexOf('github') > -1) rtnVal = '/club-html' + rtnVal;
    return rtnVal;
  },
  isInit: false,
  init: function () {
    if (this.isInit) {
      ui.reInit();
    } else {
      ui.isInit = true;
      ui.common.init();
      ui.util.init();
      ui.button.init();
      ui.tooltip.init();
      ui.form.init();
      ui.list.init();
      ui.scroll.init();
      ui.animation.init();
      ui.animation.splitting();
      ui.chart.init();

      ui.etc.guide();

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
    ui.swiper.reInit();
    ui.animation.init();
    ui.animation.splitting();
    ui.chart.init();
  },
  isLoadInit: false,
  loadInit: function () {
    if (ui.isLoadInit) return;
    ui.isLoadInit = true;
    ui.common.loadInit();
    ui.common.scrollEvt();
    ui.button.loadInit();
    ui.form.loadInit();
    ui.list.loadInit();
    ui.swiper.init();
  }
};

$(function () {
  ui.common.vhChk();
  ui.common.dark();
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
});
$(window).on('scroll resize', function () {
  ui.common.scrollEvt();
  ui.common.fixedInit();
  ui.common.bottomSpace();
});
$(window).on('resize', function () {
  ui.common.vhChk();
  ui.tab.resize();
  ui.tooltip.resize();
  ui.table.guideResize();
  ui.touch.rotateItem();
});
$(window).on('scroll', function () {});
$(window).on(
  'scroll',
  _.debounce(function () {
    ui.common.scrollEndEvt();
  }, 1500)
);

//Html include
ui.html = {
  include: function () {
    const $elements = $.find('*[data-include-html]');
    if ($elements.length) {
      const dfd = $.Deferred();
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
            }
          });
        });
      } else {
        dfd.resolve();
      }
      return dfd.promise();
    }
  }
};

/** 디바이스 확인 **/
ui.device = {
  iPhone8PlusH: 736,
  screenH: window.screen.height,
  screenW: window.screen.width,
  isIPhoneX: function () {
    $('html').addClass('iPhone-X');
  },
  notIPhoneX: function () {
    $('html').removeClass('iPhone-X');
  },
  check: function () {
    ui.mobile.check();
    ui.pc.check();
    if (ui.mobile.any()) {
      const $pixelRatio = Math.round(window.devicePixelRatio);
      if (!!$pixelRatio) $('html').addClass('pixel-ratio-' + $pixelRatio);

      const $isIPhoneX = ui.mobile.iPhone() && ui.device.screenH > ui.device.iPhone8PlusH ? true : false;
      if ($isIPhoneX) {
        if ($(window).width() < $(window).height()) ui.device.isIPhoneX();
        else ui.device.notIPhoneX();
      }

      //가로, 세로 회전시
      if (window.screen.orientation.angle == 0) $('html').removeClass('landscape');
      else $('html').addClass('landscape');
      $(window).on('orientationchange', function () {
        if (window.screen.orientation.angle == 0) {
          $('html').removeClass('landscape');
          if ($isIPhoneX) ui.device.isIPhoneX();
        } else {
          $('html').addClass('landscape');
          if ($isIPhoneX) ui.device.notIPhoneX();
        }
      });
    }

    // 최소기준 디바이스(가로)크기보다 작으면 meta[name="viewport"] 수정
    const deviceMinWidth = 320;
    if ($(window).width() < deviceMinWidth) {
      const $viewport = $('meta[name="viewport"]');
      const $newContent = 'width=' + deviceMinWidth + ',user-scalable=no,viewport-fit=cover';
      $viewport.attr('content', $newContent);
    }
  },
  app: function () {
    // isWebView() -앱확인., goOutLink() -새창. 는 개발팀 공통함수
    if (typeof isWebView === 'function' && isWebView()) {
      return true;
    } else {
      return false;
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
  edge: function () {
    return navigator.userAgent.match(/edge/i) == null ? false : true;
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
      if (ui.pc.edge()) {
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

    // 앱인지 구분
    if (ui.device.app()) $('html').addClass('is-app');
  }
};

/** common **/
ui.common = {
  init: function () {
    ui.common.page();
    ui.btnTop.init();
    ui.common.header();
    ui.common.bottomSpaceAppend();
    ui.common.bottomSpaceRepeat();
    ui.common.fixedInit();
    ui.common.UI();
    // ui.common.landscape();
  },
  reInit: function () {
    ui.common.page();
    ui.btnTop.append();
    ui.common.header();
    ui.common.bottomSpaceAppend();
    ui.common.bottomSpaceRepeat();
    ui.common.fixedInit();
    ui.common.hr();
    ui.common.lottie();
  },
  loadInit: function () {
    ui.common.bottomSpace();
    ui.common.hr();
    ui.common.lottie();
  },
  page: function () {
    $(ui.className.wrap).each(function () {
      if (!$(this).closest(ui.className.popup).length) $(this).addClass(ui.className.mainWrap.slice(1));
    });

    const $last = $(ui.className.body + ' > .btn-wrap' + ui.className.bottomFixed + ':last-child');
    if ($last.length) {
      $last.each(function () {
        const $section = $(this).prev('.section');
        if ($section.length) $section.addClass('last');
      });
    }
  },
  dark: function () {
    //다크모드 체크
    try {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: Dark)').matches;
      if (prefersDark) $('html').addClass('dark');
    } catch (e) {}
  },
  vhChk: function () {
    const $vh = window.innerHeight * 0.01;
    $('html').css('--vh', $vh + 'px');
  },
  hr: function () {
    //hr태그 토크백 제외
    $('hr').each(function () {
      const $this = $(this);
      if (!$this.attr('aria-hidden') !== 'true') $this.attr('aria-hidden', true);
    });
  },
  fixedInit: function () {
    ui.common.fixed(ui.className.mainWrap + ' ' + ui.className.header);
    ui.common.fixed('.tab-fixed');
  },
  fixed: function (target, isBottom) {
    if (isBottom === undefined) isBottom = false;
    const $target = $(target);
    if (!$target.length) return;
    $target.each(function () {
      const $this = $(this);
      if ($('html').hasClass(ui.className.lock.slice(1))) return false;
      const $scrollTop = $(window).scrollTop();
      if ($this.closest(ui.className.popup).length) return;
      const $topMargin = getTopFixedHeight($this);
      let $topEl = $this;
      const $offsetTop = $this.data('top') !== undefined ? $this.data('top') : Math.max(0, getOffset(this).top);
      const $thisH = $this.outerHeight();
      const $isFixed = isBottom ? $scrollTop + $topMargin > $offsetTop + $thisH : $scrollTop + $topMargin > $offsetTop;
      if ($isFixed) {
        $this.data('top', $offsetTop);
        $this.addClass(ui.className.topFixed.slice(1));
        if ($topEl.css('position') !== 'fixed' && $topEl.css('position') !== 'sticky') $topEl = $topEl.children();
        if ($topMargin !== parseInt($topEl.css('top')) && $topEl.css('position') === 'fixed') $topEl.css('top', $topMargin);
      } else {
        $this.removeData('top');
        if ($topEl.css('position') !== 'fixed' && $topEl.css('position') !== 'sticky') $topEl = $topEl.children();
        $topEl.removeCss('top');
        $this.removeClass(ui.className.topFixed.slice(1));
      }
    });
  },
  header: function () {
    const $mainWrap = $(ui.className.mainWrap);
    if (!$mainWrap.length) return;
    $mainWrap.each(function () {
      if (!$(this).is(':visible')) return;
      const $head = $(this).find(ui.className.header);
      const $body = $head.siblings(ui.className.body);
      if ($head.length && $body.length && $head.css('position') === 'fixed') {
        $body.css('padding-top', $head.outerHeight());
      }
      const $titleEl = $head.find(ui.className.title);
      if (!$titleEl.length) return;
      if ($head.closest(ui.className.wrap).find('.' + ui.common.scrollShowTitleClass).length) $titleEl.addClass('scl-title-hide');

      const $headLeft = $head.find(ui.className.headerLeft);
      if ($headLeft.find('h1').length) {
        $headLeft.addClass('full');
        return;
      }
      const $headLeftW = $headLeft.outerWidth();
      const $headRight = $head.find(ui.className.headerRight);
      const $headRightW = $headRight.outerWidth();
      if (!$headLeft.length && !$titleEl.hasClass('t-left')) {
        $titleEl.before('<div class="' + ui.className.headerLeft.slice(1) + '" style="width:' + $headRightW + 'px;" aria-hidden="true"></div>');
      } else if (!$headRight.length) {
        $titleEl.after('<div class="' + ui.className.headerRight.slice(1) + '" style="width:' + $headLeftW + 'px;" aria-hidden="true"></div>');
      } else if ($headLeftW > $headRightW) {
        $headRight.css('width', $headLeftW);
      } else if ($headRight > $headLeftW) {
        $headLeft.css('width', $headRightW);
      }
    });
  },
  bottomSpaceAppend: function () {
    const $wrap = $(ui.className.mainWrap);
    if (!$wrap.length) return;
    $wrap.each(function () {
      const $this = $(this);
      if (!$this.find(ui.className.bottomFixedSpace).length) {
        // let target = $this;
        // if (target.find(ui.className.body).length) target = target.find(ui.className.body);
        $this.append('<div class="' + ui.className.bottomFixedSpace.slice(1) + '" aria-hidden="true"></div>');
      }
    });
  },
  bottomSpace: function () {
    const $wrap = $(ui.className.wrap);
    if (!$wrap.length) return;
    $wrap.each(function () {
      const $space = $(this).find(ui.className.bottomFixedSpace);
      if (!$space.length) return;
      const $spaceArryHeight = [];
      $(this)
        .find(ui.className.bottomFixed)
        .not('.none-space')
        .each(function () {
          const $this = $(this);
          const $height = $this.children().outerHeight();
          if (!$this.hasClass('fixed-none')) $spaceArryHeight.push($height);
          if ($this.hasClass('is-restore')) $this.css('height', $height);
        });

      const $maxHeight = $spaceArryHeight.length ? Math.max.apply(null, $spaceArryHeight) : 0;
      $space.css('height', $maxHeight);
      const $floatingBtn = $(this).find(ui.className.floatingBtn);
      if ($floatingBtn.length) $floatingBtn.css('bottom', $maxHeight === 0 ? 24 : $maxHeight + 10);
    });
  },
  bottomSpaceRepeat: function () {
    let i = 0;
    const repeatEvt = function () {
      if (i < 10) {
        ui.common.bottomSpace();
        setTimeout(repeatEvt, 100);
      }
      i += 1;
    };
    repeatEvt();
  },
  landscape: function () {
    //가로모드 막기
    if (ui.mobile.any()) {
      const _landscapeDiv = '.landscape-lock';
      const _text = '이 사이트는 세로 전용입니다.<br />단말기를 세로모드로 변경해주세요.';
      if (!$(_landscapeDiv).length) {
        const $landscapeHtml = '<div class="' + _landscapeDiv.substring(1) + '"><div class="tbl"><div class="td">' + _text + '</div></div></div>';
        $('body').append($landscapeHtml);
      }
      $(_landscapeDiv)
        .unbind('touchmove')
        .bind('touchmove', function (e) {
          e.preventDefault();
        });
    }
  },
  lastSclTop: $(window).scrollTop(),
  scrollEvt: function () {
    const $SclTop = $(window).scrollTop();
    const $wrap = $(ui.className.mainWrap + ':visible');
    const $header = $wrap.find(ui.className.header);
    const $headerH = $header.outerHeight();
    const $spaceH = $wrap.find(ui.className.bottomFixedSpace).outerHeight();
    const $btnTop = $wrap.find(ui.className.btnTop);
    const $bottom = parseInt($btnTop.parent().css('bottom'));
    const $margin = 24;
    const $Height = window.innerHeight;
    const $scrollHeight = $('body').get(0).scrollHeight;
    if ($spaceH > 0 && $spaceH != $bottom - $margin) {
      $wrap.find(ui.className.floatingBtn).css('bottom', $spaceH === 0 ? $margin : $spaceH + 10);
    }

    if ($SclTop > ui.btnTop.min && ui.common.lastSclTop !== $SclTop) {
      if ($('html').hasClass('input-focus') && ui.mobile.any()) return;
      ui.btnTop.on($btnTop);
    } else {
      ui.btnTop.off($btnTop);
    }
    const $fadeTitle = $wrap.find('.' + ui.common.scrollShowTitleClass);
    const $headerTit = $header.find(ui.className.title);
    if ($fadeTitle.length && $headerTit.length) ui.common.scrollShowTitle($fadeTitle[0], $wrap[0], $header[0], $headerTit[0]);

    const $sclHead = $wrap.find('.ui-header-bg-origin');
    if ($header.length && $sclHead.length) {
      if ($sclHead.offset().top - $headerH < $SclTop) {
        $header.addClass('bg-origin');
      } else {
        $header.removeClass('bg-origin');
      }
    }

    const $btnFixed = $wrap.find('.btn-wrap' + ui.className.bottomFixed);
    if ($btnFixed.length) {
      $btnFixed.each(function () {
        const $this = $(this);
        if ($this.hasClass('is-restore')) {
          const $top = $this.offset().top;
          const $bottom = $top + $this.children().outerHeight();
          if ($SclTop + $Height > $bottom) {
            $this.addClass('fixed-none');
          } else {
            $this.removeClass('fixed-none');
          }
        }
        if ($SclTop + $Height > $scrollHeight - 3 || $this.hasClass('fixed-none')) {
          $this.removeClass('ing-fixed');
        } else {
          $this.addClass('ing-fixed');
        }
      });
    }

    setTimeout(function () {
      ui.common.lastSclTop = $SclTop;
    }, 50);
  },
  scrollEndEvt: function () {
    const $SclTop = $(window).scrollTop();
    if ($SclTop > ui.btnTop.min) {
      const btn = $(ui.className.mainWrap + ':visible ' + ui.className.btnTop);
      ui.btnTop.off(btn);
    }
  },
  scrollShowTitleClass: 'page-fade-title',
  scrollShowTitle: function (target, wrap, header, titleEl) {
    const $fadeTitle = $(target);
    if (!$fadeTitle.length) return;
    const $wrap = $(wrap);
    const $header = $(header);
    const $headerTit = $(titleEl);
    const $SclTop = $wrap.hasClass(ui.className.mainWrap.slice(1)) ? window.scrollY : $wrap.scrollTop();
    const $headerH = $header.outerHeight();
    if (!$headerTit.hasClass('scl-title-hide')) $headerTit.addClass('scl-title-hide');

    const $fadeTitleTop = getOffset($fadeTitle[0]).top;
    const $fadeTitleHeight = $fadeTitle.outerHeight();
    const $fadeTitleEnd = $fadeTitleTop + $fadeTitleHeight;
    if ($SclTop < $fadeTitleEnd) {
      const $topMargin = Math.max(getTopFixedHeight($fadeTitle), $headerH);
      let $opacityVal = Math.max(0, $SclTop + $topMargin - $fadeTitleTop) / $fadeTitleHeight;
      $opacityVal = Math.max(0, Math.min(1, Math.round(($opacityVal + Number.EPSILON) * 100) / 100));
      if ($opacityVal === 0) {
        $headerTit.removeAttr('style');
      } else {
        $headerTit.css({
          opacity: $opacityVal,
          transform: 'translateY(' + (100 - $opacityVal * 100) + '%)'
        });
      }
    } else {
      $headerTit.css({
        opacity: 1,
        transform: 'translateY(0%)'
      });
      // if ($headerTit.hasClass('scl-title-hide')) $headerTit.removeClass('scl-title-hide').removeAttr('style');
    }
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
      const $url = ui.basePath() + '/js/lib/lottie.5.11.0.min.js';
      ui.util.loadScript($url).then($lottieInit);
    } else {
      $lottieInit();
    }
  },
  UI: function () {
    $(document).on('click', ui.className.mainWrap, function (e) {
      if (!$('html').hasClass(ui.className.lock.slice(1))) $(window).scroll();
    });

    // 수정 필요
    let isFirst = false;
    let isScrollIng = false;
    let startY = 0;
    let prevY = null;
    let scrollDirection = null;
    let prevMove = 0;
    let lastMove = 0;

    $(window).on('scroll', function () {
      if (!isFirst) {
        startY = window.scrollY;
        isFirst = true;
        return;
      }
      let currentY = window.scrollY;
      let distanceY = currentY - startY;
      if (prevY !== null) {
        const deltaY = currentY - prevY;
        if (deltaY > 0 && Math.abs(distanceY) > 3 && scrollDirection !== 'down') {
          scrollDirection = 'down';
          startY = currentY;
        } else if (deltaY < 0 && Math.abs(distanceY) > 3 && scrollDirection !== 'up') {
          scrollDirection = 'up';
          startY = currentY;
        }
      }
      const $fixedHead = $(ui.className.mainWrap + ':visible ' + ui.className.header + '.ty-fixed');
      if ($fixedHead.length) {
        const headerHeight = $fixedHead.outerHeight();
        const min = -headerHeight;
        const max = 0;
        let move = Math.min(max, Math.max(min, distanceY > 0 ? -distanceY : -(distanceY + headerHeight)));
        if (window.scrollY <= 3) {
          $fixedHead.removeCss('transition').css('transform', `translateY(${move}px)`);
        } else {
          if (prevMove !== move) $fixedHead.css({ transform: `translateY(${move}px)`, transition: 'none' });
        }
        prevMove = move;
      }
      prevY = currentY;
    });

    $(document).on('touchstart', function () {
      const $fixedHead = $(ui.className.mainWrap + ':visible ' + ui.className.header + '.ty-fixed');
      if ($fixedHead.length) {
        isScrollIng = true;
      }
    });

    const fixedEnd = function () {
      const $fixedHead = $(ui.className.mainWrap + ':visible ' + ui.className.header + '.ty-fixed');
      if (isScrollIng || !$fixedHead.length) return;
      const headerHeight = $fixedHead.outerHeight();
      let move;
      if (Math.abs(prevMove) > headerHeight / 2) {
        move = -headerHeight;
      } else {
        move = 0;
      }
      $fixedHead.removeCss('transition');
      if (prevMove !== move) $fixedHead.css('transform', `translateY(${move}px)`);
      prevMove = move;
      lastMove = move;
    };

    $(document).on('touchend', function () {
      if (isScrollIng) {
        isScrollIng = false;
        fixedEnd();
      }
    });

    $(window).on(
      'scroll',
      _.debounce(function () {
        startY = window.scrollY;
        fixedEnd();
        prevY = null;
        scrollDirection = null;
        isFirst = false;
      }, 1000)
    );
  }
};
ui.util = {
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
  loadScript: function (url) {
    const dfd = $.Deferred();
    const script = document.createElement('script');
    script.type = 'text/javascript';
    if (script.readyState) {
      //IE
      script.onreadystatechange = function () {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null;
          dfd.resolve();
        }
      };
    } else {
      //Others
      script.onload = function () {
        dfd.resolve();
      };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
    return dfd.promise();
  },
  paint: function () {
    if (!$('.smooth-corners').length) return;
    const $url = ui.basePath() + '/js/lib/paint.min.js';
    if (CSS && 'paintWorklet' in CSS) CSS.paintWorklet.addModule($url);
  },
  canvasRotateImg: function (target, src, deg) {
    const image = document.createElement('img');
    image.onload = function () {
      drawRotated(deg);
    };
    image.src = src;

    const canvas = target;

    const drawRotated = function (degrees) {
      const ctx = canvas.getContext('2d');

      if (degrees == 90 || degrees == 270) {
        canvas.width = image.height;
        canvas.height = image.width;
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (degrees == 90 || degrees == 270) {
        ctx.translate(image.height / 2, image.width / 2);
      } else {
        ctx.translate(image.width / 2, image.height / 2);
      }
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
    };
  },
  iframe: function () {
    if ($('iframe.load-height').length) {
      const iframeHeight = function () {
        $('iframe.load-height').each(function () {
          const $this = $(this);
          const $thisH = $(this).height();
          const $bodyH = $this.contents().find('body').height();
          if (!!$bodyH && $thisH < $bodyH) $this.height($bodyH);
        });
      };

      iframeHeight();
      setTimeout(function () {
        iframeHeight();
      }, 1000);
    }
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
  },
  reInit: function () {
    ui.util.iframe();
    ui.util.lazyImg();
  },
  init: function () {
    ui.util.paint();
    ui.util.iframe();
    ui.util.lazyImg();
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
  },
  guide: function () {
    const themeColorChange = function () {
      const $path = location.pathname;
      if ($path.indexOf('/html/guide') > -1) {
        // if(!$('.gd__theme_color').length){
        // }
        let $html = '<div class="gd__theme_color">';
        $html += '<button type="button" class="gd__theme_btn"><i class="i-ico-arr-right-24" aria-hidden="true"></i></button>';
        $html += '<dl>';
        $html += '<dt>메인컬러 변경</dt>';
        $html += '<dd>';
        $html += '<input type="color">';
        $html += '<div>';
        $html += '<div class="color"></div>';
        $html += '<div class="reset"><button type="button">리셋</button></div>';
        $html += '</div>';
        $html += '</dd>';
        $html += '</dl>';
        $html += '</div>';
        $('body').append($html);

        const $baseThemeColor = '#ff69a0';
        const $input = $('.gd__theme_color input');
        const $color = $('.gd__theme_color .color');
        const $openBtn = $('.gd__theme_btn');
        const $resetBtn = $('.gd__theme_color .reset button');
        const $themeColor = uiCookie.get('theme-color') !== '' ? uiCookie.get('theme-color') : $baseThemeColor;

        const setColor = function (colorStr) {
          $input.val(colorStr);
          $color.text(colorStr);
          if ($baseThemeColor !== colorStr) {
            $('html').css('--primary-color', colorStr);
            const $rgb = hexToRgb(colorStr.substring(1));
            $('html').css('--primary-color-rgb', $rgb);
            uiCookie.set('theme-color', colorStr);
          } else {
            $('html').removeCss('--primary-color');
            $('html').removeCss('--primary-color-rgb');
            uiCookie.set('theme-color', '');
          }
        };
        setColor($themeColor);

        $openBtn.on('click', function (e) {
          e.preventDefault();
          $('.gd__theme_color').toggleClass('open');
        });

        $input.on('input', function () {
          const $val = $(this).val();
          setColor($val);
        });

        $resetBtn.on('click', function (e) {
          e.preventDefault();
          setColor($baseThemeColor);
        });
      }
    };
    themeColorChange();
  }
};
ui.btnTop = {
  init: function () {
    ui.btnTop.append();
    ui.btnTop.UI();
  },
  label: '컨텐츠 상단으로 이동',
  text: 'TOP',
  min: 100,
  onClass: 'on',
  hoverClass: 'hover',
  scrollSpeed: 200,
  append: function () {
    const $wrap = $(ui.className.wrap);
    if (!$wrap.length) return;
    $wrap.each(function () {
      if ($(this).find(ui.className.btnTop).length || $(this).find(ui.className.body).hasClass('not-top-btn')) return;
      let btnHtml = '<a href="#" class="btn ' + ui.className.btnTop.slice(1) + '" title="' + ui.btnTop.label + '" role="button" aria-label="' + ui.btnTop.label + '">' + ui.btnTop.text + '</a>';
      if ($(this).find(ui.className.floatingBtn).length) {
        $(this).find(ui.className.floatingBtn).append(btnHtml);
      } else {
        btnHtml = '<div class="' + ui.className.floatingBtn.slice(1) + '">' + btnHtml + '</div>';
        $(this).append(btnHtml);
      }
    });
  },
  on: function (btn) {
    $(btn).attr('aria-hidden', 'false').addClass(ui.btnTop.onClass);
    $(btn).closest(ui.className.floatingBtn).addClass('top-on');
  },
  off: function (btn) {
    $(btn).attr('aria-hidden', 'true').removeClass(ui.btnTop.onClass);
    $(btn).closest(ui.className.floatingBtn).removeClass('top-on');
  },
  UI: function () {
    $(document)
      .on('click', ui.className.btnTop, function (e) {
        e.preventDefault();
        const $page = $(this).closest(ui.className.wrap);
        if ($page.closest(ui.className.popup).length) {
          ui.scroll.wrapTop($page, 0, ui.btnTop.scrollSpeed).then(function () {
            console.log('팝업 스크롤');
          });
        } else {
          ui.scroll.top(0, ui.btnTop.scrollSpeed).then(function () {
            console.log('페이지 스크롤');
          });
          $page.find($focusableEl).first().focus();
        }
      })
      .on('mouseenter', ui.className.btnTop, function () {
        $(this).addClass(ui.btnTop.hoverclass);
      })
      .on('mouseleave', ui.className.btnTop, function () {
        $(this).removeClass(ui.btnTop.hoverClass);
      });
  }
};

/** button **/
ui.button = {
  init: function () {
    ui.button.default();
    ui.button.disabledChk();
    ui.button.reset();
    ui.button.effect();
    ui.button.star();
    ui.button.imgBox();
    ui.tab.init();

    ui.touch.init();
  },
  reInit: function () {
    ui.button.loadInit();
    ui.button.disabled();
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
          if (($href.startsWith('#') || $href.startsWith('javascript')) && $role == undefined) $(this).attr('role', 'button');
        }
      }

      if ($(this).attr('title') === undefined) {
        if ($(this).attr('target') === '_blank') $(this).attr('title', '새창열림');
        if ($(this).hasClass('tel') || ($href != undefined && $href.startsWith('tel'))) $(this).attr('title', '전화걸기');
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
        if ($href.startsWith('#')) {
          e.preventDefault();
        }
      }

      // 앱에서 새창열기
      /*
      const $target = $(this).attr('target');
      if (ui.device.app()) {
        if ($target === '_blank' && typeof webviewInterface === 'object' && typeof webviewInterface.goOutLink === 'function') {
          e.preventDefault();
          webviewInterface.goOutLink($href);
        }
      }
      */
    });
  },
  disabled: function () {
    $('a[aria-disabled]').each(function () {
      if (!$(this).hasClass('disabled')) $(this).removeAttr('aria-disabled');
    });
    $('a.disabled').each(function () {
      $(this).attr('aria-disabled', 'true');
    });
  },
  disabledChk: function () {
    const checking = function () {
      setTimeout(function () {
        ui.button.disabled();
        ui.form.input();
        ui.form.select();
      }, 100);
    };
    $(document).on('click', 'a, button', function () {
      checking();
    });
    $(document).on('change', 'input', function () {
      checking();
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
      if ($btnEl.is('input')) $btnEl = $btnEl.siblings('.lbl');
      if ($btnEl.hasClass('btn-click-outer')) $btnEl = $btnEl.offsetParent();
      const $delay = 650;
      if ($btnEl.is('.disabled') || $btnEl.is('.btn-heart') || $btnEl.is('.btn-click-not')) return;
      let $bgColor = $btnEl.css('background-color') ? rgba2hex($btnEl.css('background-color')) : '#ffffff';
      let $bgAlpha = 0;
      if ($bgColor.length > 7) {
        const $tempColor = $bgColor;
        $bgColor = $tempColor.substr(0, 7);
        $bgAlpha = 255 - parseInt($tempColor.substr(7, 2), 16);
      }
      const $bgColorVal = Math.max($bgAlpha, Math.round(getBgBrightValue($bgColor)));
      const isBalck = $bgColorVal < 50 ? true : false;
      if (!$btnEl.find('.btn-click-in').length) $btnEl.addClass('btn-clicking-active').append('<i class="btn-click-in"></i>');
      const $btnIn = $btnEl.find('.btn-click-in').last();
      if (isBalck) $btnIn.addClass('white');
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
  star: function () {
    // 별점
    $(document).on('click', '.ico-star-wrap > button', function (e) {
      e.preventDefault();
      const $idx = $(this).index();
      const $title = $(this).attr('title');
      const $closest = $(this).closest('.ico-star-wrap');
      $closest.attr('data-on', $idx + 1);
      $closest.find('.txt').text($title);
    });
  },
  imgBox: function () {
    $(document).on('click', '.ui-expend .ui-img', function (e) {
      e.preventDefault();
      const $this = $(this);
      let $el = $this;
      let $idx = $el.index();
      let $parent = $el.parent();
      while (!$parent.hasClass('ui-expend')) {
        $el = $parent;
        $idx = $el.index();
        $parent = $el.parent();
      }
      const $children = $parent.children();
      Layer.imgBox($children, $idx);
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
    let showTimer;
    let hideTimer;
    if (show) {
      clearTimeout(hideTimer);
      $element.addClass(activeClass.slice(1));
      $element.append($html);
      showTimer = setTimeout(function () {
        $element.css('clip-path', 'circle(' + $min + 'px at 50% 50%)');
      }, 1);
    } else {
      clearTimeout(showTimer);
      $element.removeCss('clip-path');
      hideTimer = setTimeout(function () {
        $element.find(loadingElClass).remove();
        $element.removeClass(activeClass.slice(1));
      }, 500);
    }
  }
};
// 탭
ui.tab = {
  init: function () {
    ui.tab.tabInfo();
    ui.tab.ariaSet();
    // ui.tab.ready();
    ui.tab.UI();
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
    panel: '.tab-panel',
    swiperPanels: '.tab-swipe-panels'
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
      const $tabLeft = $listLeft + $active.position().left + $tabBtn.position().left;
      const $tabRight = $innerSclWidth - $tabLeft - $tabWidth - $innerSclGap;
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
    if (panel === '#' || !panel) return;
    const $panel = $(panel);
    const $siblings = $(siblings);
    if (!$panel.length && !$siblings.length) return;
    const $isPanel = $panel.hasClass(ui.tab.className.panel.slice(1)) || $siblings.hasClass(ui.tab.className.panel.slice(1));
    let $panelWrap = null;
    if ($panel.length) $panelWrap = $panel.closest(ui.tab.className.panels);
    if ($panelWrap === null) {
      const $siblingsSpl = siblings.split(',');
      if ($($siblingsSpl[0]).length) $panelWrap = $($siblingsSpl[0]).closest(ui.tab.className.panels);
    }
    if ($panelWrap.hasClass(ui.tab.className.swiperPanels.slice(1))) {
      const $swiper = $panelWrap.data('swiper');
      if ($swiper !== undefined && isAni) {
        // $swiper.slideTo($panel.index(), isAni ? 500 : 0);
        $swiper.slideTo($panel.index(), 300);
      }
    } else {
      const $panelWrapH = $panelWrap === null ? 0 : $panelWrap.outerHeight();
      const $panelWrapGap = $panelWrap === null ? 0 : $panelWrapH - $panelWrap.height();
      if (siblings === undefined || siblings === false || siblings === '') {
        if ($isPanel) {
          $panel.siblings(ui.tab.className.panel).attr('aria-expanded', false).removeClass(ui.tab.className.active.slice(1));
          $panel.addClass(ui.tab.className.active.slice(1)).attr('aria-expanded', true);
        } else {
          $panel.show();
        }
      } else {
        if ($isPanel) {
          $siblings.attr('aria-expanded', false).removeClass(ui.tab.className.active.slice(1));
          $panel.addClass(ui.tab.className.active.slice(1)).attr('aria-expanded', true);
        } else {
          $siblings.hide();
          $panel.show();
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
    if ($('.ui-tab-check').length) {
      $('.ui-tab-check').each(function () {
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
  swipe: function (element) {
    const $element = $(element);
    $element.each(function () {
      const $this = $(this);
      $this.addClass('_autoHeight');
      $this.attr('data-view', 1);
      ui.swiper.ready($this);

      const $tabChageEvt = function (e) {
        const $index = e.realIndex;
        const $activePanel = $(e.slides[$index]);
        const $activePanelId = $activePanel.attr('id');
        const $activeBtn = $('[href="#' + $activePanelId + '"]');

        $this.find('.swiper-slide').attr({
          'aria-expanded': false,
          'aria-hidden': true
        });
        $activePanel.attr('aria-expanded', true).removeAttr('aria-hidden');
        if ($activeBtn.length) ui.tab.tabActive($activeBtn);
      };
      ui.swiper.base($this, $tabChageEvt);

      $this.find('.swiper-slide').attr({
        'aria-expanded': false,
        'aria-hidden': true
      });
      $this.find('.swiper-slide.swiper-slide-active').attr('aria-expanded', true).removeAttr('aria-hidden');
    });
  },
  isTabInit: false,
  ready: function () {
    if ($('.tab-navi-menu').length) ui.tab.scrolledCheck('.tab-navi-menu');
    ui.tab.activeCenter();

    if ($(ui.tab.className.swiperPanels).length) {
      ui.tab.swipe(ui.tab.className.swiperPanels);
    }

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
              if ($(_href).length) {
                $(_href).attr({
                  role: 'tabpanel',
                  'aria-labelledby': _aId
                });
                if (_href === $hash || $(_href).find($hash).length) {
                  $hashActive = _a;
                }
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
    if ($('.tab-navi-menu').length) ui.tab.scrolledCheck('.tab-navi-menu');
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

        if ($($href).find('.ui-swiper').length) {
          ui.swiper.update($($href).find('.ui-swiper'));
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
    $(document).on('change', '.ui-tab-radio input', function (e) {
      const $show = $(this).data('show');
      const $hide = $(this).closest('.ui-tab-radio').data('hide');
      ui.tab.panelActive($show, $hide, true, true);
    });

    //checkbox tab
    $(document).on('change', '.ui-tab-check input', function (e) {
      const $closest = $(this).closest('.ui-tab-check');
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
      const $cont = $wrap.find(ui.tooltip.className.body);
      const $winW = $(window).width() - 40;
      const $btnW = $btn.outerWidth();
      const $btnX = Math.min($winW + $btnW / 2 - 2, $btn.offset().left) - 20;
      let $scrollEnd = $(window).height() + $(window).scrollTop();
      if ($(ui.className.bottomFixed + ':visible').length) $scrollEnd = $scrollEnd - $(ui.className.bottomFixed).children().outerHeight();
      const $left = Math.max(-4, $btnX);
      $cont.children(ui.tooltip.className.arrow).css({
        left: $left + $btnW / 2
      });
      $cont.css({
        width: $winW,
        left: -$left
      });
      const $contY = $wrap.offset().top + $wrap.outerHeight() + parseInt($cont.css('margin-top')) + parseInt($cont.css('margin-bottom')) + $cont.outerHeight();
      if ($cont.hasClass('is-bottom')) {
        $cont.addClass('bottom');
      } else {
        if ($scrollEnd - 10 < $contY) {
          $cont.addClass('bottom');
        } else {
          $cont.removeClass('bottom');
        }
      }
    });
  },
  position: function (tar) {
    const $tar = $(tar);

    if (!$tar.find(ui.tooltip.className.inner).length) $tar.wrapInner('<div class="' + ui.tooltip.className.inner.slice(1) + '"></div>');
    if (!$tar.find(ui.tooltip.className.arrow).length) $tar.prepend('<i class="' + ui.tooltip.className.arrow.slice(1) + '" aria-hidden="true"></i>');
    if (!$tar.find(ui.tooltip.className.closeBtn).length) $tar.find(ui.tooltip.className.inner).append('<a href="#" class="' + ui.tooltip.className.closeBtn.slice(1) + '" role="button" aria-label="툴팁닫기"></a>');
    ui.tooltip.resize();
  },
  aria: function (element) {
    $(element).each(function (e) {
      const $btn = $(this).find(ui.tooltip.className.btn);
      const $cont = $(this).find(ui.tooltip.className.body);
      let $contId = $cont.attr('id');
      const $closeBtn = $(this).find(ui.tooltip.className.closeBtn);
      if (!$contId) $contId = 'ttCont-' + e;
      $btn.attr({
        role: 'button'
        // 'aria-describedby': $contId
      });
      $cont.attr({
        // id: $contId,
        role: 'tooltip'
      });
      $closeBtn.attr('role', 'button');
    });
  },
  reInit: function () {
    ui.tooltip.aria(ui.tooltip.className.wrap);
  },
  init: function () {
    ui.tooltip.aria(ui.tooltip.className.wrap);

    //열기
    $(document).on('click', ui.tooltip.className.wrap + ' ' + ui.tooltip.className.btn, function (e) {
      e.preventDefault();
      const $cont = $(this).closest(ui.tooltip.className.wrap).find(ui.tooltip.className.body);
      if ($(this).hasClass('is-pop')) {
        const $popContent = $cont.html();
        const $popTitle = $cont.attr('title');
        if ($popTitle !== undefined) {
          Layer.tooltip($popContent, $popTitle);
        } else {
          Layer.tooltip($popContent);
        }
      } else {
        if ($(this).hasClass(ui.tooltip.className.active.slice(1))) {
          $cont.stop(true, false).fadeOut();
          $(this).removeClass(ui.tooltip.className.active.slice(1));
        } else {
          $(ui.tooltip.className.btn).removeClass(ui.tooltip.className.active.slice(1));
          $(ui.tooltip.className.body).fadeOut();
          $(this).addClass(ui.tooltip.className.active.slice(1));
          $cont.stop(true, false).fadeIn();
          setTimeout(function () {
            ui.tooltip.position($cont);
          }, 30);
        }
      }
    });
    //닫기
    $(document).on('click', ui.tooltip.className.closeBtn, function (e) {
      e.preventDefault();
      const $cont = $(this).closest(ui.tooltip.className.body);
      const $btn = $cont.siblings(ui.tooltip.className.btn);
      $btn.removeClass(ui.tooltip.className.active.slice(1));
      $cont.stop(true, false).fadeOut(500, function () {
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
// touch UI
ui.touch = {
  wrapClass: '.ui-touch-rotate',
  itemsClass: '.rotate-items',
  itemClass: '.rotate-item',
  rotateItem: function () {
    if (!$(ui.touch.wrapClass + ' ' + ui.touch.itemsClass).length) return;
    const $wrap = $(ui.touch.wrapClass + ' ' + ui.touch.itemsClass);
    const $items = $wrap.find(ui.touch.itemClass);
    const $radius = $wrap.outerWidth() / 2;
    const $total = $items.length;
    const $theta = [];
    const $rotate = 360;
    const $frags = $rotate / $total;
    for (let i = 0; i < $total; i++) {
      $theta.push(($frags / 180) * i * Math.PI);
    }
    const $wrapH = $wrap.height();
    $items.each(function (j) {
      const $this = $(this);
      const $thisW = $this.outerWidth();
      const $thisH = $this.outerHeight();
      const $posX = Math.round($radius * Math.sin($theta[j]));
      const $posY = Math.round($radius * Math.cos($theta[j]));
      const $left = $wrapH / 2 + $posX - $thisW / 2;
      const $top = $wrapH / 2 - $posY - $thisH / 2;
      $(this).css({
        left: $left,
        top: $top
      });
    });
  },
  rotate: function (element) {
    let ang = 0; // All angles are expressed in radians
    let angStart = 0;
    let isStart = false;
    let isTouch = false;

    const _angXY = (ev) => {
      const bcr = element.getBoundingClientRect();
      const radius = bcr.width / 2;
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const y = clientY - bcr.top - radius; // y from center
      const x = clientX - bcr.left - radius; // x from center
      return Math.atan2(y, x);
    };

    const _start = (ev) => {
      if (ev.touches !== undefined) {
        isTouch = true;
        Body.lock();
      }
      isStart = true;
      angStart = _angXY(ev) - ang;
      setTimeout(function () {
        element.classList.add('rotating');
      }, 10);
    };

    const _move = (ev) => {
      if (!isStart) return;
      if (!isTouch) ev.preventDefault();
      ang = _angXY(ev) - angStart;
      const deg = radToDeg(ang);
      element.style.transform = 'rotate(' + deg + 'deg)';
      const $items = element.querySelectorAll(ui.touch.itemClass);
      $items.forEach(function (item) {
        item.style.transform = 'rotate(' + deg * -1 + 'deg)';
      });
    };

    const _end = () => {
      isStart = false;
      if (isTouch) {
        isTouch = false;
        Body.unlock();
      }
      element.classList.remove('rotating');
    };

    element.addEventListener('mousedown', _start, false);
    document.addEventListener('mousemove', _move, false);
    document.addEventListener('mouseup', _end, false);
    element.addEventListener('touchstart', _start, false);
    document.addEventListener('touchmove', _move, false);
    document.addEventListener('touchend', _end, false);
  },
  focus: function () {
    let $isFocus = false;
    let $isFocusEl = null;
    $(document).on('focus', 'input, textarea', function (e) {
      const $target = e.target;
      let $el;
      // if ($target.tagName === 'TEXTAREA') $el = $($target);
      if ($target.tagName === 'INPUT') {
        const $type = $target.getAttribute('type');
        // if($type === 'checkbox' || $type === 'radio' || $type === 'button' || $type === 'submit') return;
        if ($type !== 'text' && $type !== 'tel' && $type !== 'number' && $type !== 'password' && $type !== 'email' && $type !== 'search' && $type !== 'url') return;
      }
      $el = $($target);
      if ($el.prop('disabled') || $el.prop('readonly')) return;
      $isFocus = true;
      $isFocusEl = $target;
      $('html').addClass('input-focus');
    });
    const $reset = function () {
      $isFocus = false;
      $isFocusEl = null;
      $('html').removeClass('input-focus');
      $startY = null;
    };
    $(document).on('blur', 'input, textarea', function (e) {
      if ($isFocus) $reset();
    });

    // bottom fixed focus
    /*
    let $startY = null;
    let isParent = false;
    const $bottomInp = $(ui.className.bottomFixed).find('input, textarea');
    $(document).on('touchstart', function (e) {
      const $target = $(e.target);
      if ($target.closest(ui.className.bottomFixed).length) {
        isParent = true;
      } else {
        if ($isFocus && $bottomInp.is(':focus')) {
          const $target = e.target;
          const $clientY = e.touches[0].clientY;
          if ($target !== $isFocusEl) {
            $($isFocusEl).blur();
            $reset();
          } else {
            $startY = $clientY;
          }
        }
      }
    });

    $(document).on('touchmove', function (e) {
      if ($isFocus && $bottomInp.is(':focus') && isParent) {
        const $target = $(e.target);
        const $clientY = e.touches[0].clientY;
        let $closest;
        if ($target.closest(ui.className.bottomFixed).length) $closest = $target.closest(ui.className.bottomFixed).children();
        if (!$closest) return;
        const $closestTop = $target.closest(ui.className.popup).length ? $closest.offset().top : $closest.offset().top - $(window).scrollTop();
        if ($closestTop > $clientY || $(window).height() < $clientY) {
          $($isFocusEl).blur();
          $reset();
        }
      }
    });
    */
  },
  init: function () {
    if ($(ui.touch.wrapClass).length) {
      ui.touch.rotateItem();
      document.querySelectorAll(ui.touch.wrapClass + ' ' + ui.touch.itemsClass).forEach(ui.touch.rotate);
    }

    ui.touch.focus();
  }
};

/** form **/
ui.form = {
  init: function () {
    ui.form.focus();
    ui.form.select();
    // ui.form.select2();
    ui.form.selectUI();
    ui.form.inputUI();
    ui.form.input();
    ui.form.textarea();
    ui.form.textareaUI();
    ui.form.textCountInit();
    ui.form.textCountUI();

    ui.form.spinnerUI();
    ui.form.spinner();
    ui.form.range();
    ui.form.jqRange();
    ui.form.jqCalendar('.datepicker');
  },
  reInit: function () {
    ui.form.loadInit();
    ui.form.select();
    // ui.form.select2();
    ui.form.textarea();
    ui.form.textCountInit();

    ui.form.spinner();
    ui.form.range();
    ui.form.jqRange();
    ui.form.jqCalendar('.datepicker');
  },
  loadInit: function () {
    //select off효과
    $('select').each(function () {
      const $val = $(this).val();
      if ($val == '' || $val == null) $(this).addClass('off');
      else $(this).removeClass('off');
    });
    if ($('.input-date input').length) {
      $('.input-date input').each(function () {
        ui.form.selectDate(this);
      });
    }
  },
  focus: function () {
    const $inpEls = 'input:not(:checkbox):not(:radio):not(:hidden), select, textarea, .btn-select';
    const $appFocusElScroll = function (tar) {
      const $this = $(tar);
      if (!ui.device.app() || !ui.mobile.Android()) return;
      if ($this.is('a') || $this.prop('readonly') || $this.prop('disabled')) return;
      let $isFixedParent = false;
      const $parents = $this.parents();
      $parents.each(function () {
        if ($(this).css('position') === 'fixed' || $(this).css('position') === 'sticky') {
          $isFixedParent = true;
        }
      });
      if ($isFixedParent) return;
      setTimeout(function () {
        const $el = $this.offsetParent();
        let $elTop = $el.offset().top;
        let isPop = false;
        let $wrap = $(window);
        let $wrapClass;
        if ($this.closest('.' + Layer.className.popup).length) {
          isPop = true;
          $wrapClass = Layer.className.wrap;
          $wrap = $this.closest('.' + $wrapClass);
        }
        const $wrapH = $wrap.height();
        const $scrollTop = $wrap.scrollTop();
        $elTop = isPop ? $elTop - $wrap.offset().top : $elTop - $scrollTop;
        const $elHeight = $el.outerHeight();
        const $elEnd = $elTop + $elHeight;
        const $topGap = isPop ? getTopFixedHeight($this) : getTopFixedHeight($this);
        const $bottomGap = $wrap.find(ui.className.bottomFixedSpace).length ? $wrap.find(ui.className.bottomFixedSpace).outerHeight() : $wrap.find('.' + Layer.footClass).outerHeight();
        let $move;
        const $start = ($topGap ? $topGap : 0) + 10;
        const $end = $wrapH - ($bottomGap ? $bottomGap : 0) - 10;
        if ($start > $elTop) {
          $move = $scrollTop - ($start - $elTop);
        } else if ($end < $elEnd) {
          $move = $scrollTop + ($elEnd - $end);
        }
        if ($move) {
          if (isPop) {
            $wrap.stop(true, false).animate({ scrollTop: $move }, 200);
          } else {
            ui.scroll.top($move, 200);
          }
        }
      }, 300);
    };
    let $dimTimer;
    $(document).on('focusin', $inpEls, function (e) {
      const $this = $(this);
      if ($this.prop('readonly') || $this.prop('disabled')) return;
      // if (!$this.prop('readonly') && !$this.prop('disabled')) $('html').addClass('inp-focus');
      if ($this.closest('.form-item').length) $this.closest('.form-item').addClass('focus');
      if ($this.is('input') && $this.closest('.input').length) $this.closest('.input').addClass('focus');
      if ($this.is('select') && $this.closest('.select').length) $this.closest('.select').addClass('focus');
      if ($this.hasClass('btn-select') && $this.closest('.select').length) $this.closest('.select').addClass('focus');
      if ($this.is('textarea') && $this.closest('.textarea').length) $this.closest('.textarea').addClass('focus');

      //app focus scroll: 안드로이드
      // $appFocusElScroll(this);
    });
    $(document).on('focusout', $inpEls, function (e) {
      const $this = $(this);
      // $('html').removeClass('inp-focus');
      if ($this.closest('.form-item').length) $this.closest('.form-item').removeClass('focus');
      if ($this.is('input') && $this.closest('.input').length) $this.closest('.input').removeClass('focus');
      if ($this.is('select') && $this.closest('.select').length) $this.closest('.select').removeClass('focus');
      if ($this.hasClass('btn-select') && $this.closest('.select').length) $this.closest('.select').removeClass('focus');
      if ($this.is('textarea') && $this.closest('.textarea').length) $this.closest('.textarea').removeClass('focus');
    });
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
    if ($selectTxt == '') $selectTxt = '선택';
    const $btnVal = $target.siblings('.btn-select').find('.btn-select-val');
    if ($selectTxt === $btnVal.text()) return;
    $btnVal.html($selectTxt);
    if ($val == '') $target.siblings('.btn-select').addClass('off');
    else $target.siblings('.btn-select').removeClass('off');
  },
  select: function () {
    const $select = $('.select').not('.btn, .not');
    if ($select.length) {
      $select.each(function (e) {
        const $this = $(this);
        const $sel = $this.find('select');
        const $val = $sel.val();
        if ($val == '' || $val == null) $sel.addClass('off');
        else $sel.removeClass('off');
        if ($sel.prop('readonly')) $this.addClass('readonly');
        else $this.removeClass('readonly');
        if ($sel.prop('disabled')) $this.addClass('disabled');
        else $this.removeClass('disabled');

        if (!$sel.siblings('.btn-select').length) {
          let $selId = $sel.attr('id');
          let $title = $sel.attr('title');

          if ($selId == undefined) $selId = 'none';
          if ($title == undefined) $title = '선택';
          const $btnTitle = '팝업으로 ' + $title;
          const $btnHtml = '<a href="#' + $selId + '" class="btn-select ui-select-open" title="' + $btnTitle + '" role="button"><span class="btn-select-val"></span></a>';

          $sel.hide().after($btnHtml);

          const $forLbl = $('label[for="' + $selId + '"]');
          if ($forLbl.length) $forLbl.addClass('ui-select-lbl').attr('title', $btnTitle);

          ui.form.selectSetVal($sel);
        }
      });
    }
  },
  /*
  select2: function () {
    const $select = $('.select.inline');
    if ($select.length) {
      $select.each(function () {
        const $this = $(this);
        const $select = $this.find('select');
        let $selId = $select.attr('id');
        let $title = $select.attr('title');

        if ($select.length && !$select.siblings('.btn-select').length) {
          if ($selId == undefined) $selId = 'none';
          if ($title == undefined) $title = '선택';
          const $btnHtml = '<a href="#' + $selId + '" class="btn-select" title="' + $title + '" role="button"><span class="val"></span></a>';
          let $optionHtml = '<div class="option-wrap">';
          $select.children().each(function () {
            const $val = $(this).attr('value');
            const $text = $(this).text();
            $optionHtml += '<a href="#" class="option" data-val="' + $val + '">' + $text + '</a>';
          });
          $optionHtml += '</div>';
          $select.hide().after($btnHtml);
          $this.append($optionHtml);
          $select.off('change').on('change', function () {
            const $val = $(this).val();
            let $selectTxt = $(this).find(':selected').text();
            if ($selectTxt == '') $selectTxt = '선택';
            $(this).siblings('.btn-select').find('.val').html($selectTxt);
            if ($val == '') {
              $(this).siblings('.btn-select').addClass('off');
            } else {
              $(this).siblings('.btn-select').removeClass('off');
            }
          });
          $select.change();
        }
      });
    }
  },
  */
  selectUI: function () {
    $(document).on('change', 'select', function () {
      const $val = $(this).val();
      if ($val == '') {
        $(this).addClass('off');
      } else {
        $(this).removeClass('off');
      }
      if ($(this).siblings('.btn-select').length) ui.form.selectSetVal(this);
    });

    /*
    $(document).on('click', '.select.inline .btn-select', function (e) {
      e.preventDefault();
      const $closest = $(this).closest('.select');
      const $select = $closest.find('select');
      if (!$select.length) return;
      const $val = $select.val();
      const $option = $closest.find('.option[data-val="' + $val + '"]');
      $option.addClass('selected').siblings().removeClass('selected');
      $(this).closest('.select').toggleClass('option-open');
    });
    $(document).on('click', '.select.inline .option', function (e) {
      e.preventDefault();
      const $val = $(this).data('val');
      const $select = $(this).closest('.select').find('select');
      $select.val($val).change();
      $(this).closest('.select').removeClass('option-open');
    });
    */

    $(document).on('change', '.datepicker-etc-select', function (e) {
      const $val = $(this).val();
      if ($('.datepicker-etc').length) {
        if ($val === 'etc') {
          $('.datepicker-etc').slideDown(300);
        } else {
          $('.datepicker-etc').slideUp(300);
        }
      }
    });
  },
  inputUI: function () {
    // input[maxlength]

    if (ui.mobile.Android()) {
      // 안드로이드 중 일부 maxlength 방식이 상이함(무한입력 후 포커스 아웃때 적용됨)
      $(document).on('input', 'input[maxlength], textarea[maxlength]', function (e) {
        const $this = $(this);
        const $val = $this.val();
        const $max = $this.attr('maxlength');
        const $length = $val.length;
        if ($val && $length > $max) this.value = this.value.slice(0, $max);
      });
    }

    //form 안에 input이 1개일때 엔터시 새로고침 현상방지
    /*
    $(document).on('keydown', 'form input', function (e) {
      const $keyCode = e.keyCode ? e.keyCode : e.which;
      const $form = $(this).closest('form');
      const $length = $form.find('input').not('[type=checkbox],[type=radio]').length;

      //.search-box 검색창은 예외
      if ($length == 1 && !$(this).closest('.search-box').length) {
        if ($keyCode == 13) return false;
      }
    });
    */

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

    $(document).on('click', '.btn-inp-del', function () {
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

    $(document).on('keyup focusin change', '.input input, .textarea.del textarea', function () {
      ui.form.insertDel(this);
    });
    /*
    // focusout 시 삭제버튼 숨김
    $(document).on('focusout', '.input:not(.show-del) input, .textarea.del:not(.show-del) textarea', function () {
      const $this = $(this);
      if ($this.siblings('.btn-inp-del').length) {
        const removeDelBtn = setTimeout(function () {
          $this.siblings('.btn-inp-del').remove();
          $this.removeData('removeDelBtn');
        }, 300);
        $this.data('removeDelBtn', removeDelBtn);
      }
    });
    */

    //메일
    $(document).on('input', '.input-mail input', function () {
      ui.form.selectMail(this);
    });

    $(document).on('click', '.input-select-list-btn', function (e) {
      e.preventDefault();
      const $text = $(this).text();
      const $input = $(this).closest('.input-mail').find('input');
      $input.val($text);
      ui.form.selectMail($input, true);
    });

    $(document)
      .on('click touchend', function (e) {
        if ($('.input-select-list').length) {
          $('.show-select-list').removeClass('show-select-list');
          $('.input-select-list').remove();
        }
      })
      .on('click touchend', '.input-mail', function (e) {
        e.stopPropagation();
      });

    //핸드폰
    $(document).on('input', '.input-phone input', function () {
      $(this).val(fn_getHpVal($(this).val()));
    });

    // 날짜선택기
    $(document).on('focusin', '.input-date input', function () {
      $(this).closest('.input-date').addClass('open');
    });

    $(document)
      .on('click touchend', function (e) {
        if ($('.input-date.open').length) $('.input-date.open').removeClass('open');
      })
      .on('click touchend', '.input-date', function (e) {
        e.stopPropagation();
      });
  },
  input: function () {
    $('.input input, .textarea.del textarea').each(function () {
      ui.form.insertDel(this);

      const $closest = $(this).closest('.input');
      if ($closest.hasClass('password') && !$closest.find('.btn-inp-pwd').length) {
        $closest.append('<a href="#" class="btn-inp-pwd" role="button" aria-label="비밀번호 입력확인"></a>');
      }
    });
    $('.input input').each(function () {
      const $this = $(this);
      const $wrap = $(this).closest('.input');
      if ($this.prop('readonly')) $wrap.addClass('readonly');
      else $wrap.removeClass('readonly');
      if ($this.prop('disabled')) $wrap.addClass('disabled');
      else $wrap.removeClass('disabled');
    });
  },
  insertDel: function (el) {
    //input 삭제버튼
    const $this = $(el);
    const $val = $this.val();
    if ($this.data('removeDelBtn') !== undefined) clearTimeout($this.data('removeDelBtn'));
    // if ($this.data('removePwdBtn') !== undefined) clearTimeout($this.data('removePwdBtn'));
    // prettier-ignore
    if (
        $this.prop('readonly') ||
        $this.prop('disabled') ||
        $this.hasClass('hasDatepicker') ||
        $this.hasClass('time') ||
        $this.attr('type') === 'date' ||
        $this.hasClass('t-right') ||
        $this.hasClass('t-center') ||
        $this.hasClass('no-del')
      ) {
        return false;
      }
    // const $closest = $this.closest('.input');
    if ($val != '') {
      if (!$this.siblings('.btn-inp-del').length && !$this.siblings('.datepicker').length) {
        $this.after('<a href="#" class="btn-inp-del" role="button" aria-label="입력내용삭제"></a>');
      }
      /*
        if ($closest.hasClass('password') && !$closest.find('.btn-inp-pwd').length) {
          $closest.append('<a href="#" class="btn-inp-pwd" role="button" aria-label="비밀번호 입력확인"></a>');
        }
        */
    } else {
      if ($this.siblings('.btn-inp-del').length) {
        const removeDelBtn = setTimeout(function () {
          $this.siblings('.btn-inp-del').remove();
          $this.removeData('removeDelBtn');
        }, 10);
        $this.data('removeDelBtn', removeDelBtn);
      }
      /*
        if ($this.siblings('.btn-inp-pwd').length) {
          const removePwdBtn = setTimeout(function () {
            $this.siblings('.btn-inp-pwd').remove();
            $this.removeData('removePwdBtn');
          }, 10);
          $this.data('removePwdBtn', removePwdBtn);
        }
        */
    }
  },
  selectMail: function (el, isRemove) {
    const mailList = ['gmail.com', 'naver.com', 'kakao.com', 'daum.net', 'nate.net', 'outlook.com'];
    const $this = $(el);
    const $val = $this.val();
    const $input = $this.closest('.input');
    const $wrap = $this.closest('.input-mail');
    let $list = $wrap.find('.input-select-list');
    if ($val === '' || $val.indexOf('@') > -1 || isRemove) {
      $input.removeClass('show-select-list');
      $list.remove();
    } else {
      $input.addClass('show-select-list');
      if (!$list.length) {
        $wrap.append('<ul class="input-select-list" role="listbox"></ul>');
        $list = $wrap.find('.input-select-list');
      }
      let $options = '';
      $.each(mailList, function () {
        $options += '<li><a href="#" class="input-select-list-btn" role="option">' + $val + '@' + this + '</a></li>';
      });
      $list.html($options);
    }
  },
  selectDateIdx: 0,
  selectDate: function (el, i = 0) {
    const $el = $(el);
    if (!$el.length) return;

    const $wrap = $el.closest('.input-date');
    if ($wrap.find('.scroll-selector-wrap').length) return;
    let $scrollHtml = '<div class="scroll-selector-wrap">';
    $scrollHtml += '<div class="year" id="scrollSelectorYear-' + ui.form.selectDateIdx + '"></div>';
    $scrollHtml += '<div class="month" id="scrollSelectorMonth-' + ui.form.selectDateIdx + '"></div>';
    $scrollHtml += '<div class="day" id="scrollSelectorDay-' + ui.form.selectDateIdx + '"></div>';
    $scrollHtml += '</div>';
    $wrap.append($scrollHtml);

    var yearSelector;
    var monthSelector;
    var dateSelector;

    function fn_initDateSelector() {
      var now = new Date();

      yearSelector = new scrollSelector({
        el: '#scrollSelectorYear-' + ui.form.selectDateIdx,
        option: fn_getDateOption('year'),
        value: now.getFullYear(),
        // sensitivity: 5, // 숫자가 낮을수록 돌렸을때 팽그르르 돌며, 초기 select 할때도 느려진다. 기본값은 0.8
        onChange: (selected) => {
          fn_dateChanged('year');
        }
      });
      // 			yearSelector.select(now.getFullYear());

      monthSelector = new scrollSelector({
        el: '#scrollSelectorMonth-' + ui.form.selectDateIdx,
        loop: true,
        option: fn_getDateOption('month'),
        value: now.getMonth() + 1,
        sensitivity: 5, // 숫자가 낮을수록 돌렸을때 팽그르르 돌며, 초기 select 할때도 느려진다. 기본값은 0.8
        onChange: (selected) => {
          fn_dateChanged('month');
        }
      });

      dateSelector = new scrollSelector({
        el: '#scrollSelectorDay-' + ui.form.selectDateIdx,
        option: fn_getDateOption('date'),
        value: now.getDate(),
        sensitivity: 5, // 숫자가 낮을수록 돌렸을때 팽그르르 돌며, 초기 select 할때도 느려진다. 기본값은 0.8
        onChange: (selected) => {
          fn_dateChanged('date');
        }
      });

      ui.form.selectDateIdx += 1;
      $(this).data({
        year: yearSelector,
        month: monthSelector,
        date: dateSelector
      });
    }

    // 날짜 변경시 처리(type : year/month/date)
    function fn_dateChanged(type) {
      if (type == 'year' || type == 'month') {
        // 연도나 월이 변경 되면 선택된 연/월로 일자 Option 재조회
        var newDateOption = fn_getDateOption('date');
        // 일자 목록보다 선택된 날짜가 크면
        if (dateSelector.value > newDateOption.length) {
          // 목록의 마지막 날짜로 설정
          dateSelector.select(newDateOption.length);
        }
        // 일자 Selector Option 갱신
        dateSelector.updateOption(newDateOption);
      }

      var dateStr = yearSelector.value;
      dateStr += '-' + (monthSelector.value < 10 ? '0' + monthSelector.value : monthSelector.value);
      dateStr += '-' + (dateSelector.value < 10 ? '0' + dateSelector.value : dateSelector.value);

      $el.val(dateStr);
      $el.trigger('input');
    }

    // 연/월/일 option 조회
    function fn_getDateOption(type) {
      var now = new Date();
      var dataOption = []; // 목록

      if (type == 'year') {
        var fromYear = now.getFullYear() - 100; // 연도 시작
        // fromYear부터 현재 연도까지 표시
        for (var i = fromYear; i <= now.getFullYear(); i++) {
          dataOption.push({
            value: i,
            text: i + '년'
          });
        }
      } else if (type == 'month') {
        // 1~12월
        for (var i = 1; i <= 12; i++) {
          dataOption.push({
            value: i,
            text: i + '월'
          });
        }
      } else if (type == 'date') {
        // 선택된 연/월에 따른 날짜 목록
        var date = [];
        var dateCnt = new Date(yearSelector.value, monthSelector.value, 0).getDate();
        for (var i = 1; i <= dateCnt; i++) {
          dataOption.push({
            value: i,
            text: i + '일'
          });
        }
      }

      return dataOption;
    }

    fn_initDateSelector();
  },
  textareaSpace: function () {
    $('.textarea.auto-height').each(function () {
      const $val = $(this).find('textarea').val();
      const $space = '<div class="textarea-space">' + $val + '<div>';
      if (!$(this).find('.textarea-space').length) $(this).append($space);
    });
  },
  textareaHeight: function (elem) {
    const $val = $(elem).val();
    const $lines = $val.split(/\r|\r\n|\n/);
    const $count = $lines.length;
    const $lineH = parseInt($(elem).css('line-height'));
    const $pd = parseInt($(elem).css('padding-top')) + parseInt($(elem).css('padding-bottom'));
    $(elem).css('height', $count * $lineH + $pd);
  },
  textarea: function () {
    // ui.form.textareaSpace();
    $('.textarea.auto-height textarea').each(function () {
      ui.form.textareaHeight(this);
    });
  },
  textareaUI: function () {
    $(document).on('keyup keydown keypress change', '.textarea.auto-height textarea', function () {
      ui.form.textareaHeight(this);
    });
  },
  success: function (element, messege) {
    const $el = $(element);
    const $closest = $el.closest('.validate-item').length ? $el.closest('.validate-item') : $el.parent();
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
    if ($closest.is('input') || $closest.is('select') || $closest.is('textarea')) $closest = $closest.parent();
    if ($el.closest('.validate-item').length) $closest = $el.closest('.validate-item');

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
          $target.text($length);
        } else {
          $target.text(Math.min($max, $length));
        }
      }, 1);
    } else {
      if ($val != '') $target.text(Math.min($max, $length));
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
  range: function () {
    const $sliderRange = document.querySelectorAll('.range-slider');
    if ($sliderRange.length) {
      $('.range-slider').each(function () {
        const $slider = $(this).find('.range-wrap');
        const $list = $(this).find('.list');
        const $input = $(this).find('input').first();
        let $first = $(this).find('.first-inp');
        if (!$first.length && $input.length == 1) {
          $input.addClass('first-inp');
          $first = $input;
        }
        const $last = $(this).find('.last-inp');
        const $min = parseInt($input[0].min);
        const $max = parseInt($input[0].max);
        const $step = parseInt($input[0].step);
        const $unit = $list.data('unit') !== undefined ? $list.data('unit').split(',') : '';
        if (!$slider.find('.range').length) $slider.prepend('<div class="range"></div>');
        const $range = $slider.find('.range');
        if ($first.length && $last.length && !$range.find('i').length) $range.append('<i></i>');
        if ($last.length && !$slider.find('.thumb.last').length) $range.after('<div class="thumb last"></div>');
        if ($first.length && !$slider.find('.thumb.first').length) $range.after('<div class="thumb first"></div>');

        if ($list.length) {
          $list.empty();
          $slider.find('.dot').remove();
          const $total = ($max - $min) / $step;
          const $stepLeft = 100 / $total;
          let $listHtml = '<ul>';
          let $dotHtml = '<ul class="dot">';
          for (let i = 0; i <= $total; i++) {
            const $setLeft = $stepLeft * i;
            $dotHtml += '<li style="left:' + $setLeft + '%"></li>';
            $listHtml += '<li style="left:' + $setLeft + '%"><span>' + ($unit.length > 1 ? $unit[i] : i * $step + $min + $unit) + '</span></li>';
          }
          $listHtml += '</ul>';
          $dotHtml += '</ul>';
          $list.append($listHtml);
          if ($list.hasClass('append-dot')) {
            $range.after($dotHtml);
          }
        }
      });

      const $clippath = function (wrap) {
        // addClass
        const $wrap = wrap;
        const $first = $wrap.querySelector('.first-inp');
        const $last = $wrap.querySelector('.last-inp');
        const $getIdx = function (el) {
          const $el = el;
          const $value = parseInt($el.value);
          const $min = parseInt($el.min);
          const $step = parseInt($el.step);
          return ($value - $min) / $step;
        };
        const $firstIdx = $first ? $getIdx($first) : null;
        const $lastIdx = $last ? $getIdx($last) : null;

        const $list = $wrap.parentNode.querySelector('.list');
        const $dot = $wrap.querySelector('.dot');
        const $liAddClass = function (wrap) {
          const $li = wrap.querySelectorAll('li');
          $li.forEach(function (item, i) {
            if (i === $firstIdx || i === $lastIdx) {
              item.classList.add('on');
            } else {
              item.classList.remove('on');
            }
          });
        };
        if ($list) $liAddClass($list);
        if ($dot) $liAddClass($dot);

        // clip-path
        const $range = $wrap.querySelector('.range i');
        let $rangeLeft = 0;
        let $rangeRight = 0;
        if ($range) {
          $rangeLeft = parseInt($range.style.left);
          $rangeRight = parseInt($range.style.right);
        }
        if ($first && $last) {
          const _polyVal = (100 - ($rangeLeft + $rangeRight)) / 2 + $rangeLeft;
          $last.style.clipPath = 'polygon(' + _polyVal + '% 0%, 100% 0%, 100% 100%, ' + _polyVal + '% 100%)';
        }
      };

      const $firstRange = function (wrap) {
        const $el = wrap.querySelector('.first-inp');
        const $lastEl = wrap.querySelector('.last-inp');
        const $lastVal = $lastEl ? parseInt($lastEl.value) : parseInt($el.max) + 1;
        $el.value = Math.min($el.value, $lastVal - 1);
        const value = (100 / (parseInt($el.max) - parseInt($el.min))) * parseInt($el.value) - (100 / (parseInt($el.max) - parseInt($el.min))) * parseInt($el.min);

        const parent = $el.parentNode;
        if (parent.querySelector('.range i')) parent.querySelector('.range i').style.left = value + '%';
        parent.querySelector('.thumb.first').style.left = value + '%';
        if (parent.querySelector('.thumb.first .value')) parent.querySelector('.thumb.first .value').innerHTML = $el.value;
        $clippath(parent);
      };

      const $lastRange = function (wrap) {
        const $el = wrap.querySelector('.last-inp');
        const $firstEl = wrap.querySelector('.first-inp');
        const $firstVal = $firstEl ? parseInt($firstEl.value) : parseInt($el.min) - 1;
        $el.value = Math.max($el.value, $firstVal + 1);
        const value = (100 / (parseInt($el.max) - parseInt($el.min))) * parseInt($el.value) - (100 / (parseInt($el.max) - parseInt($el.min))) * parseInt($el.min);
        const parent = $el.parentNode;
        if (parent.querySelector('.range i')) parent.querySelector('.range i').style.right = 100 - value + '%';
        parent.querySelector('.thumb.last').style.left = value + '%';
        if (parent.querySelector('.thumb.last .value')) parent.querySelector('.thumb.last .value').innerHTML = $el.value;
        $clippath(parent);
      };

      $sliderRange.forEach(function (el) {
        const $el = el;
        const $first = $el.querySelector('.first-inp');
        const $last = $el.querySelector('.last-inp');
        const $isInited = $el.classList.contains('_inited');
        if ($first && $last) {
          $el.classList.add('multiple');
        }
        if ($first) {
          $firstRange($el);
          if (!$isInited) {
            $first.addEventListener(
              'input',
              function () {
                $firstRange($el);
              },
              false
            );
          }
        } else if ($el.querySelector('.thumb.first')) {
          $el.querySelector('.thumb.first').style.display = 'none';
        }
        if ($last) {
          $lastRange($el);
          if (!$isInited) {
            $last.addEventListener(
              'input',
              function () {
                $lastRange($el);
              },
              false
            );
          }
        } else if ($el.querySelector('.thumb.last')) {
          $el.querySelector('.thumb.last').style.display = 'none';
        }
        $el.classList.add('_inited');
      });
    }
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
    const dfd = $.Deferred();
    //jquery UI datepicker
    const $dimmedClass = 'datepicker-dimmed';
    const swipeArr = $('<div class="swipe-arr" aria-hidden="true"><i class="arr top"></i><i class="arr bottom"></i><i class="arr left"></i><i class="arr right"></i></div>');
    const swipeGuide = $('<div class="datepicker-guide">달력 부분을 상,하,좌,우 드래그하면<br />편리하게 이동할 수 있어요.</div>');
    let isSwipeGuide = true;
    const prevYrBtn = $('<a href="#" role="button" class="ui-datepicker-prev-y" aria-label="이전년도 보기"><span>이전년도 보기</span></a>');
    const nextYrBtn = $('<a href="#" role="button" class="ui-datepicker-next-y" aria-label="다음년도 보기"><span>다음년도 보기</span></a>');
    const calendarOpen = function (target, ob, delay) {
      if (delay == undefined || delay == '') delay = 5;
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
          if (!$($calendar).find('.swipe-arr').length) $($calendar).prepend(swipeArr);
          if (isSwipeGuide) {
            $($calendar).addClass('add-guide').append(swipeGuide);
            isSwipeGuide = false;
          } else {
            $($calendar).removeClass('add-guide');
          }
          if (!$('.' + $dimmedClass).length) $($calendar).before('<div class="' + $dimmedClass + '" aria-hidden="true"></div>');
        }

        $header.find('.ui-datepicker-year').attr('title', '년 선택');
        $header.find('.ui-datepicker-month').attr('title', '월 선택');
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
          .before(prevYrBtn);
        const $prevYearBtn = $header.find('.ui-datepicker-prev-y');
        if ($selectedYear <= $minY) {
          $prevYearBtn.addClass('ui-state-disabled').attr('aria-disabled', true);
          $($calendar).find('.swipe-arr .top').addClass('off');
        } else {
          $prevYearBtn.removeClass('ui-state-disabled').removeAttr('aria-disabled');
          $($calendar).find('.swipe-arr .top').removeClass('off');
        }
        $nextMonthBtn
          .attr({
            role: 'button',
            'aria-label': '다음달 보기'
          })
          .after(nextYrBtn);
        const $nextYearBtn = $header.find('.ui-datepicker-next-y');
        if ($selectedYear >= $maxY) {
          $nextYearBtn.addClass('ui-state-disabled').attr('aria-disabled', true);
          $($calendar).find('.swipe-arr .bottom').addClass('off');
        } else {
          $nextYearBtn.removeClass('ui-state-disabled').removeAttr('aria-disabled');
          $($calendar).find('.swipe-arr .bottom').removeClass('off');
        }
        if ($prevMonthBtn.hasClass('ui-state-disabled')) {
          $prevMonthBtn.attr('aria-disabled', true);
          $($calendar).find('.swipe-arr .left').addClass('off');
        } else {
          $prevMonthBtn.removeAttr('aria-disabled');
          $($calendar).find('.swipe-arr .left').removeClass('off');
        }
        if ($nextMonthBtn.hasClass('ui-state-disabled')) {
          $nextMonthBtn.attr('aria-disabled', true);
          $($calendar).find('.swipe-arr .right').addClass('off');
        } else {
          $nextMonthBtn.removeAttr('aria-disabled');
          $($calendar).find('.swipe-arr .right').removeClass('off');
        }

        //$header.find('.ui-datepicker-title').append('월');
        $header.find('.ui-datepicker-prev, .ui-datepicker-next').attr('href', '#');
        if (!$isInline) {
          if (ui.mobile.any()) {
            $($calendar).find('.title').attr('tabindex', -1).focus();
            if ($(ui.className.mainWrap + ':visible').length) $(ui.className.mainWrap + ':visible').attr('aria-hidden', true);
          } else {
            $($calendar).attr('tabindex', 0).focus();
            Layer.focusMove($calendar);
          }

          if (!$container.data('init')) {
            $container.data('init', true);
            $container.swipe({
              swipeStatus: function (event, phase, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                const $this = $(this);
                const $max = 30;
                const $btnPrevMonth = $header.find('.ui-datepicker-prev');
                const $btnNextMonth = $header.find('.ui-datepicker-next');
                const $btnPrevYear = $header.find('.ui-datepicker-prev-y');
                const $btnNextYear = $header.find('.ui-datepicker-next-y');
                if (direction != null) {
                  let $distance = Math.min($max, distance);
                  if (direction == 'left' || direction == 'up') $distance = -$distance;
                  if (direction == 'left' || direction == 'right') $this.css('left', $distance);
                  if (direction == 'up' || direction == 'down') $this.css('top', $distance);
                  if (phase == 'end' || phase == 'cancel') {
                    $this.animate(
                      {
                        left: 0,
                        top: 0
                      },
                      200,
                      function () {
                        if (Math.abs($distance) >= $max) {
                          if (direction == 'right' && !$btnPrevMonth.hasClass('ui-state-disabled')) $btnPrevMonth.click();
                          if (direction == 'left' && !$btnNextMonth.hasClass('ui-state-disabled')) $btnNextMonth.click();
                          if (direction == 'down' && !$btnPrevYear.hasClass('ui-state-disabled')) $btnPrevYear.click();
                          if (direction == 'up' && !$btnNextYear.hasClass('ui-state-disabled')) $btnNextYear.click();
                        }
                      }
                    );
                  }
                }
              },
              cancleTreshold: 0
            });
          }
        }

        $header
          .find('.ui-datepicker-prev-y')
          .unbind('click')
          .bind('click', function () {
            if (!$(this).hasClass('ui-state-disabled')) $.datepicker._adjustDate(target, -1, 'Y');
          });
        $header
          .find('.ui-datepicker-next-y')
          .unbind('click')
          .bind('click', function () {
            if (!$(this).hasClass('ui-state-disabled')) $.datepicker._adjustDate(target, +1, 'Y');
          });
      }, delay);
    };
    const calendarClose = function (target, ob, date) {
      const $isInline = ob.inline ? true : false;
      const $calendar = $isInline ? '#' + ob.id : '#' + ob.dpDiv[0].id;
      const $cal = $($calendar);
      if ($isInline) {
        //인라인달력
        const $date = date;
        const $input = $cal.find('.ui-datepicker-inline-inp');
        if ($input.length) $input.val($date);
      } else {
        //팝업달력
        Body.unlock();
        $(ob.input).change();
        if ($(ui.className.mainWrap + ':visible').length) $(ui.className.mainWrap + ':visible').removeAttr('aria-hidden');
        $cal.find('.title').removeAttr('tabindex');
        $('.' + $dimmedClass).remove();
        $(target).next('.ui-datepicker-trigger').focus();
        if ($(target).data('isReadonly') != true) $(target).prop('readonly', false);
      }
    };

    if ($(element).length) {
      $(element).each(function () {
        const $this = $(this);
        if ($this.hasClass('_inited')) return;
        let $minDate = $(this).data('min');
        let $maxDate = $(this).data('max');
        let $defaultDate = $(this).data('default');
        let $range = $(this).data('range');
        if ($minDate == undefined) $minDate = '-100y';
        if ($maxDate == undefined) $maxDate = '+100y';
        if ($defaultDate == undefined) {
          $defaultDate = null;
        } else {
          if ($this.val() == '') $this.val($defaultDate);
        }
        if (!!defaultDate) $defaultDate = defaultDate;
        if ($range == undefined) $range = '-100:+100';
        const $inlineTag = 'div, span';
        let $isInline = false;
        if ($this.is($inlineTag)) $isInline = true;
        $this.datepicker({
          minDate: $minDate,
          maxDate: $maxDate,
          defaultDate: $defaultDate,
          closeText: '닫기',
          prevText: '이전달 보기',
          nextText: '다음달 보기',
          currentText: '오늘',
          buttonText: '기간조회',
          monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
          dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
          dateFormat: 'yy.mm.dd',
          yearRange: $range,
          yearSuffix: '. ',
          showMonthAfterYear: true,
          showButtonPanel: true,
          showOn: 'button',
          changeMonth: true,
          changeYear: true,
          showOtherMonths: true,
          selectOtherMonths: true,
          beforeShow: function (el, ob) {
            //열때
            if (!$isInline) {
              Body.lock();
              if ($this.prop('readonly') == true) {
                $this.data('isReadonly', true);
              } else {
                $this.prop('readonly', true);
              }
            }

            //기간 선택
            const $closest = $(this).closest('.date_wrap');
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
            calendarClose($this, ob, d);
            if ($isInline) calendarOpen($this, ob);

            //콜백
            dfd.resolve();
          },
          onClose: function (d, ob) {
            //닫을때
            calendarClose($this, ob, d);
          }
        });
        $this.addClass('_inited');
        if ($isInline) {
          const $ob = $.datepicker._getInst($this[0]);
          calendarOpen($this, $ob);
        }

        //달력버튼 카드리더기에서 안읽히게
        $(this).siblings('.ui-datepicker-trigger').attr({
          'aria-label': '달력팝업으로 기간조회'
          //'aria-hidden':true,
          //'tabindex':-1
        });

        $('.' + $dimmedClass)
          .off('touchstart')
          .on('touchstart', function () {
            $('.hasDatepicker').datepicker('hide');
          });
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
          $(this).val(autoDateFormet($val, '.'));
        }
      });
    }
    return dfd.promise();
  }
};

/** 리스트 **/
ui.list = {
  init: function () {
    ui.list.allCheck();
  },
  reInit: function () {
    ui.list.loadInit();
  },
  loadInit: function () {
    //토글실행
    ui.folding.list('.ui-folding', '.folding-btn', '.folding-panel');
    ui.folding.btn('.ui-folding-btn');
    ui.folding.close('.ui-folding-close');

    //테이블 스크롤 가이드 실행
    ui.table.guideScroll();
    ui.table.guideResize();
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
            if ($li.find(panel).find('.ui-swiper').length) {
              ui.swiper.update($li.find(panel).find('.ui-swiper'));
            }
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
          if ($($panel).find('.ui-swiper').length) {
            ui.swiper.update($($panel).find('.ui-swiper'));
          }
        };

        if (($panel == '#' || $panel == '#none') && $this.closest('.folding-list').length) $panel = $this.closest('.folding-list').find('.folding-panel');
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
//테이블
ui.table = {
  class: '.tbl-scroll-in',
  guideScroll: function () {
    const $tbl = $(ui.table.class);
    if (!$tbl.length) return;
    $tbl.each(function () {
      const $this = $(this);
      $this.data('first', true);
      $this.data('direction', '좌우');
      $(this).on('scroll', function () {
        $this.data('first', false);
        $this.find('.tbl-guide').remove();
        //$this.removeAttr('title');

        const $sclInfo = $this.next('.tbl-scroll-ifno');
        if ($sclInfo.length) {
          const $sclPercentX = ui.scroll.sclPer($this).x;
          const $sclPercentY = ui.scroll.sclPer($this).y;
          const $horizon = $sclInfo.find('.horizon');
          const $vertical = $sclInfo.find('.vertical');
          if ($horizon.is(':visible')) $horizon.children().css('width', $sclPercentX + '%');
          if ($vertical.is(':visible')) $vertical.children().css('height', $sclPercentY + '%');
        }
      });
    });
  },
  guideResize: function () {
    const $tbl = $(ui.table.class);
    if (!$tbl.length) return;
    $tbl.each(function () {
      const $this = $(this);
      const $direction = $this.data('direction');
      let $changeDirection = '';
      const $guide = '<div class="tbl-guide" title="해당영역은 테이블을 스크롤하면 사라집니다."><div><i class="icon" aria-hidden="true"></i>테이블을 ' + $direction + '로 스크롤하세요.</div></div>';
      const $height = $this.outerHeight();

      const $isScrollX = ui.scroll.is($this).x;
      const $isScrollY = ui.scroll.is($this).y;
      const $sclInfoHtml = '<div class="tbl-scroll-ifno" aria-hidden="true"><div class="horizon"><div></div></div><div class="vertical"><div></div></div></div>';
      let $sclIfno = $this.next('.tbl-scroll-ifno');
      if ($this.data('first')) {
        if ($isScrollX && $isScrollY) {
          $changeDirection = '상하좌우';
        } else if ($isScrollX) {
          $changeDirection = '좌우';
        } else if ($isScrollY) {
          $changeDirection = '상하';
        } else {
          $changeDirection = '';
        }

        if ($changeDirection == '') {
          $this.removeAttr('tabindex').find('.tbl-guide').remove();
          $sclIfno.remove();
          $this.removeAttr('title');
        } else {
          if (!$this.find('.tbl-guide').length) {
            if (!ui.mobile.any()) {
              $this.attr('tabindex', 0); //pc일땐 tabindex 사용
            }
            $this.prepend($guide);
          }
          if (!$sclIfno.length) {
            $this.after($sclInfoHtml);
            $sclIfno = $this.next('.tbl_scroll_ifno');
          }
          if ($sclIfno.length) {
            $sclIfno.find('.vertical').css('height', $height);
            $sclIfno.find('.vertical').show();
            $sclIfno.find('.horizon').show();
            if ($changeDirection == '좌우') {
              $sclIfno.find('.vertical').hide();
            } else if ($changeDirection == '상하') {
              $sclIfno.find('.horizon').hide();
            }
          }

          $this.attr('title', '터치스크롤하여 숨겨진 테이블영역을 확인하세요');
        }

        if ($direction != $changeDirection && $this.find('.tbl-guide').length) {
          $this.find('.tbl-guide').changeTxt($direction, $changeDirection);
          $this.data('direction', $changeDirection);
        }
      }
    });
  }
};

/** Swiper **/
ui.swiper = {
  init: function () {
    if ($('.ui-swiper').length) {
      ui.swiper.ready('.ui-swiper');
      ui.swiper.base('.ui-swiper');
      ui.swiper.UI();
    }
  },
  reInit: function () {
    ui.swiper.ready('.ui-swiper');
    ui.swiper.base('.ui-swiper');
  },
  base: function (tar, changeEvt) {
    $(tar).each(function () {
      const $this = $(this);
      const $swiper = $this.find('.swiper');
      const $pagination = $this.find('.swiper-pagination');
      const $slide = $this.find('.swiper-slide');
      if (!$slide.length) return;

      let $paginationType = 'bullets';
      if ($this.hasClass('_fraction')) $paginationType = 'fraction';

      let $navigation = false;
      if ($this.hasClass('_navi')) {
        let $btnHtml = '';
        if (!$swiper.find('.swiper-button-prev').length) $btnHtml += '<button type="button" class="swiper-button-prev swiper-button"></button>';
        if (!$swiper.find('.swiper-button-next').length) $btnHtml += '<button type="button" class="swiper-button-next swiper-button"></button>';
        if ($btnHtml !== '') $swiper.append($btnHtml);
        $navigation = {
          prevEl: $this.find('.swiper-button-prev')[0],
          nextEl: $this.find('.swiper-button-next')[0]
        };
      }

      let $slidesPerView = 'auto';
      if ($this.data('view') !== undefined) {
        $slidesPerView = $this.data('view');
        $this.removeAttr('data-view');
      }

      let $loop = $this.hasClass('_loop') ? true : false;
      let $autoHeight = $this.hasClass('_autoHeight') ? true : false;
      let $centeredSlides = $this.hasClass('_centeredSlides') ? true : false;

      let $auto = false;
      if ($this.data('auto') !== undefined) {
        $auto = {
          delay: $this.data('auto'),
          disableOnInteraction: false
        };
        $this.removeAttr('data-auto');
        if (!$this.find('.swiper-auto-ctl').length) {
          if (!$this.find('.swiper-pagination-wrap').length) $pagination.wrap('<div class="swiper-pagination-wrap"></div>');
          $pagination.before('<button type="button" class="swiper-auto-ctl" aria-label="슬라이드 자동롤링 중지"></button>');
        }
      }
      let $parallax = false;
      if (
        $this.find('[data-swiper-parallax]').length ||
        $this.find('[data-swiper-parallax-x]').length ||
        $this.find('[data-swiper-parallax-y]').length ||
        $this.find('[data-swiper-parallax-scale]').length ||
        // $this.find('[data-swiper-parallax-duration]').length ||
        $this.find('[data-swiper-parallax-opacity]').length
      ) {
        $parallax = true;
      }

      let $zoom = false;
      if ($this.find('.swiper-zoom-container').length) {
        $zoom = {
          maxRatio: 2,
          toggle: true
        };
        $this.find('.swiper-zoom-container').each(function () {
          let $btnHtml = '<div class="swiper-zoom-btn">';
          $btnHtml += '<button type="button" role="button" class="swiper-zoom-in" aria-label="확대"></button>';
          $btnHtml += '<button type="button" role="button" class="swiper-zoom-out" aria-label="축소"></button>';
          $btnHtml += '</div>';
          $(this).before($btnHtml);
        });
      }

      let baseSwiper;
      if ($swiper.hasClass('swiper-initialized')) {
        baseSwiper = $this.data('swiper');
        if (baseSwiper !== undefined) baseSwiper.update();
      } else {
        baseSwiper = new Swiper($swiper[0], {
          pagination: {
            el: $pagination[0],
            type: $paginationType,
            clickable: true,
            renderBullet: function (index, className) {
              return '<button type="button" class="' + className + '" aria-label="' + (index + 1) + '번째 슬라이드로 이동"></button>';
            }
          },
          navigation: $navigation,
          slidesPerView: $slidesPerView,
          loop: $loop,
          autoHeight: $autoHeight,
          centeredSlides: $centeredSlides,
          autoplay: $auto,
          parallax: $parallax,
          zoom: $zoom,
          on: {
            init: function (e) {
              if ($navigation) {
                setTimeout(function () {
                  e.navigation.prevEl.ariaLabel = '이전 슬라이드로 이동';
                  e.navigation.nextEl.ariaLabel = '다음 슬라이드로 이동';
                }, 1);
              }
            },
            slideChangeTransitionEnd: function (e) {
              if (!!changeEvt) changeEvt(e);
            }
          }
        });
        $this.data('swiper', baseSwiper);
      }
    });
  },
  ready: function (tar) {
    const $target = $(tar);
    $target.each(function () {
      const $this = $(this);
      if (!$this.find('.swiper-slide').length) {
        let $children = $this.children();
        while ($children.hasClass('swiper') || $children.hasClass('swiper-wrapper')) {
          $children = $children.children();
        }
        $children.addClass('swiper-slide');
      }

      if (!$this.find('.swiper-wrapper').length) {
        if (!$this.find('.swiper').length) {
          $this.wrapInner('<div class="swiper-wrapper"></div>');
          $this.wrapInner('<div class="swiper"></div>');
        } else {
          $this.find('.swiper').wrapInner('<div class="swiper-wrapper"></div>');
        }
      } else if (!$this.find('.swiper').length) {
        $this.find('.swiper-wrapper').parent().wrapInner('<div class="swiper"></div>');
      }
      if (!$this.find('.swiper-pagination').length) {
        $this.append('<div class="swiper-pagination"></div>');
      }
    });
  },
  UI: function () {
    $(document).on('click', '.ui-swiper .swiper-auto-ctl', function (e) {
      e.preventDefault();
      const $this = $(this);
      const $closest = $this.closest('.ui-swiper');
      const $swiper = $closest.data('swiper');
      if ($(this).hasClass('play')) {
        $swiper.autoplay.start();
        $(this).removeClass('play').changeAriaLabel('시작', '중지');
      } else {
        $swiper.autoplay.stop();
        $(this).addClass('play').changeAriaLabel('중지', '시작');
      }
    });

    $(document).on('click', '.ui-swiper .swiper-zoom-in', function (e) {
      e.preventDefault();
      const $this = $(this);
      const $swiper = $this.closest('.ui-swiper').data('swiper');
      $swiper.zoom.in();
    });

    $(document).on('click', '.ui-swiper .swiper-zoom-out', function (e) {
      e.preventDefault();
      const $this = $(this);
      const $swiper = $this.closest('.ui-swiper').data('swiper');
      $swiper.zoom.out();
    });
  },
  update: function (target) {
    $(target).each(function () {
      const $this = $(this);
      const $swiper = $this.data('swiper');
      if ($swiper !== undefined) $swiper.update();
    });
  }
};

/** scroll **/
ui.scroll = {
  isCSS: function (val) {
    const $type = ['auto', 'scroll', 'overlay', 'visible'];
    if ($type.indexOf(val) > -1) {
      return true;
    } else {
      return false;
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
  guide: function (element) {
    const $el = $(element);
    const $wrapClass = 'ui-scl-guide';
    const $contClass = 'ui-scl-cont';
    const $infoClass = 'ui-scl-info';
    const $barClass = 'ui-scl-bar';
    $el.each(function () {
      const $this = $(this);
      const $isSclGuide = $this.data('sclGuide');

      if (!$this.hasClass($contClass)) $this.addClass($contClass);
      if (!$this.parent().hasClass($wrapClass)) $this.wrap('<div class="' + $wrapClass + '"></div>');
      if (!$this.siblings('.' + $infoClass).length) $this.before('<div class="' + $infoClass + '" role="img" aria-label="스크롤하면 아래 숨겨진 컨텐츠를 확인 할 수 있습니다."></div>');
      if (!$this.siblings('.' + $barClass).length) $this.after('<div class="' + $barClass + '" aria-hidden="true"><div></div></div>');
      const $info = $this.siblings('.' + $infoClass);
      const $bar = $this.siblings('.' + $barClass);
      let $percent = ui.scroll.sclPer(this).x;
      if ($percent <= 0) {
        $bar.hide();
      } else {
        $bar
          .show()
          .children()
          .css('width', $percent + '%');
      }
      const $sclGap = $this.get(0).scrollHeight - $this.outerHeight();
      if ($sclGap < 1) {
        $info.hide();
      } else {
        $info.show();
      }

      if (!$isSclGuide) {
        $this.data('sclGuide', true);
        $this.on('scroll', function () {
          $percent = ui.scroll.sclPer(this).x;
          if ($percent <= 0) {
            $bar.hide();
          } else {
            $bar
              .show()
              .children()
              .css('width', $percent + '%');
          }
          if ($percent >= 100) {
            $info.hide();
          } else {
            $info.show();
          }
        });
      }
    });
  },
  sclPer: function (element, type) {
    const $obj = {
      x: 0,
      y: 0
    };
    $obj.x = Math.abs($(element).scrollLeft() / ui.scroll.is(element).width) * 100;
    $obj.y = Math.abs($(element).scrollTop() / ui.scroll.is(element).height) * 100;
    return $obj;
  },
  horizonScl: function () {
    const $wrap = '.tab-inner, .img-box-wrap';
    if (!$($wrap).length || ui.mobile.any()) return;
    $($wrap).each(function () {
      const $this = $(this);
      if ($this.data('_ui-init')) return;
      $this.data('_ui-init', true);
      $this.on('mousewheel', function (e) {
        const $wheelDelta = e.originalEvent.wheelDelta;
        const $this = $(this);
        const $thisW = $this.outerWidth();
        const $thisSclW = $this[0].scrollWidth;
        const $widthGap = $thisSclW - $thisW;
        const $thisSclL = $this.scrollLeft();
        let $isMove = false;
        const $move = function () {
          if ($isMove) return;
          $isMove = true;
          // $this.scrollLeft($thisSclL - $wheelDelta);
          $this.stop(false, true).animate({ scrollLeft: $thisSclL - $wheelDelta }, 100, function () {
            $isMove = false;
          });
        };

        if ($wheelDelta > 0) {
          //up
          if ($thisSclL > 0) {
            e.preventDefault();
            $move();
          }
        } else {
          //down
          if ($thisSclL + $thisW < $thisSclW) {
            e.preventDefault();
            $move();
          }
        }
      });
    });
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
    const bottomFixedSpace = $(ui.className.mainWrap + ':visible ' + ui.className.bottomFixedSpace);
    const $bottomMargin = bottomFixedSpace.length ? bottomFixedSpace.outerHeight() + 10 : 0;
    const $winEnd = $scrollTop + $winHeight - $bottomMargin;
    const $topElTop = $(topEl).offset().top - $topMargin;
    const $bototomElTop = $(bototomEl).offset().top;
    const $bototomElHeight = $(bototomEl).outerHeight();
    const $bototomElEnd = $bototomElTop + $bototomElHeight;
    let $scroll = '';
    if ($winEnd < $bototomElEnd) {
      $scroll = Math.min($topElTop, $bototomElEnd - $winHeight + $bottomMargin);
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
  init: function () {
    ui.scroll.horizonScl();
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
            if ($boayEl().length) ui.animation.sclCheckIn($boayEl(), window);
          }, 300)
        );
      }

      /*
      if (!'IntersectionObserver' in window && !'IntersectionObserverEntry' in window && !'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
        // IntersectionObserver 지원안할때 
        $(window).on('scroll resize',function(){
          ui.animation.sclCheckIn($animations);
        });
      }else{
        // IntersectionObserver 지원될때 
        $($animations).each(function(){
          ui.animation.sclAray.push(ui.animation.sclObserver(this))
        });
      }
      */
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
    // const $target = $.find('*[data-animation]');
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
      let $bottomFixedH = 0;
      const $bottomFixedSpace = $(ui.className.mainWrap + ':visible ' + ui.className.bottomFixedSpace);
      if ($isWin && $bottomFixedSpace.length) {
        $bottomFixedH = $bottomFixedSpace.height();
      } else if ($wrap.find(ui.className.bottomFixed + ':visible').length) {
        $bottomFixedH = $wrap.find(ui.className.bottomFixed + ':visible').height();
      }
      const $wrapTop = $scrollTop + $topFixedH;
      const $wrapCenter = $scrollTop + ($wHeight - $topFixedH - $bottomFixedH) / 2;
      const $wrapBottom = $scrollTop + ($wHeight - $bottomFixedH);

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
  sclObserver: function (el) {
    const $el = $(el);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.intersectionRatio > 0)) {
          ui.animation.sclAction($el);
        }
      },
      {
        threshold: 0.03
      }
    );
    // io.observe(el);
    io.unobserve(el);
    return io;
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

/** 차트 **/
ui.chart = {
  init: function () {
    ui.chart.circle();
  },
  circle: function () {
    $('[data-circle-box]').each(function () {
      const _this = $(this);
      let deg = 0;
      let $firstSize = 0;
      let $firstBgLineW = 0;
      let $firstLineW = 0;
      let strokeWidth = $(this).data('circle-width') ? parseInt($(this).data('circle-width')) : 5;
      const typeCheck = _this.data('circle-box');
      _this.addClass(typeCheck);
      _this.find('[data-circle-val]').each(function (e) {
        $(this).empty();
        const idx = $(this).data('circle-val');
        const color = $(this).data('circle-color');
        const size = $(this).data('circle-size');
        const dasharray = 2 * Math.PI * (18 - strokeWidth / 2);

        let html = '';
        html += '<svg viewBox="0 0 36 36" class="circular-chart"';
        if (size) html += ' style="width:' + size + 'px;height:' + size + 'px;"';
        html += ' aria-hidden="true">';
        if (!e || typeCheck !== 'type2') {
          // html += '<path';
          // html += ' class="circle-bg"';
          // html += ' d="M18 2.0845';
          // html += ' a 15.9155 15.9155 0 0 1 0 31.831';
          // html += ' a 15.9155 15.9155 0 0 1 0 -31.831"';
          // html += ' />';
          html += '<circle class="circle-bg" fill="none" stroke-width="' + strokeWidth + '" cx="18" cy="18" r="' + (18 - strokeWidth / 2) + '"></circle>';
        }
        html += '<circle';
        html += ' class="circle"';
        if (typeCheck === 'type1') {
          html += ' style="';
          html += '-webkit-animation-delay: ' + e * 0.3 + 's;';
          html += 'animation-delay: ' + e * 0.3 + 's;';
          html += '" ';
        }
        if (color) html += ' stroke="' + color + '"';
        html += ' stroke-dasharray="' + dasharray * (idx / 100) + ', ' + dasharray + '"';
        // html += ' d="M18 2.0845';
        // html += ' a 15.9155 15.9155 0 0 1 0 31.831';
        // html += ' a 15.9155 15.9155 0 0 1 0 -31.831"';
        html += ' stroke-width="' + strokeWidth + '" cx="18" cy="18" r="' + (18 - strokeWidth / 2) + '"';
        html += ' />';
        html += '</svg>';
        $(this).append(html);
        if (typeCheck == 'type2') {
          if (e) {
            $(this)
              .find('.circular-chart')
              .css({ transform: 'rotate(' + 360 * (deg / 100) + 'deg)' });
          }
          deg += idx;
        }
        $(this).role('img');
        // $(this).children().unwrap();
        if (size) {
          const $thisLineBg = $(this).find('.circle-bg');
          const $thisLineBgW = parseInt($thisLineBg.css('stroke-width'));
          const $thisLine = $(this).find('.circle');
          const $thisLineW = parseInt($thisLine.css('stroke-width'));
          if (!e) {
            $firstSize = size;
            $firstBgLineW = $thisLineBgW;
            $firstLineW = $thisLineW;
          } else {
            const $ratio = $firstSize / size;
            $thisLineBg.css('stroke-width', $firstBgLineW * $ratio);
            $thisLine.css('stroke-width', $firstLineW * $ratio);
          }
        }
      });
    });
  }
};

/********************************
 * front 사용함수 *
 ********************************/
const $focusableEl = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]';
//Focus.disabled();
const Focus = {
  disabled: function (el) {
    const $number = -10;
    const $tabIdx = $(el).attr('tabindex');
    const $dataIdx = $(el).data('tabindex');
    if ($dataIdx == undefined && $tabIdx > $number) $(el).data('tabindex', $tabIdx);
    $(el).attr('tabindex', $number);
  },
  abled: function (el) {
    const $tabIdx = $(el).data('tabindex');
    if ($tabIdx != undefined) {
      $(el).attr('tabindex', $tabIdx);
    } else {
      $(el).removeAttr('tabindex');
    }
  }
};

//body scroll lock
const Body = {
  scrollTop: '',
  lock: function () {
    if ($('html').hasClass('lock')) return;

    Body.scrollTop = window.scrollY;
    const $wrap = $(ui.className.mainWrap + ':visible');
    if ($wrap.length) {
      const $wrapTop = $wrap.offset().top;
      const $setTop = Body.scrollTop * -1 + $wrapTop;
      $wrap.addClass('lock-wrap').css('top', $setTop);
    }
    $('html').addClass('lock');
  },
  unlock: function () {
    if (!$('html').hasClass('lock')) return;

    $('html').removeClass('lock');
    $('.lock-wrap').removeClass('lock-wrap').removeAttr('style');
    window.scrollTo(0, Body.scrollTop);
    window.setTimeout(function () {
      Body.scrollTop = '';
    }, 0);
  }
};

//로딩함수
const Loading = {
  className: {
    wrap: '.loading-wrap',
    box: '.loading-lottie'
  },
  speed: 200,
  open: function (txt) {
    let $html = '<div class="' + Loading.className.wrap.slice(1) + '" class="hide">';
    $html += '<div class="tl">';
    $html += '<div>';
    /* // img 타입
    $html += '<div class="loading-icon" role="img"';
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
    $html += '<div class="' + Loading.className.box.slice(1) + '" role="img"';
    if (!txt) {
      $html += ' aria-label="화면을 불러오는중입니다."';
    }
    $html += '>';
    $html += '<div class="lottie _loop" data-lottie="' + $file + '" aria-hidden="true"></div>';
    $html += '</div>';
    $html += '</div>';
    $html += '</div>';
    $html += '</div>';

    if (!$(Loading.className.wrap).length) {
      $('body').prepend($html);
      setTimeout(function () {
        if ($(Loading.className.wrap + ' .lottie').length) {
          ui.common.lottie(function (target) {
            if ($(target).closest(Loading.className.wrap).length) {
              $(Loading.className.wrap).stop(true, false).fadeIn(Loading.speed);
            }
          });
        }
      }, 5);
    } else {
      $(Loading.className.wrap).stop(true, false).fadeIn(Loading.speed);
    }
    if (!!txt) {
      $(Loading.className.wrap + ' ' + Loading.className.box).after('<div class="txt">' + txt + '</div>');
    } else {
      $(Loading.className.wrap + ' .txt').remove();
    }
  },
  close: function () {
    $(Loading.className.wrap).stop(true, false).fadeOut(Loading.speed);
  }
};

//레이어팝업(Layer): 레이어 팝업은 body 바로 아래 위치해야함
const Layer = {
  id: 'uiLayer',
  className: {
    popup: ui.className.popup.slice(1),
    wrap: ui.className.wrap.slice(1),
    header: ui.className.header.slice(1),
    headerInner: ui.className.headerInner.slice(1),
    headerLeft: ui.className.headerLeft.slice(1),
    headerRight: ui.className.headerRight.slice(1),
    close: 'head-close',
    body: ui.className.body.slice(1),
    inner: 'section',
    active: 'show',
    etcCont: ui.className.mainWrap + ':visible',
    focused: 'pop__focused',
    focusIn: 'ui-focus-in',
    removePopup: 'ui-pop-remove',
    closeRemove: 'ui-pop-close-remove',
    alert: 'ui-pop-alert',
    lastPopup: 'ui-pop-last',
    bgNoClose: 'bg-no-click'
  },
  closeBtn: '<button type="button" class="head-close head-btn ui-pop-close" aria-label="팝업창 닫기"></button>',
  reOpen: false,
  openEl: '',
  openPop: [],
  opening: 0,
  open: function (tar) {
    const dfd = $.Deferred();
    const $popup = $(tar);
    const $popWrap = $popup.find('.' + Layer.className.wrap);

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
    }

    Layer.opening++;

    //z-index
    const $showLength = $('.' + Layer.className.popup + '.' + Layer.className.active).not('.' + Layer.className.alert).length;
    const $alertShowLength = $('.' + Layer.className.popup + '.' + Layer.className.active + '.' + Layer.className.alert).length;
    if ($popup.hasClass(Layer.className.alert && !$alertShowLength)) {
      $popup.css('z-index', '+=' + $alertShowLength);
    } else if ($showLength) {
      $popup.css('z-index', '+=' + $showLength);
    }

    //id없을때
    let $id = $popup.attr('id');
    const $idx = $popup.index('.' + Layer.className.popup);
    if ($id === undefined) {
      $id = Layer.id + $idx;
      $popup.attr('id', $id);
    }

    //last 체크
    let $lastPop = '';
    if (Layer.openPop.length) $lastPop = Layer.openPop[Layer.openPop.length - 1];
    if (!$popup.hasClass(Layer.className.alert)) {
      if (Layer.openPop.length) {
        let $last;
        $.each(Layer.openPop, function () {
          const $this = '' + this;
          if (!$($this).hasClass(Layer.className.alert)) $last = $this;
        });
        $($last).removeClass(Layer.className.lastPopup);
      }
      $popup.addClass(Layer.className.lastPopup);
    }
    if (Layer.openPop.indexOf('#' + $id) < 0) Layer.openPop.push('#' + $id);

    // bg close
    //  && !$popup.hasClass('full')
    if (!$popup.hasClass(Layer.className.alert) && !$popup.hasClass(Layer.className.bgNoClose) && !$popup.find('.pop-bg-close').length) {
      const $bgClick = '<div class="pop-bg-close ui-pop-close" role="button" aria-label="팝업창 닫기"></div>';
      $popup.prepend($bgClick);
    }

    // delay time
    const $openDelay = 20 * Layer.opening;

    //show
    $popup.attr('aria-hidden', false);
    $popup.css('display', 'flex');
    // console.log(event.currentTarget, Event.currentTarget, 'currentTarget');
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
          $popup.find('.bottem-fixed .button').last().focus();
        } else {
          $popup.attr({ tabindex: 0 }).focus();
        }
      } else {
        let $first = '';
        let $focusInEl = $popup.find('.' + Layer.className.focusIn);
        let $thisTxt = '';
        let $childrenTxt = '';
        //모바일
        if ($popup.find('.' + Layer.className.header + ' h1').length) {
          $popup.attr({ tabindex: 0 }).focus();
        } else if ($popup.find('.' + Layer.className.header + ' .' + Layer.className.close).length) {
          $popup.find('.' + Layer.className.header + ' .' + Layer.className.close).focus();
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

    setTimeout(function () {
      //웹접근성
      $(Layer.className.etc).attr('aria-hidden', true);
      if (Layer.openPop.length && $lastPop) $($lastPop).attr('aria-hidden', true);
      const $tit = $popup.find('.' + Layer.className.header + ' h1');
      if ($tit.length) {
        if ($tit.attr('id') == undefined) {
          $tit.attr('id', $id + 'Label');
          $popup.attr('aria-labelledby', $id + 'Label');
        } else {
          $popup.attr('aria-labelledby', $tit.attr('id'));
        }
      }

      //팝업안 swiper
      // if ($popup.find('.ui-swiper').length) ui.Swiper.update($popup.find('.ui-swiper'));

      //열기
      Body.lock();
      $popup.addClass(Layer.className.active);
      $popWrap.scrollTop(0);
      /*
      const $animation = $popWrap.find('[data-animation]');
      if ($animation.length) {
        $animation.each(function () {
          $(this).removeClass($(this).data('animation'));
        });
      }
      */

      //iframe
      if ($popup.find('iframe.load-height').length) ui.util.iframe();

      //focus
      if (!ui.mobile.any()) Layer.focusMove(tar);

      //position
      Layer.position(tar);
      let fixedChkIdx = 0;
      const fixedChk = function () {
        if (fixedChkIdx > 5) return;
        Layer.fixed($popWrap);
        fixedChkIdx += 1;
        setTimeout(function () {
          fixedChk();
        }, 100);
      };
      fixedChk();

      //resize
      setTimeout(function () {
        Layer.resize();
        ui.tab.resize();
      }, 10);

      //callback
      const transitionEndEvt = function () {
        setTimeout(function () {
          $popup.addClass(Layer.className.active + '-end');
        }, 100);
        $FocusEvt();
        $popup.trigger('Layer.show');
        dfd.resolve();
        $popup.off('transitionend', transitionEndEvt);
      };
      $popup.on('transitionend', transitionEndEvt);

      Layer.opening--;
    }, $openDelay);

    return dfd.promise();
  },
  close: function (tar) {
    const dfd = $.Deferred();
    const $popup = $(tar);
    if ($popup.hasClass('morphing') && !$popup.hasClass('morphing-close')) {
      Layer.morphing.close(tar).then(function () {
        dfd.resolve();
      });
      return;
    }
    if (!$popup.hasClass(Layer.className.active)) {
      dfd.reject();
      return console.log(tar, '해당팝업 안열려있음');
    }
    const $id = $popup.attr('id');
    let $lastPop = '';
    const $visible = $('.' + Layer.className.popup + '.' + Layer.className.active).length;

    Layer.openPop.splice(Layer.openPop.indexOf('#' + $id), 1);
    if (Layer.openPop.length) $lastPop = Layer.openPop[Layer.openPop.length - 1];
    if (!$popup.hasClass(Layer.className.alert)) {
      if (Layer.openPop.length) {
        let $last;
        $.each(Layer.openPop, function () {
          const $this = '' + this;
          if (!$($this).hasClass(Layer.className.alert)) $last = $this;
        });
        $($last).addClass(Layer.className.lastPopup);
      }
      $popup.removeClass(Layer.className.lastPopup);
    }
    if ($visible == 1) {
      Body.unlock();
      $(Layer.className.etc).removeAttr('aria-hidden');
    }
    if ($lastPop != '') $($lastPop).attr('aria-hidden', false);

    //포커스
    const $focusEvt = function () {
      const $returnFocus = $popup.data('returnFocus');
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
          if (mainWrapHeader.find('.head-back').length) {
            mainWrapHeader.find('.head-back').focus();
          } else if (mainWrapHeader.find('h1').length) {
            mainWrapHeader.find('h1').attr({ tabindex: 0 }).focus();
          } else {
            mainWrapHeader.attr({ tabindex: 0 }).focus();
          }
        } else {
          // $popup.find(':focus').blur();
          mainWrap.find(ui.className.body).find($focusableEl).first().focus();
        }
      }
    };
    setTimeout(function () {
      $focusEvt();
    }, 100);

    //닫기
    $popup.removeClass(Layer.className.active + '-end');
    /*
    if ($popup.find('.next-foot-fixed').length) {
      const $popWrap = $popup.find('.' + Layer.className.wrap);
      $popWrap.scrollTop(0);
    }
    */
    $popup.removeClass(Layer.className.active).data('focusMove', false).data('popPosition', false);
    $popup.attr('aria-hidden', 'true').removeAttr('tabindex aria-labelledby');

    const $closeAfter = function () {
      $popup.removeAttr('style');
      $popup
        .find('.' + Layer.className.header)
        .removeAttr('style')
        .find('h1')
        .removeAttr('tabindex');
      $popup.find('.' + Layer.className.body).removeAttr('tabindex style');
      $popup.find('.' + Layer.className.focusIn).removeAttr('tabindex');

      // 닫을 때 없어져야하는 요소
      if ($popup.find('.' + Layer.className.closeRemove).length) $popup.find('.' + Layer.className.closeRemove).remove();

      // 닫기 후 팝업 자체가 없어지는 케이스
      if ($popup.hasClass(Layer.className.alert) || $popup.hasClass(Layer.selectClass) || $popup.hasClass(Layer.className.removePopup)) {
        if ($popup.hasClass(Layer.selectClass)) Layer.isSelectOpen = false;
        if ($popup.hasClass(Layer.className.alert)) {
          const $content = $popup.find('.message>div').html();
        }
        $popup.remove();
      }
    };

    const transitionEndEvt = function () {
      $closeAfter();

      // $popup.addClass(Layer.className.active + '-end');
      $popup.trigger('Layer.hide');
      dfd.resolve();
      $popup.off('transitionend', transitionEndEvt);
    };
    $popup.on('transitionend', transitionEndEvt);

    /*
    const $wrap = $popup.find('.' + Layer.className.wrap);
    $wrap.on('transitionend', function () {
      $closeAfter();
      $wrap.off('transitionend');
    });
    */
    return dfd.promise();
  },

  alertHtml: function (type, popId, btnActionId, btnCancelId) {
    let $html = '<div id="' + popId + '" class="' + Layer.className.popup + ' modal alert ' + Layer.className.alert + '" role="dialog" aria-hidden="true">';
    $html += '<article class="' + Layer.className.wrap + '">';
    $html += '<header class="' + Layer.className.header + '"><div class="' + Layer.className.headerInner + '"><div class="' + Layer.className.headerLeft + ' full"><h1>안내</h1></div></div></header>';
    $html += '<main class="' + Layer.className.body + '">';
    $html += '<div class="' + Layer.className.inner + '">';
    if (type === 'prompt') {
      $html += '<div class="form-lbl mt-0">';
      $html += '<label for="inpPrompt" role="alert" aria-live="assertive"></label>';
      $html += '</div>';
      $html += '<div class="form-item">';
      $html += '<div class="input"><input type="text" id="inpPrompt" placeholder="입력해주세요."></div>';
      $html += '</div>';
    } else {
      $html += '<div class="message">';
      $html += '<div role="alert" aria-live="assertive"></div>';
      $html += '</div>';
    }
    $html += '</div>';
    $html += '</main>';
    $html += '<div class="btn-wrap ' + ui.className.bottomFixed.slice(1) + '">';
    $html += '<div class="flex full">';
    if (type === 'confirm' || type === 'prompt') {
      $html += '<button type="button" id="' + btnCancelId + '" class="button gray">취소</button>';
    }
    $html += '<button type="button" id="' + btnActionId + '" class="button primary">확인</button>';
    $html += '</div>';
    $html += '</div>';
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
    if (!!option.title || (typeof title === 'string' && title !== '')) {
      const $insertTit = typeof title === 'string' && title !== '' ? title : option.title;
      $pop.find('.' + Layer.className.wrap + ' h1').html($insertTit);
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
      };
      Layer.close('#' + $popId).then($actionEvt);
    });
    $cancelBtn.on('click', function () {
      const $cancelEvt = function () {
        dfd.reject();
      };
      Layer.close('#' + $popId).then($cancelEvt);
    });

    return dfd.promise();
  },
  alert: function (option, title, actionTxt, init) {
    const dfd = $.Deferred();
    Layer.alertEvt('alert', option, title, actionTxt, null, init).then(function () {
      dfd.resolve();
    });
    return dfd.promise();
  },
  confirm: function (option, title, actionTxt, cancelTxt, init) {
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
  prompt: function (option, title, actionTxt, cancelTxt, init) {
    const dfd = $.Deferred();
    Layer.alertEvt('prompt', option, title, actionTxt, cancelTxt, init).then(function (value) {
      dfd.resolve(value);
    });
    return dfd.promise();
  },
  alertKeyEvt: function () {
    //컨펌팝업 버튼 좌우 방할기로 포커스 이동
    $(document).on('keydown', '.' + Layer.className.alert + ' ' + ui.className.bottomFixed.slice(1) + ' .button', function (e) {
      const $keyCode = e.keyCode ? e.keyCode : e.which;
      let $tar = '';
      if ($keyCode == 37) $tar = $(this).prev();
      if ($keyCode == 39) $tar = $(this).next();
      if (!!$tar) $tar.focus();
    });
  },
  selectId: 'uiSelectLayer',
  selectIdx: 0,
  selectClass: 'ui-pop-select',
  select: function (target, col) {
    const $target = $(target);
    const $targetVal = $target.val();
    const $addClass = $target.data('class');
    const $type = $target.data('type');
    let $title = $target.attr('title');
    const $popId = Layer.selectId + Layer.selectIdx;
    const $length = $target.children().length;
    let $option = '';
    let $opDisabled = '';
    let $opTxt = '';
    let $opVal = '';
    let $popHtml = '';
    let $isFullPop = false;

    Layer.selectIdx++;
    if ($title == undefined) $title = '선택';
    const $monthTxt = function (txt) {
      let $txt = txt;
      const $split = $txt.split('.');
      if ($split.length == 2) {
        $txt = $split[0] + '년 ' + $split[1] + '월';
      } else if ($split.length == 3) {
        $txt = $split[0] + '년 ' + $split[1] + '월 ' + $split[2] + '일';
      } else {
        $txt = $split.join('.');
      }
      return $txt;
    };
    $popHtml += '<div id="' + $popId + '" class="' + Layer.className.popup + ' ' + ($isFullPop ? 'full' : 'bottom') + ' ' + Layer.selectClass + '" role="dialog" aria-hidden="true">';
    $popHtml += '<article class="' + Layer.className.wrap + '">';
    $popHtml += '<header class="' + Layer.className.header + '">';
    $popHtml += '<div class="' + Layer.className.headerInner + '">';
    $popHtml += '<div class="' + Layer.className.headerLeft + ' full">';
    $popHtml += '<h1>' + $title + '</h1>';
    $popHtml += '</div>';
    $popHtml += '<div class="' + Layer.className.headerRight + '">';
    $popHtml += Layer.closeBtn;
    $popHtml += '</div>';
    $popHtml += '</div>';
    $popHtml += '</header>';
    $popHtml += '<main class="' + Layer.className.body + '">';

    $popHtml += '<ul class="select-item-wrap';
    if (!!col) $popHtml += ' col' + col;
    if ($addClass) $popHtml += ' ' + $addClass;
    $popHtml += '">';
    for (let i = 0; i < $length; i++) {
      $option = $target.children().eq(i);
      $opDisabled = $option.prop('disabled');
      $opTxt = $option.data('txt') ? $option.data('txt') : $option.text();
      $opSub = $option.data('sub');
      $opVal = $option.attr('value');
      if ($opVal != '') {
        $popHtml += '<li>';
        $popHtml += '<div class="select-item' + ($targetVal == $opVal ? ' selected' : '') + '">';
        $popHtml += '<a href="#" class="ui-pop-select-btn' + ($opDisabled ? ' disabled' : '') + '" role="button" data-value="' + $opVal + '"';
        if ($targetVal == $opVal) $popHtml += ' title="' + ($opTxt.length > 20 ? $opTxt.substring(20, $opTxt.lastIndexOf('(')) : $opTxt) + ' 선택됨"';
        $popHtml += '>';
        // $popHtml += '<div class="checkbox ty2"><i aria-hidden="true"></i></div>';
        if ($opSub && $type === 'reverse') {
          $popHtml += '<div class="select-item-txt">' + $opSub + '</div>';
          $popHtml += '<div class="select-item-sub">' + $opTxt + '</div>';
        } else {
          if ($type === 'date') {
            $popHtml += '<div class="select-item-txt">' + $monthTxt($opTxt) + '</div>';
          } else {
            $popHtml += '<div class="select-item-txt">' + $opTxt + '</div>';
          }
          if ($opSub) $popHtml += '<div class="select-item-sub">' + $opSub + '</div>';
        }
        $popHtml += '</a>';
        $popHtml += '</div>';
        $popHtml += '</li>';
      }
    }
    $popHtml += '</ul>';
    $popHtml += '</main>';
    $popHtml += '</article>';
    $popHtml += '</div>';

    $('body').append($popHtml);

    $target.data('popup', '#' + $popId);
    const $pop = $('#' + $popId);
    $pop.on('click', '.ui-pop-select-btn', function (e) {
      e.preventDefault();
      if (!$(this).hasClass('disabled')) {
        const $btnVal = $(this).data('value');
        // const $btnTxt = $(this).text();
        $(this).parent().addClass('selected').closest('li').siblings().find('.selected').removeClass('selected');
        ui.form.selectSetVal($target, $btnVal);
        Layer.close('#' + $popId, function () {
          $target.change();
        });
      }
    });
  },
  isSelectOpen: false,
  selectOpen: function (select, e) {
    const $select = $(select);
    const $txtLengthArry = [];
    if ($select.prop('disabled')) return false;
    if ($select.find('option').length < 1) return console.log('select에 option 없음');
    if ($select.find('option').length == 1 && $select.find('option').val() == '') return console.log('select에 option의 value가 0이라 리턴');
    Layer.isSelectOpen = true;
    $select.find('option').each(function () {
      const $optVal = $(this).val();
      const $optTxt = $(this).text();
      if ($optVal != '') {
        $txtLengthArry.push($optTxt.length);
      }
    });
    Layer.select($select);

    const $pop = $select.data('popup');
    Layer.open($pop, function () {
      //if(!!e)$($pop).data('returnFocus',$currentTarget);
    });
  },
  selectUI: function () {
    //셀렉트 팝업
    $(document).on('click', '.ui-select-open', function (e) {
      e.preventDefault();
      let $select = '';
      if (Layer.isSelectOpen == false) {
        $select = $($(this).attr('href'));
        if (!$select.length) $select = $(this).prev('select');
        Layer.selectOpen($select, e);
      }
    });
    $(document).on('click', '.ui-select-lbl', function (e) {
      e.preventDefault();
      const $tar = $(this).is('a') ? $(this).attr('href') : '#' + $(this).attr('for');
      $($tar).next('.ui-select-open').focus().click();
    });
  },
  toast: function (txt, fn, type, delayTime) {
    if (type === undefined) type = 'toast';
    const $isAlarm = type === 'alarm';
    const $isFn = !!fn;
    const $className = '.' + type + '-box';

    if (delayTime == undefined) delayTime = 2000;

    let $boxHtml = '<div class="' + $className.substring(1) + '">';
    $boxHtml += '<div>';
    if ($isFn) {
      $boxHtml += '<a href="#" role="button" class="txt">' + txt + '</a>';
    } else {
      $boxHtml += '<div class="txt">' + txt + '</div>';
    }
    if ($isAlarm) {
      $boxHtml += '<button type="button" class="close" aria-label="닫기"></button>';
    }
    $boxHtml += '</div>';
    $boxHtml += '</div>';
    $('body').before($boxHtml);
    const $toast = $($className).last();
    const $toastClose = function () {
      $toast.removeClass('on');
      $toast.one('transitionend', function () {
        $(this).remove();
      });
    };
    const $bottomFixedSpace = $(ui.className.mainWrap + ':visible ' + ui.className.bottomFixedSpace);
    const $spaceH = $bottomFixedSpace.outerHeight();
    if ($spaceH) {
      // const $top = parseInt($toast.css('bottom'));
      // $toast.css('bottom', $top + $spaceH);
      $toast.css('bottom', $spaceH);
    }
    $toast.addClass('on');
    let $closeTime;
    if (!$isAlarm) {
      $closeTime = setTimeout($toastClose, delayTime);
    }
    if ($isFn) {
      $toast.find('a.txt').one('click', function (e) {
        e.preventDefault();
        fn();

        // 이벤트 실행시 바로 닫기
        clearTimeout($closeTime);
        $toastClose();
      });
    }
  },
  alarm: function (txt, fn, delayTime) {
    Layer.toast(txt, fn, 'alarm', delayTime);
  },

  resize: function () {
    const $popup = $('.' + Layer.className.popup + '.' + Layer.className.active);
    if (!$popup.length) return;
    const headHeight = function (headCont, contentCont) {
      const $headH = headCont.children().outerHeight();
      const $position = headCont.css('position');
      const $padTop = parseInt(contentCont.css('padding-top'));
      if ($headH > $padTop) {
        contentCont.css('padding-top', $headH);
      }
    };
    const bottomFixedHeight = function (fixedEl, bodyEl) {
      const $bottomFixedH = fixedEl.children().outerHeight();
      const $padBottom = parseInt(bodyEl.css('padding-bottom'));
      if ($bottomFixedH > $padBottom) bodyEl.css('padding-bottom', $bottomFixedH);
    };
    $popup.each(function () {
      const $this = $(this);
      const $wrap = $this.find('.' + Layer.className.wrap);
      const $head = $wrap.find('.' + Layer.className.header);
      const $body = $wrap.find('.' + Layer.className.body);
      const $bottomFixed = $body.siblings(ui.className.bottomFixed);
      // const $tit = $head.find('h1');

      $head.removeAttr('style');
      $body.removeAttr('tabindex style');

      const $bottomFixedH = $bottomFixed.outerHeight() ? $bottomFixed.outerHeight() : $bottomFixed.children().outerHeight();
      const $bodyPdB = parseInt($body.css('padding-bottom'));

      // if ($head.length) headHeight($head, $body);
      // if ($bottomFixed.length) bottomFixedHeight($bottomFixed, $body);
      if ($bottomFixed.length && ($bottomFixed.css('position') === 'fixed' || $bottomFixed.children().css('position') === 'fixed') && $bottomFixedH !== $bodyPdB) $body.css('padding-bottom', $bottomFixedH);

      //레이어팝업
      //컨텐츠 스크롤이 필요할때
      const $height = $this.height();
      // const  $popHeight = $this.find('.'+Layer.className.wrap).outerHeight();
      if ($this.hasClass('bottom') || $this.hasClass('modal')) $wrap.css('max-height', $height);

      //팝업 fixed
      Layer.fixed($wrap);

      //바텀시트 선택요소로 스크롤
      if ($this.hasClass(Layer.selectClass) && $this.find('.selected').length && !$wrap.hasClass('scrolling')) {
        const $headH = $head.outerHeight();
        const $wrapH = $wrap.outerHeight();
        const $wrapH2 = $wrap.get(0).scrollHeight;
        const $selected = $wrap.find('.selected');
        const $selectedH = $selected.outerHeight();
        const $selectedTop = $selected.position().top;

        if ($wrapH < $wrapH2) {
          $wrap.addClass('scrolling');
          const $sclTop = $selectedTop - $wrapH + $wrapH / 2 - $selectedH / 2 + $headH / 2;
          $wrap.animate({ scrollTop: $sclTop }, 300, function () {
            $wrap.removeClass('scrolling');
          });
        }
      }
    });
  },
  fixed: function (el) {
    //  pop fixed
    let $wrap = $(el);
    if ($wrap.find('.' + Layer.className.wrap).length) $wrap = $wrap.find('.' + Layer.className.wrap);
    if ($wrap.closest('.' + Layer.className.wrap).length) $wrap = $wrap.closest('.' + Layer.className.wrap);
    const $head = $wrap.find('.' + Layer.className.header);
    const $body = $wrap.find('.' + Layer.className.body);
    const $bottomFixed = $body.siblings(ui.className.bottomFixed);
    const $scrollTop = $wrap.scrollTop();
    const $scrollHeight = $wrap[0].scrollHeight;
    const $wrapHeight = $wrap.outerHeight();
    const $topClassName = ui.className.topFixed.slice(1);
    const $bottomClassName = 'ing-fixed';
    if ($head.length) {
      if ($scrollTop > 0) {
        $head.addClass($topClassName);
      } else {
        $head.removeClass($topClassName);
      }
    }

    if ($bottomFixed.length) {
      if ($scrollTop + $wrapHeight >= $scrollHeight - 10) {
        $bottomFixed.removeClass($bottomClassName);
      } else {
        $bottomFixed.addClass($bottomClassName);
      }
    }
    const $fixed = $wrap.find('.pop-fixed');
    const $wrapTop = $wrap.position().top;
    if ($fixed.length) {
      $fixed.each(function () {
        const $this = $(this);
        const $offsetTop = $this.data('top') !== undefined ? $this.data('top') : Math.max(0, getOffset(this).top);
        const $topMargin = getTopFixedHeight($this, $topClassName);
        let $topEl = $this;
        const $top = $offsetTop - $wrapTop;
        if ($scrollTop + $topMargin > $top) {
          $this.data('top', $offsetTop);
          $this.addClass($topClassName);
          if ($topEl.css('position') !== 'fixed' && $topEl.css('position') !== 'sticky') $topEl = $topEl.children();
          if ($topMargin !== parseInt($topEl.css('top')) && $topEl.css('position') === 'fixed') $topEl.css('top', $topMargin);
          // if ($head.hasClass($topClassName)) $head.addClass('end-fixed');
        } else {
          $this.removeData('top');
          if ($topEl.css('position') !== 'fixed' && $topEl.css('position') !== 'sticky') $topEl = $topEl.children();
          $topEl.removeCss('top');
          $this.removeClass($topClassName);
          // if (($head.hasClass($topClassName) && $wrap.find('.' + $topClassName).length === 1) || !$wrap.find('.' + $topClassName).length) $head.removeClass('end-fixed');
        }
      });
    }
  },
  position: function (tar) {
    const $popup = $(tar);
    if (!$popup.hasClass(Layer.className.active)) return false;
    if ($popup.data('popPosition') == true) return false;
    $popup.data('popPosition', true);
    let $wrap = $popup.find('.' + Layer.className.wrap);
    let $wrapH = $wrap.outerHeight();
    let $wrapSclH = $wrap[0].scrollHeight;
    const $head = $popup.find('.' + Layer.className.header);
    const $body = $popup.find('.' + Layer.className.body);
    const $bottomFixed = $body.siblings(ui.className.bottomFixed);
    let $bottomFixedH = 0;
    if ($bottomFixed.length) {
      $bottomFixedH = $bottomFixed.children().css('position') === 'fixed' ? $bottomFixed.children().outerHeight() : $bottomFixed.outerHeight();
    }

    const $btnTop = $popup.find(ui.className.btnTop);
    if ($btnTop.length) $btnTop.closest(ui.className.floatingBtn).css('bottom', !$bottomFixedH ? 24 : $bottomFixedH + 10);

    let $animation = $wrap.find('[data-animation]');
    if ($animation.length) {
      setTimeout(function () {
        ui.animation.sclCheckIn($animation, $wrap);
      }, 500);
    }

    let $lastSclTop = 0;
    let $timer;
    if (!$wrap.data('_ui-init')) {
      $wrap.data('_ui-init', true);
      $wrap.on('scroll', function () {
        const $this = $(this);
        const $wrapSclTop = $this.scrollTop();

        if ($wrapSclTop > ui.btnTop.min) {
          if ($('html').hasClass('input-focus') && ui.mobile.any()) return;
          ui.btnTop.on($btnTop);
        } else {
          ui.btnTop.off($btnTop);
        }

        // 고정확인
        Layer.fixed($this);
      });

      $wrap.on('click', function () {
        setTimeout(function () {
          $wrap.scroll();
        }, 50);
      });

      $wrap.on(
        'scroll resize',
        _.debounce(function () {
          $animation = $wrap.find('[data-animation]');
          if ($animation.length) ui.animation.sclCheckIn($animation, $wrap);
        }, 100)
      );
      $wrap.on(
        'scroll',
        _.debounce(function () {
          ui.btnTop.off($btnTop);
        }, 1500)
      );
    }

    Layer.resize();
    // Layer.fixed($wrap);
  },
  focusMove: function (tar) {
    if (!$(tar).hasClass(Layer.className.active)) return false;
    if ($(tar).data('focusMove') == true) return false;
    $(tar).data('focusMove', true);
    const $tar = $(tar);
    const $focusaEls = $tar.find($focusableEl);
    let $isFirstBackTab = false;

    $focusaEls.on('keydown', function (e) {
      const $keyCode = e.keyCode ? e.keyCode : e.which;
      const $focusable = $tar.find($focusableEl);
      const $focusLength = $focusable.length;
      const $firstFocus = $focusable.first();
      const $lastFocus = $focusable.last();
      const $index = $focusable.index(this);

      $isFirstBackTab = false;
      if ($index == $focusLength - 1) {
        //last
        if ($keyCode == 9) {
          if (!e.shiftKey) {
            $firstFocus.focus();
            e.preventDefault();
          }
        }
      } else if ($index == 0) {
        //first
        if ($keyCode == 9) {
          if (e.shiftKey) {
            $isFirstBackTab = true;
            $lastFocus.focus();
            e.preventDefault();
          }
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
  init: function () {
    if ($('.' + Layer.className.popup + '.' + Layer.className.active + '[aria-hidden="true"]').length) {
      Layer.open('.' + Layer.className.popup + '.' + Layer.className.active + '[aria-hidden="true"]');
    }

    $(document).on('click', $focusableEl, function (e) {
      Layer.openEl = e.currentTarget;
    });
    setTimeout(function () {
      Layer.openEl = '';
    }, 100);

    //열기
    $(document).on('click', '.ui-pop-open', function (e) {
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
    $(document).on('click', '.ui-pop-close', function (e) {
      e.preventDefault();
      let $pop = $(this).attr('href');
      if ($pop == '#' || $pop == '#none' || $pop == undefined) $pop = $(this).closest('.' + Layer.className.popup);
      if ($pop.length) Layer.close($pop);
    });

    Layer.alertKeyEvt();
    Layer.selectUI();

    // 알람박스 닫기
    $(document).on('click', '.alarm-box .close', function (e) {
      e.preventDefault();
      const $box = $(this).closest('.alarm-box');
      $box.removeClass('on');
      $box.on('transitionend', function () {
        $(this).remove();
      });
    });
  },
  tooltip: function (contents, title) {
    const tooltipPopId = 'uiPopToolTip';
    let $html = '<div id="' + tooltipPopId + '" class="' + Layer.className.popup + ' modal tooltip ' + Layer.className.removePopup + '" role="dialog" aria-hidden="true">';
    $html += '<article class="' + Layer.className.wrap + '">';
    if (title !== undefined && title !== '') {
      $html += '<header class="' + Layer.className.header + '">';
      $html += '<div class="' + Layer.className.headerInner + '">';
      $html += '<div class="' + Layer.className.headerLeft + '">';
      $html += '<h1>' + title + '</h1>';
      $html += '</div>';
      $html += '<div class="' + Layer.className.headerRight + '">';
      $html += Layer.closeBtn;
      $html += '</div>';
      $html += '</div>';
      $html += '</header>';
    }
    $html += '<div class="' + Layer.className.body + '">';
    $html += '<div class="' + Layer.className.inner + '">';
    if (title === undefined) {
      $html += Layer.closeBtn;
    }
    $html += contents;
    $html += '</div>';
    $html += '</div>';
    $html += '</article>';
    $html += '</div>';

    $('body').append($html);
    Layer.open('#' + tooltipPopId);
  },
  like: function () {
    const wrapClass = '.layer-like';
    const $delayTime = 2000;
    let $fileUrl = ui.basePath() + '/lottie/love.json';
    const $html = '<div class="' + wrapClass.slice(1) + '" aria-hidden="true"><div class="lottie" data-lottie="' + $fileUrl + '"></div></div>';
    if ($(wrapClass).length) return;
    // 넣고
    $('body').append($html);
    // 보여주고
    ui.common.lottie(
      function (target) {
        if ($(target).closest(wrapClass).length) {
          $(wrapClass).addClass('show');
        }
      },
      function (target) {
        if ($(target).closest(wrapClass).length) {
          $(wrapClass).removeClass('show');
          const $transitionend = function () {
            $(wrapClass).remove();
            $(wrapClass).off('transitionend', $transitionend);
          };
          $(wrapClass).on('transitionend', $transitionend);
        }
      }
    );
    /*
    setTimeout(function () {
      $('.layer-like')
      ui.common.lottie();
      // 숨기고
      setTimeout(function () {
        $('.layer-like').removeClass('show');
        // 지우고
        setTimeout(function () {
          $('.layer-like').remove();
        }, 310);
      }, $delayTime);
    }, 10);
    */
  }
};
Layer.morphing = {
  is: false,
  open: function (btn, target) {
    const dfd = $.Deferred();
    const $btn = $(btn);
    const $pop = $(target);
    const $currentTarget = $(btn);
    if (!$pop.length || Layer.morphing.is) return;
    Layer.morphing.is = true;
    Body.lock();
    let $bgEl;
    let $toMin;
    let $width;
    let $height;
    let $left;
    let $top;
    let $radius;
    let $scale;
    const $getScaleValue = function (topValue, leftValue, radiusValue) {
      const windowW = $(window).width();
      const windowH = $(window).height();
      const maxDistHor = leftValue > windowW / 2 ? leftValue : windowW - leftValue;
      const maxDistVert = topValue > windowH / 2 ? topValue : windowH - topValue;
      return Math.ceil(Math.sqrt(Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2)) / radiusValue);
    };
    const $wrap = $btn.closest(ui.className.wrap);
    $wrap.addClass('overflow-hidden');
    const $position = function () {
      const $popId = $pop.attr('id');
      $width = $btn.outerWidth();
      $height = $btn.outerHeight();
      const $offset = $btn.offset();
      $top = $offset.top - $(window).scrollTop();
      $left = $offset.left - $(window).scrollLeft();
      // $top = $offset.top - $wrap.offset().top;
      // $left = $offset.left - $wrap.offset().left;
      const $bg = $btn.css('background-color');
      const $border = $btn.css('border');
      const $borderWidth = parseInt($btn.css('border-width'));
      const $borderRadius = parseInt($btn.css('border-radius'));
      const $shadow = $btn.css('box-shadow');
      let $style = '';
      $style += 'left:' + $left + 'px;';
      $style += 'top:' + $top + 'px;';
      $style += 'width:' + $width + 'px;';
      $style += 'height:' + $height + 'px;';
      $style += 'border-radius:' + $borderRadius + 'px;';
      if ($bg !== 'rgba(0, 0, 0, 0)') $style += 'background:' + $bg + ';';
      if ($borderWidth) $style += 'border:' + $border + ';';
      if ($shadow !== 'none') $style += 'box-shadow:' + $shadow + ';';
      $bgEl = '.morphing-bg[data-pop="#' + $popId + '"]';
      if (!$($bgEl).length) {
        const $html = '<div class="morphing-bg" data-pop="#' + $popId + '" style="' + $style + '"></div>';
        $($pop).before($html);
      } else {
        $($bgEl).removeAttr('style').attr('style', $style);
      }

      $($bgEl).data('left', $left);
      $($bgEl).data('top', $top);
      $($bgEl).data('width', $width);
      $($bgEl).data('height', $height);
      $($bgEl).data('border-radius', $borderRadius);

      $toMin = $width < $height ? $width : $height;
      $radius = $toMin / 2;
      $scale = $getScaleValue($left, $top, $radius);
    };
    $position();
    setTimeout(function () {
      $btn.addClass('morphing-btn-hidden');
    }, 300);
    const tl = anime.timeline({
      // easing: 'easeOutExpo',
      // easing: 'linear',
      easing: 'easeOutQuad',
      duration: 300
    });
    tl.add({
      targets: $bgEl,
      opacity: 1
    })
      .add({
        targets: $bgEl,
        left: $left + ($width - $toMin) / 2 + 'px',
        top: $top + ($height - $toMin) / 2 + 'px',
        width: $toMin + 'px',
        height: $toMin + 'px',
        borderRadius: $radius + 'px'
      })
      .add({
        targets: $bgEl,
        duration: 500,
        scale: $scale * 1.5,
        complete: function () {
          Layer.open($pop).then(function () {
            $($pop).data('returnFocus', $currentTarget);
            dfd.resolve();
          });
        }
      });
    return dfd.promise();
  },
  close: function (target) {
    const dfd = $.Deferred();
    const $pop = $(target);
    const $btn = $pop.data('returnFocus');
    const $wrap = $btn.closest(ui.className.wrap);

    $pop.addClass('morphing-close');
    const $popClose = function () {
      const $popId = $pop.attr('id');
      const $bgEl = '.morphing-bg[data-pop="#' + $popId + '"]';
      const $left = $($bgEl).data('left');
      const $top = $($bgEl).data('top');
      console.log($left, $top);
      const $width = $($bgEl).data('width');
      const $height = $($bgEl).data('height');
      const $radius = $($bgEl).data('border-radius');
      const tl = anime.timeline({
        easing: 'easeOutQuad',
        duration: 300
      });
      tl.add({
        targets: $bgEl,
        duration: 500,
        scale: 1,
        complete: function () {
          $wrap.removeClass('overflow-hidden');
        }
      })
        .add({
          targets: $bgEl,
          left: $left,
          top: $top,
          width: $width,
          height: $height,
          borderRadius: $radius,
          complete: function () {
            $btn.removeClass('morphing-btn-hidden');
          }
        })
        .add({
          targets: $bgEl,
          opacity: 0,
          complete: function () {
            $($bgEl).remove();
            Layer.morphing.is = false;
          }
        });
    };
    Layer.close(target).then(function () {
      $pop.removeClass('morphing-close');
      $popClose();
      dfd.resolve();
    });
    return dfd.promise();
  }
};
