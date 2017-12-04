import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/first';
import {Subject} from 'rxjs/Subject';

import { Alert, AlertType } from './models/alert';

@Injectable()
export class AlertingService {
  private subject = new Subject<Alert>();
  private keepAfterRouteChange = false;

  constructor(private router: Router) {
      router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
              if (this.keepAfterRouteChange) {
                  this.keepAfterRouteChange = false;
              } else {
                  this.clear();
              }
          }
      });
  }

  private showNotification(notifyIcon: string, notifyMessage: string, notifyType: string, notifyFrom: string, notifyAlign: string) {
      $['notify']({
          icon: notifyIcon,
          message: notifyMessage
      },
      {
          element: 'body',
          type: notifyType,
          allow_dismiss: true,
          newest_on_top: true,
          showProgressbar: false,
          placement: {
              from: notifyFrom,
              align: notifyAlign
          },
          offset: 20,
          spacing: 10,
          z_index: 1033,
          delay: 5000,
          timer: 1000,
          animate: {
              enter: 'animated fadeIn',
              exit: 'animated fadeOutDown'
          }
      });
  }

  success(message: string) {
      const icon = 'fa fa-check';
      this.showNotification(icon, message, 'success', 'bottom', 'center');
  }

  error(message: string) {
      const icon = 'fa fa-times';
      this.showNotification(icon, message, 'danger', 'bottom', 'center');
  }

  info(message: string, keepAfterRouteChange = false) {
      const icon = 'fa fa-info-circle';
      this.showNotification(icon, message, 'info', 'bottom', 'center');
  }

  warn(message: string, keepAfterRouteChange = false) {
      const icon = 'fa fa-warning';
      this.showNotification(icon, message, 'warning', 'bottom', 'center');
  }

  clear() {
      this.subject.next();
  }
}
