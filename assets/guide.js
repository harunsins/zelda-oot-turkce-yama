(()=>{
  const scene=document.querySelector('#demo-desktop');if(!scene)return;
  const title=document.querySelector('#step-title');
  const desc=document.querySelector('#step-description');
  const progress=[...document.querySelectorAll('[data-guide-step]')];
  const check=document.querySelector('#config-row');
  const playButton=document.querySelector('#guide-play');
  const slow=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const stages=[
    {title:'1. Oyunun mod menüsünü aç',desc:'Emülatörde Zelda oyununa sağ tıkla. Açılan menüde mod dosyalarının konumunu açma seçeneğini bul.'},
    {title:'2. Mod dizinine git',desc:'“Open Mod Data Location” (Mod Konumunu Aç) seçeneğine tıkla. Emülatörüne göre seçeneğin adı değişebilir.'},
    {title:'3. Türkçe yama klasörünü taşı',desc:'İndirdiğin ZIP içindeki “TurkceYama” klasörünü, açılan mod dizinine sürükle. Mevcut yamayı önce yedekle.'},
    {title:'4. Yamayı etkinleştir',desc:'Oyuna sağ tıklayıp “Configure Game” seçeneğini aç. Modlar bölümünden “TurkceYama” kutucuğunu işaretle.'},
    {title:'5. Kurulum tamam',desc:'Oyunun dilini American English olarak seçip başlat. Menülerin ve konuşmaların Türkçe görünmesi gerekir.'}
  ];
  let current=0,playing=!slow,timer=null,checkTimer=null;
  function draw(){
    scene.dataset.stage=String(current);
    title.textContent=stages[current].title;desc.textContent=stages[current].desc;
    progress.forEach((b,i)=>b.setAttribute('aria-current',i===current?'step':'false'));
    check.classList.toggle('checked',current===4);
    clearTimeout(checkTimer);
    if(current===3)checkTimer=setTimeout(()=>check.classList.add('checked'),1600);
    playButton.textContent=playing?'Durdur':'Oynat';
    playButton.setAttribute('aria-label',playing?'Animasyonu durdur':'Animasyonu oynat');
  }
  function step(i){current=(i+stages.length)%stages.length;draw();resetTimer()}
  function resetTimer(){clearInterval(timer);if(playing)timer=setInterval(()=>{current=(current+1)%stages.length;draw()},5200)}
  document.querySelector('#guide-prev')?.addEventListener('click',()=>step(current-1));
  document.querySelector('#guide-next')?.addEventListener('click',()=>step(current+1));
  playButton?.addEventListener('click',()=>{playing=!playing;draw();resetTimer()});
  progress.forEach((b,i)=>b.addEventListener('click',()=>step(i)));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInterval(timer)}else resetTimer()});
  draw();resetTimer();
})();