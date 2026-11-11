# 03 — Curriculum: Variables (v1)

## Module list on the map

Shown in v1:

- Variables (open)
- Operators (locked — Coming later)
- If and else (locked)
- Lists (locked)
- Sets (locked)
- Loops (locked)
- sObjects (locked)
- Maps (locked)
- SOQL (locked)
- DML (locked)
- Methods (locked)
- Classes (locked)

Triggers are not on the v1 map.

Pricing for later modules is out of scope for v1.

## Variables topic order

Modules are stops on the map. Topics are rows inside a module. Cards live inside a topic. Each stop and each row shows a mark that depicts that content, as in [10-visual-design.md](10-visual-design.md).

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

The seed places ten exercises after the theory cards on Integer, String, Boolean, Decimal, Date, and Concatenation. Mixed review has 50 exercises.

The first two exercise prompts on Integer, String, Boolean, Decimal, Date, and Concatenation name the Apex type in the declare instruction. From the third exercise on, the prompt names the variable and the value and does not name the type. The student chooses the type from that topic's theory and from the value. Mixed review names the type on the first ten exercises. From the eleventh exercise on, those prompts do not name the type. A later prompt can still contrast a value with text, such as the number 10 rather than the text 10, or true rather than the text true.

Superseded: a seed of one example exercise on each of those six topics.

Each primitive topic includes one exercise that declares a variable and leaves the value off, so it is null. A check on that card accepts null. It does not require the characters `= null`.

Integer exercises declare and assign whole numbers only. In order: 3 in `seatCount`, 100 in `capacity`, 0 in `emptySeats`, -2 in `temperature`, 1500 in `headcount`, `missing` with the value left off, `openSeats` declared and then set to 12, `guestCount` set to 3 and then replaced with 4, `floor` set to -1 and then replaced with 2, and `rowCount` 10 with `columnCount` 4. No `+ - * /`. The first preview is `Integer seatCount = 3;`. Its one hidden test checks that the value is 3.

String exercises use single quotes. In order: Acme in `accountName`, Austin in `city`, Call tomorrow in `note`, Hi in `loud` and hi in `quiet`, empty text in `blank`, `missing` with the value left off, O'Brien in `contactName`, `nickname` declared and then set to Ace, Open in `status` replaced with Closed, and Ana in `firstName` with Silva in `lastName`. No `.length()` and no `==`. The first preview is `String accountName = 'Acme';`.

Boolean exercises use `true` and `false` with no quotes. In order: true in `isActive`, false in `hasDiscount`, true in `canEdit`, false in `isConverted`, `isReady` with the value left off, `isWon` declared and then set to true, true in `isOpen` replaced with false, false in `isCustomer` replaced with true, true in `hasPhone` with false in `hasEmail`, and `isBlocked` declared and then set to false. No `==` and no `&&`. The first preview is `Boolean isActive = true;`.

Decimal exercises declare and assign only. In order: 19.99 in `amount`, 0.5 in `discount`, 0.08 in `taxRate`, -3.25 in `adjustment`, 0.0 in `zero`, `missing` with the value left off, `price` declared and then set to 12.5, 10.5 in `fee` replaced with 8.75, -15.5 in `balance` replaced with 0.0, and 10.0 in `unitPrice` with 4.5 in `shipping`. A value check on a Decimal also calls `.scale()`, so an Integer does not pass. No `+ - * /`. The first preview is `Decimal amount = 19.99;`.

Date exercises use `Date.newInstance(year, month, day)` or `Date.today()`. In order: 15 March 2026 in `closeDate`, 1 January 2026 in `startDate`, 4 July 2026 in `holiday`, 31 December 2026 in `endDate`, 28 February 2026 in `fiscalStart`, `dueDate` with the value left off, `today` set to the day the code runs, `launchDate` declared and then set to 1 June 2026, 15 March 2026 in `reviewDate` replaced with 16 March 2026, and 1 April 2026 in `kickoff` with 30 April 2026 in `deadline`. No year, month, or day getter methods. The first preview is `Date closeDate = Date.newInstance(2026, 3, 15);`.

Concatenation exercises join with `+`. They do not join null, and `+` here is not math. In order:

- `hello` Hello, `name` Ana, and `greeting` joining them with a space, so Hello Ana. Three run-clean tests. Preview: `String hello = 'Hello';` then `String name = 'Ana';` then `String greeting = hello + ' ' + name;`
- `welcome` joining the text Hello, a space, and the text Ana
- `stuck` joining Hello and Ana with no space, so HelloAna
- `accountName` Acme, then `line` joining Account: with that name, so Account: Acme
- `guestCount` 6, then `label` joining Guests: with that Integer, so Guests: 6
- `isActive` true, then `statusLine` joining Active: with that Boolean, so Active: true
- `hasDiscount` false, then `discountLine` joining Discount: with that Boolean, so Discount: false
- `amount` 19.99, then `totalLine` joining Total: with that Decimal, so Total: 19.99
- `closeDate` 15 March 2026, then `closeLine` joining Closes: with that Date. The line check requires the text to start with `Closes: 2026-03-15`. A runner that appends a time after that prefix still passes.
- `firstName` Ana, `lastName` Silva, and `fullName` joining them with a space, so Ana Silva

