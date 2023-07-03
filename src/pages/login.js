// disable eslint for this file
/* eslint-disable */

import React from 'react';

//export Login component
function Login() {
  const [keycloak, setKeycloak] = React.useState(null);
  const [user, setUser] = React.useState(null);

  //load some javascript code by url
  React.useEffect(() => {
    let script = document.createElement('script');
    script.src = 'https://dev-k8s.treetracker.org/auth/js/keycloak.js';
    // script.async = true;
    document.body.appendChild(script);
    script = document.createElement('script');
    script.src = 'https://dev-k8s.treetracker.org/auth/js/keycloak-authz.js';
    // script.async = true;
    document.body.appendChild(script);

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

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function handleLogin() {
    console.log('keycloak redi:', keycloak.createLoginUrl());
    window.location.href = keycloak.createLoginUrl();
  }

  function handleLogout() {
    window.location.href = keycloak.createLogoutUrl();
  }

  function handleLoad() {
    var keycloak;
    var auzTemp;
    function doLoad() {
      keycloak = new window.Keycloak({
        url: 'https://dev-k8s.treetracker.org/auth',
        realm: 'treetracker',
        clientId: 'webmap',
        // realm: 'quickstart',
        // clientId: 'webmap-client',
      });
      setKeycloak(keycloak);

      console.warn('keycloak:', keycloak);
      // force logout everytime
      // keycloak.logout();
      //        var keycloakAuthz = new KeycloakAuthz(keycloak);
      keycloak
        .init({ onLoad: 'login-required' })
        .success(function () {
          console.log('User is now authenticated.');
          console.log('loaded token:', keycloak.token);
          keycloak.loadUserProfile().success(function (profile) {
            console.log('User profile loaded: ' + JSON.stringify(profile));
          });
          keycloak.loadUserInfo().then(() => {
            console.warn('user', keycloak.userInfo);
            console.warn('user', keycloak.userInfo);
          });
          console.error('keycloak', keycloak);
          if (keycloak.token) {
            auzTemp = new KeycloakAuthorization(keycloak);
            console.warn('auz', auzTemp);
            const inited = auzTemp.init();
            console.warn('inited', inited);
            //            .then(() => {
            //              console.warn('auz', auzTemp);
            //            });
            setTimeout(() => {
              console.warn('auz', auzTemp);
              auzTemp.entitlement('microservice').then((res) => {
                console.warn('entitlement', res);
                const r = jwt_decode(res);
                console.warn('r', r);
                console.log(JSON.stringify(r, undefined, 2));
                console.warn('rpt:', auzTemp.rpt);
                setUser(r);
              });
            }, 1000 * 2);
          } else {
            console.error('no token');
          }
        })
        .error(function (e) {
          console.error('User is not authenticated: ', e);
          // window.location.reload();
        });
    }

    function handleAPI() {
      fetch(
        'https://dev-k8s.treetracker.org/test-api/organizations/178/theme',
        {
          method: 'GET',
          headers: {
            //'Authorization': 'Bearer ' + keycloak.token,
            Authorization: 'Bearer ' + auzTemp.rpt,
          },
        },
      )
        .then(function (response) {
          console.log('response', response);
          return response.json();
        })
        .then(function (json) {
          console.log('json', json);
          document.getElementById('settings').innerHTML =
            'loaded settings: ' + JSON.stringify(json, undefined, 2);
        });
    }

    function handleAPI2() {
      fetch('https://dev-k8s.treetracker.org/test-api/web-map-settings', {
        method: 'GET',
        headers: {
          //'Authorization': 'Bearer ' + keycloak.token,
          Authorization: 'Bearer ' + auzTemp.rpt,
        },
      });
    }

    function handleAPI3() {
      fetch('https://dev-k8s.treetracker.org/test-api/web-map-settings', {
        method: 'POST',
        headers: {
          //'Authorization': 'Bearer ' + keycloak.token,
          Authorization: 'Bearer ' + auzTemp.rpt,
        },
      });
    }

    function handleAPI4() {
      fetch('https://dev-k8s.treetracker.org/test-api/organizations/178', {
        method: 'GET',
        headers: {
          //'Authorization': 'Bearer ' + keycloak.token,
          Authorization: 'Bearer ' + auzTemp.rpt,
        },
      });
    }

    function handleAPI5() {
      fetch('https://dev-k8s.treetracker.org/test-api/organizations/178', {
        method: 'POST',
        headers: {
          //'Authorization': 'Bearer ' + keycloak.token,
          Authorization: 'Bearer ' + auzTemp.rpt,
        },
      });
    }

    function handleLogout() {
      console.warn('begin logout');
      window.location.href = keycloak.createLogoutUrl();
    }

    doLoad();
  }

  React.useEffect(() => {
    setTimeout(() => {
      handleLoad();
    }, 3000);
  }, []);

  function gotoProfile() {
    window.open(
      'https://dev-k8s.treetracker.org/auth/realms/treetracker/account',
      '_blank',
    );
  }

  return (
    <div>
      <h1>Login</h1>
      <p>Log in here</p>
      {user && <h4>Hi, this is {user.preferred_username} </h4>}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={gotoProfile}>User Profile</button>
    </div>
  );
}

export default Login;
