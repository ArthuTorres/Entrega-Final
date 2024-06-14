import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ClienteService } from './cliente.service';
import { PrestadorServicoService } from './prestador-servico.service';
import { FilterLogicalGroup } from '@gimmeapps/gquicklib-angular';
import { Router } from '@angular/router';

interface UserProfiles {
  isCustomer: boolean;
  isProfessional: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profiles = new BehaviorSubject<UserProfiles | null>(null)
  $profiles = this._profiles.asObservable();

  private _selectedProfile = new BehaviorSubject<string | undefined>(this.localStorageService.retrieve("selected-profile"))
  $selectedProfile = this._selectedProfile.asObservable();

  logOutFn = this.authService.logout

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private clienteService: ClienteService,
    private prestadorServicoService: PrestadorServicoService,
    private router:Router
  ) {
    this.setup()
  }

  async setup() {
    const filter: FilterLogicalGroup = { "and": [{ "=": { "user_id": this.authService.userData?.id } }] }

    const profiles: UserProfiles = {
      isCustomer: (await firstValueFrom(this.clienteService.query(filter))).length > 0,
      isProfessional: (await firstValueFrom(this.prestadorServicoService.query(filter))).length > 0,
    }

    if (!this.selectedProfile)
      if (profiles.isCustomer)
        this.selectedProfile = 'cliente'
      else if (profiles.isProfessional)
        this.selectedProfile = 'prestador-servico'

    this._profiles.next(profiles)
  }

  private get selectedProfile() {
    return this.localStorageService.retrieve("selected-profile")
  }

  private set selectedProfile(value: string | undefined) {
    this.localStorageService.store("selected-profile", value ?? "")
    this._selectedProfile.next(value)
  }

  public alterarPerfil(perfil: string) {
    this.selectedProfile = perfil;
    this.router.navigate(["/"])
  }

  async vincularCliente() {
    await firstValueFrom(this.clienteService.insert({ user_id: this.authService.userData?.id }))
    await this.setup()
    this.alterarPerfil('cliente');
  }

  async vincularPrestadorServico() {
    await firstValueFrom(this.prestadorServicoService.insert({ user_id: this.authService.userData?.id }))
    await this.setup()
    this.alterarPerfil('prestador-servico')
  }
}
