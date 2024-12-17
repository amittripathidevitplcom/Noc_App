import { Injectable } from '@angular/core';
import { config } from 'rxjs';
import { default as AppSetting } from '../../assets/appsettings.json';

export class GlobalConstants {
  //public static apiURL: string = (<any>AppSetting)['apiurl'];
  //public static BacktoSSOURL: string = (<any>AppSetting)['backtossourl'];
  //public static ImagePathURL: string = (<any>AppSetting)['imagepathurl'];
  //public static SSOURL: string = (<any>AppSetting)['ssourl'];
  //public static ApplicationTitle: string = (<any>AppSetting)['applicationtitle'];
  //public static RPPRequstURL: string = (<any>AppSetting)['rpprequsturl'];

  //public static configUrl: any = window['window'];

  //public static apiURL: string = this.configUrl["config"]['apiurl'] == undefined ? '' : this.configUrl["config"]['apiurl'];
  //public static BacktoSSOURL: string = this.configUrl["config"]['backtossourl'] == undefined ? '' : this.configUrl["config"]['backtossourl'];
  //public static BacktoSSOURL_Logout: string = this.configUrl["config"]['backtossourl_logout'] == undefined ? '' : this.configUrl["config"]['backtossourl_logout'];
  //public static ImagePathURL: string = this.configUrl["config"]['imagepathurl'] == undefined ? '' : this.configUrl["config"]['imagepathurl'];
  //public static SSOURL: string = this.configUrl["config"]['ssourl'] == undefined ? '' : this.configUrl["config"]['ssourl'];
  //public static ApplicationTitle: string = this.configUrl["config"]['applicationtitle'] == undefined ? '' : this.configUrl["config"]['applicationtitle'];
  //public static RPPRequstURL: string = this.configUrl["config"]['rpprequsturl'] == undefined ? '' : this.configUrl["config"]['rpprequsturl'];

  //  {
  //  "APIURL": "http://172.22.33.75//API//api//",
  //    "BacktoSSOURL": "http://172.22.33.75/SSO_Landing_Page.aspx?BackToSSO=Yes",
  //      "BacktoSSOURL_Logout": "http://172.22.33.75/SSO_Landing_Page.aspx?BackToSSO=No",
  //        "ImagePathURL": "http://172.22.33.75/API/ImageFile/",
  //          "SSOURL": "https://ssotest.rajasthan.gov.in/signin",
  //            "ApplicationTitle": "RJ_NOC",
  //              "RPPRequstURL": "http://uat.rpp.rajasthan.gov.in/payments/v1/init"
  //}
  // send Box local
  //public static apiURL: string = "https://unocapi.devitsandbox.com/api/";
  //public static BacktoSSOURL: string = "https://unoc.devitsandbox.com/login";
  //public static BacktoSSOURL_Logout: string = "https://unoc.devitsandbox.com/login";
  //public static ImagePathURL: string = "https://unocapi.devitsandbox.com/imagefile/"
  //public static SSOURL: string = "https://ssotest.rajasthan.gov.in/signin";
  //public static ApplicationTitle: string = "RJ_NOC";
  //public static RPPRequstURL: string = "http://uat.rpp.rajasthan.gov.in/payments/v1/init";
  //public static SystemGeneratedPDFPathURL: string = "https://unocapi.devitsandbox.com/SystemGeneratedPDF/"

