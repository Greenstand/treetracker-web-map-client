import MuiLink from '@material-ui/core/Link';
import clsx from 'clsx';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

// eslint-disable-next-line react/display-name
const NextComposed = React.forwardRef((props, ref) => {
  const { as, href, ...other } = props;
  return (
    <NextLink href={href} as={as}>
      <a ref={ref} {...other} />
    </NextLink>
  );
});

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function LinkComponent(props) {
  const {
    href,
    activeClassName = 'active',
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props;

  const router = useRouter();
  const pathname = typeof href === 'string' ? href : href.pathname;

  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  });

  if (naked) {
    return (
      <NextComposed
        className={className}
        ref={innerRef}
        href={href}
        {...other}
      />
    );
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      href={href}
      {...other}
    />
  );
}

const Link = React.forwardRef(
  (props, ref) => <LinkComponent {...props} innerRef={ref} />,
  { displayName: 'Link' },
);

export default Link;
