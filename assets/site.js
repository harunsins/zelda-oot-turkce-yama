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
  const output=document.querySelector('#music-volume-value');
  const widget=document.querySelector('.music-widget');
  const expand=document.querySelector('#volume-expand');
  if(audio&&muteButton&&volume&&output&&widget){
    const get=(key,def)=>{try{return localStorage.getItem(key)??def}catch(_e){return def}};
    const timeGet=()=>{try{return +sessionStorage.getItem('zelda-music-time')||0}catch(_e){return 0}};
    let wanted=get('zelda-music-on','true')!=='false';
    let active=false;
    let value=Math.min(100,Math.max(0,Number(get('zelda-music-volume','75'))||75));
    volume.value=value;
    function updateVolume(){audio.volume=Math.min(1,Number(volume.value)/100*.28);output.textContent=volume.value+'%'}
    function sync(){muteButton.setAttribute('aria-pressed',String(active));muteButton.setAttribute('aria-label',active?'Müziği kapat':'Müziği aç');muteButton.title=active?'Müziği kapat':'Müziği aç';muteButton.querySelector('[data-icon-on]').hidden=!active;muteButton.querySelector('[data-icon-off]').hidden=active}
    const start=async()=>{if(!wanted)return;try{await audio.play();active=!audio.paused}catch(_e){active=false}sync()};
    function stop(){audio.pause();active=false;sync()}
    updateVolume();sync();
    audio.addEventListener('loadedmetadata',()=>{const t=timeGet();if(t>0&&t<audio.duration-0.5)audio.currentTime=t},{once:true});
    if(audio.readyState>=1){const t=timeGet();if(t>0&&t<audio.duration-0.5)audio.currentTime=t}
    muteButton.addEventListener('click',()=>{
      if(!audio.paused){wanted=false;stop()}else{wanted=true;start()}
      try{localStorage.setItem('zelda-music-on',String(wanted))}catch(_e){}
    });
    volume.addEventListener('input',()=>{updateVolume();try{localStorage.setItem('zelda-music-volume',volume.value)}catch(_e){}});
    expand?.addEventListener('click',()=>widget.dataset.volumeOpen=widget.dataset.volumeOpen==='true'?'false':'true');
    document.addEventListener('pointerdown',e=>{if(widget.dataset.volumeOpen==='true'&&!widget.contains(e.target))widget.dataset.volumeOpen='false'});
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