import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Band, BandService } from '../band.service';
import { BandSelectionService } from '../band-selection.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-select',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-select.component.html',
  styleUrls: ['./client-select.component.scss']
})
export class ClientSelectComponent implements OnInit {
  bands: Band[] = [];
  selected?: Band;

  constructor(
    private bandService: BandService, 
    private selectionService: BandSelectionService, 
    private router: Router) {}

  ngOnInit(): void {
    this.bandService.getBands()
      .subscribe((list: Band[]) => {
        // Mezclar las bandas aleatoriamente
        this.bands = this.shuffleArray([...list]);
        // Debug: verificar que las bandas tienen colores
        console.log('Bandas cargadas (orden aleatorio):', this.bands.map(b => ({ title: b.title, color: b.color })));
      });
  }

  /**
   * Mezcla aleatoriamente un array usando el algoritmo Fisher-Yates
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  selectBand(b: Band): void {
    this.selected = b;
  }

  onSelectionChange(): void {
    // placeholder for future multi-select logic
  }

  /**
   * Convierte un color hex a rgba con transparencia
   * Retorna los estilos para aplicar cuando la banda está seleccionada
   */
  getSelectedStyle(band: Band): any {
    if (!band.selected || !band.color) {
      return {};
    }
    
    // Normalizar el color: asegurar que tenga el formato correcto
    let color = band.color.trim();
    
    // Si no empieza con #, agregarlo
    if (!color.startsWith('#')) {
      color = `#${color}`;
    }
    
    // Validar que sea un color hex válido (6 caracteres después del #)
    const hexMatch = color.match(/^#([A-Fa-f0-9]{6})$/);
    if (!hexMatch) {
      console.warn(`Color inválido para banda ${band.title}: ${band.color}`);
      return {};
    }
    
    // Convertir hex a rgba con transparencia (10% de opacidad)
    const hex = hexMatch[1];
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return {
      color: color,
      'border-color': color,
      background: `rgba(${r}, ${g}, ${b}, 0.15)`
    };
  }

  continue(): void {
    const selectedBands = this.bands.filter(b => b.selected);
    const payload = { bands: selectedBands.map(b => ({ ...b })), person: '' };
    this.selectionService.saveBands(payload).subscribe(
      (res) => {

        this.router.navigate(['/']);
      },
      (err) => {
        console.error('Error saving bands:', err);
      }
    );
  }
}
