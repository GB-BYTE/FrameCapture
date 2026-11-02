// Judge a render by playback progress, not the estimated recording length.
// Native recordings can have timestamps that differ from the wall-clock timer.
export function createPlaybackMonitor({now=()=>performance.now(),stallMs=45000}={}) {
 let lastTime=-1,lastProgress=now();
 return {check(currentTime){const time=Number(currentTime);if(Number.isFinite(time)&&time>lastTime+.01){lastTime=time;lastProgress=now();}return now()-lastProgress>=stallMs;}};
}
