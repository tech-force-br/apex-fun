import type { Locale } from "@/lib/locale";

export const authCopy: Record<
  Locale,
  {
    wordmark: string;
    tagline: string;
    signIn: string;
    signUp: string;
    accountTabs: string;
    email: string;
    password: string;
    emailPlaceholder: string;
    languageHelp: string;
    submitSignIn: string;
    submitSignUp: string;
    or: string;
    google: string;
    mockNote: string;
    welcome: string;
    signedInGoogle: string;
    signedInPassword: string;
    lessonLanguage: string;
    signOut: string;
    errors: {
      missing_email: string;
      invalid_email: string;
      missing_password: string;
    };
  }
> = {
  en: {
    wordmark: "ApexFun",
    tagline: "Little theory. Many small, checked exercises.",
    signIn: "Sign in",
    signUp: "Sign up",
    accountTabs: "Account",
    email: "Email",
    password: "Password",
    emailPlaceholder: "you@example.com",
    languageHelp: "Lessons and the site will use this language.",
    submitSignIn: "Sign in",
    submitSignUp: "Create account",
    or: "or",
    google: "Continue with Google",
    mockNote: "Demo only. Accounts are not saved yet.",
    welcome: "You are in",
    signedInGoogle: "Signed in with Google",
    signedInPassword: "Signed in with email",
    lessonLanguage: "Lesson language",
    signOut: "Sign out",
    errors: {
      missing_email: "Enter an email address.",
      invalid_email: "Enter a valid email address.",
      missing_password: "Enter a password.",
    },
  },
  "pt-BR": {
    wordmark: "ApexFun",
    tagline: "Pouca teoria. Muitos exercícios curtos e conferidos.",
    signIn: "Entrar",
    signUp: "Criar conta",
    accountTabs: "Conta",
    email: "E-mail",
    password: "Senha",
    emailPlaceholder: "voce@exemplo.com",
    languageHelp: "As lições e o site vão usar este idioma.",
    submitSignIn: "Entrar",
    submitSignUp: "Criar conta",
    or: "ou",
    google: "Continuar com o Google",
    mockNote: "Só uma demonstração. As contas ainda não são salvas.",
    welcome: "Você entrou",
    signedInGoogle: "Entrada com o Google",
    signedInPassword: "Entrada com e-mail",
    lessonLanguage: "Idioma das lições",
    signOut: "Sair",
    errors: {
      missing_email: "Digite um e-mail.",
      invalid_email: "Digite um e-mail válido.",
      missing_password: "Digite uma senha.",
    },
  },
};
