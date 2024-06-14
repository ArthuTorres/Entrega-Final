import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPropostasPrestadorComponent } from './dashboard-propostas-prestador.component';

describe('DashboardPropostasPrestadorComponent', () => {
  let component: DashboardPropostasPrestadorComponent;
  let fixture: ComponentFixture<DashboardPropostasPrestadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardPropostasPrestadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardPropostasPrestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
