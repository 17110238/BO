import SignInLayout from "components/Login/layouts/SignInLayout";
import SignInForm from "components/Login/SignInForm";
import { getCookie } from "utils/helpers";

interface LoginProps {
  clientId: string;
}

export default function Login(props: LoginProps) {
  const { clientId } = props;
  return (
    <SignInLayout>
      <SignInForm />
    </SignInLayout>
  );
}
export async function getServerSideProps({ req, res, query }: any) {

  return {
    props: {
      destination: '',
      permanent: false,
    },
  };
}