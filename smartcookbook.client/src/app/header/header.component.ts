import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor() { }

  @Output() featureSelected = new EventEmitter<string>();

  onFeatureSelected(feature: string) {
    this.featureSelected.emit(feature);
  }
}
