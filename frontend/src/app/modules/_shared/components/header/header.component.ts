import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  $profiles = this.profileService.$profiles
  $selectedProfile = this.profileService.$selectedProfile

  $userdata = this.authService.$userData

  constructor(
    private authService: AuthService,
    public profileService: ProfileService,
    private router: Router
  ) { }

  abrirPerfil() {
    this.router.navigate(['/perfil'])
  }

  alterarPerfil(profile: string) {
    this.profileService.alterarPerfil(profile)
  }

  async vincularCliente() {
    await this.profileService.vincularCliente()
  }

  async vincularPrestadorServico() {
    await this.profileService.vincularPrestadorServico()
  }

  logoff() {
    this.authService.logout()
  }
}
