import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../_shared/services/auth.service';
import { LocalStorageService } from '../../../_shared/services/local-storage.service';
import { ProfileService } from '../../../_shared/services/profile.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  $profile = this.profileService.$selectedProfile
  
  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) { }
}
