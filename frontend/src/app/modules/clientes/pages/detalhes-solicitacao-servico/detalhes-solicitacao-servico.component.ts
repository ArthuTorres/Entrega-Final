import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../_shared/services/auth.service';
import { Observable, debounceTime, firstValueFrom } from 'rxjs';
import { User } from '../../../_shared/models/auth.models';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { SolicitacaoServicoService } from '../../../_shared/services/solicitacao-servico.service';
import { Image } from '@gimmeapps/gquicklib-angular/lib/shared/models/image.models';
import { ClienteService } from '../../../_shared/services/cliente.service';
import { SolicitacaoServico } from '../../../_shared/models/solicitacao-servico.models';
import { ArquivoSolicitacaoServicoService } from '../../../_shared/services/arquivo-solicitacao-servico.service';
import { PropostaServicoService } from '../../../_shared/services/proposta-servico.service';
import { PropostaServico } from '../../../_shared/models/proposta-servico.models';
import { AvaliacaoPrestador } from '../../../_shared/models/avaliacao-prestador.models';
import { MessageService } from '../../../_shared/services/message.service';

@Component({
  selector: 'app-detalhes-solicitacao-servico',
  templateUrl: './detalhes-solicitacao-servico.component.html',
  styleUrl: './detalhes-solicitacao-servico.component.scss'
})
export class DetalhesSolicitacaoServicoComponent implements OnInit {

  $userData: Observable<User | null>;
  objId?: number;

  tiposEquipamento: string[] = [];
  marcas: string[] = [];
  modelos: string[] = [];

  form = this.formBuilder.group({
    "id": this.formBuilder.control(-1),
    "cliente_id": this.formBuilder.control(-1, [Validators.required, Validators.min(1)]),
    "tipo_equipamento": this.formBuilder.control("", [Validators.required]),
    "marca": this.formBuilder.control("", [Validators.required]),
    "modelo": this.formBuilder.control("", [Validators.required]),
    "periodo_preferencial": this.formBuilder.control(-1, [Validators.required, Validators.min(0)]),
    "descricao_problema": this.formBuilder.control("", [Validators.required]),
    "status": this.formBuilder.control(0, [Validators.required])
  })

  images: Partial<Image>[] = []
  loading: boolean = false;
  solicitacao?: SolicitacaoServico;
  propostas: PropostaServico[] = [];
  propostaSelecionada?: PropostaServico;

  constructor(
    private authService: AuthService,
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private solicitacaoServicoService: SolicitacaoServicoService,
    private arquivoSolicitacaoServicoService: ArquivoSolicitacaoServicoService,
    private propostaServicoService: PropostaServicoService,
    private messageService: MessageService
  ) {
    this.$userData = authService.$userData
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id'])
      this.objId = this.route.snapshot.params['id']

    this.setupForm()
    this.loadData()
  }

  async setupForm() {
    this.form.get('marca')?.disable()
    this.form.get('modelo')?.disable()

    this.tiposEquipamento = await firstValueFrom(this.solicitacaoServicoService.listarTiposEquipamento());

    this.form.get('tipo_equipamento')?.valueChanges.pipe(debounceTime(500)).subscribe(async (value) => {
      if (this.loading)
        return

      setTimeout(async () => {
        if (this.form.get('marca')?.value)
          this.form.get('marca')?.reset()

        const tipo_equipamento = this.form.value.tipo_equipamento ?? "";

        if (tipo_equipamento) {
          this.marcas = await firstValueFrom(this.solicitacaoServicoService.listarMarcas(tipo_equipamento))
          this.form.get('marca')?.enable()
        } else {
          this.form.get('marca')?.disable()
        }
      });
    })

    this.form.get('marca')?.valueChanges.pipe(debounceTime(500)).subscribe(async () => {
      if (this.loading)
        return

      if (this.form.get('modelo')?.value)
        this.form.get('modelo')?.reset()

      const tipo_equipamento = this.form.value.tipo_equipamento ?? "";
      const marca = this.form.value.marca ?? "";

      if (tipo_equipamento) {
        this.modelos = await firstValueFrom(this.solicitacaoServicoService.listarModelos(tipo_equipamento, marca))
        this.form.get('modelo')?.enable()
      } else {
        this.form.get('modelo')?.disable()
      }
    })
  }

  async loadData() {
    this.loading = true

    if (!this.objId) {
      const cliente = (await firstValueFrom(this.clienteService.query({ "=": { "user_id": this.authService.userData?.id } })))[0]
      this.form.get('cliente_id')?.reset(cliente.id)
    } else {
      this.solicitacao = await firstValueFrom(this.solicitacaoServicoService.getById(this.objId))
      const arquivos = await firstValueFrom(this.arquivoSolicitacaoServicoService.query({ "=": { "solicitacao_servico_id": this.objId } }))
      this.images = arquivos.map(arquivo => {
        return {
          id: arquivo.id,
          url: ["data:image/jpeg;base64", arquivo.arquivo].join(",")
        }
      })

      this.form.reset(this.solicitacao)
      this.form.disable()

      await this.carregarPropostas()
    }

    this.loading = false
  }

  async carregarPropostas() {
    this.propostas = await firstValueFrom(this.propostaServicoService.query({ "=": { "solicitacao_servico_id": this.objId } }))
    this.propostaSelecionada = this.propostas.find(p => p.status === 1)
  }

  logoff() {
    this.authService.logout()
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

  async apagarFoto(image: Partial<Image>) {
    if (image && image.id)
      await firstValueFrom(this.arquivoSolicitacaoServicoService.delete(image.id))
  }

  async saveChanges() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const payload = <Partial<SolicitacaoServico>>this.form.getRawValue()
    payload.arquivos = this.images.map(img => { return { arquivo: img.url?.split(',')[1] } })

    if (!this.objId) {
      await firstValueFrom(this.solicitacaoServicoService.insert(payload))
    }

    this.router.navigate(['/'])
  }

  async cancelRequest() {
    if (this.objId) {
      const payload = { id: this.objId, status: 5 }
      await firstValueFrom(this.solicitacaoServicoService.update(this.objId, payload))

      this.router.navigate(['/'])
    }
  }

  async selecionar(proposta: PropostaServico) {
    if (!this.objId)
      return

    const idProposta = proposta.id
    this.propostas.forEach(p => p.status = (p.id != idProposta) ? 2 : 1)

    const payloadPropostas = this.propostas.map(p => {
      return {
        id: p.id,
        status: p.status
      }
    })
    await firstValueFrom(this.propostaServicoService.bulk(payloadPropostas))

    const payload = {
      status: 1
    }
    await firstValueFrom(this.solicitacaoServicoService.update(this.objId, payload))

    window.location.reload()
  }

  async concluirServico() {
    if (!this.objId)
      return

    const payload = { status: 4 }
    await firstValueFrom(this.solicitacaoServicoService.update(this.objId, payload))
    window.location.reload()
  }

  calcularRatingPrestador(avaliacoes?: Partial<AvaliacaoPrestador>[]): number {
    try {
      if (avaliacoes)
        return avaliacoes.reduce((acc, current) => current.nota_prestador ? acc + current.nota_prestador : 0, 0) / avaliacoes.length;

      return 0
    } catch (e) {
      return 0
    }
  }

  openMessages(professionalId: number) {
    this.messageService.openMessages(professionalId)
  }
}
