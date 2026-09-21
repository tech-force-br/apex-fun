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
| 6 | Integer | Exercises |
| 7 | String | Exercises |
| 8 | Boolean | Exercises |
| 9 | Decimal | Exercises |
| 10 | Date | Exercises |
| 11 | Concatenation | Exercises |
| 12 | Mixed review | Exercises |

The owner chooses how many theory cards and exercise cards each topic has, and can add or remove either. The next topic opens when the student finishes the last card on the current topic.

Writing guide, not a required count: about 10 exercises on Integer, String, Boolean, Decimal, Date, and Concatenation, and about 50 on mixed review. Those figures do not decide when the next topic opens.

## Exercise totals

Standing rule for every module: complete = 90% clean first tries of the exercise cards that exist. If 90% is not a whole number, round up.

Superseded: a required total of 60 primitive and concatenation exercises, 50 mixed-review exercises, 110 altogether, and a complete line of 99 / 110. That was the writing guide above.

## What each primitive topic includes

Integer, String, Boolean, Decimal, Date:

- Declare and assign only
- Include a null-declare exercise
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
- Same lock rules as other topics. The owner chooses how many cards
- Fixed admin-set order. Every student sees the same order, including after a restart
- Writing guide for the mix: about 8 cards each from Integer, String, Boolean, Decimal, Date, Concatenation, plus a few extra the owner places

## Related

Back: [02-learners-and-pedagogy.md](02-learners-and-pedagogy.md)
Next: [04-progress-and-scoring.md](04-progress-and-scoring.md)
