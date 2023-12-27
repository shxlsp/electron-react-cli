import { createRoot } from 'react-dom/client';
import App from './src';

const initReactDOM = () => {
  const root = createRoot(document.querySelector('#app'));
  root.render(<App />);
  return () => {
    root.unmount();
  };
};

initReactDOM();
