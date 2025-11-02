function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clockDisplay').innerHTML = h + " : " + m + " : " + s;
    setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}

let isPlaying = false;
let currentTrack = 0;
const audio = new Audio();
audio.volume = 0.5;

const tracks = [
    { name: "Die Toteninsel Emptiness", file: "audios/Die Toteninsel Emptiness.mp3" }
];
        
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        event.target.textContent = '▶';
    } else {
        if (!audio.src) {
            audio.src = tracks[currentTrack].file;
        }
        audio.play();
        event.target.textContent = '⏸';
        document.getElementById('trackName').textContent = '♪ ' + tracks[currentTrack].name;
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    audio.src = tracks[currentTrack].file;
    if (isPlaying) {
        audio.play();
    }
    document.getElementById('trackName').textContent = '♪ ' + tracks[currentTrack].name;
}
        
function previousTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    audio.src = tracks[currentTrack].file;
    if (isPlaying) {
        audio.play();
    }
    document.getElementById('trackName').textContent = '♪ ' + tracks[currentTrack].name;
}

audio.addEventListener('ended', function() {
    nextTrack();
    if (isPlaying) {
        audio.play();
    }
});

const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~§€¥£¢₹₽¿¡';
const originalText = 'The signal is weak but persistent.';
const glitchElement = document.getElementById('glitchText');
let glitchInterval;
        
function glitchText() {
    let glitched = '';
    for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.4 && originalText[i] !== ' ') {
            glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
            glitched += originalText[i];
        }
    }
    glitchElement.textContent = glitched;
}
        
function startGlitching() {
    glitchInterval = setInterval(glitchText, 80);
    setTimeout(() => {
        clearInterval(glitchInterval);
        glitchElement.textContent = originalText;
    }, 2000);
}

setInterval(startGlitching, 4000);

setTimeout(startGlitching, 1000);

const discordid = "348236384449986560";
const api = `https://api.lanyard.rest/v1/users/${discordid}`;

async function updatediscordstatus() {
    try {
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await response.json();

        if (data.success && data.data) {
            const { activities, discord_status } = data.data;

            updateonlinestatus(discord_status);
            updatelistening(activities);
            updateplaying(activities);
        }
    } catch (error) {
        console.error("Failed to fetch Lanyard data:", error)
    }
}

function updateonlinestatus(status) {
    // Target the first sidebar, second sidebar-section, second paragraph, span
    const statuselement = document.querySelector(".sidebar:first-child .sidebar-section:nth-of-type(2) p:nth-of-type(2) span");
    if (!statuselement) {
        console.log("Status element not found");
        return;
    }

    const statusmap = {
        "online": { color: "#00ff9f", text: "● Online"},
        "idle": { color: "#ffa500", text: "● Idle"},
        "dnd": { color: "#ff0000", text: "● Do Not Disturb"},
        "offline": { color: "#747f8d", text: "● Offline"}
    };

    const statusinfo = statusmap[status] || statusmap["offline"];
    statuselement.style.color = statusinfo.color;
    statuselement.textContent = statusinfo.text;
}

function updatelistening(activities) {
    // Target the first sidebar, first sidebar-section, first status-item
    const statusitem = document.querySelector(".sidebar:first-child .sidebar-section:first-of-type .status-item:nth-of-type(1)");
    if (!statusitem) {
        console.log("Listening element not found");
        return;
    }
    
    const musicactivity = activities.find(a =>
        a.type === 2 || a.name === "Apple Music"
    );

    if (musicactivity) {
        const artist = musicactivity.state || "Unknown Artist";
        const song = musicactivity.details || "Unknown Song";
        statusitem.innerHTML = `<u> Listening to</u>: ${song} - ${artist}`;
    } else {
        statusitem.innerHTML = `<u> Listening to</u>: None`;
    }
}

function updateplaying(activities) {
    // Target the first sidebar, first sidebar-section, fourth status-item
    const statusitem = document.querySelector(".sidebar:first-child .sidebar-section:first-of-type .status-item:nth-of-type(4)");
    if (!statusitem) {
        console.log("Playing element not found");
        return;
    }
    
    const excludedapps = ["Apple Music", "Spotify", "Youtube Music"];
    const gameactivity = activities.find(a =>
        a.type === 0 && !excludedapps.includes(a.name)
    );

    if (gameactivity) {
        statusitem.innerHTML = `<u> Playing</u>: ${gameactivity.name}`;
    } else {
        statusitem.innerHTML = `<u> Playing</u>: None`;
    }
}

updatediscordstatus();
setInterval(updatediscordstatus, 5000);