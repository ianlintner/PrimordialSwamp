import Phaser from 'phaser';
import { MUSIC_TRACKS, SOUND_EFFECTS, AMBIENT_SOUNDS, AudioAsset } from '../config/assets';

/**
 * AudioManager - Singleton for managing all game audio
 * Handles music, sound effects, and ambient sounds with volume control
 */
export class AudioManager {
  private static instance: AudioManager;
  private scene: Phaser.Scene | null = null;
  private currentMusic: Phaser.Sound.BaseSound | null = null;
  private currentAmbient: Phaser.Sound.BaseSound | null = null;
  private masterVolume: number = 1.0;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private isMuted: boolean = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Initialize the audio manager with a scene
   */
  initialize(scene: Phaser.Scene): void {
    this.scene = scene;
    this.loadVolumeSettings();
  }

  /**
   * Load volume settings from localStorage
   */
  private loadVolumeSettings(): void {
    try {
      const settings = localStorage.getItem('primordialSwamp_audioSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.masterVolume = parsed.masterVolume ?? 1.0;
        this.musicVolume = parsed.musicVolume ?? 0.5;
        this.sfxVolume = parsed.sfxVolume ?? 0.7;
        this.isMuted = parsed.isMuted ?? false;
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error);
    }
  }

  /**
   * Save volume settings to localStorage
   */
  private saveVolumeSettings(): void {
    try {
      localStorage.setItem('primordialSwamp_audioSettings', JSON.stringify({
        masterVolume: this.masterVolume,
        musicVolume: this.musicVolume,
        sfxVolume: this.sfxVolume,
        isMuted: this.isMuted,
      }));
    } catch (error) {
      console.warn('Failed to save audio settings:', error);
    }
  }

  /**
   * Play background music
   */
  playMusic(key: string, fadeIn: boolean = true): void {
    if (!this.scene) return;

    const track = MUSIC_TRACKS.find(t => t.key === key);
    if (!track) {
      console.warn(`Music track not found: ${key}`);
      return;
    }

    // Stop current music
    if (this.currentMusic) {
      if (fadeIn) {
        this.scene.tweens.add({
          targets: this.currentMusic,
          volume: 0,
          duration: 500,
          onComplete: () => {
            this.currentMusic?.stop();
            this.currentMusic = null;
            this.startMusic(key, track, fadeIn);
          },
        });
      } else {
        this.currentMusic.stop();
        this.currentMusic = null;
        this.startMusic(key, track, fadeIn);
      }
    } else {
      this.startMusic(key, track, fadeIn);
    }
  }

  /**
   * Start playing music track
   */
  private startMusic(key: string, track: AudioAsset, fadeIn: boolean): void {
    if (!this.scene || !this.scene.sound.get(key)) {
      console.warn(`Music not loaded: ${key}`);
      return;
    }

    const volume = this.calculateVolume(track.volume ?? 0.5, 'music');
    
    this.currentMusic = this.scene.sound.add(key, {
      loop: track.loop ?? true,
      volume: fadeIn ? 0 : volume,
    });

    if (!this.isMuted) {
      this.currentMusic.play();
      
      if (fadeIn) {
        this.scene.tweens.add({
          targets: this.currentMusic,
          volume: volume,
          duration: 1000,
        });
      }
    }
  }

