# Edgaze OpenAPI specification

Machine-readable OpenAPI 3.1 description of the Edgaze REST API.

Repository: https://github.com/edgaze-ai/edgaze-openapi

Use this repository to generate clients, import into Postman or Insomnia, or pin a spec version in your own CI.

## Get the specification

JSON (same bytes as `https://www.edgaze.ai/openapi.json`):

```sh
curl -L https://raw.githubusercontent.com/edgaze-ai/edgaze-openapi/main/openapi.json \
  -o edgaze-openapi.json
```

YAML:

```sh
curl -L https://raw.githubusercontent.com/edgaze-ai/edgaze-openapi/main/openapi.yaml \
  -o edgaze-openapi.yaml
```

The document uses **OpenAPI 3.1** and can be imported into tools that support the OpenAPI ecosystem.

## Live fetch URLs

These URLs always serve the current production document and do not require a key:

- https://api.edgaze.ai/v1/openapi
- https://www.edgaze.ai/api/v1/openapi
- https://www.edgaze.ai/openapi.json

This repository is the pin. The live URLs move with production.

## Docs

- [API reference](https://www.edgaze.ai/docs/api)
- [OpenAPI page](https://www.edgaze.ai/docs/api/openapi)

## How this repository is updated

The spec is generated from the public API in [edgaze-ai/edgaze](https://github.com/edgaze-ai/edgaze). Two automatic paths keep this repository current:

1. On merge to `main` in the product repo, a publish workflow copies the committed document here when `OPENAPI_PUBLISH_TOKEN` is configured.
2. This repository also pulls `https://www.edgaze.ai/openapi.json` every 20 minutes and refreshes JSON and YAML.

Do not edit `openapi.json` or `openapi.yaml` by hand; those files are overwritten.

Issues about the API surface are welcome. Spec-file edits will be replaced on the next publish.

## License

MIT
