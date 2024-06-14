import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoPrestadorComponent } from './avaliacao-prestador.component';

describe('AvaliacaoPrestadorComponent', () => {
  let component: AvaliacaoPrestadorComponent;
  let fixture: ComponentFixture<AvaliacaoPrestadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvaliacaoPrestadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvaliacaoPrestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