  /**
   * Stop current music
   */
  stopMusic(fadeOut: boolean = true): void {
    if (!this.currentMusic || !this.scene) return;

    if (fadeOut) {
      this.scene.tweens.add({
        targets: this.currentMusic,
        volume: 0,
        duration: 500,
        onComplete: () => {
          this.currentMusic?.stop();
          this.currentMusic = null;
        },
      });
    } else {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  /**
   * Play a sound effect
   */
  playSFX(key: string): void {
    if (!this.scene || this.isMuted) return;

    const effect = SOUND_EFFECTS.find(s => s.key === key);
    if (!effect) {
      console.warn(`Sound effect not found: ${key}`);
      return;
    }

    if (!this.scene.sound.get(key)) {
      console.warn(`Sound not loaded: ${key}`);
      return;
    }

    const volume = this.calculateVolume(effect.volume ?? 0.7, 'sfx');
    this.scene.sound.play(key, { volume });
  }

  /**
   * Play ambient sound
   */
  playAmbient(key: string): void {
    if (!this.scene) return;

    const ambient = AMBIENT_SOUNDS.find(a => a.key === key);
    if (!ambient) {
      console.warn(`Ambient sound not found: ${key}`);
      return;
    }

    // Stop current ambient
    if (this.currentAmbient) {
      this.currentAmbient.stop();
    }

    if (!this.scene.sound.get(key)) {
      console.warn(`Ambient not loaded: ${key}`);
      return;
    }

    const volume = this.calculateVolume(ambient.volume ?? 0.3, 'sfx');
    
    this.currentAmbient = this.scene.sound.add(key, {
      loop: true,
      volume: this.isMuted ? 0 : volume,
    });

    if (!this.isMuted) {
      this.currentAmbient.play();
    }
  }

  /**
   * Stop ambient sound
   */
  stopAmbient(): void {
    if (this.currentAmbient) {
      this.currentAmbient.stop();
      this.currentAmbient = null;
    }
  }

  /**
   * Calculate actual volume based on settings
   */
  private calculateVolume(baseVolume: number, type: 'music' | 'sfx'): number {
    const typeVolume = type === 'music' ? this.musicVolume : this.sfxVolume;
    return baseVolume * typeVolume * this.masterVolume;
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
    this.saveVolumeSettings();
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateMusicVolume();
    this.saveVolumeSettings();
  }

  /**
   * Set SFX volume
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveVolumeSettings();
  }

  /**
   * Toggle mute
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.updateAllVolumes();
    this.saveVolumeSettings();
    return this.isMuted;
  }

  /**
   * Safely set volume on a sound object, handling different Phaser sound implementations
   */
  private setSoundVolume(sound: Phaser.Sound.BaseSound, volume: number): void {
    // Check if the sound has a setVolume method (WebAudioSound and HTML5AudioSound both have it)
    if ('setVolume' in sound && typeof (sound as Phaser.Sound.WebAudioSound).setVolume === 'function') {
      (sound as Phaser.Sound.WebAudioSound).setVolume(volume);
    }
  }

  /**
   * Update all playing audio volumes
   */
  private updateAllVolumes(): void {
    this.updateMusicVolume();
    if (this.currentAmbient) {
      const ambientAsset = AMBIENT_SOUNDS.find(a => 
        this.currentAmbient && this.scene?.sound.get(a.key) === this.currentAmbient
      );
      const baseVolume = ambientAsset?.volume ?? 0.3;
      this.setSoundVolume(
        this.currentAmbient,
        this.isMuted ? 0 : this.calculateVolume(baseVolume, 'sfx')
      );
    }
  }

  /**
   * Update music volume
   */
  private updateMusicVolume(): void {
    if (this.currentMusic) {
      const musicAsset = MUSIC_TRACKS.find(m => 
        this.currentMusic && this.scene?.sound.get(m.key) === this.currentMusic
      );
      const baseVolume = musicAsset?.volume ?? 0.5;
      this.setSoundVolume(
        this.currentMusic,
        this.isMuted ? 0 : this.calculateVolume(baseVolume, 'music')
      );
    }
  }

  /**
   * Get current volume settings
   */
  getVolumeSettings(): { master: number; music: number; sfx: number; muted: boolean } {
    return {
      master: this.masterVolume,
      music: this.musicVolume,
      sfx: this.sfxVolume,
      muted: this.isMuted,
    };
  }
}

// Export singleton getter
export const getAudioManager = (): AudioManager => AudioManager.getInstance();
