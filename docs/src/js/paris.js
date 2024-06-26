(function(){
  document.addEventListener("DOMContentLoaded", function() {
    // 유효하지 않은 버튼 a 링크 이벤트 처리
    const invalidButtons = document.querySelectorAll('.invalid');
    invalidButtons && (
      invalidButtons.forEach(function(items){
        items.addEventListener('click', function(e){
          e.preventDefault();
        })
      })
    )
    // 상단 GNB Scroll fixed Event
    const fixedEl = document.querySelector('.nav');
    // const fixedElTop = fixedEl.getBoundingClientRect().top;
    const fixedElTop = fixedEl?.offsetTop;
    function fixedEvent(){
      if(window.scrollY >= fixedElTop){
        fixedEl?.classList.add('fixed');
        document.body.style.paddingTop = fixedEl.offsetHeight + 'px';
      } else {
        fixedEl?.classList.remove('fixed');
        document.body.style.removeProperty('padding-top');
      }
    }
    window.addEventListener('scroll', function(){
      fixedEvent();
    })
    // a 태그가 아닌 요소에 href 링크 추가
    const linkElements = document.querySelectorAll('.link_el');
    linkElements.forEach(function(items){
      items.addEventListener('click', function(){
        const href = items.getAttribute('data-href');
        if(href){
          window.location.href = href;
        }
      })
    })

    // 기사 내용 중 다크모드 일부 반영 안된 부분 수정
    const articlesFontElements = document.querySelectorAll('div.news_view div.view_cont font');
    if(articlesFontElements){
      articlesFontElements.forEach((function(items){
        items.removeAttribute('color');
      }))
    }
  })
})()

function isiOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
function setIOS(){
  if (isiOS()) {
    document.body.classList.add('ios');
  }
}

function setRankTopClass(){
  const rankNum = document.querySelectorAll('.num');
  for(let i = 0; i < 5; i++){
    rankNum[i].classList.add('top_rank')
  }
}

function closeEventsLayer(body, layerWrap, currentEl){
  const close = document.querySelectorAll('.close_button');
  close.forEach((function(items){
    items.addEventListener('click', function(){
      layerWrap.classList.remove('active'); 
      body.removeChild(layerWrap);
      body.style.removeProperty('overflow');
      currentEl?.classList.remove('active');
    })
  }))
}

function viewAllEventsLayer(layerPop){
  const button = document.querySelector('.view_all_events_button');
  const body = document.querySelector('.body');
  const layerWrap = document.createElement('div');
  button.addEventListener('click', function(){
    body.appendChild(layerWrap);
    body.style.overflow = 'hidden';
    layerWrap.className = "dimmed_animation close_button";
    layerWrap.innerHTML = layerPop;
    this.classList.add('active');
    setTimeout(() => {
      layerWrap.classList.add('active');
    },100)
    closeEventsLayer(body, layerWrap, this);
  })
}

