import { Component, OnInit } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificacaoService } from '../../services/notificacao.service';
import { AuthService } from '../../services/auth.service';
import { FilterLogicalGroup } from '@gimmeapps/gquicklib-angular';
import { firstValueFrom } from 'rxjs';
import { Notificacao } from '../../models/notificacao.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  icon = faBell
  collapsed: boolean = true
  userId?: number;
  notificacoes: Notificacao[] = [];

  constructor(
    private notificacaoService: NotificacaoService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.userId = this.authService?.userData?.id;
    await this.carregar();
  }

  private async carregar() {
    const criteria: FilterLogicalGroup = {
      "and": [
        { "=": { "user_id": this.userId } },
        { "=": { "lido": false } },
      ]
    };
    this.notificacoes = await firstValueFrom(this.notificacaoService.query(criteria));
  }

  toggleMenu() {
    console.log(this.collapsed)
    this.collapsed = !this.collapsed
  }

  async goto(notificacao: Notificacao) {
    const payload = { lido: true }
    await firstValueFrom(this.notificacaoService.update(notificacao.id, payload))
    console.log(notificacao.url)
    this.router.navigateByUrl(notificacao.url)
  }
}
