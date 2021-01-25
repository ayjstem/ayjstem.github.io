/******
LOOPIFY UNDER MIT LICENSE 
MODIFIED From https://github.com/veltman/loopify
*/
alreadyPlaying = false;
function initiateLoop() {
    if (!alreadyPlaying){
      alreadyPlaying = true;
      console.log('soothing loop on :) Music by Alex (@mlpegasus on instagram)');
      function loopify(uri,cb) {
      
        try {
        var context = new (window.AudioContext || window.webkitAudioContext)(),
            request = new XMLHttpRequest();
        } catch (e) {
          backupLoop = new Audio('audio/intro-final.mp3');
          backupLoop.addEventListener('ended', function() {
              this.currentTime = 0;
              this.play();
          }, false);
          backupLoop.play();
        }

        request.responseType = "arraybuffer";
        request.open("GET", uri, true);

        // XHR failed
        request.onerror = function() {
          cb(new Error("Couldn't load audio from " + uri));
        };

        // XHR complete
        request.onload = function() {
          context.decodeAudioData(request.response,success,function(err){
            // Audio was bad
            cb(new Error("Couldn't decode audio from " + uri));
          });
        };

        request.send();

        function success(buffer) {

          var source;

          function play() {

            // Stop if it's already playing
            stop();

            // Create a new source (can't replay an existing source)
            source = context.createBufferSource();
            source.connect(context.destination);

            // Set the buffer
            source.buffer = buffer;
            source.loop = true;

            // Play it
            source.start(0);

          }

          function stop() {

            // Stop and clear if it's playing
            if (source) {
              source.stop();
              source = null;
            }

          }

          cb(null,{
            play: play,
            stop: stop
          });

        }

      }

      loopify.version = "0.1";

      if (typeof define === "function" && define.amd) {
        define(function() { return loopify; });
      } else if (typeof module === "object" && module.exports) {
        module.exports = loopify;
      } else {
        this.loopify = loopify;
      }

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
    }

  }