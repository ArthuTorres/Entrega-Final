import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../_shared/services/auth.service';
import { Router } from '@angular/router';
import { FilterLogicalGroup } from '@gimmeapps/gquicklib-angular';
import { SolicitacaoServicoService } from '../../_shared/services/solicitacao-servico.service';
import { firstValueFrom } from 'rxjs';
import { SolicitacaoServico } from '../../_shared/models/solicitacao-servico.models';
import { calcularRatingCliente } from '../../_shared/models/avaliacao-cliente.models';

@Component({
  selector: 'app-buscador-servicos',
  templateUrl: './buscador-servicos.component.html',
  styleUrl: './buscador-servicos.component.scss'
})
export class BuscadorServicosComponent implements OnInit {
  public calcularRatingCliente = calcularRatingCliente
  
  $userdata = this.authService.$userData
  loading: boolean = false;
  servicos: SolicitacaoServico[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private solicitacaoServicoService: SolicitacaoServicoService
  ) { }

  async ngOnInit() {
    this.loading = true
    const filter: FilterLogicalGroup = { "and": [{ "=": { "status": 0 } }] }

    const servicos = await firstValueFrom(this.solicitacaoServicoService.query(filter))
    this.servicos = servicos.sort((s1, s2) => s2.id - s1.id)

    this.loading = false
    this.changeDetector.detectChanges()
  }

  abrirPerfil() {
    this.router.navigate(['/perfil'])
  }

  logoff() {
    this.authService.logout()
  }

  breakLines(text: string) {
    return text.split("\n")
  }

  getCidade(servico: SolicitacaoServico) {
    const enderecos = servico.cliente?.user.enderecos
    if (!enderecos || enderecos.length == 0)
      return "N/A"

    const endereco = enderecos[0]
    return `${endereco.cidade} - ${endereco.estado}`
  }

  getBairro(servico: SolicitacaoServico) {
    const enderecos = servico.cliente?.user.enderecos
    if (!enderecos || enderecos.length == 0)
      return "N/A"

    const endereco = enderecos[0]
    return endereco.bairro
  }

  enviarProposta(servico: SolicitacaoServico) {
    this.router.navigate(["prestadores/elaborar-proposta", servico.id])
  }

}
