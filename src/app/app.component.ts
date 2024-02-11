import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientComponent } from "./client/client.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, ClientComponent, SidebarComponent]
})
export class AppComponent {
  title = 'front-alianza';
}
