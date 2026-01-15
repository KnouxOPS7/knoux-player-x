# Plugin Development Best Practices

1. **Isolation**: Always use the `context` bridge provided. Do not try to access `window` or `document` directly unless inside a UI component.
2. **Performance**: Heavy computation should be done via WebWorkers.
3. **Security**: Do not fetch remote scripts (CDNs) inside your plugin code. Bundle everything.
4. **Localization**: Use `context.i18n.t()` for all user-facing strings.
