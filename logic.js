/******
Under the MIT License

Copyright (c) 2015 veltman
Copyright (c) 2021 Alex Cen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions.

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

alreadyPlaying = false; /*Check if user already clicked audio control*/
backupLoop = new Audio('audio/intro-final.mp3');
var source;
var gainNode;
function initiateLoop() {
    if (!alreadyPlaying){
      function loopify(uri,cb) {
      console.log('Trying to play audio');
        try {
        /* Tries to use webAudioAPI to create a context*/
        context = new (window.AudioContext || window.webkitAudioContext)(),
            request = new XMLHttpRequest();
        } catch (e) {
          console.log('Playing w/o webAudioAPI');
          /* If webAudioAPI not supported, do it manually */
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

          function play() {

            // Stop if it's already playing
            stop();

            // Create a new source (can't replay an existing source)
            source = context.createBufferSource();
            gainNode = context.createGain();
            source.connect(gainNode);
            gainNode.connect(context.destination);
            gainNode.gain.setValueAtTime(0.3, context.currentTime);

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

            /* Check how things are going */
            if(context.state=="running"){
              alreadyPlaying = true;
              console.log('Music by Alex (@mlpegasus on instagram)');
            } else {
                alert("You're using a browser that doesn't support background music.");
                
                /*This probably won't work either but it's worth a shot*/
                try {
                  backupLoop.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                  }, false);
                  backupLoop.play();
                } catch {
                  console.log('nothing works :(');
                }
              
            }
            
          /* Add listener to stop loop, or use context.suspend(); to suspend audio
          document.getElementById("#INSERT-ID-HERE").addEventListener("click",function(){
            loop.stop();
          });
          */
      }
    } else if (context.state != "running"){
      context.resume();
    }

  }
/* END OF LOOPIFY STUFF */

/* Toggle background music*/
  function toggleBackLoop(){
    if (context.state == "running"){
      context.suspend();
    } else {
      context.resume();
    }
  }

/* For the masochist */
  function hurtMe(){
    console.log("boil a frog slowly and it won't hop out.");
    gainNode.gain.exponentialRampToValueAtTime(1000, context.currentTime + 100);
  }

