/*
  The admin pages (`/admin`, `/admin/global`, `/admin/theme`) have no working
  login and save nothing, so they are off unless the server starts with
  ADMIN_PAGES_ENABLED=true. The value has no NEXT_PUBLIC_ prefix: the server
  reads it at runtime (no new build), and it never goes to the browser.
*/

export function adminPagesEnabled() {
  return process.env.ADMIN_PAGES_ENABLED === 'true';
}

/**
 * getServerSideProps for an admin page: the 404 page while the admin pages are
 * off. The code of the page runs only while they are on.
 *
 * @param {(context: any) => any} [getServerSideProps] - the code of the page
 */
export function withAdminPages(getServerSideProps = () => ({ props: {} })) {
  // Next.js awaits the result, so the page code can be async or not.
  return (context) => {
    if (!adminPagesEnabled()) return { notFound: true };
    return getServerSideProps(context);
  };
}
