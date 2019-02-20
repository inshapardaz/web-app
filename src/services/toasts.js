import { toast } from 'react-semantic-toasts';

export function success(message) {
    toast({
        type: 'success',
        title: message,
        time: 3000,
    },
    () => {},
    () => {}
  );
}

export function info(message) {
    toast({
        type: 'info',
        title: message,
        time: 3000,
    },
    () => {},
    () => {}
  );
}

export function error(message) {
    toast({
        type: 'error',
        title: message,
        time: 3000,
    },
    () => {},
    () => {}
  );
}