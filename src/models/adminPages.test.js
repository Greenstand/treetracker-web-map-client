import { adminPagesEnabled, withAdminPages } from './adminPages';

describe('adminPages', () => {
  const original = process.env.ADMIN_PAGES_ENABLED;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.ADMIN_PAGES_ENABLED;
    } else {
      process.env.ADMIN_PAGES_ENABLED = original;
    }
  });

  it('is off when ADMIN_PAGES_ENABLED is not set', () => {
    delete process.env.ADMIN_PAGES_ENABLED;
    expect(adminPagesEnabled()).toBe(false);
  });

  it.each(['', 'false', '1', 'yes', 'TRUE', ' true'])(
    'is off when ADMIN_PAGES_ENABLED is %p',
    (value) => {
      process.env.ADMIN_PAGES_ENABLED = value;
      expect(adminPagesEnabled()).toBe(false);
    },
  );

  it('is on when ADMIN_PAGES_ENABLED is "true"', () => {
    process.env.ADMIN_PAGES_ENABLED = 'true';
    expect(adminPagesEnabled()).toBe(true);
  });

  it('gives the 404 page while off, and does not run the page code', async () => {
    delete process.env.ADMIN_PAGES_ENABLED;
    const getServerSideProps = jest.fn();
    expect(await withAdminPages(getServerSideProps)({})).toEqual({
      notFound: true,
    });
    expect(getServerSideProps).not.toHaveBeenCalled();
  });

  it('runs the page code while on', async () => {
    process.env.ADMIN_PAGES_ENABLED = 'true';
    const context = { params: {} };
    const getServerSideProps = jest
      .fn()
      .mockResolvedValue({ props: { organization: { id: 178 } } });
    expect(await withAdminPages(getServerSideProps)(context)).toEqual({
      props: { organization: { id: 178 } },
    });
    expect(getServerSideProps).toHaveBeenCalledWith(context);
  });

  it('gives empty props while on, for a page without its own code', async () => {
    process.env.ADMIN_PAGES_ENABLED = 'true';
    expect(await withAdminPages()({})).toEqual({ props: {} });
  });

  it('reads the value at each request, not one time at the start', async () => {
    const getServerSideProps = withAdminPages();
    delete process.env.ADMIN_PAGES_ENABLED;
    expect(await getServerSideProps({})).toEqual({ notFound: true });
    process.env.ADMIN_PAGES_ENABLED = 'true';
    expect(await getServerSideProps({})).toEqual({ props: {} });
  });
});
