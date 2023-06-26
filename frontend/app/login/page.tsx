import Login from './Login';

export default async function LoginHome() {
  return (
    <div className="flex min-h-screen max-md:flex-col">
      <div className="md:hidden basis-32 overflow-hidden">
        <Background />
      </div>
      <div className="flex-auto">
        <LoginWrapper />
      </div>
      <div className="max-md:hidden flex-auto">
        <Background />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div
      style={{
        background: 'linear-gradient(-45deg, #ee7752, #EA7679, rgb(37, 88, 246), #76CBC1)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        height: '100vh',
      }}
    ></div>
  );
}

function LoginWrapper() {
  return (
    <div className="p-24 max-h-screen overflow-auto">
      <div
        style={{
          background: 'url(/nokia-b.svg) no-repeat',
          backgroundSize: 'contain',
        }}
        className="h-32 md:mb-24 mb-2"
      />
      <Login />
    </div>
  );
}
