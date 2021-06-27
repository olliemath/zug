# zug - programming on the go

Zug is a general-purpose programming language designed specifically to write
on touch-screen devices.

It requires no special characters except `.` and `,`. It's heavily under
development, but here's an example of the kind of thing you should be able
to write:
```
import http

let resp .http.get ,google.com,.
assert .lt resp.code 300.

print resp.json
```

The main point here is that you never have to leave a standard qwerty keyboard
to write this on your phone. It's way more fun to write when you're away from
your computer than any other language.


## Roadmap

- [x] Conditionals: if / else / or / and / not
- [x] Auto-load prelude
- [x] IO: stdin stdout
- [ ] Command line args (e.g.) zug run foo.zug
- [ ] Unit-tests: zug test tests.zug
- [ ] Syntax highlighting
- [ ] Dotted attribute access
- [ ] Many more test cases
- [ ] Browser REPL
- [ ] Initial relase. Docs.

- [x] Stdlib symbolic imports
- [ ] String utils: join / split / slice / char
- [ ] Itertools: map, zip, filter, slice, nth
- [ ] New release. More docs.
- [ ] File IO
- [ ] JSON
- [ ] HTTP (sync)
- [ ] New release. More docs.

- [ ] Better strings: escaped chars
- [ ] Better strings: python style multi-line strings
- [ ] Use let for destructuring arrays (remove set)
- [ ] New release. More docs.

- [ ] setattr, hasattr, getattr with default
- [ ] Type introspection
- [ ] Try/catch logic
- [ ] New release. More docs.

- [ ] Asyncio (HTTP only)
- [ ] New release. More docs.

- [ ] Error types. Improved try/catch logic
- [ ] New release. More docs.

- [ ] Package manager
- [ ] New release. More docs.

- [ ] Sys: args
- [ ] Sys: filesystem
- [ ] Sys: stdout, stdin, stderr
- [ ] New release. More docs.

- [ ] Editor support: vi
- [x] Editor support: vscode
- [ ] Publish vscode support to git
