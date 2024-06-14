import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorServicosComponent } from './buscador-servicos.component';

describe('BuscadorServicosComponent', () => {
  let component: BuscadorServicosComponent;
  let fixture: ComponentFixture<BuscadorServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuscadorServicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuscadorServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
