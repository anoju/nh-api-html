/********************************
 * front 유틸함수 *
 * 작성자: 안효주
 ********************************/
const getTopFixedHeight = function (element, className) {
  if (className == undefined) className = 'top-fixed';
  let $element = $(element);
  let $topFixedHeight = 0;
  const $plusHeight = function (target) {
    let $height = $(target).outerHeight();
    if ($(target).css('position') !== 'sticky') $height = $(target).children().outerHeight();
    $topFixedHeight += $height;
  };
  if ($('.' + className).length) {
    while (!$element.is('body')) {
      const $prevAll = $element.prevAll();
      if ($prevAll.length) {
        $prevAll.each(function () {
          const $this = $(this);
          if ($this.hasClass(className)) {
            $plusHeight($this);
          } else {
            const $child = $this.find('.' + className);
            if ($child.length) {
              $child.each(function () {
                $plusHeight(this);
              });
            }
          }
        });
      }
      $element = $element.parent();
    }
  }
  return $topFixedHeight;
};

const getOffset = function (element) {
  let $el = element;
  let $elX = 0;
  let $elY = 0;
  let isSticky = false;
  while ($el && !Number.isNaN($el.offsetLeft) && !Number.isNaN($el.offsetTop)) {
    let $style = window.getComputedStyle($el);
    // const $matrix = new WebKitCSSMatrix($style.transform);
    if ($style.position === 'sticky') {
      isSticky = true;
      $el.style.position = 'static';
    }
    $elX += $el.offsetLeft;
    // $elX += $matrix.m41; //translateX
    $elY += $el.offsetTop;
    // $elY += $matrix.m42;  //translateY
    if (isSticky) {
      isSticky = false;
      $el.style.position = '';
      if ($el.getAttribute('style') === '') $el.removeAttribute('style');
    }
    $el = $el.offsetParent;
    if ($el !== null) {
      $style = window.getComputedStyle($el);
      $elX += parseInt($style.borderLeftWidth);
      $elY += parseInt($style.borderTopWidth);
    }
  }
  return { left: $elX, top: $elY };
};

// Convert radians to degrees
const radToDeg = function (radians) {
  const pi = Math.PI;
  return radians * (180 / pi);
};

// 컬러가 어두운지 밝은지 확인
const getBgBrightValue = function (hexColor) {
  const c = hexColor.substring(1); // 색상 앞의 # 제거
  const rgb = parseInt(c, 16); // rrggbb를 10진수로 변환
  const r = (rgb >> 16) & 0xff; // red 추출
  const g = (rgb >> 8) & 0xff; // green 추출
  const b = (rgb >> 0) & 0xff; // blue 추출

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  // 색상 선택
  return luma;
};

//컬러값 변경
const hexToRgb = function (h) {
  let r = 0;
  let g = 0;
  let b = 0;
  // 3 digits
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
    // 6 digits
  } else if (h.length === 6) {
    r = parseInt(h[0] + h[1], 16);
    g = parseInt(h[2] + h[3], 16);
    b = parseInt(h[4] + h[5], 16);
  }
  return r + ',' + g + ',' + b;
};
const rgbToHex = function (r, g, b) {
  function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
const hex2rgba = function (str) {
  const num = parseInt(str.slice(1), 16); // Convert to a number
  const ary = [(num >> 16) & 255, (num >> 8) & 255, num & 255, (num >> 24) & 255];
  return ary.join(',');
};
const rgba2hex = function (rgba) {
  const $match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1);
  const $map = $match.map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', ''));
  const $rtnVal = $map.join('');
  return '#' + $rtnVal;
};

//br 태그 삽입
//brTxtInsert(엘리먼트,기준마크,최대글자수);
//brTxtInsert('.br-txt','/',7);
const brTxtInsert = function (el, mark, maxWordLength) {
  $(el).each(function () {
    const $text = $(this).text();
    if ($text.indexOf(mark) >= 0) {
      const $txtAry = $text.split(mark);
      let $insertTxt = '';
      let $wordLength = $insertTxt.length;
      let $row = 1;
      for (let i = 0; i < $txtAry.length; i++) {
        if (i != 0) {
          if ($wordLength + $txtAry[i].length + mark.length > maxWordLength * $row) {
            $insertTxt += '<br />';
            $row++;
            $wordLength = 0;
          }
          $insertTxt += mark;
        }
        $insertTxt += $txtAry[i];
        if ($wordLength == 0) {
          $wordLength = $txtAry[i].length + mark.length;
        } else {
          $wordLength = $insertTxt.length;
        }
      }
      $(this).html($insertTxt);
    }
  });
};

