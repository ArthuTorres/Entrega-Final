import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataGridPagination, DatagridOptions } from '@gimmeapps/gquicklib-angular';
import { SolicitacaoServico, statusList } from '../../../../_shared/models/solicitacao-servico.models';
import { SolicitacaoServicoService } from '../../../../_shared/services/solicitacao-servico.service';
import { AuthService } from '../../../../_shared/services/auth.service';
import { ClienteService } from '../../../../_shared/services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-servicos-cliente',
  templateUrl: './dashboard-servicos-cliente.component.html',
  styleUrl: './dashboard-servicos-cliente.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardServicosClienteComponent implements OnInit {
  servicos: Partial<SolicitacaoServico>[] = [];

  datagridOptions: DatagridOptions = {
    columns: [
      { path: 'id', label: "# Solicitação" },
      { path: 'modelo', label: "Aparelho" },
      { path: 'status', label: "Status", formatFn: (value) => statusList[value] }
    ],
    canEdit: true
  }

  paginationOptions: DataGridPagination = {
    currentPage: 1,
    pageSize: 10,
    pageSizes: [
      { value: 10, display: "10 itens por página" },
      { value: 25, display: "25 itens por página" },
      { value: 50, display: "50 itens por página" },
    ]
  };

  constructor(
    private solicitacaoServicoService: SolicitacaoServicoService,
    private authService: AuthService,
    private clienteService: ClienteService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadData()
  }

  async loadData($event: DataGridPagination | void) {
    this.clienteService.query({ "=": { "user_id": this.authService.userData?.id } }).subscribe({
      next: (clientes) => {
        const cliente = clientes[0]
        this.solicitacaoServicoService.query({ "=": { "cliente_id": cliente.id } }).subscribe({
          next: (results) => {
            this.servicos = results.sort((r1, r2) => r2.id - r1.id)
            this.changeDetector.detectChanges()
          }
        })
      },
    })
  }

  editItem($event: number) {
    this.router.navigate(['/clientes/solicitacao-servico', $event])
  }

  novaSolicitacao() {
    this.router.navigate(["/clientes/solicitacao-servico/novo"])
  }
}
