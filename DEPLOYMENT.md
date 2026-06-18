# BTC Karma Docs — Deployment

How the docs at **docs.btckarma.io** are built and shipped.

## Overview

- **Content:** GitBook-style markdown under `btc-karma-gitbook/` (single source of truth).
- **Build:** [Docusaurus 3](https://docusaurus.io) in `website/` renders that markdown into a
  static site, themed to match the BTC Karma branding. `cd website && npm run build` →
  output in `website/build/`.
- **Host:** Amazon S3 (private) behind CloudFront, mapped to `docs.btckarma.io`.
- **CI/CD:** `.github/workflows/deploy-docs.yml` rebuilds and redeploys on every push to
  `main` that touches `btc-karma-gitbook/**` or `website/**`.

## Repo layout

```
btc-karma-gitbook/        # markdown content (+ frontmatter + _category_.json per section)
  README.md               # site homepage (slug: /)
  start-here/  rewards/  security/  ecosystem/
website/                  # Docusaurus app (config, theme, css)
  docusaurus.config.js    # docs path -> ../btc-karma-gitbook, routeBasePath '/'
  src/css/custom.css      # dark + gold BTC Karma theme
  static/img/             # btc-karma-wordmark.svg (navbar), karma-logo.svg (favicon)
.github/workflows/deploy-docs.yml
```

> The repo-root `summary.md` / `readme.md` are broken GitBook git-sync artifacts (links
> point at `/broken/pages/...`) and are **excluded** from the build. Content titles/order
> come from each file's frontmatter and each folder's `_category_.json`. If GitBook git-sync
> is ever re-enabled and overwrites the content, re-apply the frontmatter + category files.

## Local build

```bash
cd website
npm install
npm start          # live dev server at http://localhost:3000
npm run build      # static output in website/build
npm run serve      # serve the production build locally
```

## AWS resources (account 472757222684, us-east-1)

| Resource | Value | Status |
|---|---|---|
| Production bucket (private) | `docs.btckarma.io` | ✅ created, public access blocked, site deployed |
| Origin Access Control | `ECSLGP9BGLTPO` (`docs-btckarma-oac`) | ✅ created |
| CloudFront distribution | `E3NAJ3WY42WCSC` → `d33pdsn0kbxv7p.cloudfront.net` | ✅ Deployed, serving HTTPS |
| CloudFront function (URL rewrite) | `docs-btckarma-rewrite` (viewer-request) | ✅ appends `index.html` for clean URLs |
| Custom error response | `403 → /404.html` | ✅ Docusaurus 404 page |
| Bucket policy (OAC scoped) | allows that distribution only | ✅ set |
| Public preview bucket | `btckarma-docs-preview` | temporary — tear down after cutover |
| ACM cert for docs.btckarma.io | us-east-1 | ❌ **BLOCKED — `acm:RequestCertificate` denied for `lorenze`** |
| CloudFront alias + viewer cert | `docs.btckarma.io` | ⏳ pending the ACM cert |
| Route 53 cutover | `docs.btckarma.io` A → CloudFront | ⏳ ready (write verified); currently A → 76.76.21.21 (Vercel) |

`lorenze` has CloudFront and Route 53 access (verified). The **only** remaining permission
gap is **`acm:RequestCertificate`** (+ `acm:AddTagsToCertificate`). Once granted, the cutover
below completes end-to-end with no further admin help.

## Why a CloudFront Function?

With OAC the S3 origin is the REST endpoint, which does **not** resolve `/path` to
`/path/index.html` (only the distribution root object does). Docusaurus emits
`start-here/quick-start/index.html`, so a request to `/start-here/quick-start` would 403.
The `docs-btckarma-rewrite` viewer-request function appends `index.html` to directory-style
URLs to fix this.

## Remaining production cutover

### 1. ACM certificate — **needs `acm:RequestCertificate` granted first**
```bash
CERT=$(aws acm request-certificate --region us-east-1 \
  --domain-name docs.btckarma.io --validation-method DNS \
  --query CertificateArn --output text)
aws acm describe-certificate --region us-east-1 --certificate-arn "$CERT" \
  --query "Certificate.DomainValidationOptions[0].ResourceRecord"
```

### 2. Add the validation CNAME to the btckarma.io zone (`Z011288421CEM1C1083FZ`)
UPSERT the CNAME from step 1, then
`aws acm wait certificate-validated --certificate-arn "$CERT" --region us-east-1`.

### 3. Attach the alias + cert to distribution `E3NAJ3WY42WCSC`
Set `Aliases = [docs.btckarma.io]` and `ViewerCertificate = { ACMCertificateArn: $CERT,
SSLSupportMethod: sni-only, MinimumProtocolVersion: TLSv1.2_2021 }`.

### 4. Route 53 cutover — replaces the live Vercel site
Current record: `docs.btckarma.io` **A → 76.76.21.21** (Vercel, TTL 300). Replace with an
ALIAS A to the distribution (CloudFront zone id `Z2FDTNDATAQYW2`):
```bash
aws route53 change-resource-record-sets --hosted-zone-id Z011288421CEM1C1083FZ --change-batch '{
  "Changes":[{"Action":"UPSERT","ResourceRecordSet":{
    "Name":"docs.btckarma.io","Type":"A",
    "AliasTarget":{"HostedZoneId":"Z2FDTNDATAQYW2",
      "DNSName":"d33pdsn0kbxv7p.cloudfront.net","EvaluateTargetHealth":false}}}]}'
```
Reversible: flip the A record back to `76.76.21.21` to restore the old site (within TTL).

## CI/CD — GitHub Actions (auto-deploy on push)

`.github/workflows/deploy-docs.yml` does: `npm ci` → `npm run build` (Docusaurus) →
`s3 sync` → CloudFront invalidation. Bucket and distribution id are set as `env` in the
workflow. To activate, add one repo **secret**:

| Secret | Value |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | IAM role ARN the workflow assumes via OIDC |

The deploy role needs a trust policy for the GitHub OIDC provider
(`token.actions.githubusercontent.com`) scoped to `repo:cswapsystems/karma-docs:*`, and a
permissions policy allowing `s3:PutObject/DeleteObject/ListBucket` on `docs.btckarma.io`
plus `cloudfront:CreateInvalidation` on the distribution.

(Long-lived `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` secrets also work if OIDC isn't set
up — swap the `configure-aws-credentials` inputs accordingly.)
