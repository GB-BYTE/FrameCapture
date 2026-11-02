const http=require('node:http'),{spawn}=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
const url='http://127.0.0.1:4318';
function probe(){return new Promise(resolve=>{const req=http.get(url+'/health',r=>{let body='';r.on('data',c=>body+=c);r.on('end',()=>resolve(body==='FrameCapture'));});req.setTimeout(1000,()=>req.destroy());req.on('error',()=>resolve(false));});}
async function main(){if(!await probe()){const log=fs.openSync(path.join(__dirname,'server.log'),'a');const child=spawn(process.execPath,[path.join(__dirname,'serve.cjs')],{cwd:__dirname,detached:true,windowsHide:true,stdio:['ignore',log,log],env:{...process.env,PORT:'4318'}});child.unref();fs.closeSync(log);let ready=false;for(let n=0;n<30;n++){await new Promise(r=>setTimeout(r,200));if(await probe()){ready=true;break;}}if(!ready)throw Error('Could not start FrameCapture. Port 4318 may be occupied. See server.log.');}
 if(process.argv.includes('--check')){console.log('FrameCapture is ready at '+url);return;}
 const child=spawn('cmd.exe',['/d','/c','start','',url],{windowsHide:true,stdio:'ignore'});child.on('error',e=>{console.error(e.message);process.exitCode=1;});child.unref();}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
