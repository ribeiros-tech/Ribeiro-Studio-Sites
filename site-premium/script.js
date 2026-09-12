(function(){
'use strict';
var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var header=document.getElementById('header');

// --- HEADER SCROLL ---
window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>60)},{passive:true});

// --- MOBILE MENU ---
var menuBtn=document.getElementById('menuBtn');
var overlay=document.getElementById('mobileOverlay');
function toggleMenu(){menuBtn.classList.toggle('active');overlay.classList.toggle('active');document.body.classList.toggle('no-scroll')}
menuBtn.addEventListener('click',toggleMenu);
overlay.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){if(overlay.classList.contains('active'))toggleMenu()})});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.classList.contains('active'))toggleMenu()});

// --- SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var id=this.getAttribute('href');if(id==='#')return;e.preventDefault();
    var t=document.querySelector(id);if(t){window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-header.offsetHeight,behavior:rm?'auto':'smooth'})}
  })
});

// --- REVEAL ---
var reveals=document.querySelectorAll('.reveal');
function checkReveals(){var h=window.innerHeight;reveals.forEach(function(el,i){if(el.getBoundingClientRect().top<h*.88){if(!rm)el.style.transitionDelay=(i%5)*.06+'s';el.classList.add('visible')}})}
window.addEventListener('scroll',checkReveals,{passive:true});
checkReveals();

// --- COUNT UP ---
var nums=document.querySelectorAll('.diff-number[data-target]'),counted=false;
function animateNum(el){var target=+el.dataset.target,start=performance.now();function tick(now){var p=Math.min((now-start)/2000,1);el.textContent=Math.floor((1-Math.pow(1-p,3))*target);if(p<1)requestAnimationFrame(tick);else el.textContent=target}requestAnimationFrame(tick)}
function checkCount(){if(counted)return;var s=document.querySelector('.section-diff');if(s&&s.getBoundingClientRect().top<window.innerHeight*.8){counted=true;nums.forEach(animateNum)}}
window.addEventListener('scroll',checkCount,{passive:true});

// --- LIGHTBOX ---
var lightbox=document.getElementById('lightbox'),lbImg=document.getElementById('lightboxImg');
var lbClose=lightbox.querySelector('.lightbox-close'),lbPrev=lightbox.querySelector('.lightbox-prev'),lbNext=lightbox.querySelector('.lightbox-next');
var structItems=document.querySelectorAll('.struct-item[data-lightbox]'),lbIndex=0,lbImages=[];
structItems.forEach(function(item){var img=item.querySelector('img');if(img)lbImages.push(img.src)});
function openLB(i){lbIndex=i;lbImg.src=lbImages[i];lightbox.classList.add('active');document.body.classList.add('no-scroll')}
function closeLB(){lightbox.classList.remove('active');document.body.classList.remove('no-scroll')}
function navLB(d){lbIndex=(lbIndex+d+lbImages.length)%lbImages.length;lbImg.src=lbImages[lbIndex]}
structItems.forEach(function(item,i){item.addEventListener('click',function(){openLB(i)})});
lbClose.addEventListener('click',closeLB);lbPrev.addEventListener('click',function(){navLB(-1)});lbNext.addEventListener('click',function(){navLB(1)});
lightbox.addEventListener('click',function(e){if(e.target===lightbox)closeLB()});
document.addEventListener('keydown',function(e){if(!lightbox.classList.contains('active'))return;if(e.key==='Escape')closeLB();if(e.key==='ArrowLeft')navLB(-1);if(e.key==='ArrowRight')navLB(1)});
var tSX=0;
lightbox.addEventListener('touchstart',function(e){tSX=e.changedTouches[0].screenX},{passive:true});
lightbox.addEventListener('touchend',function(e){var d=tSX-e.changedTouches[0].screenX;if(Math.abs(d)>50)navLB(d>0?1:-1)},{passive:true});

// --- ACTIVE NAV ---
var sections=document.querySelectorAll('section[id]'),navLinks=document.querySelectorAll('.nav-link');
function highlightNav(){var y=window.scrollY+header.offsetHeight+120;sections.forEach(function(s){if(y>=s.offsetTop&&y<s.offsetTop+s.offsetHeight){navLinks.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+s.id)})}})}
window.addEventListener('scroll',highlightNav,{passive:true});
})();