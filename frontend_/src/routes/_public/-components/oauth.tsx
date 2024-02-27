import { pb } from '@/@data/client';
import { pbSnackbarWrapper } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { LoginComponentProps } from './type';

function useOAuthOnClick(
  provider: string,
  setLoading: LoginComponentProps['setLoading']
) {
  const navigate = useNavigate();

  const onClick = useCallback(async () => {
    setLoading(true);
    try {
      await pbSnackbarWrapper(
        pb.collection('users').authWithOAuth2({ provider }),
        'Successful login'
      );
    } finally {
      setLoading(false);
    }
    navigate({
      to: '/',
      replace: false,
    });
  }, [navigate, provider, setLoading]);

  return onClick;
}

export function GithubLogIn({ setLoading }: LoginComponentProps) {
  const onClick = useOAuthOnClick('github', setLoading);

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500"
      onClick={onClick}
    >
      <FaGithub className="mr-2 text-lg" />
      Log in with Github
    </button>
  );
}

export function GoogleLogIn({ setLoading }: LoginComponentProps) {
  const onClick = useOAuthOnClick('google', setLoading);

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50 dark:focus:ring-[#4285F4]/55"
      onClick={onClick}
    >
      <FaGoogle className="mr-2 text-lg" />
      Log in with Google
    </button>
  );
}
