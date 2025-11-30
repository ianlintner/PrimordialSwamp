# Performance & Stability Improvements

## 🎯 Objective

Ensure PrimordialSwamp runs smoothly on target devices with fast load times, stable performance, reliable save/load, and cross-browser compatibility.

---

## 📋 Feature Checklist

### Load Time Optimization

#### Asset Loading Strategy
- [ ] **Critical Path Loading**
  - Boot screen assets first
  - Menu assets preloaded
  - Combat assets on-demand
  - Biome assets lazy-loaded
- [ ] **Asset Compression**
  - WebP for supported browsers (fallback PNG)
  - Sprite atlases over individual files
  - Audio compression (OGG primary, MP3 fallback)
  - JSON minification for data files
- [ ] **Loading Screen**
  - Progress bar with percentage
  - Tip rotation during load
  - Cancel option for slow loads

#### Bundle Optimization
- [ ] **Code Splitting**
  - Main bundle < 200KB
  - Phaser as separate chunk
  - Scene-based lazy loading
- [ ] **Tree Shaking**
  - Remove unused Phaser modules
  - Dead code elimination
  - Production build optimization

#### Target Metrics
| Metric | Target | Maximum |
|--------|--------|---------|
| Initial Load | < 2s | 3s |
| Scene Transition | < 500ms | 1s |
| First Meaningful Paint | < 1s | 2s |
| Time to Interactive | < 3s | 5s |

### Memory Management

#### Object Pooling
- [ ] **Pooled Objects**
  - Particle emitters
  - Damage number texts
  - Projectiles
  - Status effect icons
- [ ] **Pool Implementation**
  ```typescript
  class ObjectPool<T> {
    private pool: T[] = [];
    private factory: () => T;
    private reset: (obj: T) => void;
    
    get(): T {
      return this.pool.pop() ?? this.factory();
    }
    
    release(obj: T): void {
      this.reset(obj);
      this.pool.push(obj);
    }
  }
  ```

#### Asset Cleanup
- [ ] **Scene Cleanup**
  - Destroy all scene objects on exit
  - Clear event listeners
  - Reset state machines
- [ ] **Texture Management**
  - Unload unused biome textures
  - Cache size limits (50MB)
  - LRU eviction policy

#### Memory Monitoring
- [ ] **Debug Mode**
  - Memory usage display
  - Object count tracking
  - Leak detection warnings
- [ ] **Production Safeguards**
  - Auto-cleanup thresholds
  - Graceful degradation

### Save/Load Reliability

#### Save System Architecture
- [ ] **Auto-Save**
  - Save after each encounter
  - Save on settings change
  - Debounced saves (1 second minimum)
- [ ] **Save Data Structure**
  ```typescript
  interface SaveData {
    version: string;
    timestamp: number;
    checksum: string;
    data: {
      currentRun: RunState | null;
      metaProgress: MetaProgress;
      settings: GameSettings;
    };
  }
  ```

#### Error Handling
- [ ] **Corruption Recovery**
  - Checksum validation
  - Backup save system
  - Graceful fallback to defaults
- [ ] **Storage Quota**
  - Check available space before save
  - Warn when approaching limits
  - Offer export option

#### Import/Export
- [ ] **Save Export**
  - Base64 encoded JSON
  - Copyable to clipboard
  - Downloadable file option
- [ ] **Save Import**
  - Paste from clipboard
  - File upload
  - Version migration

### Cross-Browser Compatibility

#### Supported Browsers
| Browser | Minimum Version | Testing Priority |
|---------|-----------------|------------------|
| Chrome | 90+ | High |
| Firefox | 88+ | High |
| Safari | 14+ | Medium |
| Edge | 90+ | Medium |
| Mobile Chrome | 90+ | High |
| Mobile Safari | 14+ | High |

#### Compatibility Features
- [ ] **WebGL Fallback**
  - Detect WebGL support
  - Canvas fallback mode
  - Feature detection utilities
- [ ] **Audio Compatibility**
  - Web Audio API primary
  - HTML5 Audio fallback
  - User gesture for audio start
- [ ] **Storage Compatibility**
  - localStorage primary
  - IndexedDB fallback
  - Cookie storage emergency fallback

#### Polyfills & Shims
- [ ] Required polyfills for older browsers
- [ ] Feature detection before polyfill load
- [ ] Minimal polyfill bundle

### Mobile Responsiveness

#### Touch Support
- [ ] **Touch Inputs**
  - Tap to select/confirm
  - Swipe for scrolling
  - Pinch zoom disabled
  - Touch feedback (ripple effect)
- [ ] **Virtual Controls**
  - Touch-friendly button sizes (44x44px minimum)
  - Drag prevention on scrollables
  - Multi-touch handling

#### Responsive Layout
- [ ] **Breakpoints**
  ```css
  /* Mobile Portrait */
  @media (max-width: 480px) { }
  
  /* Mobile Landscape / Tablet Portrait */
  @media (max-width: 768px) { }
  
  /* Tablet Landscape / Small Desktop */
  @media (max-width: 1024px) { }
  
  /* Desktop */
  @media (min-width: 1025px) { }
  ```
- [ ] **UI Adaptation**
  - Stacked layouts on mobile
  - Larger touch targets
  - Simplified menus
  - Optional on-screen controls

#### Performance on Mobile
- [ ] **Reduced Effects**
  - Fewer particles
  - Simpler animations
  - Lower resolution textures
- [ ] **Battery Considerations**
  - Reduce update frequency when backgrounded
  - Pause when not visible
  - Efficient rendering

### Frame Rate Stability

#### Performance Targets
| Device Tier | Target FPS | Minimum FPS |
|-------------|------------|-------------|
| High-end Desktop | 60 | 60 |
| Mid-range Desktop | 60 | 45 |
| Low-end Desktop | 30 | 30 |
| Mobile | 60 | 30 |

