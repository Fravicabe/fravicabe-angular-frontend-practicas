    import { CommonModule } from '@angular/common';
    import { Component } from '@angular/core';
    import { RouterLink, RouterLinkActive } from '@angular/router';
    import { MatIconModule } from '@angular/material/icon';
    import { MatToolbarModule } from '@angular/material/toolbar';

    @Component({
        selector: 'app-header',
        standalone: true,
        
    imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatToolbarModule
    ],
        templateUrl: './header.html',
        styleUrl: './header.scss'
    })
    export class HeaderComponent {

    }