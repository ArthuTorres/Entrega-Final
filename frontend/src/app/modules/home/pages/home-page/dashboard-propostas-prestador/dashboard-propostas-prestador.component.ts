import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PropostaServico, statusList } from '../../../../_shared/models/proposta-servico.models';
import { DataGridPagination, DatagridOptions } from '@gimmeapps/gquicklib-angular';
import { AuthService } from '../../../../_shared/services/auth.service';
import { PropostaServicoService } from '../../../../_shared/services/proposta-servico.service';
import { firstValueFrom } from 'rxjs';
import { PrestadorServicoService } from '../../../../_shared/services/prestador-servico.service';
import { PrestadorServico } from '../../../../_shared/models/prestador-servico.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-propostas-prestador',
  templateUrl: './dashboard-propostas-prestador.component.html',
  styleUrl: './dashboard-propostas-prestador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPropostasPrestadorComponent implements OnInit {
  propostas: Partial<PropostaServico>[] = [];

  datagridOptions: DatagridOptions = {
    columns: [
      { path: 'solicitacao_servico_id', label: "# Solicitação" },
      { path: 'solicitacao_servico.tipo_equipamento', label: "Tipo de equipamento" },
      { path: 'solicitacao_servico.cliente.user.name', label: "Cliente" },
      { path: 'id', label: "# Proposta" },
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

  prestador?: PrestadorServico;

  constructor(
    private authService: AuthService,
    private prestadorServicoService: PrestadorServicoService,
    private propostaServicoService: PropostaServicoService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) { }

  async ngOnInit() {
    this.prestador = await this.loadPrestador()
    await this.loadData()
  }

  private async loadPrestador() {
    const userId = this.authService.userData?.id
    const prestadores = await firstValueFrom(this.prestadorServicoService.query({ "=": { "user_id": userId } }))
    return prestadores[0]
  }

  editItem($event: number) {
    const proposta = this.propostas.find(p => p.id == $event)
    this.router.navigate(["prestadores/elaborar-proposta", proposta?.solicitacao_servico_id])
  }

  async loadData($event: void | DataGridPagination) {
    this.propostas = await firstValueFrom(this.propostaServicoService.query({
      "and": [
        { "=": { "prestador_servico_id": this.prestador?.id } },
        { "=": { "status": 0 } }
      ]
    }))
    this.changeDetector.detectChanges();
  }
}
