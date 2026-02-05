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
  personName: string = '';

  constructor(
    private bandService: BandService, 
    private selectionService: BandSelectionService, 
    private router: Router) {}

  ngOnInit(): void {
    this.bandService.getBands()
      .subscribe((list: Band[]) => {
        this.bands = list;
      });
  }

  selectBand(b: Band): void {
    this.selected = b;
  }

  onSelectionChange(): void {
    // placeholder for future multi-select logic
  }

  continue(): void {
    const selectedBands = this.bands.filter(b => b.selected);
    const payload = { bands: selectedBands.map(b => ({ ...b })), person: this.personName };
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