Mixed review has 50 exercises. Eight focus on Integer, eight on String, eight on Boolean, eight on Decimal, eight on Date, and eight on Concatenation. Two more mix several types. No `+ - * /` on numbers, no `.length()`, no `==`, no `&&`, no null concatenation, and no year, month, or day getter methods. A Decimal value check calls `.scale()`. A Date joined into text is checked with a prefix, because a runner may append a time. A null declare on these cards accepts null and does not require the characters `= null`. Three prompts contrast a value with text: the text 42 in `codeText`, the Boolean true in `canView` rather than the text true, and the number 10 in `quantity` rather than the text 10. In order:

1. Integer `seatCount` 3, then String `label` joining Seats: with that Integer, so Seats: 3. Two run-clean tests. Preview: `Integer seatCount = 3;` then `String label = 'Seats: ' + seatCount;`.
2. Integer `ticketCount` 8.
3. String `subject` Follow up.
4. Boolean `isPaid` true.
5. Decimal `price` 24.5.
6. Date `meetingDate` 2 May 2026.
7. String `city` Austin, String `region` TX, and String `place` joining them with a space, so Austin TX. Three run-clean tests.
8. Integer `queueSize` 0.
9. String `codeText` storing the text 42.
10. Boolean `isClosed` false.
11. Decimal `portion` 0.25.
12. Date `holidayDate` 9 September 2026.
13. String `prefix` SF, String `code` the text 100, and String `badge` joining them with no space, so SF100. Three run-clean tests.
14. Integer `floorNumber` -3.
15. String `answer` Yes and String `code` yes.
16. Boolean `canView` true, not the text true.
17. Decimal `offset` -1.5.
18. Date `runDate` set to the day the code runs.
19. Integer `roomCount` 12, then String `line` joining Rooms: with that Integer, so Rooms: 12.
20. Integer `attendeeCount` 2400.
21. String `tag` empty text.
22. Boolean `isSynced` with the value left off.
23. Decimal `balanceDue` 0.0.
24. Date `holdDate` with the value left off.
25. Boolean `paidFlag` false, then String `paidLine` joining Paid: with that Boolean, so Paid: false.
26. Integer `spare` with the value left off.
27. String `reminder` with the value left off.
28. Boolean `isApproved` declared and then set to true.
29. Decimal `credit` with the value left off.
30. Date `shipDate` declared and then set to 20 August 2026.
31. Decimal `unitPrice` 8.5, then String `priceLine` joining Price: with that Decimal, so Price: 8.5.
32. Integer `attempts` set to 1 and then replaced with 5.
33. String `city` declared and then set to Denver.
34. Boolean `isDraft` set to true and then replaced with false.
35. Decimal `cost` declared and then set to 7.25.
36. Date `eventDate` set to 1 May 2026 and then replaced with 2 May 2026.
37. Date `startDate` 1 June 2026, then String `startLine` joining Starts: with that Date. The line check requires the text to start with `Starts: 2026-06-01`.
38. Integer `roomNumber` declared and then set to 14.
39. String `ownerName` O'Neil.
40. Boolean `isMember` set to false and then replaced with true.
41. Decimal `listPrice` set to 9.99 and then replaced with 7.5.
42. Date `yearEnd` 31 December 2027.
43. String `firstName` Leo, String `lastName` Costa, and String `fullName` joining them with a space, so Leo Costa. Three run-clean tests.
44. Integer `adultCount` 2 and Integer `childCount` 1.
45. String `stage` set to New and then replaced with Working.
46. Boolean `hasStreet` true and Boolean `hasZip` false.
47. Decimal `tax` 1.5 and Decimal `tip` 2.0.
48. Date `openDate` 1 March 2026 and Date `closeOut` 31 March 2026.
49. Integer `quantity` the number 10, not the text 10, Boolean `isTaxable` true, and String `note` Rush. Three run-clean tests.
50. Integer `guestCount` 4, Decimal `fee` 12.5, and String `summary` joining the text Guests: , that Integer, the text Fee: , and that Decimal, so Guests: 4 Fee: 12.5. Three run-clean tests.

The seed compile-fail list has two shared tests, stored in code the same way as the cards. The first match text is `missing ';'`. Its English student message is "There is a semicolon (;) missing somewhere." Its Portuguese student message is "Tem um ponto e vírgula (;) faltando em algum lugar." Its preview sample is `Integer seatCount = 3`. The second match text is `token recognition error at: '"'`. Its English student message is "Use single quotes instead of double quotes." Its Portuguese student message is "Use aspas simples em vez de aspas duplas." Its preview sample is `String name = "Carl";`. No exercise card carries these tests.

Superseded: a compile-fail match on `Duplicate variable: seatCount` stored on that card. A correct declaration compiles. Compile-fail tests are now one shared list of explanations. See [06-exercise-checks.md](06-exercise-checks.md).

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
- Writing guide for the mix: about 8 cards each from Integer, String, Boolean, Decimal, Date, Concatenation, plus a few extra the owner places. The seed follows that guide in the list above.

## Related

Back: [02-learners-and-pedagogy.md](02-learners-and-pedagogy.md)
Next: [04-progress-and-scoring.md](04-progress-and-scoring.md)
