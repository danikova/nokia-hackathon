import { FaGithub, FaGoogle } from "react-icons/fa6";

export type CompProps = {
  setLoading: (value: boolean) => void;
};

// prettier-ignore
const useOAuthOnClick = (provider: string, props: CompProps) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  const onClick = async () => {};

  return onClick;
};

export function GithubLogIn(props: CompProps) {
  const onClick = useOAuthOnClick("github", props);

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
  const onClick = useOAuthOnClick("google", props);

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
