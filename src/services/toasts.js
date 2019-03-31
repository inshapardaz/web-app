import { toastr } from 'react-redux-toastr';
import LocaleService from './LocaleService';

const toastrOptions = {
  timeOut: 3000, 
  showCloseButton: true,
  closeOnToastrClick: true
}

export function success(message) {
    toastr.success(message, toastrOptions);
}

export function info(message) {
  toastr.info(message, toastrOptions);
}

export function warning(message) {
  toastr.warning(message, toastrOptions);
}

export function error(message) {
  toastr.error(message, toastrOptions);
}

export function question(message, okText = null, onOk, cancelText = null, onCancel = () => {})
{
  const okLabel = okText ? okText : LocaleService.formatMessage('action.yes');
  const cancelLabel = cancelText ? cancelText : LocaleService.formatMessage('action.no');
  const toastrConfirmOptions = {
    onOk: onOk,
    onCancel: onCancel,
    okText: okLabel,
    cancelText: cancelLabel
  };

  toastr.confirm(message, toastrConfirmOptions);
}