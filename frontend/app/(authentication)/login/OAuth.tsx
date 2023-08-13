'use client'

import { useCallback } from "react";
import { CompProps } from "./Login";
import { loginFlow } from "../actions";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { snackbarWrapper, usePocketBase } from "../../_lib/clientPocketbase";

function useOAuthOnClick(provider: string, props: CompProps) {
  const pb = usePocketBase();
  const router = useRouter();

  const onClick = useCallback(async () => {
    try {
      await snackbarWrapper(pb.collection('users').authWithOAuth2({ provider }), 'Successful login');
      loginFlow(pb.authStore.exportToCookie({}, process.env.NEXT_PUBLIC_PB_COOKIE_KEY));
      router.push('/info');
    } catch (_) { }
  }, [pb, router, provider]);

  return onClick;
}


export function GithubLogIn(props: CompProps) {
  const onClick = useOAuthOnClick('github', props);

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

export function GoogleLogIn(props: CompProps) {
  const onClick = useOAuthOnClick('google', props);

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