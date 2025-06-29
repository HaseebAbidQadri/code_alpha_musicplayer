// Music Player JavaScript
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio-player');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.progress = document.getElementById('progress');
        this.progressBar = document.querySelector('.progress-bar');
        this.currentTimeEl = document.getElementById('current-time');
        this.durationEl = document.getElementById('duration');
        this.volumeSlider = document.getElementById('volume-slider');
        this.songTitle = document.getElementById('song-title');
        this.artistName = document.getElementById('artist-name');
        this.albumImage = document.getElementById('album-image');
        this.playlistItems = document.getElementById('playlist-items');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.repeatBtn = document.getElementById('repeat-btn');
        this.autoplayBtn = document.getElementById('autoplay-btn');
        
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffling = false;
        this.isRepeating = false;
        this.isAutoplay = true;
        
        // Sample playlist (you can replace with actual audio files)
        this.playlist = [
            {
                title: "Sample Song 1",
                artist: "Demo Artist",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                image: "https://via.placeholder.com/300x300/667eea/ffffff?text=Song+1"
            },
            {
                title: "Sample Song 2", 
                artist: "Demo Band",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                image: "https://via.placeholder.com/300x300/764ba2/ffffff?text=Song+2"
            },
            {
                title: "Sample Song 3",
                artist: "Demo Group",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", 
                image: "https://via.placeholder.com/300x300/f093fb/ffffff?text=Song+3"
            },
            {
                title: "Sample Song 4",
                artist: "Demo Solo",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                image: "https://via.placeholder.com/300x300/4facfe/ffffff?text=Song+4"
            },
            // Added new music tracks below
            {
                title: "Chill Vibes",
                artist: "Lo-Fi Beats",
                src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                image: "https://via.placeholder.com/300x300/43e97b/ffffff?text=Chill+Vibes"
            },
            {
                title: "Night Drive",
                artist: "Synthwave",
                src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                image: "https://via.placeholder.com/300x300/38f9d7/ffffff?text=Night+Drive"
            },
            {
                title: "Acoustic Breeze",
                artist: "Bensound",
                src: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
                image: "https://via.placeholder.com/300x300/f7971e/ffffff?text=Acoustic+Breeze"
            },
            {
                title: "Sunny",
                artist: "Bensound",
                src: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
                image: "https://via.placeholder.com/300x300/ffd200/333333?text=Sunny"
            },
            {
                title: "Energy",
                artist: "Bensound",
                src: "https://www.bensound.com/bensound-music/bensound-energy.mp3",
                image: "https://via.placeholder.com/300x300/ff0844/ffffff?text=Energy"
            },
            {
                title: "Your Song Title",
                artist: "Your Artist Name",
                src: "songs/your-song.mp3", // path to your mp3 file
                image: "images/your-cover.jpg" // path to your cover image (optional)
            },
            {
                title: "darkasht",
                artist: "unknown",
                src: "https://www.youtube.com/embed/51ZbhTVmvG0?si=XGaNlgzvWlqCqmyV" , // This will not play in <audio>, use a direct mp3/wav URL if possible
                image: "dj.jpg"
            }
            // ...add more songs as needed...
        ];
        
        this.init();
    }
    
    init() {
        this.loadSong(this.currentSongIndex);
        this.createPlaylist();
        this.attachEventListeners();
        this.setVolume(50);
    }
    
    attachEventListeners() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        
        // Volume slider
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('error', () => this.handleAudioError());
        
        // Additional controls
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboardControls(e));
    }
    
    loadSong(index) {
        const song = this.playlist[index];
        this.songTitle.textContent = song.title;
        this.artistName.textContent = song.artist;
        this.albumImage.src = song.image || "dj.jpg";
        this.audio.src = song.src;

        // Album image fallback if image fails to load
        this.albumImage.onerror = () => {
            this.albumImage.src = "dj.jpg";
        };

        // Update active playlist item
        this.updateActivePlaylistItem(index);
    }
    
    createPlaylist() {
        this.playlistItems.innerHTML = '';
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <div class="song-title">${song.title}</div>
                <div class="artist">${song.artist}</div>
            `;
            item.addEventListener('click', () => {
                this.currentSongIndex = index;
                this.loadSong(index);
                if (this.isPlaying) {
                    this.audio.play();
                }
            });
            this.playlistItems.appendChild(item);
        });
    }
    
    updateActivePlaylistItem(index) {
        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pauseSong();
        } else {
            this.playSong();
        }
    }
    
    playSong() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            document.querySelector('.music-player').classList.add('playing');
        }).catch((error) => {
            console.error('Error playing audio:', error);
            this.handleAudioError();
        });
    }

    pauseSong() {
        this.audio.pause();
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.querySelector('.music-player').classList.remove('playing');
    }
    
    previousSong() {
        if (this.isShuffling) {
            this.currentSongIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentSongIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.playlist.length - 1;
        }
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.playSong();
        }
    }
    
    nextSong() {
        if (this.isShuffling) {
            this.currentSongIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentSongIndex = this.currentSongIndex < this.playlist.length - 1 ? this.currentSongIndex + 1 : 0;
        }
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.playSong();
        }
    }
    
    setProgress(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        if (duration) {
            this.audio.currentTime = (clickX / width) * duration;
        }
    }
    
    updateProgress() {
        const { duration, currentTime } = this.audio;
        
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            this.progress.style.width = `${progressPercent}%`;
            
            this.currentTimeEl.textContent = this.formatTime(currentTime);
        }
    }
    
    updateDuration() {
        const duration = this.audio.duration;
        if (duration) {
            this.durationEl.textContent = this.formatTime(duration);
        }
    }
    
    setVolume(volume) {
        this.audio.volume = volume / 100;
        this.volumeSlider.value = volume;
        
        // Update volume icon
        const volumeIcon = document.querySelector('.volume-container .fa-volume-down');
        if (volume == 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (volume < 50) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }
    
    handleSongEnd() {
        if (this.isRepeating) {
            this.audio.currentTime = 0;
            this.playSong();
        } else if (this.isAutoplay) {
            this.nextSong();
        } else {
            this.pauseSong();
        }
    }
    
    handleAudioError() {
        console.error('Audio loading error');
        this.pauseSong();
        // Show a user-friendly message
        this.songTitle.textContent = 'Error loading audio';
        this.artistName.textContent = 'Please check the audio source';
        // Try to skip to next song if available
        setTimeout(() => {
            if (this.isAutoplay && this.playlist.length > 1) {
                this.nextSong();
            }
        }, 1500);
    }
    
    toggleShuffle() {
        this.isShuffling = !this.isShuffling;
        this.shuffleBtn.classList.toggle('active', this.isShuffling);
    }
    
    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        this.repeatBtn.classList.toggle('active', this.isRepeating);
    }
    
    toggleAutoplay() {
        this.isAutoplay = !this.isAutoplay;
        this.autoplayBtn.classList.toggle('active', this.isAutoplay);
    }
    
    handleKeyboardControls(e) {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                this.previousSong();
                break;
            case 'ArrowRight':
                this.nextSong();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const currentVolume = parseInt(this.volumeSlider.value);
                this.setVolume(Math.min(100, currentVolume + 10));
                break;
            case 'ArrowDown':
                e.preventDefault();
                const currentVol = parseInt(this.volumeSlider.value);
                this.setVolume(Math.max(0, currentVol - 10));
                break;
        }
    }
    
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// After class MusicPlayer definition and before DOMContentLoaded
function setupFileUpload(player) {
    const fileInput = document.getElementById('file-upload');
    if (!fileInput) return;
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            const url = URL.createObjectURL(file);
            const song = {
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: "Local File",
                src: url,
                image: "dj.jpg"
            };
            player.playlist.push(song);
            player.createPlaylist();
            player.currentSongIndex = player.playlist.length - 1;
            player.loadSong(player.currentSongIndex);
            player.playSong();
        }
    });
}

// Initialize the music player when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();

    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabSections = document.querySelectorAll('.tab-section');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabSections.forEach(sec => sec.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // Album art click to play/pause
    const albumArt = document.getElementById('album-art-click');
    const albumOverlay = albumArt.querySelector('.album-overlay');
    albumArt.addEventListener('click', () => {
        player.togglePlayPause();
    });

    // Update overlay icon on play/pause
    function updateOverlayIcon() {
        if (player.isPlaying) {
            albumOverlay.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            albumOverlay.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // Hook into play/pause for overlay icon
    const origPlaySong = player.playSong.bind(player);
    player.playSong = function() {
        origPlaySong();
        updateOverlayIcon();
    };
    const origPauseSong = player.pauseSong.bind(player);
    player.pauseSong = function() {
        origPauseSong();
        updateOverlayIcon();
    };
    updateOverlayIcon();

    // Add some visual feedback for interactions
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
    
    // Add loading state indication
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.addEventListener('loadstart', () => {
        document.querySelector('.album-art.neon-glow').style.opacity = '0.7';
    });
    
    audioPlayer.addEventListener('canplaythrough', () => {
        document.querySelector('.album-art.neon-glow').style.opacity = '1';
    });

    setupFileUpload(player);
});
