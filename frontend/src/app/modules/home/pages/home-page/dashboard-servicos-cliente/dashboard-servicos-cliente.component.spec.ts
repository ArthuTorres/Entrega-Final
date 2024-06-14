import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardServicosClienteComponent } from './dashboard-servicos-cliente.component';

describe('DashboardServicosClienteComponent', () => {
  let component: DashboardServicosClienteComponent;
  let fixture: ComponentFixture<DashboardServicosClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardServicosClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardServicosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
