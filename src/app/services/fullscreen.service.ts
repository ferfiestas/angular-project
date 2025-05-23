import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FullscreenService {
  private fullscreenSubject = new BehaviorSubject<boolean>(false);
  fullscreen$ = this.fullscreenSubject.asObservable();

  enterFullscreen(): void {
    this.fullscreenSubject.next(true);
  }

  exitFullscreen(): void {
    this.fullscreenSubject.next(false);
  }

  toggleFullscreen(): void {
    const isFullscreen = this.fullscreenSubject.getValue();
    this.fullscreenSubject.next(!isFullscreen);
  }

  isFullscreen(): boolean {
    return this.fullscreenSubject.getValue();
  }
} 
