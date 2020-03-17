/* eslint-disable max-lines */
'use strict';

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const request = require('superagent');
const URL = require('url');
const UUID = require('uuid/v4');
const { ApiErrorFactory } = require('./errors');
const { Logger } = require('@hmcts/nodejs-logging');
const NodeCache = require('node-cache');

const errorFactory = ApiErrorFactory('security.js');
const stdTTL = 600;

const constants = Object.freeze({
  SECURITY_COOKIE: '__auth-token',
  REDIRECT_COOKIE: '__redirect',
  USER_COOKIE: '__user-info',
  SITEID_COOKIE: '__site-id',
  SCOPE_COOKIE: '__user_scope'
});

const ACCESS_TOKEN_OAUTH2 = 'access_token';

function Security(options) {
  this.cache = new NodeCache({ stdTTL, useClones: false });
  this.opts = options || {};
  this.opts.userDetailsKeyPrefix = `${options.apiUrl}/o/userinfo/`;
  if (!this.opts.loginUrl) {
    throw new Error('login URL required for Security');
  }
}

/* --- INTERNAL --- */

function addOAuth2Parameters(url, state, self, req) {
  // const scope = req.cookies[constants.SCOPE_COOKIE];
  // if (scope) {
  //   url.query.scope = scope;
  // }
  url.query.response_type = 'code';
  url.query.state = state;
  url.query.scope = 'openid profile roles';
  url.query.client_id = self.opts.clientId;
  url.query.redirect_uri = `https://${req.get('host')}${self.opts.redirectUri}`;
}

function generateState() {
  return UUID();
}

function storeRedirectCookie(req, res, continueUrl, state) {
  const url = URL.parse(continueUrl);
  const cookieValue = { continue_url: url.path, state };
  if (req.protocol === 'https') {
    res.cookie('kk', 'kk');
    res.cookie(constants.REDIRECT_COOKIE, JSON.stringify(cookieValue),
      { secure: true, httpOnly: true });
  } else {
    res.cookie('kk1', 'kk1');
    res.cookie(constants.REDIRECT_COOKIE, JSON.stringify(cookieValue),
      { httpOnly: true });
  }
}

function login(req, res, roles, self) {
  const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const state = generateState();
  res.cookie('eleven', 'eleven');
  storeRedirectCookie(req, res, originalUrl, state);
  res.cookie('twelve', 'twelve');
  let url = null;

  if (roles.includes('letter-holder')) {
    url = URL.parse(`${self.opts.loginUrl}/pin`, true);
  } else {
    url = URL.parse(self.opts.loginUrl, true);
  }
  res.cookie('thirteen', 'thirteen');
  addOAuth2Parameters(url, state, self, req);
  res.cookie('three', 'three');
  res.redirect(url.format());
}

function authorize(req, res, next, self) {
  res.cookie('roles', req.roles);
  if (req.roles !== null) {
    for (const role in self.roles) {
      if (req.roles.includes(self.roles[role])) {
        res.cookie('roles1', req.userInfo);
        res.cookie(constants.USER_COOKIE, JSON.stringify(req.userInfo));
        return next();
      }
    }
  }
  const error = errorFactory.createForbiddenError(null, `ERROR: Access forbidden - User does not have any of ${self.roles}. Actual roles:${req.roles}`);
  return next(error);
}

function getTokenFromCode(self, req) {
  const url = URL.parse(`${self.opts.apiUrl}/o/token`, true);
  return request.post(url.format())
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({ client_id: self.opts.clientId })
    .send({ client_secret: self.opts.clientSecret })
    .send({ grant_type: 'authorization_code' })
    .send({ code: req.query.code })
    .send({ redirect_uri: `https://${req.get('host')}${self.opts.redirectUri}` });
}

function invalidateToken(self, req) {
  const url = URL.parse(`${self.opts.apiUrl}/session/${req.cookies[constants.SECURITY_COOKIE]}`, true);

  return request.delete(url.format())
    .auth(self.opts.clientId, self.opts.clientSecret);
}

function getUserDetails(self, securityCookie) {
  const value = self.cache.get(self.opts.userDetailsKeyPrefix + securityCookie);
  if (value) {
    const promise = Promise.resolve(value);
    promise.end = callback => {
      callback(null, value);
    };
    return promise;
  }
  return request.get(`${self.opts.apiUrl}/o/userinfo`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${securityCookie}`);
}

function getUserSite(self, email, securityCookie) {
  return request.get(`${self.opts.siteRequestUrl}/sites?my-sites=true`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${securityCookie}`);
}

