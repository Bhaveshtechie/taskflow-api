## HTTP Fundamentals — My Notes

### Idempotency

If you call an endpoint multiple times: The final state should be the same as calling it once(maintaining the result no matter how many times you perform a operation again and again on it.)
Hint to check yourself: if I call DELETE /users/42 five times,
what happens each time? Is that idempotent?
GET ,PUT , DELETE , HEAD , OPTIONS are idempotent.
POST and PATCH are not ideempotent.

### Safe vs Unsafe methods

[Which methods are safe? What does "safe" mean exactly?]
GET, HEAD, OPTIONS are safe methods. Safe does NOT modify server state

### 401 vs 403

401 - user/client is unauthenticated
403 - user/client is authenticated but not authorized
Hint: think about the airport analogy from the curriculum

### Content-Type

[What does it tell the client? What happens if it's wrong or missing?]
Tells the client what format the response body is in.
For example :- application/json , text/html , image/png

If wrong or missing:
Client may:
Fail to parse response
Misinterpret data
Show errors or garbage output

### Status code for each scenario:

- User submits a form with invalid email format: 400
- User tries to delete someone else's post: 403
- Server crashes because of a null pointer bug: 500 Internal Server Error
- POST /users creates a new user successfully: 201
- GET /users/999 where 999 doesn't exist: 404
- GET /users/42 but the client's cached version is still fresh: 304 Not Modified

### HTTP request and their raw response:

1. curl -i https://api.github.com/users/torvalds (See the full response including headers)
   HTTP/2 200
   date: Thu, 02 Apr 2026 16:08:29 GMT
   content-type: application/json; charset=utf-8
   cache-control: public, max-age=60, s-maxage=60
   vary: Accept,Accept-Encoding, Accept, X-Requested-With
   etag: W/"6b9dc87d1980c3d50c5fb9987c61f08d68275637dff743669bcc681b57a0d746"
   last-modified: Tue, 13 Jan 2026 07:10:05 GMT
   x-github-media-type: github.v3; format=json
   x-github-api-version-selected: 2022-11-28
   access-control-expose-headers: ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset
   access-control-allow-origin: \*
   strict-transport-security: max-age=31536000; includeSubdomains; preload
   x-frame-options: deny
   x-content-type-options: nosniff
   x-xss-protection: 0
   referrer-policy: origin-when-cross-origin, strict-origin-when-cross-origin
   content-security-policy: default-src 'none'
   server: github.com
   accept-ranges: bytes
   x-ratelimit-limit: 60
   x-ratelimit-remaining: 59
   x-ratelimit-used: 1
   x-ratelimit-resource: core
   x-ratelimit-reset: 1775149709
   content-length: 1358
   x-github-request-id: E29D:1C6C73:D782D9:EE7BB3:69CE947D

   {
   "login": "torvalds",
   "id": 1024025,
   "node_id": "MDQ6VXNlcjEwMjQwMjU=",
   "avatar_url": "https://avatars.githubusercontent.com/u/1024025?v=4",
   "gravatar_id": "",
   "url": "https://api.github.com/users/torvalds",
   "html_url": "https://github.com/torvalds",
   "followers_url": "https://api.github.com/users/torvalds/followers",
   "following_url": "https://api.github.com/users/torvalds/following{/other_user}",
   "gists_url": "https://api.github.com/users/torvalds/gists{/gist_id}",
   "starred_url": "https://api.github.com/users/torvalds/starred{/owner}{/repo}",
   "subscriptions_url": "https://api.github.com/users/torvalds/subscriptions",
   "organizations_url": "https://api.github.com/users/torvalds/orgs",
   "repos_url": "https://api.github.com/users/torvalds/repos",
   "events_url": "https://api.github.com/users/torvalds/events{/privacy}",
   "received_events_url": "https://api.github.com/users/torvalds/received_events",
   "type": "User",
   "user_view_type": "public",
   "site_admin": false,
   "name": "Linus Torvalds",
   "company": "Linux Foundation",
   "blog": "",
   "location": "Portland, OR",
   "email": null,
   "hireable": null,
   "bio": null,
   "twitter_username": null,
   "public_repos": 11,
   "public_gists": 1,
   "followers": 294477,
   "following": 0,
   "created_at": "2011-09-03T15:26:22Z",
   "updated_at": "2026-01-13T07:10:05Z"
   }

2. curl -I https://api.github.com/users/torvalds (See only the headers)
   HTTP/2 200
   date: Thu, 02 Apr 2026 16:11:21 GMT
   content-type: application/json; charset=utf-8
   cache-control: public, max-age=60, s-maxage=60
   vary: Accept,Accept-Encoding, Accept, X-Requested-With
   etag: W/"408a5e6ed20d668ee44ad841d58ac84d80ebef4ea0260a86f15e7a488ac1fea3"
   last-modified: Tue, 13 Jan 2026 07:10:05 GMT
   x-github-media-type: github.v3; format=json
   x-github-api-version-selected: 2022-11-28
   access-control-expose-headers: ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset
   access-control-allow-origin: \*
   strict-transport-security: max-age=31536000; includeSubdomains; preload
   x-frame-options: deny
   x-content-type-options: nosniff
   x-xss-protection: 0
   referrer-policy: origin-when-cross-origin, strict-origin-when-cross-origin
   content-security-policy: default-src 'none'
   server: github.com
   accept-ranges: bytes
   x-ratelimit-limit: 60
   x-ratelimit-remaining: 58
   x-ratelimit-used: 2
   x-ratelimit-resource: core
   x-ratelimit-reset: 1775149709
   content-length: 1358
   x-github-request-id: E58A:20B1FF:D5D636:ECDF01:69CE9528

3. curl -v https://api.github.com/users/torvalds 2>&1 | head -50 (See the request headers you're sending + response headers)
   % Total % Received % Xferd Average Speed Time Time Time Current
   Dload Upload Total Spent Left Speed
   0 0 0 0 0 0 0 0 --:--:-- --:--:-- --:--:-- 0\* Host api.github.com:443 was resolved.
   - IPv6: 64:ff9b::14cf:4955
   - IPv4: 20.207.73.85
   - Trying [64:ff9b::14cf:4955]:443...
   - Connected to api.github.com (64:ff9b::14cf:4955) port 443
   - ALPN: curl offers h2,http/1.1
   - (304) (OUT), TLS handshake, Client hello (1):
     } [319 bytes data]
   - CAfile: /etc/ssl/cert.pem
   - CApath: none
     0 0 0 0 0 0 0 0 --:--:-- --:--:-- --:--:-- 0\* (304) (IN), TLS handshake, Server hello (2):
     { [122 bytes data]
   - (304) (IN), TLS handshake, Unknown (8):
     { [19 bytes data]
   - (304) (IN), TLS handshake, Certificate (11):
     { [2740 bytes data]
   - (304) (IN), TLS handshake, CERT verify (15):
     { [79 bytes data]
   - (304) (IN), TLS handshake, Finished (20):
     { [36 bytes data]
   - (304) (OUT), TLS handshake, Finished (20):
     } [36 bytes data]
   - SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256 / [blank] / UNDEF
   - ALPN: server accepted h2
   - Server certificate:
   - subject: CN=\*.github.com
   - start date: Mar 6 00:00:00 2026 GMT
   - expire date: Jun 3 23:59:59 2026 GMT
   - subjectAltName: host "api.github.com" matched cert's "\*.github.com"
   - issuer: C=GB; O=Sectigo Limited; CN=Sectigo Public Server Authentication CA DV E36
   - SSL certificate verify ok.
   - using HTTP/2
   - [HTTP/2] [1] OPENED stream for https://api.github.com/users/torvalds
   - [HTTP/2] [1] [:method: GET]
   - [HTTP/2] [1] [:scheme: https]
   - [HTTP/2] [1] [:authority: api.github.com]
   - [HTTP/2] [1] [:path: /users/torvalds]
   - [HTTP/2] [1] [user-agent: curl/8.7.1]
   - [HTTP/2] [1] [accept: */*]
     > GET /users/torvalds HTTP/2
     > Host: api.github.com
     > User-Agent: curl/8.7.1
     > Accept: _/_
   - Request completely sent off
     < HTTP/2 200
     < date: Thu, 02 Apr 2026 16:13:01 GMT
     < content-type: application/json; charset=utf-8
