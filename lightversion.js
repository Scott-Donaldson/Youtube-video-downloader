// This is a lightweight version of my original code, its a mess I know. But this one is a really simple hacked together script that
// allows the user to (with some knowledge of NodeJS and Code) download almost any youtube video they want! This is specifically
// designed for playlists but there is a function to download just a single video if you want that!


const ytdl = require('ytdl-core');
const ffmpeg = require ('fluent-ffmpeg');
const fs = require('fs');
const readline = require('readline');
const ytlist = require('youtube-playlist');

let SaveDir = './downloaded2';  
if(!fs.existsSync(SaveDir)){ 
    fs.mkdirSync(SaveDir);
    console.log("Created: " + SaveDir + " to store files");
}
async function downloadVideo(ID){
    ytdl.getInfo(ID, (err,info) =>{
        try{
            let VideoTitle = info.title;
            let EscTitle = VideoTitle.replace(/([/,\(, ,\),\.\],\[,\-,\|,\:,\!,\"])+/g,"");
            let VideoStream = ytdl(ID,{
                quality: 'highestaudio'
            });
            let TimeMark = Date.now();
            ffmpeg(VideoStream)
                .audioBitrate(128)
                .save(`${SaveDir}/${EscTitle}.mp3`)
                .on('progress', (p) => {
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`${p.targetSize}kb downloaded`);
                    })
                .on('end',()=>{
                    console.log(`\nDownloaded ${VideoTitle} - ${(Date.now() - TimeMark) / 1000}s`)
            })
        }catch(err){
            console.log(`Video Failed:` + err);
        }
    })
}
async function downloadVideos(PlaylistURL){
    await ytlist(PlaylistURL, 'url').then(res=>{
        console.log(`${res.data.playlist.length} Videos Loaded`);
        let VideoArray = res.data.playlist;
        for(ID of VideoArray){
            downloadVideo(ID);
        }
    })
}
downloadVideos('PLAYLIST GOES HERE FULL URL');
