import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitacaoServicoService } from '../../_shared/services/solicitacao-servico.service';
import { firstValueFrom } from 'rxjs';
import { SolicitacaoServico } from '../../_shared/models/solicitacao-servico.models';
import { Image } from '@gimmeapps/gquicklib-angular/lib/shared/models/image.models';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { PrestadorServicoService } from '../../_shared/services/prestador-servico.service';
import { PropostaServicoService } from '../../_shared/services/proposta-servico.service';
import { PropostaServico } from '../../_shared/models/proposta-servico.models';
import { calcularRatingCliente } from '../../_shared/models/avaliacao-cliente.models';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from '../../_shared/services/message.service';

@Component({
  selector: 'app-gerador-proposta',
  templateUrl: './gerador-proposta.component.html',
  styleUrl: './gerador-proposta.component.scss'
})
export class GeradorPropostaComponent implements OnInit {
  icons = {
    "message": faMessage
  }

  public calcularRatingCliente = calcularRatingCliente

  $userdata = this.authService.$userData
  loading: boolean = false;

  solicitacao?: SolicitacaoServico;
  images: Partial<Image>[] = [];
  proposta?: Partial<PropostaServico>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private solicitacaoServicoService: SolicitacaoServicoService,
    private propostaServicoService: PropostaServicoService,
    private prestadorServicoService: PrestadorServicoService,
    private messageService: MessageService
  ) { }

  form = this.formBuilder.group({
    "solicitacao_servico_id": this.formBuilder.control(-1, [Validators.required, Validators.min(0)]),
    "prestador_servico_id": this.formBuilder.control(-1, [Validators.required, Validators.min(0)]),
    "descricao_proposta": this.formBuilder.control("", [Validators.required]),
    "valor_servico": this.formBuilder.control(0, [Validators.required, Validators.min(0.01)]),
    "prazo": this.formBuilder.control("", [Validators.required])
  })

  async ngOnInit() {
    const id = this.route.snapshot.params["idSolicitacao"]
    this.solicitacao = await firstValueFrom(this.solicitacaoServicoService.getById(id))
    if (!this.solicitacao || this.solicitacao.status == 5)
      this.router.navigate(["/prestadores/buscar-servicos"])

    this.images = this.solicitacao.arquivos.map(arquivo => {
      return {
        id: arquivo.id,
        url: ["data:image/jpeg;base64", arquivo.arquivo].join(",")
      }
    })

    const userId = this.authService.userData?.id;
    const prestadores = await firstValueFrom(this.prestadorServicoService.query({ "=": { "user_id": userId } }))
    const prestador = prestadores[0]

    this.proposta = (await firstValueFrom(this.propostaServicoService.query({
      "and": [
        { "=": { "solicitacao_servico_id": this.solicitacao.id } },
        { "=": { "prestador_servico_id": prestador.id } },
      ]
    })))[0]

    if (!this.proposta)
      this.proposta = { prestador_servico_id: prestador.id, solicitacao_servico_id: this.solicitacao.id, status: 0 }
    else
      this.form.disable()

    this.form.reset(this.proposta)
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

  isInvalidField(control: AbstractControl | null) {
    if (!control)
      return false

    return (
      !control.disabled &&
      control.touched &&
      !control.valid
    )
  }

  async enviarProposta() {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return
    }

    const payload: Partial<PropostaServico> = this.form.value
    await firstValueFrom(this.propostaServicoService.insert(payload))

    this.router.navigate(["/"])
  }

  async iniciarServico() {
    if (!this.solicitacao || !this.solicitacao.id)
      return

    const payload = { status: 2 }
    await firstValueFrom(this.solicitacaoServicoService.update(this.solicitacao.id, payload))

    window.location.reload()
  }
  async entregarServico() {
    if (!this.solicitacao || !this.solicitacao.id)
      return

    const payload = { status: 3 }
    await firstValueFrom(this.solicitacaoServicoService.update(this.solicitacao.id, payload))

    window.location.reload()
  }

  openMessages(customerId: number) {
    this.messageService.openMessages(customerId)
  }
}
