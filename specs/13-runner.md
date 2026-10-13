# 13 — Runner (aer)

## Job

Receive glued Apex from the website, run it with aer, return:

- Did it compile?
- Full log (errors + debug lines)
- Raw compiler / runtime text (for compile-fail matching)

The website decides pass/fail and which student message to show.

## Glue (v1 Variables)

Student snippet and hidden check share one method / one scope.

The program is an anonymous Apex block. There is no wrapper class. The site puts the student snippet first and, for a run-clean test, the check immediately after it:

```apex
Integer age = 20;
if (age != 20) {
    System.assert(false);
}
```

The site sends the student snippet alone first. If the runner reports that it did not compile, the site matches that raw compiler text against the shared compile-fail list and stops. It does not glue a check. If the snippet compiled, the site discards that result and runs every run-clean test, in card order, each as its own program. Stop at the first failure from the site’s point of view. A compile-fail explanation does not change the run-clean glue.

Superseded: running a compile-fail test as its own program that passed only when the code failed to compile, in card order, and only when that card had one.

## Runner service

- TypeScript
- Lives on the aer box
- Accepts only requests that have the site’s secret
- Writes the snippet to stdin
- Calls `aer exec -q`
- Enforces a timeout of 10 seconds (`RUNNER_TIMEOUT_SECONDS`)
- Returns JSON (`compiled`, `clean`, `log`, `raw`)

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