//넓이대비 삽입가능한 글자수 확인: 검증필요
//console.log(wordInsertCount(element));
const wordInsertCount = function (el) {
  const _this = $(el);
  const _thisFtSize = parseInt(_this.css('font-size'));
  const _thisWidth = _this.width();
  return Math.floor(_thisWidth / _thisFtSize);
};

//랜덤값 추출
const randomNumber = function (min, max, point) {
  let $rtnVal;
  if (point) {
    $rtnVal = (Math.random() * (max - min) + min).toFixed(point);
  } else if (point === 0) {
    $rtnVal = Math.floor(Math.random() * (max - min + 1) + min);
  } else {
    $rtnVal = Math.random() * (max - min) + min;
  }
  if ($rtnVal > max) $rtnVal = max;
  return $rtnVal;
};

//전화번호 포맷
const autoPhoneFormet = function (str, mark) {
  const $phone = str.replace(/[^0-9]/g, '');
  const $phoneAry = [];
  if (!mark) mark = '-';
  if ($phone.length < 4) {
    $phoneAry.push($phone);
  } else if (str.length < 8) {
    $phoneAry.push($phone.substr(0, 3));
    $phoneAry.push($phone.substr(3));
  } else if (str.length < 11) {
    $phoneAry.push($phone.substr(0, 3));
    $phoneAry.push($phone.substr(3, 3));
    $phoneAry.push($phone.substr(6));
  } else {
    $phoneAry.push($phone.substr(0, 3));
    $phoneAry.push($phone.substr(3, 4));
    $phoneAry.push($phone.substr(7));
  }
  return $phoneAry.join(mark);
};

//Input date
const autoDateFormet = function (str, mark) {
  const $date = str.replace(/[^0-9]/g, '');
  const $dateAry = [];
  if (!mark) mark = '.';
  if ($date.length < 5) {
    $dateAry.push($date);
  } else if (str.length < 7) {
    $dateAry.push($date.substr(0, 4));
    $dateAry.push($date.substr(4));
  } else {
    $dateAry.push($date.substr(0, 4));
    $dateAry.push($date.substr(4, 2));
    $dateAry.push($date.substr(6));
  }
  return $dateAry.join(mark);
};
const autoTimeFormet = function (str, mark) {
  const $time = str.replace(/[^0-9]/g, '');
  const $timeAry = [];
  if (!mark) mark = '.';
  if ($time.length <= 2) {
    $timeAry.push($time);
  } else if (str.length == 3 || str.length == 5) {
    $timeAry.push($time.substr(0, 1));
    $timeAry.push($time.substr(1, 2));
    if (str.length == 5) $timeAry.push($time.substr(3));
  } else if (str.length >= 4) {
    $timeAry.push($time.substr(0, 2));
    $timeAry.push($time.substr(2, 2));
    if (str.length > 4) $timeAry.push($time.substr(4));
  }
  return $timeAry.join(mark);
};

//파라미터 값 갖고오기
const getUrlParams = function () {
  const params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
    params[key] = value;
  });
  return params;
};

// 스토리지(localStorage, sessionStorage) 값 컨트롤
const uiStorage = {
  set: function (key, value, type) {
    let $storage = type === 'session' ? sessionStorage : localStorage;
    $storage.setItem(key, value);
  },
  get: function (key, type) {
    let $storage = type === 'session' ? sessionStorage : localStorage;
    const $value = $storage.getItem(key);
    return $value;
  },
  remove: function (key, type) {
    let $storage = type === 'session' ? sessionStorage : localStorage;
    $storage.removeItem(key);
  },
  clear: function (type) {
    let $storage = type === 'session' ? sessionStorage : localStorage;
    $storage.clear();
  }
};

// 쿠키 컨트롤
const uiCookie = {
  set: function (key, value, expireYn) {
    let cookieVal = key + '=' + value;
    if (expireYn == 1) cookieVal += '; expires=' + new Date().toString().split('+')[0] + ';';
    document.cookie = cookieVal;
  },
  get: function (key) {
    const cookieArry = document.cookie.split(';');
    let returnVal = '';
    for (let cI in cookieArry) {
      const cookieDataArry = String(cookieArry[cI]).split('=');
      if (String(cookieDataArry[0]).trim() == key && String(cookieDataArry[0]).trim() != '') {
        returnVal = String(cookieDataArry[1]).trim();
      }
    }
    return returnVal;
  }
};

