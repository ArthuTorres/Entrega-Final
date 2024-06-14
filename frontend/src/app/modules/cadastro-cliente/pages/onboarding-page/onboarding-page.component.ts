import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EnderecoService } from '../../../_shared/services/endereco.service';
import { debounceTime, firstValueFrom } from 'rxjs';
import { ClienteService } from '../../../_shared/services/cliente.service';
import { Cliente } from '../../../_shared/models/cliente.models';

@Component({
  selector: 'app-onboarding-page',
  templateUrl: './onboarding-page.component.html',
  styleUrl: './onboarding-page.component.scss'
})
export class OnboardingPageComponent {
  form?: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private enderecoService: EnderecoService
  ) {
    this.configureForm(formBuilder);
  }

  private configureForm(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      "user": formBuilder.group({
        "name": formBuilder.control("", [Validators.required]),
        "email": formBuilder.control("", [Validators.required, Validators.email]),
        "password": formBuilder.control("", [Validators.required]),
        "passwordConfirm": formBuilder.control("", [Validators.required]),
      }, { validators: [this.userFormValidator] }),
      "endereco": formBuilder.group({
        "cep": formBuilder.control("", [Validators.required]),
        "cep-desconhecido": formBuilder.control(false),
        "logradouro": formBuilder.control("", [Validators.required]),
        "numero": formBuilder.control("", [Validators.required]),
        "bairro": formBuilder.control("", [Validators.required]),
        "cidade": formBuilder.control("", [Validators.required]),
        "estado": formBuilder.control("", [Validators.required]),
      }, { validators: [this.enderecoFormValidator] })
    });

    const disableEnderecoFields = ["logradouro", "bairro", "cidade", "estado"];
    disableEnderecoFields.forEach(field => this.formEndereco.get(field)?.disable({ emitEvent: false }));

    this.formEndereco.get('cep')?.valueChanges.pipe(debounceTime(500)).subscribe(async (cep: string) => {
      cep = cep.replace('-', '');
      if (cep.length !== 8)
        return;

      try {
        const endereco = await firstValueFrom(this.enderecoService.buscarCep(cep));
        this.formEndereco.reset({ ...this.formEndereco.value, ...endereco }, { emitEvent: false });
        disableEnderecoFields.forEach(field => this.formEndereco.get(field)?.disable({ emitEvent: false }));
      } catch (e) {
        disableEnderecoFields.forEach(field => this.formEndereco.get(field)?.enable({ emitEvent: false }));
      }
    });
  }

  public async salvar() {
    const cliente: Partial<Cliente> = {
      user: {
        ...this.formUser.value,
        enderecos: [this.formEndereco.getRawValue()]
      }
    };

    const clienteRetorno = await this.clienteService.signup(cliente);
  }

  private userFormValidator: ValidatorFn = (control: AbstractControl) => {
    const group = <FormGroup>control
    const errors: ValidationErrors = {}

    const senhaField = group.get("password");
    const confirmaSenhaField = group.get("passwordConfirm");

    if (!senhaField || !confirmaSenhaField)
      return null

    senhaField.setErrors(null)
    confirmaSenhaField.setErrors(null)

    if (senhaField.value !== confirmaSenhaField.value) {
      const error = { "As senhas não são iguais": true }
      senhaField.setErrors(error)
      confirmaSenhaField.setErrors(error)

      errors["As senhas não são iguais"] = true
    }

    if (Object.keys(errors).length > 0)
      return errors

    return null
  }

  private enderecoFormValidator: ValidatorFn = (control: AbstractControl) => {
    const group = <FormGroup>control
    const errors: ValidationErrors = {}

    if (Object.keys(errors).length > 0)
      return errors

    return null
  }

  private get formUser(): FormGroup {
    return <FormGroup>this.form?.get("user");
  }

  private get formEndereco(): FormGroup {
    return <FormGroup>this.form?.get("endereco");
  }
}
