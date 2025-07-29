import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { ByuHeaderComponent, HeaderConfig } from '@fhss-web-team/frontend-utils';


@Component({
  selector: 'app-byu',
  imports: [RouterOutlet, ByuHeaderComponent], // Add the component here
  templateUrl: './byu.layout.html',
  styleUrl: './byu.layout.scss',
})

export class ByuLayout {
  headerConfig: HeaderConfig = {
    title: { text: "austin's toodoo", path: '' },
    menu: [
      { text: 'Home', path: '' },
      { text: 'My Lists', path: '/lists' },
    ],
  };
}
