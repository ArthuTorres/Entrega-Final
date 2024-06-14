import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardServicosPrestadorComponent } from './dashboard-servicos-prestador.component';

describe('DashboardServicosPrestadorComponent', () => {
  let component: DashboardServicosPrestadorComponent;
  let fixture: ComponentFixture<DashboardServicosPrestadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardServicosPrestadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardServicosPrestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
