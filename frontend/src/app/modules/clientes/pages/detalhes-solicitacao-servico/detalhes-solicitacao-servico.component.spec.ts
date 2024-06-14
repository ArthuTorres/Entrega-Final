import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesSolicitacaoServicoComponent } from './detalhes-solicitacao-servico.component';

describe('DetalhesSolicitacaoServicoComponent', () => {
  let component: DetalhesSolicitacaoServicoComponent;
  let fixture: ComponentFixture<DetalhesSolicitacaoServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalhesSolicitacaoServicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalhesSolicitacaoServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
