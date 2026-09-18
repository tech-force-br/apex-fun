# 03 — Curriculum: Variables (v1)

## Module list on the map

Shown in v1:

- Variables (open)
- Operators (locked — Coming later)
- If and else (locked)
- Lists (locked)
- Loops (locked)
- Methods (locked)
- sObjects (locked)
- SOQL (locked)
- DML (locked)

Triggers are not on the v1 map.

Pricing for later modules is out of scope for v1.

## Variables topic order

Modules are folders on the map. Topics are folders inside a module. Cards live inside a topic.

| # | Topic | Student work |
|---|---|---|
| 1 | What a variable is | Theory only |
| 2 | Naming rules | Theory only |
| 3 | Declaring | Theory only |
| 4 | Assigning | Theory only |
| 5 | System.debug | Theory only |
| 6 | Integer | 10 exercises |
| 7 | String | 10 exercises |
| 8 | Boolean | 10 exercises |
| 9 | Decimal | 10 exercises |
| 10 | Date | 10 exercises |
| 11 | Concatenation | 10 exercises |
| 12 | Mixed review | 50 exercises |

No fixed number of theory cards per topic. Admin adds as many as needed.

## Exercise totals

- Primitive + concatenation exercises: 60
- Mixed review: 50
- **Variables total: 110 exercises**
- Complete line: **99 clean first tries out of 110** (90%, rounded up)

Standing rule for every module: complete = 90% clean first tries. If 90% is not a whole number, round up.

## What each primitive topic includes

Integer, String, Boolean, Decimal, Date:

- Declare and assign only
- One of the 10 exercises is a null-declare exercise
- Null is **not** its own topic. Teach null in that primitive’s theory

### Integer and Decimal

No `+ - * /` on numbers in this module.

### String and Boolean

- Strings use single quotes
- Boolean is `true` / `false`
- No `.length()`, no `==`, no `&&`

### Date

Teach only:

- `Date.newInstance(year, month, day)`
- `Date.today()`

No year / month / day getter methods in this topic.

### Concatenation

- `String + String`
- `String +` Integer, Decimal, Boolean, or Date
- No null concatenation
- `+` here only joins values. It is not math.

## Naming rules that theory must teach

Apex names are not case-sensitive: `age` and `Age` are the same variable.

String **values** are case-sensitive: `"Hi"` is not `"hi"`.

## Out of Variables

Double, Long, Time, Id, Datetime, `final` constants.

No type-mismatch topic folder. Teach type mismatch in failed-run plain-language messages and in some mixed-review exercises only.

## Mixed review

- Last topic folder inside Variables
- 50 exercise cards, same lock rules as other topics
- Fixed admin-set order. Every student sees the same order, including after a restart
- Mix: about 8 cards each from Integer, String, Boolean, Decimal, Date, Concatenation (48), plus 2 extra the admin places

## Related

Back: [02-learners-and-pedagogy.md](02-learners-and-pedagogy.md)
Next: [04-progress-and-scoring.md](04-progress-and-scoring.md)
