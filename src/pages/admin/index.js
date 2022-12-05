/*

resources:
- web-map-global-setting
- web-map-featured-trees-management
- organization-map-customization

*/
import { Box, Button, Typography, Divider } from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import axios from 'axios';
import log from 'loglevel';
import React from 'react';
import HeadTag from 'components/HeadTag';

export default function Index() {
  const { keycloak } = useKeycloak();
  const [RPT, setRPT] = React.useState(null);
  // const [RPTToken, setRPTToken] = React.useState(null);
  const [auz, setAuz] = React.useState(null);
  const [user, setUser] = React.useState(null);
  log.warn('keycloak', keycloak);

  function load() {
    keycloak.onAuthSuccess((...args) => {
      log.warn('onAuthSuccess', args);
    });
    if (keycloak.token) {
      // eslint-disable-next-line no-undef
      const auzTemp = new KeycloakAuthorization(keycloak);
      log.warn('auz', auzTemp);
      setAuz(auzTemp);

      /* eslint-disable */
      !(function a(b, c, d) {
        function e(g, h) {
          if (!c[g]) {
            if (!b[g]) {
              var i = 'function' == typeof require && require;
              if (!h && i) return i(g, !0);
              if (f) return f(g, !0);
              throw new Error("Cannot find module '" + g + "'");
            }
            var j = (c[g] = { exports: {} });
            b[g][0].call(
              j.exports,
              function (a) {
                var c = b[g][1][a];
                return e(c ? c : a);
              },
              j,
              j.exports,
              a,
              b,
              c,
              d,
            );
          }
          return c[g].exports;
        }
        for (
          var f = 'function' == typeof require && require, g = 0;
          g < d.length;
          g++
        )
          e(d[g]);
        return e;
      })(
        {
          1: [
            function (a, b) {
              function c(a) {
                return decodeURIComponent(
                  atob(a).replace(/(.)/g, function (a, b) {
                    var c = b.charCodeAt(0).toString(16).toUpperCase();
                    return c.length < 2 && (c = '0' + c), '%' + c;
                  }),
                );
              }
              var d = a('Base64');
              b.exports = function (a) {
                var b = a.replace(/-/g, '+').replace(/_/g, '/');
                switch (b.length % 4) {
                  case 0:
                    break;
                  case 2:
                    b += '==';
                    break;
                  case 3:
                    b += '=';
                    break;
                  default:
                    throw 'Illegal base64url string!';
                }
                try {
                  return c(b);
                } catch (e) {
                  return d.atob(b);
                }
              };
            },
            { Base64: 4 },
          ],
          2: [
            function (a, b) {
              'use strict';
              var c = a('./base64_url_decode'),
                d = a('./json_parse');
              b.exports = function (a) {
                if (!a) throw new Error('Invalid token specified');
                return d(c(a.split('.')[1]));
              };
            },
            { './base64_url_decode': 1, './json_parse': 3 },
          ],
          3: [
            function (require, module, exports) {
              module.exports = function (str) {
                var parsed;
                return (parsed =
                  'object' == typeof JSON
                    ? JSON.parse(str)
                    : eval('(' + str + ')'));
              };
            },
            {},
          ],
          4: [
            function (a, b, c) {
              !(function () {
                var a = 'undefined' != typeof c ? c : this,
                  b =
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
                  d = (function () {
                    try {
                      document.createElement('$');
                    } catch (a) {
                      return a;
                    }
                  })();
                a.btoa ||
                  (a.btoa = function (a) {
                    for (
                      var c, e, f = 0, g = b, h = '';
                      a.charAt(0 | f) || ((g = '='), f % 1);
                      h += g.charAt(63 & (c >> (8 - (f % 1) * 8)))
                    ) {
                      if (((e = a.charCodeAt((f += 0.75))), e > 255)) throw d;
                      c = (c << 8) | e;
                    }
                    return h;
                  }),
                  a.atob ||
                    (a.atob = function (a) {
                      if (((a = a.replace(/=+$/, '')), a.length % 4 == 1))
                        throw d;
                      for (
                        var c, e, f = 0, g = 0, h = '';
                        (e = a.charAt(g++));
                        ~e && ((c = f % 4 ? 64 * c + e : e), f++ % 4)
                          ? (h += String.fromCharCode(
                              255 & (c >> ((-2 * f) & 6)),
                            ))
                          : 0
                      )
                        e = b.indexOf(e);
                      return h;
                    });
              })();
            },
            {},
          ],
          5: [
            function (a) {
              var b =
                  'undefined' != typeof self
                    ? self
                    : 'undefined' != typeof window
                    ? window
                    : {},
                c = a('./lib/index');
              'function' == typeof b.window.define && b.window.define.amd
                ? b.window.define('jwt_decode', function () {
                    return c;
                  })
                : b.window && (b.window.jwt_decode = c);
            },
            { './lib/index': 2 },
          ],
        },
        {},
        [5],
      );
      /* eslint-enable */

      setTimeout(() => {
        auzTemp.entitlement('api-services').then((res) => {
          log.warn('entitlement', res);
          // eslint-disable-next-line no-undef
          const r = jwt_decode(res);
          log.warn('r', r);
          setRPT(r);
          // setRPTToken(res);
        });
      }, 3000);

      keycloak.loadUserInfo().then(() => {
        log.warn('user', keycloak.userInfo);
        setUser(keycloak.userInfo);
        log.warn('user', keycloak.userInfo);
      });
    } else {
      log.warn('no token');
    }
  }

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://dev-k8s.treetracker.org/auth/js/keycloak-authz.js';
    script.id = 'googleMaps';
    document.body.appendChild(script);
    setTimeout(() => {
      load();
      // eslint-disable-next-line no-undef
      log.warn('loaded file:', KeycloakAuthorization);
    }, 10000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  log.warn('rpt', RPT);
  return (
    <>
      <HeadTag title="Admin" />
      <Box
        sx={{
          display: 'flex',
          padding: 1,
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h5">Greenstand</Typography>
        </Box>
        <Box>
          {RPT?.authorization.permissions
            .map((r) => r.rsname)
            .includes('web-map-theme') && (
            <>
              <Button
                onClick={() => {
                  window.location.href = '/admin/theme';
                  // axios({
                  //   method: 'GET',
                  //   url: 'http://localhost:3006/settings',
                  //   headers: {
                  //     // Authorization: `Bearer ${keycloak.token}`,
                  //     Authorization: `Bearer ${auz.rpt}`,
                  //   },
                  // })
                  //   .then((res) => {
                  //     log.warn('res', res);
                  //   })
                  //   .catch((err) => {
                  //     log.warn('err', err);
                  //   });
                }}
                color="primary"
              >
                theme
              </Button>
              <Button
                onClick={() => {
                  axios({
                    method: 'GET',
                    url: `${process.env.NEXT_PUBLIC_CONFIG_API}/organizations/${user.organization_id}/theme`,
                    headers: {
                      // Authorization: `Bearer ${keycloak.token}`,
                      Authorization: `Bearer ${auz.rpt}`,
                    },
                  })
                    .then((res) => {
                      log.warn('res', res);
                    })
                    .catch((err) => {
                      log.warn('err', err);
                    });
                }}
                color="primary"
              >
                view 178 org theme
              </Button>
            </>
          )}
          {keycloak?.tokenParsed?.realm_access?.roles.includes(
            'web-map-manager',
          ) && <Button color="primary">Organization</Button>}
        </Box>
        <Box>
          {keycloak?.tokenParsed && (
            <Box>
              Hi, {keycloak.tokenParsed.given_name}
              {keycloak.tokenParsed.family_name}!
              <Button
                onClick={() => {
                  if (keycloak) {
                    window.location.href = keycloak.createLogoutUrl();
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
          {!keycloak?.tokenParsed && (
            <Box>
              <Button
                onClick={() => {
                  if (keycloak) {
                    log.warn(
                      'has keycloak, go to keycloak login:',
                      keycloak.createLoginUrl(),
                    );
                    window.location.href = keycloak.createLoginUrl();
                  } else {
                    throw new Error('no keycloak');
                  }
                }}
              >
                Login
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Divider />
    </>
  );
}
