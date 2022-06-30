import AutoRenewIcon from '@mui/icons-material/Autorenew';
import PreviewIcon from '@mui/icons-material/Preview';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Button, List, Stack, Grid } from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import axios from 'axios';
import log from 'loglevel';
import { useState, useEffect, useCallback } from 'react';
import {
  SwitchProp,
  SelectColorProp,
  SquareIconButton,
} from '../../components/playground';
import {
  PlaygroundProvider,
  usePlaygroundTheme,
  usePropUtils,
} from '../../context/playgroundContext';
import { buildTheme } from '../../context/themeContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { customizeOptions } from '../../models/themePlaygroundOptions';

function ThemeConfig() {
  const { keycloak } = useKeycloak();
  const [RPT, setRPT] = useState(null);
  // const [RPTToken, setRPTToken] = React.useState(null);
  const [auz, setAuz] = useState(null);
  const [theme, setTheme] = usePlaygroundTheme();
  const [key, setKey] = useState(1);
  const [user, setUser] = useState(null);
  const [autoReload, setAutoReload] = useState(false);
  const { setPropByPath } = usePropUtils();

  const [themeObject, setThemeObject] = useLocalStorage(
    'themeObject',
    undefined,
  );

  function handleChange(event) {
    const userValue = event.target.value;
    const parsedTheme = JSON.parse(userValue);
    setTheme(parsedTheme);
  }

  const handlePreview = useCallback(() => {
    setThemeObject({ ...theme });
    setKey(key + 1);
  }, [theme]);

  function handleSave() {
    // post theme to server
    const url = `${process.env.NEXT_PUBLIC_CONFIG_API}/organizations/${user.organization_id}/theme`;

    axios({
      method: 'POST',
      url,
      data: {
        theme,
      },
      headers: {
        // Authorization: `Bearer ${keycloak.token}`,
        Authorization: `Bearer ${auz.rpt}`,
      },
    })
      .then((response) => {
        log.warn('response:', response);
        alert('Theme saved!');
      })
      .catch((error) => {
        log.warn('error:', error);
        alert('Theme save failed!');
      });
  }

  function handleLoad() {
    // post theme to server
    const url = `${process.env.NEXT_PUBLIC_CONFIG_API}/organizations/${user.organization_id}/theme`;

    axios({
      method: 'get',
      url,
      headers: {
        // Authorization: `Bearer ${keycloak.token}`,
        Authorization: `Bearer ${auz.rpt}`,
      },
    })
      .then((response) => {
        // check status
        if (response.status === 200) {
          log.warn('response:', response);
          alert('Theme loaded!');
        } else {
          alert(`Theme load failed!${response.status}`);
        }
      })
      .catch((error) => {
        log.warn('error:', error);
        alert('Theme save loaded!');
      });
  }

  function resetAll() {
    log.warn('reseting theme');
    setTheme(buildTheme('light'));
  }

  function load() {
    // keycloak.onAuthSuccess((...args) => {
    //   log.warn('onAuthSuccess', args);
    // });
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

      keycloak.loadUserInfo().then(() => {
        log.warn('user', keycloak.userInfo);
        setUser(keycloak.userInfo);

        setTimeout(() => {
          auzTemp.entitlement('api-services').then((res) => {
            log.warn('entitlement', res);
            // eslint-disable-next-line no-undef
            const r = jwt_decode(res);
            log.warn('r', r);
            setRPT(r);
            // setRPTToken(res);
            if (r) {
              //   .then((res) => {
              //     log.warn('res', res);
              //   })
              //   .catch((err) => {
              //     log.warn('err', err);
              //   });
              const { organization_id } = user;
              const url = `${process.env.NEXT_PUBLIC_CONFIG_API}/organizations/${organization_id}/theme`;
              axios({
                method: 'GET',
                url,
                headers: {
                  // Authorization: `Bearer ${keycloak.token}`,
                  Authorization: `Bearer ${auzTemp.rpt}`,
                },
              })
                .then((response) => {
                  log.warn('response:', response);
                  setTheme(JSON.stringify(response.data.theme, null, 2));
                  setThemeObject(response.data.theme);
                })
                .catch((err) => {
                  log.warn('err', err);
                });
            } else {
              log.warn('r is null, do not request api-services');
            }
          });
        }, 3000);
      });
    } else {
      log.warn('no token');
    }
  }

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CONFIG_API) {
      log.warn('to load theme from server');
      const script = document.createElement('script');
      script.src = 'https://dev-k8s.treetracker.org/auth/js/keycloak-authz.js';
      script.id = 'googleMaps';
      document.body.appendChild(script);
      setTimeout(() => {
        load();
        // eslint-disable-next-line no-undef
        log.warn('loaded file:', KeycloakAuthorization);
      }, 10000);
    } else {
      log.warn(
        "There isn't setting's for config api, do not load theme from server",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // only trigger preview if auto reload is enabled
    if (!autoReload) return;
    handlePreview();
  }, [theme]);

  return (
    <Grid
      container
      sx={{
        height: '100vh',
      }}
    >
      <Grid item xs={9}>
        <iframe
          title="sandbox"
          key={key}
          src="http://localhost:3000/top"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Grid>
      <Grid
        item
        xs={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <SquareIconButton
            icon={<PreviewIcon />}
            tooltip="Reload Preview"
            onClick={handlePreview}
          />
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleLoad}>load</Button>
          <SquareIconButton
            icon={<RestartAltIcon />}
            color="error"
            tooltip="Reset to default"
            onClick={resetAll}
          />
          <SquareIconButton
            icon={<AutoRenewIcon />}
            color={autoReload ? 'success' : 'warning'}
            tooltip={`Auto Reload: ${autoReload ? 'on' : 'off'}`}
            onClick={() => setAutoReload((prev) => !prev)}
          />
        </Stack>
        <List
          sx={{
            p: 0,
            overflowY: 'scroll',
            flex: '1',
          }}
        >
          <SwitchProp
            prop="Theme mode"
            optionA="light"
            optionB="dark"
            initial={theme?.palette?.mode}
            onChange={(value) => {
              setPropByPath('palette.themeMode', value);
              setPropByPath('palette.mode', value);
            }}
          />
          {customizeOptions.palette.map((prop) => (
            <SelectColorProp
              key={`select-color-${prop}`}
              prop={prop}
              path={`palette.${prop}`}
            />
          ))}
        </List>
        <textarea
          onChange={handleChange}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '350px',
            minHeight: '200px',
            flex: '1',
          }}
          value={JSON.stringify(theme, null, 2)}
        />
      </Grid>
    </Grid>
  );
}

export default function ThemePlayground() {
  return (
    <PlaygroundProvider>
      <ThemeConfig />
    </PlaygroundProvider>
  );
}
