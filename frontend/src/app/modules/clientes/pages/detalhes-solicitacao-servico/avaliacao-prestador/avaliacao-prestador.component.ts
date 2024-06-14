import { Component, Input, OnInit } from '@angular/core';
import { SolicitacaoServico } from '../../../../_shared/models/solicitacao-servico.models';
import { FormBuilder, Validators } from '@angular/forms';
import { PropostaServico } from '../../../../_shared/models/proposta-servico.models';
import { AvaliacaoPrestadorService } from '../../../../_shared/services/avaliacao-prestador.service';
import { firstValueFrom } from 'rxjs';
import { AvaliacaoPrestador } from '../../../../_shared/models/avaliacao-prestador.models';
import { FilterLogicalGroup } from '@gimmeapps/gquicklib-angular';

@Component({
  selector: 'app-avaliacao-prestador',
  templateUrl: './avaliacao-prestador.component.html',
  styleUrl: './avaliacao-prestador.component.scss'
})
export class AvaliacaoPrestadorComponent implements OnInit {
  @Input() solicitacao_servico?: SolicitacaoServico
  @Input() proposta?: PropostaServico

  constructor(
    private formBuilder: FormBuilder,
    private avaliacaoPrestadorService: AvaliacaoPrestadorService
  ) { }

  form = this.formBuilder.group({
    "id": this.formBuilder.control(-1),
    "solicitacao_servico_id": this.formBuilder.control(-1, [Validators.required, Validators.min(1)]),
    "prestador_servico_id": this.formBuilder.control(-1, [Validators.required, Validators.min(1)]),
    "titulo": this.formBuilder.control("", [Validators.required]),
    "mensagem": this.formBuilder.control("", [Validators.required]),
    "nota_prestador": this.formBuilder.control(0, [Validators.required, Validators.min(1), Validators.max(5)]),
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
    await firstValueFrom(this.avaliacaoPrestadorService.insert(payload))
    await this.carregarAvaliacao()
  }

  async ngOnInit() {
    await this.carregarAvaliacao();
  }

  private async carregarAvaliacao() {
    const solicitacao_servico_id = this.solicitacao_servico?.id;
    const criteria: FilterLogicalGroup = { '=': { 'solicitacao_servico_id': solicitacao_servico_id } };
    const avaliacoes_prestador = await firstValueFrom(this.avaliacaoPrestadorService.query(criteria));

    if (avaliacoes_prestador && avaliacoes_prestador.length > 0) {
      const avaliacao = avaliacoes_prestador[0];
      this.form.reset(avaliacao);
      this.form.disable();
    }

    this.form.get("solicitacao_servico_id")?.reset(solicitacao_servico_id);
    this.form.get("prestador_servico_id")?.reset(this.proposta?.prestador_servico_id);
  }
}
