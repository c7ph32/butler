# Butler

---

get a url

### Install

To install the script locally use
[`deno install`](https://deno.land/manual/tools/script_installer)

```sh
deno install --allow-net https://raw.githubusercontent.com/yourtanish/butler/main/mod.ts
```

then use the script as

```sh
butler <URL>
```

## Flags

| flag        | alias                    | description                                                                                                             |
| ----------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `--headers` | `-h`                     | Display response headers in addition to response body                                                                   |
| `--method`  | `-m`, `--verb`, `-v`     | Change the HTTP method (default: `GET`)                                                                                 |
| `--body`    | `-b`, `--data`, `-d`     | Set the body to send with the request                                                                                   |
| `--json`    |                          | Parse the response body as JSON. This is enabled by default if the `Content-Type` headers are set as `application/json` |
| `--output`  | `-o`, `--response`, `-r` | Prints a plain-text response. Useful when redirecting to other commands                                                 |
