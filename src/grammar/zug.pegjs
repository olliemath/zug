start
    = lisp

lisp
    = head:expr tail:wexpr*
      {
          let result = [head];
          for (let item of tail) {
              result = result.concat(item);
          }
          return {type: "SEXPR", value: result};
      }

sexpr
    = '.' l:lisp '.' { return {type: "SEXPR", value: l.value}; }

qexpr
    = '[' l:lisp ']' { return {type: "ARRAY", value: l.value}; }

wexpr
    = [ ]+ e: expr { return e; }

expr
    = number
    / symbol
    / string
    / sexpr
    / qexpr
    / nil

number
    = digits:[0-9]+ { return {type: "NUMBER", value: parseInt(digits.join(""))}; }

symbol
    = head:[a-z] rest:[a-zA-Z0-9]* {
        const value = head + rest.join("");
        if (value === 'true') {
            return {type: "TRUE", value: true};
        } else if (value === 'false') {
            return {type: "FALSE", value: false};
        }
        return {type: "SYM", value: head + rest.join("")};
    }

string
    = ',' s:[^,]* ',' { return {type: "STRING", value: s.join("")}; }

nil
    = '..' { return {type: "NIL", value: null}; }
