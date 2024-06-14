import { Component, Input, OnInit } from '@angular/core';
import { SolicitacaoServico } from '../../../_shared/models/solicitacao-servico.models';
import { FormBuilder, Validators } from '@angular/forms';
import { PropostaServico } from '../../../_shared/models/proposta-servico.models';
import { AvaliacaoClienteService } from '../../../_shared/services/avaliacao-cliente.service';
import { FilterLogicalGroup } from '@gimmeapps/gquicklib-angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-avaliacao-cliente',
  templateUrl: './avaliacao-cliente.component.html',
  styleUrl: './avaliacao-cliente.component.scss'
})
export class AvaliacaoClienteComponent implements OnInit {
  @Input() solicitacao_servico?: Partial<SolicitacaoServico>
  @Input() proposta?: Partial<PropostaServico>

  constructor(
    private formBuilder: FormBuilder,
    private avaliacaoClienteService: AvaliacaoClienteService
  ) { }

  async ngOnInit() {
    await this.carregarAvaliacao();
  }

  async carregarAvaliacao() {
    const solicitacao_servico_id = this.solicitacao_servico?.id;
    const criteria: FilterLogicalGroup = { '=': { 'solicitacao_servico_id': solicitacao_servico_id } };
    const avaliacoes_cliente = await firstValueFrom(this.avaliacaoClienteService.query(criteria));

    if (avaliacoes_cliente && avaliacoes_cliente.length > 0) {
      const avaliacao = avaliacoes_cliente[0];
      this.form.reset(avaliacao);
      this.form.disable();
    }

    this.form.get("solicitacao_servico_id")?.reset(solicitacao_servico_id);
    this.form.get("cliente_id")?.reset(this.solicitacao_servico?.cliente_id);
  }

  form = this.formBuilder.group({
    "id": this.formBuilder.control(-1),
    "solicitacao_servico_id": this.formBuilder.control(-1, [Validators.required, Validators.min(1)]),
    "cliente_id": this.formBuilder.control(-1, [Validators.required, Validators.min(1)]),
    "titulo": this.formBuilder.control("", [Validators.required]),
    "mensagem": this.formBuilder.control("", [Validators.required]),
    "nota_cliente": this.formBuilder.control(0, [Validators.required, Validators.min(1), Validators.max(5)]),
    "nota_sistema": this.formBuilder.control(0, [Validators.required, Validators.min(1), Validators.max(5)]),
  })

  isFieldInvalid(formControlName: string) {
    const control = this.form.get(formControlName)
    return control && control.touched && !control.valid
  }

  async enviarAvaliacao() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return
    }

    const payload: any = this.form.value
    await firstValueFrom(this.avaliacaoClienteService.insert(payload))
    await this.carregarAvaliacao()
  }
}