//날짜구하기
const todayTimeString = function (addDay) {
  const $today = new Date();
  if (!!addDay) $today.setDate($today.getDate() + addDay);
  return timeString($today);
};
const timeString = function (date) {
  const $year = date.getFullYear();
  let $month = date.getMonth() + 1;
  let $day = date.getDate();
  let $hour = date.getHours();
  let $min = date.getMinutes();
  let $sec = date.getSeconds();
  if (('' + $month).length == 1) $month = '0' + $month;
  if (('' + $day).length == 1) $day = '0' + $day;
  if (('' + $hour).length == 1) $hour = '0' + $hour;
  if (('' + $min).length == 1) $min = '0' + $min;
  if (('' + $sec).length == 1) $sec = '0' + $sec;
  return '' + $year + $month + $day + $hour + $min + $sec;
};
const $dayLabelPrint = function () {
  const $today = new Date();
  const $week = ['일', '월', '화', '수', '목', '금', '토'];
  const $dayLabel = $week[$today.getDay()];
  return $dayLabel;
};
const $nowDateFull = parseInt(todayTimeString()); //년+월+일+시+분+초
const $nowDateHour = parseInt(todayTimeString().substr(0, 10)); //년+월+일+시
const $nowDateDay = parseInt(todayTimeString().substr(0, 8)); //년+월+일
const $nowDateMonth = parseInt(todayTimeString().substr(0, 6)); //년+월
const $nowDateOnlyFullTime = parseInt(todayTimeString().substr(8, 6)); //시+분
const $nowDateOnlyTime = parseInt(todayTimeString().substr(8, 4)); //시+분
const $nowDateOnlyYear = parseInt(todayTimeString().substr(0, 4)); //년
const $nowDateOnlyMonth = parseInt(todayTimeString().substr(4, 2)); //월
const $nowDateOnlyDay = parseInt(todayTimeString().substr(6, 2)); //일
const $nowDateOnlyHour = parseInt(todayTimeString().substr(8, 2)); //시
const $nowDateOnlyMin = parseInt(todayTimeString().substr(10, 2)); //분
const $nowDateOnlySec = parseInt(todayTimeString().substr(12, 2)); //초
const $nowDateDayLabel = $dayLabelPrint(); //요일
const $afterDateDay = function (day) {
  return parseInt(todayTimeString(day - 1).substr(0, 8));
};
//console.log($nowDateFull,$nowDateHour,$nowDateDay,$afterDateDay(7),$nowDateMonth,$nowDateOnlyFullTime,$nowDateOnlyTime,$nowDateOnlyYear,$nowDateOnlyMonth,$nowDateOnlyDay,$nowDateOnlyHour,$nowDateOnlyMin,$nowDateOnlySec)

//남은시간 체크 : DdayChk('2020-09-19 07:00:00');
const DdayChk = function (time) {
  const $timeArry = time.split(' ');
  let $openDay = onlyNumber($timeArry[0]);
  const $openTime = $timeArry[1].split(':');
  let $openHour = parseInt($openTime[0]);
  let $openMin = parseInt($openTime[1]);
  let $openSec = parseInt($openTime[2]);
  const $newDate = new Date();
  const $now = timeString($newDate);
  const $nowDay = parseInt($now.substr(0, 8));
  const $nowHour = parseInt($now.substr(8, 2));
  const $nowMin = parseInt($now.substr(10, 2));
  const $nowSec = parseInt($now.substr(12, 2));
  if ($nowSec > $openSec) {
    $openSec = $openSec + 60;
    $openMin--;
  }
  if ($nowMin > $openMin || $openMin < 0) {
    $openMin = $openMin + 60;
    $openHour--;
  }
  if ($nowHour > $openHour || $openHour < 0) {
    $openHour = $openHour + 24;
    $openDay--;
  }
  const $day = $openDay - $nowDay;
  if ($day < 0) return [0, 0, 0, 0];
  let $hour = $openHour - $nowHour;
  let $min = $openMin - $nowMin;
  let $sec = $openSec - $nowSec;
  if (('' + $hour).length == 1) $hour = '0' + $hour;
  if (('' + $min).length == 1) $min = '0' + $min;
  if (('' + $sec).length == 1) $sec = '0' + $sec;

  return [$day, $hour, $min, $sec];
};
const DdayChkHtml = function (element, completTime, callback) {
  const $repeat = setInterval(function () {
    let $timeHtml = '';
    const $Dday = DdayChk(completTime);
    if ($Dday[0] > 0) $timeHtml += '<span><strong>' + $Dday[0] + '</strong>일</span>';
    $timeHtml += '<span><strong>' + $Dday[1] + '</strong>시</span><span><strong>' + $Dday[2] + '</strong>분</span><span><strong>' + $Dday[3] + '</strong>초</span>';
    $(element).html($timeHtml);
    if ($Dday[0] == 0 && $Dday[1] == 0 && $Dday[2] == 0 && $Dday[3] == 0) {
      clearInterval($repeat);
      if (!!callback) callback();
    }
  }, 1000);
};

