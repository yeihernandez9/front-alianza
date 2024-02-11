import { Component } from '@angular/core';
import { ClientComponent } from "../client/client.component";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    imports: [ClientComponent]
})
export class SidebarComponent {

}
