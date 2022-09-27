/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/display-name */
import MuiLink from '@mui/material/Link';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import NextLink from 'next/link';
import React from 'react';

// generate material-ui style hook
const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.text.primary,
    '& :hover': {
      color: theme.palette.text.primary,
    },
  },
}));

const NextComposed = React.forwardRef((props, ref) => {
  const { as, href, ...other } = props;
  const classes = useStyles();
  return (
    <NextLink href={href} as={as}>
      <a
        style={{ display: 'flex' }}
        ref={ref}
        {...other}
        className={classes.link}
      />
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

  const pathname = typeof href === 'string' ? href : href.pathname;

  const className = clsx(classNameProps, {
    [activeClassName]: pathname && activeClassName,
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
      sx={{ textDecoration: 'none' }}
      {...other}
    />
  );
}

const Link = React.forwardRef(
  (props, ref) => <LinkComponent {...props} innerRef={ref} />,
  { displayName: 'Link' },
);

export default Link;
