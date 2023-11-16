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
    if (sessionStorage.getItem('apiurl') == null) {
      this.configUrl = window['window'];
      sessionStorage.setItem('apiurl', this.configUrl["config"]['apiurl']);
      sessionStorage.setItem('backtossourl', this.configUrl["backtossourl"]['apiurl']);
      sessionStorage.setItem('backtossourl_logout', this.configUrl["config"]['backtossourl_logout']);
      sessionStorage.setItem('imagepathurl', this.configUrl["config"]['imagepathurl']);
      sessionStorage.setItem('ssourl', this.configUrl["config"]['ssourl']);
      sessionStorage.setItem('applicationtitle', this.configUrl["config"]['applicationtitle']);
      sessionStorage.setItem('rpprequsturl', this.configUrl["config"]['rpprequsturl']);

      GlobalConstants._ApiURL = this.configUrl["config"]['apiurl'];
      GlobalConstants._BacktoSSOURL = this.configUrl["backtossourl"]['apiurl'];
      GlobalConstants._BacktoSSOURL_Logout = this.configUrl["config"]['backtossourl_logout'];
      GlobalConstants._ImagePathURL = this.configUrl["config"]['imagepathurl'];
      GlobalConstants._SSOURL = this.configUrl["config"]['ssourl'];
      GlobalConstants._ApplicationTitle = this.configUrl["config"]['applicationtitle'];
      GlobalConstants._RPPRequstURL = this.configUrl["config"]['rpprequsturl'];

    }
    else {
      GlobalConstants._ApiURL = sessionStorage.getItem('apiurl')?.toString();
      GlobalConstants._BacktoSSOURL = sessionStorage.getItem('backtossourl')?.toString();
      GlobalConstants._BacktoSSOURL_Logout = sessionStorage.getItem('backtossourl_logout')?.toString();
      GlobalConstants._ImagePathURL = sessionStorage.getItem('imagepathurl')?.toString();
      GlobalConstants._SSOURL = sessionStorage.getItem('ssourl')?.toString();
      GlobalConstants._ApplicationTitle = sessionStorage.getItem('applicationtitle')?.toString();
      GlobalConstants._RPPRequstURL = sessionStorage.getItem('rpprequsturl')?.toString();
    }
  }
}
