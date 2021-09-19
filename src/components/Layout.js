export default function Layout({ children }) {
  return (
    <>
      {/*<navbar/>*/}
      <main>{children}</main>
      {/*Any component that will persist accross every page*/}
    </>
  );
}