#### Optimization Techniques
- [ ] **Rendering**
  - Batch similar sprites
  - Reduce draw calls
  - Cull off-screen objects
  - Use render textures for static UI
- [ ] **Updates**
  - Throttle non-essential updates
  - Use delta time for all animations
  - Reduce physics complexity
- [ ] **Profiling**
  - Performance monitoring integration
  - Frame time tracking
  - Bottleneck identification

### Error Handling & Recovery

#### Error Boundaries
- [ ] **Scene Errors**
  - Catch scene initialization errors
  - Fallback to menu on failure
  - Error logging
- [ ] **Combat Errors**
  - Validate all actions
  - Recover from invalid states
  - Auto-save before risky operations

#### Crash Recovery
- [ ] **State Recovery**
  - Save state before potential crashes
  - Offer resume on reload
  - Clear corrupted state option
- [ ] **Error Reporting**
  - Anonymous error collection (opt-in)
  - Stack trace capture
  - Reproduction steps logging

---

## 🏗️ Implementation Details

### Performance Monitor

```typescript
class PerformanceMonitor {
  private frameTimings: number[] = [];
  private memoryUsage: number[] = [];
  
  public update(delta: number): void {
    this.frameTimings.push(delta);
    if (this.frameTimings.length > 60) {
      this.frameTimings.shift();
    }
    
    // Check memory (if available)
    if (performance.memory) {
      this.memoryUsage.push(performance.memory.usedJSHeapSize);
      if (this.memoryUsage.length > 60) {
        this.memoryUsage.shift();
      }
    }
  }
  
  public getAverageFPS(): number {
    const avgDelta = this.frameTimings.reduce((a, b) => a + b, 0) 
                     / this.frameTimings.length;
    return 1000 / avgDelta;
  }
  
  public getMemoryMB(): number {
    const latest = this.memoryUsage[this.memoryUsage.length - 1] ?? 0;
    return latest / (1024 * 1024);
  }
  
  public isPerformanceGood(): boolean {
    return this.getAverageFPS() >= 55;
  }
  
  public shouldReduceQuality(): boolean {
    return this.getAverageFPS() < 30;
  }
}
```

### Save System

```typescript
class SaveSystem {
  private readonly SAVE_KEY = 'primordial_swamp_save';
  private readonly BACKUP_KEY = 'primordial_swamp_backup';
  private saveDebounce: number | null = null;
  
  public save(data: GameState): boolean {
    try {
      const saveData: SaveData = {
        version: GAME_VERSION,
        timestamp: Date.now(),
        checksum: this.calculateChecksum(data),
        data: data
      };
      
      // Backup current save first
      const current = localStorage.getItem(this.SAVE_KEY);
      if (current) {
        localStorage.setItem(this.BACKUP_KEY, current);
      }
      
      // Save new data
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }
  
  public load(): GameState | null {
    try {
      const saved = localStorage.getItem(this.SAVE_KEY);
      if (!saved) return null;
      
      const saveData: SaveData = JSON.parse(saved);
      
      // Validate checksum
      if (!this.validateChecksum(saveData)) {
        console.warn('Save corrupted, trying backup');
        return this.loadBackup();
      }
      
      // Version migration if needed
      if (saveData.version !== GAME_VERSION) {
        return this.migrate(saveData);
      }
      
      return saveData.data;
    } catch (e) {
      console.error('Load failed:', e);
      return this.loadBackup();
    }
  }
  
  public debouncedSave(data: GameState): void {
    if (this.saveDebounce) {
      clearTimeout(this.saveDebounce);
    }
    this.saveDebounce = setTimeout(() => {
      this.save(data);
    }, 1000);
  }
  
  private calculateChecksum(data: object): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
}
```

### File Changes Required

| File | Changes |
|------|---------|
| `src/managers/PerformanceManager.ts` | New file |
| `src/managers/SaveSystem.ts` | Enhance/create |
| `src/utils/ObjectPool.ts` | New file |
| `src/utils/FeatureDetection.ts` | New file |
| `vite.config.ts` | Optimization settings |
| `src/scenes/BootScene.ts` | Loading optimization |

---

## ✅ Acceptance Criteria

- [ ] Initial load time < 3 seconds on mid-range devices
- [ ] Maintains 60 FPS during normal gameplay
- [ ] Save/load works reliably across sessions
- [ ] Works on all supported browsers
- [ ] Mobile touch controls responsive
- [ ] No memory leaks after 30 minutes of play
- [ ] Graceful degradation on low-end devices

---

## 🧪 Testing Requirements

### Performance Testing
- [ ] Load time benchmarks (Lighthouse)
- [ ] FPS monitoring during gameplay
- [ ] Memory leak detection (heap snapshots)
- [ ] Mobile device testing (real devices)

### Compatibility Testing
- [ ] Cross-browser testing matrix
- [ ] Mobile browser testing
- [ ] Touch input verification
- [ ] Audio playback across browsers

### Reliability Testing
- [ ] Save/load stress testing
- [ ] Corruption recovery testing
- [ ] Network interruption handling
- [ ] Browser crash recovery

---

## 📊 Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Asset Loading Optimization | High | Medium | P1 |
| Save System Reliability | High | Medium | P1 |
| Object Pooling | High | Low | P1 |
| Cross-Browser Compatibility | High | Medium | P1 |
| Mobile Touch Support | Medium | Medium | P2 |
| Performance Monitoring | Medium | Low | P2 |
| Memory Management | Medium | Medium | P2 |
| Quality Settings | Low | Medium | P3 |
| Error Reporting | Low | High | P3 |

---

*This sub-issue ensures PrimordialSwamp performs well, saves reliably, and works across all target platforms.*
