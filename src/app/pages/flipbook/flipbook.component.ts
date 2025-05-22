import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlipbookService } from '../../services/flipbook.service';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-flipbook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.css']
})
export class FlipbookComponent implements OnInit, AfterViewInit {
  @ViewChild('flipbookContainer', { static: true }) flipbookContainerRef!: ElementRef<HTMLDivElement>;

  pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;
  pageFlip: any = null;
  totalPages = 0;
  currentPage = 1;
  pdfUrl = '/assets/flipbook/junio.pdf';

  private currentZoom = 1;
  private readonly zoomStep = 0.1;
  private readonly minZoom = 0.5;
  private readonly maxZoom = 2;
  private flipSound!: HTMLAudioElement;

  constructor(private flipbookService: FlipbookService) { }

  async ngOnInit() {
    await this.loadPageFlipScript();
  }

  async ngAfterViewInit() {
    this.flipSound = new Audio('/assets/sounds/page-flip.mp3');
    this.flipSound.preload = 'auto';
    this.flipSound.load();

    await this.initFlipbook();
    window.addEventListener('resize', this.updatePageMode.bind(this));
  }

  private loadPageFlipScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).St) return resolve();
      const script = document.createElement('script');
      script.src = '/assets/libs/page-flip.browser.js';
      script.onload = () => resolve();
      script.onerror = () => reject('Error loading PageFlip script');
      document.body.appendChild(script);
    });
  }

  private getResponsiveSettings() {
    const width = window.innerWidth;

    if (width > 1080) {
      return { width: 1200, height: 1500, singlePage: false };
    } else if (width > 800) {
      return { width: 1000, height: 1300, singlePage: false };
    } else if (width > 500) {
      return { width: 450, height: 800, singlePage: true };
    } else if (width > 400) {
      return { width: 380, height: 700, singlePage: true };
    } else if (width > 300) {
      return { width: 320, height: 500, singlePage: true };
    } else {
      return { width: 280, height: 460, singlePage: true };
    }
  }

  private async initFlipbook() {
    const container = this.flipbookContainerRef.nativeElement;
    container.style.transform = 'scale(1)';
    container.style.transformOrigin = 'center top';
    this.currentZoom = 1;

    this.pdfDoc = await this.flipbookService.loadPdf(this.pdfUrl);
    this.totalPages = this.pdfDoc.numPages;

    const pages: HTMLElement[] = [];

    for (let i = 1; i <= this.totalPages; i++) {
      const canvas = await this.flipbookService.renderPage(this.pdfDoc, i);
      const wrapper = document.createElement('div');
      wrapper.className = 'page-wrapper';
      wrapper.appendChild(canvas);
      pages.push(wrapper);
    }

    const responsive = this.getResponsiveSettings();
    const St = (window as any).St;
    this.pageFlip = new St.PageFlip(this.flipbookContainerRef.nativeElement, {
      width: responsive.width,
      height: responsive.height,
      size: 'stretch',
      showCover: false,
      mobileScrollSupport: true,
      maxShadowOpacity: 0.5,
      drawShadow: true,
      useMouseEvents: true,
      showPageCorners: true,
      singlePage: responsive.singlePage,
      minWidth: 280,
      minHeight: 420,
      maxWidth: 3500,
      maxHeight: 3500
    });

    this.pageFlip.loadFromHTML(pages);
    this.pageFlip.update(responsive);

    this.pageFlip.on('flip', (e: any) => {
      this.currentPage = e.data + 1;
    });

    // Add event listeners for pointerdown and touchstart to the container
    ['pointerdown', 'touchstart'].forEach(eventType => {
      container.addEventListener(eventType, () => {
        this.playFlipSound();
      }, { passive: true });
    });
  }

  private updatePageMode() {
    const responsive = this.getResponsiveSettings();
    if (this.pageFlip) {
      this.pageFlip.update({
        width: responsive.width,
        height: responsive.height,
        singlePage: responsive.singlePage
      });
    }
  }

  playFlipSound() {
    if (this.flipSound) {
      this.flipSound.currentTime = 0;
      this.flipSound.play().catch(console.warn);
    }
  }

  goToNextPage() {
    if (this.pageFlip && this.currentPage < this.totalPages) {
      this.playFlipSound();
      this.pageFlip.flipNext();
    }
  }

  goToPrevPage() {
    if (this.pageFlip && this.currentPage > 1) {
      this.playFlipSound();
      this.pageFlip.flipPrev();
    }
  }

  zoomIn() {
    if (this.currentZoom < this.maxZoom) {
      this.currentZoom += this.zoomStep;
      this.applyZoom();
    }
  }

  zoomOut() {
    if (this.currentZoom > this.minZoom) {
      this.currentZoom -= this.zoomStep;
      this.applyZoom();
    }
  }

  resetZoom() {
    this.currentZoom = 1;
    this.applyZoom();
  }

  toggleFullscreen() {
    const elem = this.flipbookContainerRef.nativeElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  private applyZoom() {
    const container = this.flipbookContainerRef.nativeElement;
    container.style.transform = `scale(${this.currentZoom})`;
    container.style.transformOrigin = 'center top';
  }
}