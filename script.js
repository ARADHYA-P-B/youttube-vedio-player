 const playpausebtn = document.querySelector(".play-pause-btn");
 const video = document.querySelector("video");
 const videocontainer = document.querySelector(".video-container");
 const theaterbtn = document.querySelector(".theater-btn");
 const miniplayerbtn = document.querySelector(".mini-player-btn");
 const fullscreenbtn = document.querySelector(".full-screen-btn")
 const volumeSlider = document.querySelector(".volume-slider");
 const mutebtn = document.querySelector(".mute-btn");
 const currenttime = document.querySelector(".current-time");
 const totaltime = document.querySelector(".total-time");
 const captionsbtn = document.querySelector(".captions-btn");
 const speedbtn = document.querySelector(".speed-btn");
 const privieqimg = document.querySelector(".preview-img");
 const thumbnailimg = document.querySelector(".thumbnail-img");
 const timelinecontainer = document.querySelector(".timeline-container");


  
 document.addEventListener("Keydown", e =>{

  const tagName = document.activeElement.tagName.toLowerCase();

  if(tagName === "input") return 
     switch(e.key.toLowerCase()){
         case " ":
          if(tagName === "button")return;
         case "k":
            togglepLay(); 
            break;
          case "f": 
            toggleFullscreenbtn();
            break;
          case "t":
            toogleTheaterbtn();
            break;
          case "i":
            toggleMiniplayerbtn();
            break;
          case "m":
            toggleMute();
            break;
          case "arrowleft":
            case "j":
            skip(-5);
            break;
          case "arrowright":
            case "l":
            skip(5);
            break;
             
     }
 })

 document.addEventListener("keyboard", e =>{
     
 })

 //timeline 
  timelinecontainer.addEventListener("mouseover",handletimeline);

 function handletimeline(e){
   const rect = timelinecontainer.getBoundingClientRect();
   const percent = Math.min(Math.max(0 , e.x -rect.x), rect.width) / rect.width;

   const previewimagenum = Math.max(1 ,Math.floor((percent * video.duration) /10));
   const previewimageSrc = `assets/previewimages${previewimagenum}.png`
   previewimageSrc.src=  previewimageSrc
   timelinecontainer.style.setProperty("--preview-position", percent);

   if(isScurbbing){
     e.preventdefault();
     thumbnailimg.src = previewimageSrc;
     timelinecontainer.style.setProperty("--preview-position",percent);

   }
 }
 

 //playback btn

 speedbtn.addEventListener("click",changleplabackbtn);

 function changleplabackbtn (){
      const newplaybackRate  = video.playbackRate + 0.25;
      if(newplaybackRate > 2) newplaybackRate = 0.25;
      video.playbackRate = newplaybackRate;
      speedbtn.textContent =`${newplaybackRate} x`;
 }
 //play pause video-player 

 playpausebtn.addEventListener("click" , togglepLay);
 video.addEventListener("click",togglepLay());
 
  
 function togglepLay(){
     video.paused ? video.play() : video.pause()
 }

 video.addEventListener("play",() =>{
       videocontainer.classList.remove("paused");
 })

 video.addEventListener("pause",() =>{
    videocontainer.classList.add("paused");
})


//viwed modes 

theaterbtn.addEventListener("click",toogleTheaterbtn);
miniplayerbtn.addEventListener("click",toggleMiniplayerbtn);
fullscreenbtn.addEventListener("click",toggleFullscreenbtn);

function toogleTheaterbtn(){
      videocontainer.classList.toggle("theater");
}
 
 function toggleFullscreenbtn(){
      if(document.fullscreenElement ==  null)
      {
        videocontainer.requestFullscreen();
      }else{
        document.exitFullscreen();
         
      }
 }
 document.addEventListener("fullscreenchange",() =>{
     videocontainer.classList.toggle("full-screen",document.fullscreenElement);
 })



 function toggleMiniplayerbtn(){
    if(videocontainer.classList.contains("mini-player"))
    {
      document.exitPictureInPicture();
    }else{
     video.requestPictureInPicture();
       
    }
}

video.addEventListener("enterpictureinpicture",() =>{
     videocontainer.classList.add("mini-player")
})

video.addEventListener("leavepictureinpicture",() =>{
    videocontainer.classList.remove("mini-player")
})



 //volume


 mutebtn.addEventListener("click", toggleMute)
 volumeSlider.addEventListener("input", e =>{

     video.volume= e.target.value;
     video.muted = e.target.value === 0;
 })

 function toggleMute() {
     video.muted = !video.muted;
 }

 video.addEventListener("volumechange", () =>{
     volumeSlider.value = video.volume;
     let volumeLevel;

     if(video.muted || video.volume === 0){
      volumeSlider.value = 0;
       volumeLevel ="muted"
     }else if( video.volume >= 0.5){
          volumeLevel ="high";
     }
     else{
      volumeLevel ="low";
     }
         
    videocontainer.dataset.volumeLevel = volumeLevel;
 }) 

 //Duration

 video.addEventListener("loadeddata",() =>{
      totaltime.textContent = formateDuration (video.duration);
 })

 video.addEventListener("timeupdate",() =>{
    currenttime.textContent = formateDuration(video.currentTime);
    const percent = video.currentTime / video.duration;
    timelinecontainer.style.setProperty("--prgress-position",percent);
 })

 const leadingzeroformater = new Intl.NumberFormat(undefined, {
     minimumFractionDigits: 2,
 })

 function formateDuration (time){
        const seconds = Math.floor(time % 60);
        const minites = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);
  
        if(hours === 0){
           return `${minites}:${leadingzeroformater.format(seconds)}`;
           
        }  else{
          return `${hours}:${leadingzeroformater.format(minites)}`;
           
        }
 }

 //skip 

 function skip(duration){
     video.currenttime += duration;
 }


 //captions 

 const captions = video.textTracks[0];
 captions.mode ="hidden";
 
 captionsbtn.addEventListener("click",toggleCaptions );


 function toggleCaptions(){
     
  const ishidden = captions.mode === "hidden";
  captions.mode =ishidden ? "showing" : "hidden";

  videocontainer.classList.toggle("captions" ,ishidden);
 }
