export interface LoginComponentProps {
  setLoading: (isLoading: boolean) => void;
}

export type LoginComponent = (props: LoginComponentProps) => JSX.Element;
