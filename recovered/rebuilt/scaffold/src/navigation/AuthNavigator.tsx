type AuthNavigatorProps = {
  isAuthenticated: boolean;
};

type ScreenName = "Login" | "Register" | "Search";

export function AuthNavigator({ isAuthenticated }: AuthNavigatorProps) {
  const stack: ScreenName[] = isAuthenticated ? ["Search"] : ["Login", "Register"];

  return {
    type: "stack",
    screens: stack,
  };
}
