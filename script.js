// Spotify Clone - JavaScript
// handles all the interactive stuff

// track play/pause state
var isPlaying = false;
var isLiked = false;

// toggle play pause
function togglePlay() {
    isPlaying = !isPlaying;
    var btn = document.getElementById('mainPlayBtn');
    
    if (isPlaying) {
        // pause icon (two vertical bars)
        btn.innerHTML = '&#9646;&#9646;';
    } else {
        // play icon
        btn.innerHTML = '&#9654;';
    }
}

// toggle heart / like button
function toggleHeart() {
    isLiked = !isLiked;
    var heartBtn = document.getElementById('heartBtn');
    
    if (isLiked) {
        heartBtn.innerHTML = '&#9829;'; // filled heart
        heartBtn.classList.add('liked');
    } else {
        heartBtn.innerHTML = '&#9825;'; // empty heart
        heartBtn.classList.remove('liked');
    }
}

// update the currently playing song info
function playSong(songTitle, artistName) {
    document.getElementById('songName').textContent = songTitle;
    document.getElementById('artistName').textContent = artistName;
    
    // auto start playing
    isPlaying = true;
    document.getElementById('mainPlayBtn').innerHTML = '&#9646;&#9646;';
    
    // reset progress bar
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
}

// seek on progress bar click
function seekTo(event) {
    var track = document.getElementById('progressTrack');
    var rect = track.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var totalWidth = rect.width;
    
    var percent = clickX / totalWidth;
    
    // clamp between 0 and 1
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    
    // update fill
    document.getElementById('progressFill').style.width = (percent * 100) + '%';
    
    // calculate time (total 3:33 = 213 seconds)
    var totalSeconds = 213;
    var currentSec = Math.round(percent * totalSeconds);
    var minutes = Math.floor(currentSec / 60);
    var seconds = currentSec % 60;
    
    // format seconds with leading zero
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    
    document.getElementById('currentTime').textContent = minutes + ':' + seconds;
}

// change volume
function changeVolume(event) {
    var track = event.currentTarget;
    var rect = track.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var percent = (clickX / rect.width) * 100;
    
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    
    document.getElementById('volumeFill').style.width = percent + '%';
}

// sidebar toggle for mobile
function toggleSidebar() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// close sidebar if clicked outside (mobile)
document.addEventListener('click', function(e) {
    var sidebar = document.querySelector('.sidebar');
    var hamburger = document.getElementById('hamburgerBtn');
    
    // only do this on mobile
    if (window.innerWidth <= 650) {
        if (!sidebar.contains(e.target) && e.target !== hamburger) {
            sidebar.classList.remove('open');
        }
    }
});

// nav link active state
var navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navLinks.forEach(function(l) {
            l.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// simulate progress bar moving when playing
// (just a simple timer - not perfect but works for demo)
var progressInterval;
var currentProgress = 68; // start at 68% (2:34 / 3:33)

function startProgress() {
    progressInterval = setInterval(function() {
        if (isPlaying) {
            currentProgress += 0.05;
            if (currentProgress >= 100) {
                currentProgress = 0;
                isPlaying = false;
                document.getElementById('mainPlayBtn').innerHTML = '&#9654;';
            }
            document.getElementById('progressFill').style.width = currentProgress + '%';
            
            // update time
            var totalSeconds = 213;
            var currentSec = Math.round((currentProgress / 100) * totalSeconds);
            var minutes = Math.floor(currentSec / 60);
            var seconds = currentSec % 60;
            if (seconds < 10) seconds = '0' + seconds;
            document.getElementById('currentTime').textContent = minutes + ':' + seconds;
        }
    }, 1000);
}

// start the progress simulation
startProgress();

// when seek happens, update currentProgress too
document.getElementById('progressTrack').addEventListener('click', function(e) {
    var rect = this.getBoundingClientRect();
    var percent = ((e.clientX - rect.left) / rect.width) * 100;
    currentProgress = Math.max(0, Math.min(100, percent));
});
