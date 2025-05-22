declare module 'page-flip' {
  export class PageFlip {
    constructor(el: HTMLElement, settings?: any);
    loadFromHTML(pages: HTMLElement[]): void;
    loadFromImages(images: string[]): void;
    flipPrev(): void;
    flipNext(): void;
    on(event: string, callback: (e: any) => void): void;
  }

  export interface FlipSetting {
    width: number;
    height: number;
    size?: 'stretch' | 'fixed';
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
  }
}