import type { Locale } from "@/lib/locale";

export const authCopy: Record<
  Locale,
  {
    tagline: string;
    signIn: string;
    signUp: string;
    accountTabs: string;
    email: string;
    password: string;
    emailPlaceholder: string;
    submitSignIn: string;
    submitSignUp: string;
    or: string;
    google: string;
    errors: {
      missing_email: string;
      invalid_email: string;
      missing_password: string;
    };
  }
> = {
  en: {
    tagline: "Little theory. Many small, checked exercises.",
    signIn: "Sign in",
    signUp: "Sign up",
    accountTabs: "Account",
    email: "Email",
    password: "Password",
    emailPlaceholder: "you@example.com",
    submitSignIn: "Sign in",
    submitSignUp: "Create account",
    or: "or",
    google: "Continue with Google",
    errors: {
      missing_email: "Enter an email address.",
      invalid_email: "Enter a valid email address.",
      missing_password: "Enter a password.",
    },
  },
  "pt-BR": {
    tagline: "Pouca teoria. Muitos exercícios curtos e conferidos.",
    signIn: "Entrar",
    signUp: "Criar conta",
    accountTabs: "Conta",
    email: "E-mail",
    password: "Senha",
    emailPlaceholder: "voce@exemplo.com",
    submitSignIn: "Entrar",
    submitSignUp: "Criar conta",
    or: "ou",
    google: "Continuar com o Google",
    errors: {
      missing_email: "Digite um e-mail.",
      invalid_email: "Digite um e-mail válido.",
      missing_password: "Digite uma senha.",
    },
  },
};
