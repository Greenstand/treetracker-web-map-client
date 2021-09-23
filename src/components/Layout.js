import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar/>
      <main>{children}</main>
      {/*Any component that will persist accross every page*/}
    </>
  );
}
