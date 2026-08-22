import './globals.css';
import { Backdrop, DeckleFilter } from './Shell';

export const metadata = {
  title: 'Manifesto — write the dream down',
  description: 'Write a short letter to yourself. Once a month, three small questions bring you back to it.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DeckleFilter />
        <Backdrop />
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
