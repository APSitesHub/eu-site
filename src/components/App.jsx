import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import { WindowedChat } from 'utils/Chat/ChatWindowed/WindowedChat';
import { Loader } from './SharedLayout/Loaders/Loader';

const Streams = lazy(() =>
  import(
    /* webpackChunkName: "Streams layout page" */ '../pages/Streams/Streams'
  )
);

const Stream = lazy(() =>
  import(/* webpackChunkName: "Stream page" */ '../pages/Streams/Stream/Stream')
);

export const App = () => {
  return (
    <>
      <Toaster
        containerStyle={{
          top: '10%',
        }}
      />
      <Suspense fallback={Loader} noindex={true}>
        <Routes noindex={true}>
          <Route path="/" element={<Streams />} noindex={true}>
            <Route path="lesson" element={<Stream />} noindex={true} />
            <Route
              path="lesson-chat"
              element={<WindowedChat />}
              noindex={true}
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};
