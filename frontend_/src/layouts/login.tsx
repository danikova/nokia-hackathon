export function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen max-md:flex-col">
        <div className="md:hidden basis-32 overflow-hidden">
          <Background />
        </div>
        <div className="flex-[1_1_60%] max-md:flex-auto">
          <PublicContetntWrapper>{children}</PublicContetntWrapper>
        </div>
        <div className="max-md:hidden flex-[1_1_40%]">
          <Background />
        </div>
      </div>
    </>
  );
}

function Background() {
  return (
    <div
      style={{
        background:
          "linear-gradient(-45deg, #ee7752, #EA7679, rgb(37, 88, 246), #76CBC1)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
        height: "100vh",
      }}
    ></div>
  );
}

function PublicContetntWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-24 max-h-screen overflow-auto box-border">
      <img
        height={128}
        width={500}
        alt="nokia logo"
        src="/nokia-b.svg"
        className="md:mb-24 mb-2"
      />
      {children}
    </div>
  );
}
