import { Component } from '@angular/core';
import { GlobalConstants } from './Common/GlobalConstants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RJ-NOC';
  public configUrl: any = "";
  async ngOnInit() {
    if (localStorage.getItem('apiurl') == null) {
      this.configUrl = window['window'];
      localStorage.setItem('apiurl', this.configUrl["config"]['apiurl']);
      localStorage.setItem('backtossourl', this.configUrl["backtossourl"]['apiurl']);
      localStorage.setItem('backtossourl_logout', this.configUrl["config"]['backtossourl_logout']);
      localStorage.setItem('imagepathurl', this.configUrl["config"]['imagepathurl']);
      localStorage.setItem('ssourl', this.configUrl["config"]['ssourl']);
      localStorage.setItem('applicationtitle', this.configUrl["config"]['applicationtitle']);
      localStorage.setItem('rpprequsturl', this.configUrl["config"]['rpprequsturl']);

      GlobalConstants._ApiURL = this.configUrl["config"]['apiurl'];
      GlobalConstants._BacktoSSOURL = this.configUrl["backtossourl"]['apiurl'];
      GlobalConstants._BacktoSSOURL_Logout = this.configUrl["config"]['backtossourl_logout'];
      GlobalConstants._ImagePathURL = this.configUrl["config"]['imagepathurl'];
      GlobalConstants._SSOURL = this.configUrl["config"]['ssourl'];
      GlobalConstants._ApplicationTitle = this.configUrl["config"]['applicationtitle'];
      GlobalConstants._RPPRequstURL = this.configUrl["config"]['rpprequsturl'];

    }
    else {
      GlobalConstants._ApiURL = localStorage.getItem('apiurl')?.toString();
      GlobalConstants._BacktoSSOURL = localStorage.getItem('backtossourl')?.toString();
      GlobalConstants._BacktoSSOURL_Logout = localStorage.getItem('backtossourl_logout')?.toString();
      GlobalConstants._ImagePathURL = localStorage.getItem('imagepathurl')?.toString();
      GlobalConstants._SSOURL = localStorage.getItem('ssourl')?.toString();
      GlobalConstants._ApplicationTitle = localStorage.getItem('applicationtitle')?.toString();
      GlobalConstants._RPPRequstURL = localStorage.getItem('rpprequsturl')?.toString();
    }
  }
}
