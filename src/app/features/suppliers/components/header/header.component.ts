import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '@/app/features/auth/services';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, AvatarModule, TooltipModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  protected readonly user = this.authService.currentUser;
  protected readonly mobileMenuOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Suppliers', icon: 'pi pi-building', route: '/suppliers' },
  ];

  protected readonly userInitials = computed(() => {
    const u = this.user();
    if (!u) return '?';
    return u.username.slice(0, 2).toUpperCase();
  });

  protected readonly userRole = computed(() => {
    const u = this.user();
    if (!u || u.roles.length === 0) return '';
    const role = u.roles[0];
    return role.charAt(0) + role.slice(1).toLowerCase();
  });

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected onSignOut(): void {
    this.authService.signOut();
  }
}
