import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeradorPropostaComponent } from './gerador-proposta.component';

describe('GeradorPropostaComponent', () => {
  let component: GeradorPropostaComponent;
  let fixture: ComponentFixture<GeradorPropostaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeradorPropostaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeradorPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
