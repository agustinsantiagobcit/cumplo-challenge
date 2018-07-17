import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="colorbar columns">
            <div class="metlife-blue column is-8 column"></div>
            <div class="metlife-dark-blue is-3 column"></div>
            <div class="metlife-green is-1 column"></div>
        </div>
        <div class="footer-legal">
            <img src="assets/layout/images/cumplo_green.svg" width="180"/>
        </div>
    `
})
export class AppFooterComponent {

}
