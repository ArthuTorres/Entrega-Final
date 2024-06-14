import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../_shared/services/auth.service';
import { UserService } from '../../../_shared/services/user.service';
import { debounceTime, firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnderecoService } from '../../../_shared/services/endereco.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-page',
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.scss'
})
export class PerfilPageComponent implements OnInit {
  $userdata = this.authService.$userData

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private enderecoService: EnderecoService,
    private router: Router
  ) {
    this.configureForm()
  }
  
  form: FormGroup = this.formBuilder.group({
    "user": this.formBuilder.group({
      "name": this.formBuilder.control("", [Validators.required]),
      "email": this.formBuilder.control("", [Validators.required, Validators.email])
    }),
    "endereco": this.formBuilder.group({
      "id": this.formBuilder.control(""),
      "cep": this.formBuilder.control("", [Validators.required]),
      "logradouro": this.formBuilder.control("", [Validators.required]),
      "numero": this.formBuilder.control("", [Validators.required]),
      "bairro": this.formBuilder.control("", [Validators.required]),
      "cidade": this.formBuilder.control("", [Validators.required]),
      "estado": this.formBuilder.control("", [Validators.required]),
    })
  });

  async ngOnInit() {
    const userData = this.authService.userData
    if (!userData)
      return

    const user = await firstValueFrom(this.userService.getById(userData.id))
    const enderecos = await firstValueFrom(this.enderecoService.query({ "and": [{ "=": { "user_id": userData.id } }] }))

    this.formUser.reset(user)
    this.formEndereco.reset(enderecos[0], { emitEvent: false })
  }

  async salvar() {
    const userData = this.authService.userData
    const endereco = this.formEndereco.value
    if (!userData || !endereco)
      return

    await firstValueFrom(this.userService.update(userData.id, this.formUser.value))
    await firstValueFrom(this.enderecoService.update(endereco.id, endereco))

    await this.authService.updateUserdata()
    this.router.navigate(['/'])
  }

  logoff() {
    this.authService.logout()
  }

  private configureForm() {
    this.formUser.get('email')?.disable();

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

  private get formUser(): FormGroup {
    return <FormGroup>this.form?.get("user");
  }

  private get formEndereco(): FormGroup {
    return <FormGroup>this.form?.get("endereco");
  }
}
