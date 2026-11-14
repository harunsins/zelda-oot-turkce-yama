(()=>{
  const root=document.documentElement;
  const themeButtons=[...document.querySelectorAll('[data-theme-choice]')];
  function updateTheme(theme,save){
    const chosen=theme==='light'?'light':'dark';
    root.dataset.theme=chosen;
    themeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===chosen)));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',chosen==='light'?'#f8f0df':'#101b15');
    if(save)try{localStorage.setItem('zelda-oot-theme',chosen);}catch(_e){}
  }
  themeButtons.forEach(b=>b.addEventListener('click',()=>updateTheme(b.dataset.themeChoice,true)));
  updateTheme(root.dataset.theme==='light'?'light':'dark',false);
  const audio=document.querySelector('#page-music');
  const muteButton=document.querySelector('#music-toggle');
  const volume=document.querySelector('#music-volume');
  const readout=document.querySelector('#music-readout');
  const widget=document.querySelector('.music-widget');
  if(audio&&muteButton&&volume&&readout&&widget){
    const get=(key,def)=>{try{return localStorage.getItem(key)??def}catch(_e){return def}};
    const timeGet=()=>{try{return +sessionStorage.getItem('zelda-music-time')||0}catch(_e){return 0}};
    let wanted=get('zelda-music-on','true')!=='false';
    let active=false;
    let raw=Number(get('zelda-music-volume','75'));
    let value=Number.isFinite(raw)?Math.min(100,Math.max(0,raw)):75;
    let resetBadgeTimer=null;
    volume.value=String(Math.round(value));
    function updateVolume(){
      const v=Math.round(Number(volume.value));
      audio.volume=Math.max(0,Math.min(1,v/100*.28));
      volume.style.setProperty('--fill',v+'%');
      readout.textContent=v+'%';
    }
    function sync(){
      muteButton.setAttribute('aria-pressed',String(active));
      muteButton.setAttribute('aria-label',active?'Müziği kapat':'Müziği aç');
      muteButton.title=active?'Müziği kapat':'Müziği aç';
      muteButton.querySelector('[data-icon-on]').hidden=!active;
      muteButton.querySelector('[data-icon-off]').hidden=active;
    }
    function showReadout(){
      if(resetBadgeTimer)clearTimeout(resetBadgeTimer);
      widget.dataset.adjusting='true';
    }
    function hideReadout(delay=500){
      if(resetBadgeTimer)clearTimeout(resetBadgeTimer);
      resetBadgeTimer=setTimeout(()=>{widget.dataset.adjusting='false'},delay);
    }
    const start=async()=>{if(!wanted)return;try{await audio.play();active=!audio.paused}catch(_e){active=false}sync()};
    function stop(){audio.pause();active=false;sync()}
    updateVolume();sync();
    audio.addEventListener('loadedmetadata',()=>{const t=timeGet();if(t>0&&t<audio.duration-.5)audio.currentTime=t},{once:true});
    if(audio.readyState>=1){const t=timeGet();if(t>0&&t<audio.duration-.5)audio.currentTime=t}
    muteButton.addEventListener('click',()=>{
      if(!audio.paused){wanted=false;stop()}else{wanted=true;start()}
      try{localStorage.setItem('zelda-music-on',String(wanted))}catch(_e){}
    });
    volume.addEventListener('pointerdown',showReadout);
    volume.addEventListener('input',()=>{
      showReadout();updateVolume();
      try{localStorage.setItem('zelda-music-volume',volume.value)}catch(_e){}
      hideReadout(900);
    });
    volume.addEventListener('pointerup',()=>hideReadout(550));
    volume.addEventListener('pointercancel',()=>hideReadout(350));
    volume.addEventListener('keyup',()=>hideReadout(550));
    volume.addEventListener('blur',()=>hideReadout(350));
    document.addEventListener('pointerup',()=>{if(widget.dataset.adjusting==='true')hideReadout(550)});
    audio.addEventListener('pause',()=>{active=false;sync()});
    audio.addEventListener('play',()=>{active=true;sync()});
    document.addEventListener('pointerdown',e=>{if(!wanted||!audio.paused||widget.contains(e.target))return;start()},{passive:true});
    document.addEventListener('keydown',e=>{if(!wanted||!audio.paused||['Tab','Shift','Control','Alt','Meta'].includes(e.key))return;start()});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){try{sessionStorage.setItem('zelda-music-time',audio.currentTime)}catch(_e){}}});
    window.addEventListener('pagehide',()=>{try{sessionStorage.setItem('zelda-music-time',audio.currentTime)}catch(_e){}});
    start();
  }
  const links=[...document.querySelectorAll('[data-shot]')];
  const box=document.querySelector('#lightbox');
  if(links.length&&box){
    const image=box.querySelector('#lightbox-img');const caption=box.querySelector('#lightbox-caption');
    let current=0;
    const show=(i)=>{current=(i+links.length)%links.length;const a=links[current];image.src=a.getAttribute('href');image.alt=a.querySelector('img').alt;caption.textContent=a.dataset.caption+' · '+(current+1)+' / '+links.length};
    links.forEach((a,i)=>a.addEventListener('click',e=>{if(!box.showModal)return;e.preventDefault();show(i);box.showModal()}));
    box.querySelector('#close-shot').addEventListener('click',()=>box.close());
    box.querySelector('#prev-shot').addEventListener('click',()=>show(current-1));
    box.querySelector('#next-shot').addEventListener('click',()=>show(current+1));
    box.addEventListener('click',e=>{if(e.target===box)box.close()});
    box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1)}if(e.key==='ArrowRight'){e.preventDefault();show(current+1)}});
    box.addEventListener('close',()=>image.removeAttribute('src'));
  }
})();