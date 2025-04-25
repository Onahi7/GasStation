export type AuthError =
  | "CredentialsSignin"
  | "Default"
  | "SessionRequired";

export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error) {
    case "CredentialsSignin":
      return "Invalid email or password";
    case "SessionRequired":
      return "Please sign in to access this page";
    default:
      return "An error occurred during authentication";
  }
};