function storeCookie(req, res, key, value, isHttpOnly) {
  // eslint-disable-next-line no-undefined
  const httpOnly = isHttpOnly === undefined ? true : isHttpOnly;
  if (req.protocol === 'https') { /* SECURE */
    res.cookie(key, value, { secure: true, httpOnly });
  } else {
    res.cookie(key, value, { httpOnly });
  }
}

function storeTokenCookie(req, res, token) {
  req.authToken = token;
  storeCookie(req, res, constants.SECURITY_COOKIE, token);
}

function handleCookie(req) {
  if (req.cookies && req.cookies[constants.SECURITY_COOKIE]) {
    req.authToken = req.cookies[constants.SECURITY_COOKIE];
    return req.authToken;
  }

  return null;
}

Security.prototype.logout = function logout() {
  const self = { opts: this.opts, cache: this.cache };

  return function ret(req, res) {
    return invalidateToken(self, req).end(err => {
      if (err) {
        Logger.getLogger('BAR-WEB: security.js').error(err);
      }

      const token = req.cookies[constants.SECURITY_COOKIE];
      res.clearCookie(constants.SECURITY_COOKIE);
      res.clearCookie(constants.REDIRECT_COOKIE);
      res.clearCookie(constants.USER_COOKIE);
      res.clearCookie(constants.SCOPE_COOKIE);
      if (token) {
        self.cache.del(token);
      }
      res.redirect('/');
    });
  };
};

function protectImpl(req, res, next, self) {
  if (self.exceptUrls) {
    for (let i = 0; i < self.exceptUrls.length; i++) {
      if (req.url.includes(self.exceptUrls[i])) {
        return next();
      }
    }
  }
  let securityCookie = null;
  if (process.env.NODE_ENV === 'development') {
    if (req.method === 'OPTIONS') {
      return next();
    }
    req.cookies[constants.SECURITY_COOKIE] = req.header('Auth-Dev');
  }
  securityCookie = handleCookie(req);

  if (!securityCookie) {
    res.cookie('lg', 'lg');
    return login(req, res, self.roles, self);
  }
  res.cookie('four', 'four');
  return getUserDetails(self, securityCookie).end(
    (err, response) => {
      res.cookie('test', error);
      if (err) {
        if (!err.status) {
          err.status = 500;
        }
        res.cookie('getuserdetailerror', err);
        res.cookie('getuserdetailerrorstatus', err.status);
        switch (err.status) {
        case UNAUTHORIZED:
          return login(req, res, self.roles, self);
        case FORBIDDEN:
          return next(errorFactory.createForbiddenError(err, `getUserDetails() call while accessing ${req.url} was forbidden`));
        default:
          return next(errorFactory.createServerError(err, `getUserDetails() call while accessing ${req.url} failed with status: ${err.status}`));
        }
      }
      res.cookie('test66', resp.body[sub]);
      // const userInfo = resp.body;
      self.cache.set(self.opts.userDetailsKeyPrefix + securityCookie, response);
      self.opts.appInsights.setAuthenticatedUserContext(response.body.sub);
      req.roles = response.body.roles;
      req.userInfo = response.body;
      return authorize(req, res, next, self);
    });
}

Security.prototype.protect = function protect(role, exceptUrls) {
  const self = {
    roles: [role],
    new: false,
    opts: this.opts,
    exceptUrls,
    cache: this.cache
  };

  return function ret(req, res, next) {
    protectImpl(req, res, next, self);
  };
};

Security.prototype.protectWithAnyOf = function protectWithAnyOf(roles, exceptUrls) {
  const self = {
    roles,
    new: false,
    opts: this.opts,
    exceptUrls,
    cache: this.cache
  };

  return function ret(req, res, next) {
    protectImpl(req, res, next, self);
  };
};