// fixed top scroll buttons
function debounce(func, wait, immediate){
  let timeout;
  return function(){
    const context = this;
    const args = arguments;
    const later = function(){
      timeout = null;
      if(!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if(callNow) func.apply(context, args);
  }
}
const handleScroll = debounce(function(){
  const scrollPosition = window.scrollY;
  const targetElement = document.querySelector('.scroll_btns_wrap');
  if(targetElement){
    if(scrollPosition >= 150){
      targetElement.classList.add('active');
    } else {
      targetElement.classList.remove('active');
    }
  }
}, 200); // 200ms 디바운스 설정
window.addEventListener('scroll', handleScroll);

function setSlideAnchor(){
  const swiperAnchor = document.querySelectorAll('.swiper_anchor');
  const swipers = document.querySelectorAll('.swiper-slide');
  const nav = document.querySelector('.nav');
  if(swiperAnchor.length > 0 && swipers && nav){
    swipers.forEach(function(items){  

      const setSplit = !window.location.search.includes('&') ? '?' : '&';
      const setUrl = window.location.search.split(setSplit)[window.location.search.split(setSplit).length - 1];

      if(items.id !== '' && items.id === setUrl){
        const anchor = items.closest('.component_wrap');
        setTimeout(() => {
          window.scrollTo({
            top: anchor.offsetTop - nav.offsetHeight
          })
        }, 300);
      }
    })
  }
}

function setSwiper(){
  setSlideAnchor();
  const swipers = document.querySelectorAll('.swiper-container');
  swipers.forEach(function(items, index){
    let options = {
      spaceBetween: 20,
      resistanceRatio: 0,
      pagination: {
        el: swipers[index].querySelector('.swiper-pagination'),
      },
      navigation: {
        nextEl: swipers[index].querySelector('.next'),
        prevEl: swipers[index].querySelector('.prev')
      }
    }
    if(items.classList.contains('photo_swiper')){
      options = {
        ...options,
        // freeMode:true,
        slidesPerView: 'auto',
        spaceBetween: 12,
      }
    }
    if(items.classList.contains('news_swiper')){
      options = {
        ...options,
        // autoHeight: true
      }
    }
    if(items.classList.contains('paging_swiper')){
      options = {
        ...options,
        slidesPerView: 4,
        spaceBetween: 8,
        slidesPerGroup: 4,
        navigation: {
          nextEl: document.querySelector('.paging_swiper_container .next'),
          prevEl: document.querySelector('.paging_swiper_container .prev')
        }
      }
    }
    // slide Anchor
    const getIdString = items.querySelectorAll('.swiper-slide')[0].id.replace(/[0-9]/g, "");
    const setSplit = !window.location.search.includes('&') ? '?' : '&';
    const setUrl = window.location.search.split(setSplit)[window.location.search.split(setSplit).length - 1];
    const getUrlString = setUrl.replace(/[0-9]/g, "");
   
    const setSwiper =  new Swiper(items, options);
    if(getIdString === getUrlString){
      const anchorSlides = items.querySelectorAll('.swiper-slide');
      anchorSlides.forEach(function(items, idx){
        if(items.id !== "" && items.id === setUrl){
          setSwiper.slideTo(idx);
        }
      })
    }

    // slide Anchor when a tag includes current className 
    const swiperTabs = items.querySelectorAll('.swiper-slide > a');
    swiperTabs.forEach(function(items, idx){
      if(items.classList.contains('current')){
        setSwiper.slideTo(idx);
      }
    })

  });
}

function setPollBg(){
  const nav = document.querySelector('.nav');
  nav.classList.add('poll');
}

function viewPollInfo(contents){
  const pollContents = document.querySelector('.poll_contents');
  const pollInfoLayer = document.createElement('div');
  const pollInfoButton = document.querySelector('.button_info');
  pollInfoLayer.className = "poll_info_pop";
  pollInfoButton.addEventListener('click', function(){
    pollContents.appendChild(pollInfoLayer);
    pollInfoLayer.innerHTML = contents;
    closeEventsLayer(pollContents, pollInfoLayer);
  })
}

function setAnchor(){
  const anchorTargets = document.querySelectorAll('.anchor');
  const nav = document.querySelector('.nav');
  if(anchorTargets && nav){
    anchorTargets.forEach(function(items){
      if(items.id === window.location.search.split('&')[window.location.search.split('&').length - 1]){
        setTimeout(() => {
          window.scrollTo({
            top: items.offsetTop - nav.offsetHeight
          })
        }, 300);
      }
    })
  }
}

function setHorizontalScroll(pageType){
  const xScroll = document.querySelector('.xscroll');
  const scrollItems = document.querySelectorAll('.xscroll > li > a')
  const setWidth = pageType === 'event' ? 92 : 8
  scrollItems.forEach(function(items){
    if(items.classList.contains('active')){
      xScroll.scrollLeft = items.getBoundingClientRect().left -setWidth;
    }
  })
}

function setTimeScroll(paramTime){
  const times = document.querySelectorAll('.time > dt > span');
  const nav = document.querySelector('.nav');
  let isModule;
  let scrollTarget;
  times.forEach(function(items){
    const eachTimes = items.textContent.replace(":", "");
    if(paramTime >= eachTimes){
      items.closest('li').classList.add('set_times');
    }
  })
  const setTimes = document.querySelectorAll('.set_times');
  const currentGame = setTimes[setTimes.length - 1];

  if(document.querySelector('.schedule_wrap')){
    isModule = false;
    scrollTarget = window;
  } else {
    isModule = true;
    scrollTarget = document.querySelector('.schedule_list');
  }
  
  if(times && nav){
    setTimeout(() => {
      scrollTarget.scrollTo({
        top: currentGame.offsetTop + (isModule ? 0 : -nav.offsetHeight)
      })
    }, 300);
  }
}