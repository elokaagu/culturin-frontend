import React from "react";
import { getProviders, signIn as SignIntoProvider } from "next-auth/react";
import styles from "../../../styles/SignIn.module.css";

type Provider = {
  id: string;
  name: string;
  type: string;
};

function signIn({ providers }: { providers: any }) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={(provider as Provider).name} className={styles.container}>
          <button
            onClick={() =>
              SignIntoProvider((provider as Provider).id, {
                callbackUrl: "/",
              })
            }
          >
            Sign in with {(provider as Provider).name}
          </button>
        </div>
      ))}
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}

export default signIn;
