
/* Initiate beginning audio */
  loopify("audio/intro-final.mp3",ready);

    function ready(err,loop){
      if (err) {
        console.warn(err);
      }

        loop.play();

        /* Add listener to stop loop
        document.getElementById("#INSERT-ID-HERE").addEventListener("click",function(){
          loop.stop();
        });
        */
    }

    
