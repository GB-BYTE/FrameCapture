export function trimRange(duration,trim){
 const total=Number.isFinite(duration)&&duration>0?duration:.1;
 const start=Math.max(0,Math.min(total-.1,Number(trim?.start)||0));
 const end=Math.max(start+.1,Math.min(total,Number.isFinite(trim?.end)?trim.end:total));
 return {start,end,duration:end-start};
}
export const presets={small:{label:'Small file',video:2500000,audio:96000},balanced:{label:'Balanced',video:5000000,audio:128000},high:{label:'High quality',video:10000000,audio:192000}};
export function exportSettings(preset='balanced',fps=30,audio=true){const p=presets[preset]||presets.balanced;return {videoBitsPerSecond:Math.round(p.video*(fps>30?1.6:1)),audioBitsPerSecond:p.audio,audioRate:audio?p.audio:0};}
export function estimatedMB(duration,preset,fps,audio){const p=exportSettings(preset,fps,audio);return Math.max(0,duration)*(p.videoBitsPerSecond+p.audioRate)/8/1048576;}
