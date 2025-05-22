import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class FlipbookService {
  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.mjs'; // Asegúrate de que la ruta sea correcta
  }

  // Cargar el PDF
  async loadPdf(pdfUrl: string): Promise<pdfjsLib.PDFDocumentProxy> {
    try {
      const pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
      return pdfDoc;
    } catch (error) {
      console.error('Error loading PDF:', error);
      throw error;
    }
  }

  // Renderizar una página del PDF
  async renderPage(pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number): Promise<HTMLCanvasElement> {
    try {
      const page = await pdf.getPage(pageNumber);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Canvas context not available');
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      return canvas;

    } catch (error) {
      console.error('Error rendering page:', error);
      throw error;
    }
  }
}