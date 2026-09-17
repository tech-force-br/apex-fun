# 13 — Runner (aer)

## Job

Receive glued Apex from the website, run it with aer, return:

- Did it compile?
- Full log (errors + debug lines)
- Raw compiler / runtime text (for compile-fail matching)

The website decides pass/fail and which student message to show.

## Glue (v1 Variables)

Student snippet and hidden check share one method / one scope.

Conceptual shape (exact wrapper can be refined when aer is wired):

```apex
// site-generated wrapper
// --- student snippet ---
Integer age = 20;
// --- hidden check 1 ---
if (age != 20) {
    System.assert(false);
}
```

Compile-fail tests may glue a check that is **meant** not to compile (for example declaring the same name again).

Run hidden tests in order. Stop at the first failure from the site’s point of view. Implementation may run one glued program per test so compile-fail tests do not pollute run-clean tests.

## Runner service

- TypeScript
- Lives on the aer box
- Accepts only requests that have the site’s secret
- Writes the snippet to a temp file or stdin
- Calls `aer exec` (or the equivalent documented command)
- Enforces a timeout
- Deletes temp files
- Returns JSON

Do not expose aer to the public internet without that secret.

## License

aer is proprietary (October Swimmer LLC).

Free tier is limited (LSP, up to 100 tests per run, debugger 5 minutes). Other use needs a paid license. Embedding as a multi-user website is not a published plan.

Rules:

- Use aer to **build and test privately**
- Before any **public** launch: email October Swimmer and/or buy a license that covers the site
- Do not fork aer to dodge the license
- If they refuse, pick another runner

## Related

Back: [12-data-model.md](12-data-model.md)
Next: [14-launch-and-legal.md](14-launch-and-legal.md)
