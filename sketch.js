const synth = window.speechSynthesis;
const voices = speechSynthesis.getVoices();
console.log(voices[4]);
let voice = undefined;

 
function setup() {
  // put setup code here
  noLoop();
}

function draw() {
  // put drawing code here
}

function keyPressed() {
    if (keyCode === 32) {
      speak();
      cd.lastClapTime = Date.now()
    }
}

function speak() {
          const time = new Date();
        const hours = time.getHours() + " hours,";
        const minutes = time.getMinutes() + " minutes, and ";
        const seconds = time.getSeconds() + "seconds.";
        const utterThis = new SpeechSynthesisUtterance(hours + minutes + seconds);
        utterThis.voice = voice;
        utterThis.rate = 0.5;
        // utterThis.lang = "fr-FR";
        synth.speak(utterThis);
      };
setTimeout(function() {
voice = speechSynthesis.getVoices()[14];
}, 100);
setTimeout(function() {
voice = speechSynthesis.getVoices()[14];
}, 200);
setTimeout(function() {
voice = speechSynthesis.getVoices()[14];
}, 300);
setTimeout(function() {
voice = speechSynthesis.getVoices()[14];
}, 400);



let ClapDetector = function() {
    this.lastClapTime = 0
    this.detectClap = this.detectClap.bind(this)

    this.audioContext = new AudioContext()
    this.analyserNode = this.audioContext.createAnalyser()
    // high frequency, short fft size
    this.analyserNode.fftSize = 2048
    this.analyserNode.minDecibels = -90
    this.analyserNode.maxDecibels = -10
    this.analyserNode.smoothingTimeConstant = 0.85

    this.bufferLength = this.analyserNode.frequencyBinCount
    this.frequencyData = new Uint8Array(this.bufferLength)
    this.clapListeners = []
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaStreamSource = this.audioContext.createMediaStreamSource(stream)
      // connect the mediaStreamSource to the analyserNode
      mediaStreamSource.connect(this.analyserNode)
      this.start()
    })

  };


ClapDetector.prototype.start = function() {
    this.frameRequest = requestAnimationFrame(this.detectClap)
  }

ClapDetector.prototype.stop = function() {
    cancelAnimationFrame(this.frameRequest)
  }

ClapDetector.prototype.detectClap = function() {
    this.analyserNode.getByteFrequencyData(this.frequencyData)

    const highFrequencyData = this.frequencyData.slice(
      Math.round(2200 / this.audioContext.sampleRate * this.bufferLength),
      Math.round(2800 / this.audioContext.sampleRate * this.bufferLength)
    )
    const highFrequencyEnergy = highFrequencyData.reduce((sum, value) => sum + value) / highFrequencyData.length
    //console.log(highFrequencyEnergy)

    const metClapThreshold = highFrequencyEnergy > 70
    const timeSinceLastClap = Date.now() - this.lastClapTime;
    const metMinClapInterval = timeSinceLastClap > 8000
    if (metClapThreshold && metMinClapInterval) {
      console.log('Clap detected!');
      setTimeout(function() {speak()}, 500);
      this.lastClapTime = Date.now()
      this.clapListeners.forEach(listener => listener())
    }

    this.frameRequest = requestAnimationFrame(this.detectClap)
  }

  
  // add listener
ClapDetector.prototype.onClap = function(listener) {
    this.clapListeners.push(listener)
  }
  // remove listener
ClapDetector.prototype.offClap = function(listener) {
    this.clapListeners = this.clapListeners.filter(l => l !== listener)
  };
let cd = new ClapDetector();
// cd.start();