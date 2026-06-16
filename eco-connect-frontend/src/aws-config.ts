import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_GRG670Dve",
      userPoolClientId: "7c4kh8jjdfhs5sqg9kpkfrpc3a",
    },
  },
});

export const BASE_URL = "https://pphgcl2s0f.execute-api.us-east-1.amazonaws.com/dev"

