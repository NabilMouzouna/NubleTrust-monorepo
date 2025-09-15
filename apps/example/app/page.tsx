import Link from "next/link";


export default function Home() {


  return (
    <>
      <div>
        <h1>NubleTrust SDK Demo</h1>
        <Link href="/login">Login Page</Link>
        <br />
        <Link href="/register">Register Page</Link>
      </div>

      <hr style={{ margin: '1rem 0' }} />
    </>
  );
}