Security.prototype.protectWithUplift = function protectWithUplift(role, roleToUplift) {
  const self = {
    role,
    roleToUplift,
    new: false,
    opts: this.opts
  };

  return function ret(req, res, next) {
    /* Read the value of the token from the cookie */
    const securityCookie = handleCookie(req);
    res.cookie('five', 'five');
    if (!securityCookie) {
      return login(req, res, self.role, self);
    }
    return getUserDetails(self, securityCookie)
      .end((err, response) => {
        if (err) {
          /* If the token is expired we want to go to login.
          * - This invalidates correctly sessions of letter users that does not exist anymore
          */
          res.cookie('getuserdetailerror1', req);
          if (err.status === UNAUTHORIZED) {
            return login(req, res, [], self);
          }
          return next(errorFactory.createUnathorizedError(err, `getUserDetails() call failed: ${response.text}`));
        }
        res.cookie('six', 'six');
        req.roles = response.body.roles;
        req.userInfo = response.body;

        if (req.roles.includes(self.role)) { /* LOGGED IN ALREADY WITH THE UPLIFTED USER */
          return next();
        }

        if (!req.roles.includes(self.roleToUplift)) {
          return next(errorFactory.createUnathorizedError(err, 'This user can not uplift'));
        }

        /* REDIRECT TO UPLIFT PAGE */
        const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        const state = generateState();
        storeRedirectCookie(req, res, originalUrl, state);

        const url = URL.parse(`${self.opts.loginUrl}/uplift`, true);
        addOAuth2Parameters(url, state, self, req);
        url.query.jwt = securityCookie;

        return res.redirect(url.format());
      });
  };
};

function getRedirectCookie(req) {
  res.cookie('getredirectcookie', req);
  if (!req.cookies[constants.REDIRECT_COOKIE]) {
    return null;
  }

  return JSON.parse(req.cookies[constants.REDIRECT_COOKIE]);
}

function validateSite(savedSiteId, sites) {
  if (!sites || sites.length < 1) {
    return '';
  }
  if (!savedSiteId) {
    return sites[0].id;
  }
  const selectedSite = sites.find(site => site.id === savedSiteId);
  let selectedSiteId = '';
  if (selectedSite) {
    selectedSiteId = selectedSite.id;
  } else {
    selectedSiteId = sites[0].id;
  }
  return selectedSiteId;
}

/* Callback endpoint */
Security.prototype.OAuth2CallbackEndpoint = function OAuth2CallbackEndpoint() {
  const self = { opts: this.opts, cache: this.cache };
  return function ret(req, res, next) {
    /* We clear any potential existing sessions first, as we want to start over even if we deny access */
    res.clearCookie(constants.SECURITY_COOKIE);
    res.clearCookie(constants.USER_COOKIE);

    /* We check that our stored state matches the requested one */
    res.cookie('testredirect', req);
    const redirectInfo = getRedirectCookie(req);
    if (!redirectInfo) {
      return next(errorFactory.createUnathorizedError(null, 'Redirect cookie is missing'));
    }

    if (redirectInfo.state !== req.query.state) {
      return next(errorFactory.createUnathorizedError(null, `States do not match: ${redirectInfo.state} is not ${req.query.state}`));
    }

    if (!redirectInfo.continue_url.startsWith('/')) {
      return next(errorFactory.createUnathorizedError(null, `Invalid redirect_uri: ${redirectInfo.continue_url}`));
    }

    if (!req.query.code) {
      return res.redirect(redirectInfo.continue_url);
    }

    return getTokenFromCode(self, req).end(async(err, response) => { /* We ask for the token */
      if (err) {
        return next(errorFactory.createUnathorizedError(err, 'getTokenFromCode call failed'));
      }

      /* We store it in a session cookie */
      storeTokenCookie(req, res, response.body[ACCESS_TOKEN_OAUTH2]);

      /* We delete redirect cookie */
      res.clearCookie(constants.REDIRECT_COOKIE);

      /* We initialise appinsight with user details */
      try {
        res.cookie('two', 'two');
        const userDetails = await getUserDetails(self, req.authToken);
        res.cookie('userDetails', userDetails);
        const userInfo = userDetails.body;
        self.cache.set(self.opts.userDetailsKeyPrefix + req.authToken, userDetails);
        self.opts.appInsights.setAuthenticatedUserContext(`${userInfo.uid}-${userInfo.given_name}-${userInfo.family_name}`);
        self.opts.appInsights.defaultClient.trackEvent({ name: 'login_event', properties: { role: userInfo.roles } });
        const sites = await getUserSite(self, userInfo.sub, req.authToken);
        const savedSiteId = req.cookies[constants.SITEID_COOKIE];
        const currentSiteId = validateSite(savedSiteId, sites.body);
        storeCookie(req, res, constants.SITEID_COOKIE, currentSiteId, false);
      } catch (e) {
        Logger.getLogger('BAR-WEB: security.js').error(e.response ? e.response.error : e.message);
      }

      /* And we redirect back to where we originally tried to access */
      return res.redirect(redirectInfo.continue_url);
    });
  };
};

module.exports = {
  Security,
  constants
};
