import { pb } from "@/@data/client";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa6";

function useOAuthOnClick(
  provider: string,
  setLoading: (isLoading: boolean) => void
) {
  const navigate = useNavigate();

  const onClick = useCallback(async () => {
    setLoading(true);
    await pb.collection("users").authWithOAuth2({ provider });
    setLoading(false);
    navigate({
      to: "/",
      replace: false,
    });
  }, [navigate, provider, setLoading]);

  return onClick;
}

export function GithubLogIn(setLoading: (isLoading: boolean) => void) {
  const onClick = useOAuthOnClick("github", setLoading);

  return (
    <button
      type="button"
      className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 justify-center"
      onClick={onClick}
    >
      <FaGithub className="text-lg mr-2" />
      Log in with Github
    </button>
  );
}

export function GoogleLogIn(setLoading: (isLoading: boolean) => void) {
  const onClick = useOAuthOnClick("google", setLoading);

  return (
    <button
      type="button"
      className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 justify-center"
      onClick={onClick}
    >
      <FaGoogle className="text-lg mr-2" />
      Log in with Google
    </button>
  );
}