//byte 체크
const bytePrint = function (tar) {
  let $txt = $(tar).text();
  if ($(tar).is('input') || $(tar).is('select') || $(tar).is('textarea')) {
    $txt = $(tar).val();
  }
  return $txt.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g, '$&$1').length;
};

//숫자만
const onlyNumber = function (num) {
  return num.toString().replace(/[^0-9]/g, '');
};

//콤마넣기
const addComma = function (num) {
  try {
    str += '';
    const x = str.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  } catch (error) {
    console.error(error.name + ':' + error.message);
  }
};

//콤마빼기
const removeComma = function (num) {
  return num.toString().replace(/,/gi, '');
};

// 마스킹
const maskingText = function (str, count) {
  const $str = str.toString();
  return $str.substring(0, count) + $str.substring(count, str.length).replace(/(?<=.{0})./gi, '*');
};

//배열에서 문자열 찾기
const arrayIndexOf = function (array, str) {
  let $val = false;
  //for(let i in array){
  for (let i = 0; i < array.length; i++) {
    if (array[i].indexOf(str) >= 0) {
      $val = true;
    }
  }
  return $val;
};

//공백제거
const txtSpaceDel = function (txt) {
  return txt.replace(/(\s*)/g, '');
};

// \n to br
const nl2br = function (str) {
  // return str.replace(/\n/g, "<br />");
  return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
};

// img onerror 함수
const imgError = function (img) {
  if (img.tagName !== 'IMG') return;
  const $parent = $(img).closest('.img-box').length ? $(img).closest('.img-box') : $(img).parent();
  $parent.addClass('no-img-bg');
  // $(img).hide();
};

//****  as-is 함수추가  ******//
const getPageAjax = function (url, param) {
  var dfd = $.Deferred();

  $.ajax({
    type: 'get',
    url: url,
    data: param
  })
    .done(function (result, textStatus, jqXHR) {
      dfd.resolve(result, textStatus);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      dfd.reject();
    })
    .always(function (result, textStatus, jqXHR) {
      // 항상 실행할 코드
      // console.log(result);	// 테스트 코드
    });

  return dfd.promise();
};

// 전화번호 형태로 반환
function fn_getTelVal(val) {
  try {
    return val
      .replace(/[^0-9]/g, '')
      .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, '$1-$2-$3')
      .replace('--', '-');
  } catch (e) {
    return val;
  }
}
// 휴대폰 형태로 반환
function fn_getHpVal(val) {
  try {
    return val
      .replace(/[^0-9]/g, '')
      .replace(/(^01[0-9])([0-9]*)([0-9]{4})/, '$1-$2-$3')
      .replace('--', '-');
  } catch (e) {
    return val;
  }
}
// 숫자만 반환
function fn_getOnlyNumber(val) {
  try {
    return val.replace(/[^0-9]/g, '');
  } catch (e) {
    return val;
  }
}
// 숫자에 콤마 찍기
function fn_getCommaNumber(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 입력 형식 체크
function fn_checkValid(type, checkValue) {
  switch (type) {
    case 'number':
      var pattern = /^[0-9]$/i;
      return pattern.test(checkValue);
    case 'email':
      var pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      return pattern.test(checkValue);
    case 'tel':
      var pattern = /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})-([0-9]{3,4})-([0-9]{4})/;
      return pattern.test(checkValue);
    case 'hp':
      var pattern = /(^01[0-9]-([0-9]{3,4})-([0-9]{4}))/;
      return pattern.test(checkValue);
    default:
      return false;
  }
}