  //local
     public static apiURL: string = "http://localhost:62778/api/";
    public static BacktoSSOURL: string = "https://localhost:44319/sso_landing_page.aspx?backtosso=yes";
    public static BacktoSSOURL_Logout: string = "https://localhost:44319/sso_landing_page.aspx?backtosso=no";
    public static  ImagePathURL: string = "http://localhost:62778/imagefile/"
    public static SystemGeneratedPDFPathURL: string = "http://localhost:62778/systemgeneratedpdf/"
  public static SSOURL: string = "https://ssotest.rajasthan.gov.in/signin";
  public static ApplicationTitle: string = "rj_noc";
     public static rpprequsturl: string = "http://uat.rpp.rajasthan.gov.in/payments/v1/init";
  //Stagging
  //public static apiURL: string = "http://172.22.33.75/API/api/";
  //public static BacktoSSOURL: string = "http://172.22.33.75/SSO_Landing_Page.aspx?BackToSSO=Yes";
  //public static BacktoSSOURL_Logout: string = "http://172.22.33.75/SSO_Landing_Page.aspx?BackToSSO=No";
  //public static ImagePathURL: string = "http://172.22.33.75/API/ImageFile/"
  //public static SystemGeneratedPDFPathURL: string = "http://172.22.33.75/API/SystemGeneratedPDF/"
  //public static SSOURL: string = "https://ssotest.rajasthan.gov.in/signin";
  //public static ApplicationTitle: string = "RJ_NOC";
  //public static RPPRequstURL: string = "http://uat.rpp.rajasthan.gov.in/payments/v1/init";
  //Live
  //public static apiURL: string = "https://nocapi.rajasthan.gov.in/api/api/";
  //public static BacktoSSOURL: string = "https://nocapi.rajasthan.gov.in/sso_landing_page.aspx?backtosso=yes";
  //public static BacktoSSOURL_Logout: string = "https://nocapi.rajasthan.gov.in/sso_landing_page.aspx?backtosso=no";
  //public static ImagePathURL: string = "https://nocapi.rajasthan.gov.in/api/imagefile/"
  //public static SystemGeneratedPDFPathURL: string = "https://nocapi.rajasthan.gov.in/api/SystemGeneratedPDF/"
  //public static SSOURL: string = "https://sso.rajasthan.gov.in/signin";
  //public static ApplicationTitle: string = "raj noc";
  //public static RPPRequstURL: string = "http://uat.rpp.rajasthan.gov.in/payments/v1/init";


  //public static apiURL: string;
  //public static BacktoSSOURL: string;
  //public static BacktoSSOURL_Logout: string;
  //public static ImagePathURL: string;
  //public static SSOURL: string;
  //public static ApplicationTitle: string;
  //public static RPPRequstURL: string;


  //static set _ApiURL(value: string) {
  //  this.apiURL = value
  //}
  //static get _ApiURL(): string {
  //  return this.apiURL;
  //}

  //static set _BacktoSSOURL(value: string) {
  //  this.BacktoSSOURL = value
  //}
  //static get _BacktoSSOURL(): string {
  //  return this.BacktoSSOURL;
  //}
  //static set _BacktoSSOURL_Logout(value: string) {
  //  this.BacktoSSOURL_Logout = value
  //}
  //static get _BacktoSSOURL_Logout(): string {
  //  return this.BacktoSSOURL_Logout;
  //}

  //static set _ImagePathURL(value: string) {
  //  this.ImagePathURL = value
  //}
  //static get _ImagePathURL(): string {
  //  return this.ImagePathURL;
  //}

  //static set _SSOURL(value: string) {
  //  this.SSOURL = value
  //}
  //static get _SSOURL(): string {
  //  return this.SSOURL;
  //}

  //static set _ApplicationTitle(value: string) {
  //  this.ApplicationTitle = value
  //}
  //static get _ApplicationTitle(): string {
  //  return this.ApplicationTitle;
  //}

  //static set _RPPRequstURL(value: string) {
  //  this.RPPRequstURL = value
  //}
  //static get _RPPRequstURL(): string {
  //  return this.RPPRequstURL;
  //}

  //public static apiURL: string = this.configUrl["config"]['apiurl'] == undefined ? '' : this.configUrl["config"]['apiurl'];
  //public static BacktoSSOURL: string = this.configUrl["config"]['backtossourl'];
  //public static BacktoSSOURL_Logout: string = this.configUrl["config"]['backtossourl_logout'];
  //public static ImagePathURL: string = this.configUrl["config"]['imagepathurl'];
  //public static SSOURL: string = this.configUrl["config"]['ssourl'];
  //public static ApplicationTitle: string = this.configUrl["config"]['applicationtitle'];
  //public static RPPRequstURL: string = this.configUrl["config"]['rpprequsturl']; 
}
//{
//  "APIURL": "http://172.22.33.75/API/api/",
//  "BacktoSSOURL": "http://172.22.33.75/SSO_Landing_Page.aspx?BackToSSO=Yes",
//  "ImagePathURL": "http://172.22.33.75/API/ImageFile/",
//  "SSOURL": "https://ssotest.rajasthan.gov.in/signin",
//  "ApplicationTitle": "RJ_NOC",
//  "RPPRequstURL": "http://uat.rpp.rajasthan.gov.in/payments/v1/init"
//}
