import { tokenAtom } from "@/atoms/user";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useEffect } from "react";

export const Route = createFileRoute("/_public")({
  component: UnAuthenticated,
});

function UnAuthenticated() {
  const setToken = useSetAtom(tokenAtom);
  useEffect(() => {
    setToken(RESET);
  }, [setToken]);

  return (
    <>
      <div className="flex min-h-screen max-md:flex-col">
        <div className="md:hidden basis-32 overflow-hidden">
          <Background />
        </div>
        <div className="flex-[1_1_60%] max-md:flex-auto">
          <PublicContetntWrapper />
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

function PublicContetntWrapper() {
  return (
    <div className="p-24 max-h-screen overflow-auto box-border">
      <img
        height={128}
        width={500}
        alt="nokia logo"
        src="/nokia-b.svg"
        className="md:mb-24 mb-2"
      />
      <Outlet />
    </div>
  );
}
