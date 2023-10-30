import Vue from 'vue';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $staticUrl: string;
    $logo: string;

    // $parseTime: any;
    // $formatTime: any;
    // $localeOptions: any;
    // $densityList: any;
    // $hasPermission: any;
    // $noticeList: any;
  }
}
