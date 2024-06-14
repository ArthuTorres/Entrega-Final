import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoClienteComponent } from './avaliacao-cliente.component';

describe('AvaliacaoClienteComponent', () => {
  let component: AvaliacaoClienteComponent;
  let fixture: ComponentFixture<AvaliacaoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvaliacaoClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvaliacaoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
