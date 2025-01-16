import toast from 'react-hot-toast';

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful:', registration.scope);

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  toast.success('New version available! Please refresh to update.', {
                    duration: 5000,
                    position: 'bottom-center',
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed:', error);
        });

      // Handle offline/online events
      window.addEventListener('online', () => {
        toast.success('You are back online!');
      });

      window.addEventListener('offline', () => {
        toast.error('You are offline. Some features may be limited.');
      });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
} 