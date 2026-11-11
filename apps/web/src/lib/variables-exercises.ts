import type { ExerciseCard, VariablesTopicId } from "@/lib/curriculum";
import { styleExercisePrompt } from "@/lib/exercise-prompt-marks";

/**
 * Seed exercises. Run-clean check Apex stays English.
 * Integer, String, Boolean, Decimal, Date, and Concatenation each have 10.
 * Mixed review has 50: eight on each of those six, plus two that mix types.
 */
function exercise(
  id: string,
  en: string,
  pt: string,
  tests: ExerciseCard["hiddenTests"],
): ExerciseCard {
  return {
    id,
    type: "exercise",
    prompts: {
      en: styleExercisePrompt(en),
      "pt-BR": styleExercisePrompt(pt),
    },
    hiddenTests: tests,
  };
}

function runClean(
  id: string,
  checkApex: string,
  en: string,
  pt: string,
  previewCode: string,
): ExerciseCard["hiddenTests"][number] {
  return {
    id,
    checkApex,
    messages: { en, "pt-BR": pt },
    previewCode,
  };
}

function valueIs(name: string, apexValue: string) {
  return `if (${name} != ${apexValue}) {\n    System.assert(false);\n}`;
}

/** Rejects an Integer that compares equal to a whole Decimal, such as 0 or 10. */
function decimalIs(name: string, apexValue: string) {
  return `${valueIs(name, apexValue)}\n${name}.scale();`;
}

function textStarts(name: string, prefix: string) {
  return `if (${name} == null || !${name}.startsWith('${prefix}')) {\n    System.assert(false);\n}`;
}

function one(
  id: string,
  en: string,
  pt: string,
  checkApex: string,
  failEn: string,
  failPt: string,
  preview: string,
): ExerciseCard {
  return exercise(id, en, pt, [
    runClean(`${id}-check`, checkApex, failEn, failPt, preview),
  ]);
}

function many(
  id: string,
  en: string,
  pt: string,
  tests: ExerciseCard["hiddenTests"],
): ExerciseCard {
  return exercise(id, en, pt, tests);
}

const integerSeatCount = one(
  "integer-seat-count",
  "Declare an Integer named seatCount and store 3.",
  "Declare um Integer chamado seatCount e guarde 3.",
  valueIs("seatCount", "3"),
  "seatCount needs to be an Integer with the value 3.",
  "seatCount precisa ser um Integer com o valor 3.",
  "Integer seatCount = 3;",
);

const integerExercises: ExerciseCard[] = [
  integerSeatCount,
  one(
    "integer-capacity",
    "Declare an Integer named capacity and store 100.",
    "Declare um Integer chamado capacity e guarde 100.",
    valueIs("capacity", "100"),
    "capacity needs to be an Integer with the value 100.",
    "capacity precisa ser um Integer com o valor 100.",
    "Integer capacity = 100;",
  ),
  one(
    "integer-empty-seats",
    "Declare a variable named emptySeats and store 0.",
    "Declare uma variável chamada emptySeats e guarde 0.",
    valueIs("emptySeats", "0"),
    "emptySeats needs to be an Integer with the value 0.",
    "emptySeats precisa ser um Integer com o valor 0.",
    "Integer emptySeats = 0;",
  ),
  one(
    "integer-temperature",
    "Declare a variable named temperature and store -2.",
    "Declare uma variável chamada temperature e guarde -2.",
    valueIs("temperature", "-2"),
    "temperature needs to be an Integer with the value -2.",
    "temperature precisa ser um Integer com o valor -2.",
    "Integer temperature = -2;",
  ),
  one(
    "integer-headcount",
    "Declare a variable named headcount and store 1500.",
    "Declare uma variável chamada headcount e guarde 1500.",
    valueIs("headcount", "1500"),
    "headcount needs to be an Integer with the value 1500.",
    "headcount precisa ser um Integer com o valor 1500.",
    "Integer headcount = 1500;",
  ),
  one(
    "integer-missing",
    "Declare a variable named missing and leave the value off.",
    "Declare uma variável chamada missing e deixe o valor de fora.",
    valueIs("missing", "null"),
    "missing needs to be an Integer with no value stored.",
    "missing precisa ser um Integer sem valor guardado.",
    "Integer missing;",
  ),
  one(
    "integer-open-seats",
    "Declare a variable named openSeats. On the next line, store 12 in openSeats.",
    "Declare uma variável chamada openSeats. Na linha seguinte, guarde 12 em openSeats.",
    valueIs("openSeats", "12"),
    "openSeats needs to be an Integer with the value 12.",
    "openSeats precisa ser um Integer com o valor 12.",
    "Integer openSeats;\nopenSeats = 12;",
  ),
  one(
    "integer-guest-count",
    "Declare a variable named guestCount and store 3. On the next line, store 4 in guestCount.",
    "Declare uma variável chamada guestCount e guarde 3. Na linha seguinte, guarde 4 em guestCount.",
    valueIs("guestCount", "4"),
    "guestCount needs to be an Integer with the value 4.",
    "guestCount precisa ser um Integer com o valor 4.",
    "Integer guestCount = 3;\nguestCount = 4;",
  ),
  one(
    "integer-floor",
    "Declare a variable named floor and store -1. On the next line, store 2 in floor.",
    "Declare uma variável chamada floor e guarde -1. Na linha seguinte, guarde 2 em floor.",
    valueIs("floor", "2"),
    "floor needs to be an Integer with the value 2.",
    "floor precisa ser um Integer com o valor 2.",
    "Integer floor = -1;\nfloor = 2;",
  ),
  many(
    "integer-rows",
    "Declare a variable named rowCount and store 10. Declare a variable named columnCount and store 4.",
    "Declare uma variável chamada rowCount e guarde 10. Declare uma variável chamada columnCount e guarde 4.",
    [
      runClean(
        "integer-rows-row-count",
        valueIs("rowCount", "10"),
        "rowCount needs to be an Integer with the value 10.",
        "rowCount precisa ser um Integer com o valor 10.",
        "Integer rowCount = 10;\nInteger columnCount = 4;",
      ),
      runClean(
        "integer-rows-column-count",
        valueIs("columnCount", "4"),
        "columnCount needs to be an Integer with the value 4.",
        "columnCount precisa ser um Integer com o valor 4.",
        "Integer rowCount = 10;\nInteger columnCount = 4;",
      ),
    ],
  ),
];

const stringAccountName = one(
  "string-account-name",
  "Declare a String named accountName and store Acme.",
  "Declare uma String chamada accountName e guarde Acme.",
  valueIs("accountName", "'Acme'"),
  "accountName needs to be a String with the value Acme.",
  "accountName precisa ser uma String com o valor Acme.",
  "String accountName = 'Acme';",
);

const stringExercises: ExerciseCard[] = [
  stringAccountName,
  one(
    "string-city",
    "Declare a String named city and store Austin.",
    "Declare uma String chamada city e guarde Austin.",
    valueIs("city", "'Austin'"),
    "city needs to be a String with the value Austin.",
    "city precisa ser uma String com o valor Austin.",
    "String city = 'Austin';",
  ),
  one(
    "string-note",
    "Declare a variable named note and store Call tomorrow.",
    "Declare uma variável chamada note e guarde Call tomorrow.",
    valueIs("note", "'Call tomorrow'"),
    "note needs to be a String with the value Call tomorrow.",
    "note precisa ser uma String com o valor Call tomorrow.",
    "String note = 'Call tomorrow';",
  ),
  many(
    "string-capitals",
    "Declare a variable named loud and store Hi. Declare a variable named quiet and store hi.",
    "Declare uma variável chamada loud e guarde Hi. Declare uma variável chamada quiet e guarde hi.",
    [
      runClean(
        "string-capitals-loud",
        valueIs("loud", "'Hi'"),
        "loud needs to be a String with the value Hi.",
        "loud precisa ser uma String com o valor Hi.",
        "String loud = 'Hi';\nString quiet = 'hi';",
      ),
      runClean(
        "string-capitals-quiet",
        valueIs("quiet", "'hi'"),
        "quiet needs to be a String with the value hi.",
        "quiet precisa ser uma String com o valor hi.",
        "String loud = 'Hi';\nString quiet = 'hi';",
      ),
    ],
  ),
  one(
    "string-blank",
    "Declare a variable named blank and store empty text.",
    "Declare uma variável chamada blank e guarde um texto vazio.",
    valueIs("blank", "''"),
    "blank needs to be a String with no characters.",
    "blank precisa ser uma String sem nenhum caractere.",
    "String blank = '';",
  ),
  one(
    "string-missing",
    "Declare a variable named missing and leave the value off.",
    "Declare uma variável chamada missing e deixe o valor de fora.",
    valueIs("missing", "null"),
    "missing needs to be a String with no value stored.",
    "missing precisa ser uma String sem valor guardado.",
    "String missing;",
  ),
  one(
    "string-apostrophe",
    "Declare a variable named contactName and store O'Brien.",
    "Declare uma variável chamada contactName e guarde O'Brien.",
    valueIs("contactName", "'O\\'Brien'"),
    "contactName needs to be a String with the value O'Brien.",
    "contactName precisa ser uma String com o valor O'Brien.",
    "String contactName = 'O\\'Brien';",
  ),
  one(
    "string-nickname",
    "Declare a variable named nickname. On the next line, store Ace in nickname.",
    "Declare uma variável chamada nickname. Na linha seguinte, guarde Ace em nickname.",
    valueIs("nickname", "'Ace'"),
    "nickname needs to be a String with the value Ace.",
    "nickname precisa ser uma String com o valor Ace.",
    "String nickname;\nnickname = 'Ace';",
  ),
  one(
    "string-status",
    "Declare a variable named status and store Open. On the next line, store Closed in status.",
    "Declare uma variável chamada status e guarde Open. Na linha seguinte, guarde Closed em status.",
    valueIs("status", "'Closed'"),
    "status needs to be a String with the value Closed.",
    "status precisa ser uma String com o valor Closed.",
    "String status = 'Open';\nstatus = 'Closed';",
  ),
  many(
    "string-names",
    "Declare a variable named firstName and store Ana. Declare a variable named lastName and store Silva.",
    "Declare uma variável chamada firstName e guarde Ana. Declare uma variável chamada lastName e guarde Silva.",
    [
      runClean(
        "string-names-first",
        valueIs("firstName", "'Ana'"),
        "firstName needs to be a String with the value Ana.",
        "firstName precisa ser uma String com o valor Ana.",
        "String firstName = 'Ana';\nString lastName = 'Silva';",
      ),
      runClean(
        "string-names-last",
        valueIs("lastName", "'Silva'"),
        "lastName needs to be a String with the value Silva.",
        "lastName precisa ser uma String com o valor Silva.",
        "String firstName = 'Ana';\nString lastName = 'Silva';",
      ),
    ],
  ),
];

const booleanIsActive = one(
  "boolean-is-active",
  "Declare a Boolean named isActive and store true.",
  "Declare um Boolean chamado isActive e guarde true.",
  valueIs("isActive", "true"),
  "isActive needs to be a Boolean with the value true.",
  "isActive precisa ser um Boolean com o valor true.",
  "Boolean isActive = true;",
);

const booleanExercises: ExerciseCard[] = [
  booleanIsActive,
  one(
    "boolean-has-discount",
    "Declare a Boolean named hasDiscount and store false.",
    "Declare um Boolean chamado hasDiscount e guarde false.",
    valueIs("hasDiscount", "false"),
    "hasDiscount needs to be a Boolean with the value false.",
    "hasDiscount precisa ser um Boolean com o valor false.",
    "Boolean hasDiscount = false;",
  ),
  one(
    "boolean-can-edit",
    "Declare a variable named canEdit and store true.",
    "Declare uma variável chamada canEdit e guarde true.",
    valueIs("canEdit", "true"),
    "canEdit needs to be a Boolean with the value true.",
    "canEdit precisa ser um Boolean com o valor true.",
    "Boolean canEdit = true;",
  ),
  one(
    "boolean-is-converted",
    "Declare a variable named isConverted and store false.",
    "Declare uma variável chamada isConverted e guarde false.",
    valueIs("isConverted", "false"),
    "isConverted needs to be a Boolean with the value false.",
    "isConverted precisa ser um Boolean com o valor false.",
    "Boolean isConverted = false;",
  ),
  one(
    "boolean-is-ready",
    "Declare a variable named isReady and leave the value off.",
    "Declare uma variável chamada isReady e deixe o valor de fora.",
    valueIs("isReady", "null"),
    "isReady needs to be a Boolean with no value stored.",
    "isReady precisa ser um Boolean sem valor guardado.",
    "Boolean isReady;",
  ),
  one(
    "boolean-is-won",
    "Declare a variable named isWon. On the next line, store true in isWon.",
    "Declare uma variável chamada isWon. Na linha seguinte, guarde true em isWon.",
    valueIs("isWon", "true"),
    "isWon needs to be a Boolean with the value true.",
    "isWon precisa ser um Boolean com o valor true.",
    "Boolean isWon;\nisWon = true;",
  ),
  one(
    "boolean-is-open",
    "Declare a variable named isOpen and store true. On the next line, store false in isOpen.",
    "Declare uma variável chamada isOpen e guarde true. Na linha seguinte, guarde false em isOpen.",
    valueIs("isOpen", "false"),
    "isOpen needs to be a Boolean with the value false.",
    "isOpen precisa ser um Boolean com o valor false.",
    "Boolean isOpen = true;\nisOpen = false;",
  ),
  one(
    "boolean-is-customer",
    "Declare a variable named isCustomer and store false. On the next line, store true in isCustomer.",
    "Declare uma variável chamada isCustomer e guarde false. Na linha seguinte, guarde true em isCustomer.",
    valueIs("isCustomer", "true"),
    "isCustomer needs to be a Boolean with the value true.",
    "isCustomer precisa ser um Boolean com o valor true.",
    "Boolean isCustomer = false;\nisCustomer = true;",
  ),
  many(
    "boolean-phone-email",
    "Declare a variable named hasPhone and store true. Declare a variable named hasEmail and store false.",
    "Declare uma variável chamada hasPhone e guarde true. Declare uma variável chamada hasEmail e guarde false.",
    [
      runClean(
        "boolean-phone-email-phone",
        valueIs("hasPhone", "true"),
        "hasPhone needs to be a Boolean with the value true.",
        "hasPhone precisa ser um Boolean com o valor true.",
        "Boolean hasPhone = true;\nBoolean hasEmail = false;",
      ),
      runClean(
        "boolean-phone-email-email",
        valueIs("hasEmail", "false"),
        "hasEmail needs to be a Boolean with the value false.",
        "hasEmail precisa ser um Boolean com o valor false.",
        "Boolean hasPhone = true;\nBoolean hasEmail = false;",
      ),
    ],
  ),
  one(
    "boolean-is-blocked",
    "Declare a variable named isBlocked. On the next line, store false in isBlocked.",
    "Declare uma variável chamada isBlocked. Na linha seguinte, guarde false em isBlocked.",
    valueIs("isBlocked", "false"),
    "isBlocked needs to be a Boolean with the value false.",
    "isBlocked precisa ser um Boolean com o valor false.",
    "Boolean isBlocked;\nisBlocked = false;",
  ),
];

const decimalAmount = one(
  "decimal-amount",
  "Declare a Decimal named amount and store 19.99.",
  "Declare um Decimal chamado amount e guarde 19.99.",
  decimalIs("amount", "19.99"),
  "amount needs to be a Decimal with the value 19.99.",
  "amount precisa ser um Decimal com o valor 19.99.",
  "Decimal amount = 19.99;",
);

const decimalExercises: ExerciseCard[] = [
  decimalAmount,
  one(
    "decimal-discount",
    "Declare a Decimal named discount and store 0.5.",
    "Declare um Decimal chamado discount e guarde 0.5.",
    decimalIs("discount", "0.5"),
    "discount needs to be a Decimal with the value 0.5.",
    "discount precisa ser um Decimal com o valor 0.5.",
    "Decimal discount = 0.5;",
  ),
  one(
    "decimal-tax-rate",
    "Declare a variable named taxRate and store 0.08.",
    "Declare uma variável chamada taxRate e guarde 0.08.",
    decimalIs("taxRate", "0.08"),
    "taxRate needs to be a Decimal with the value 0.08.",
    "taxRate precisa ser um Decimal com o valor 0.08.",
    "Decimal taxRate = 0.08;",
  ),
  one(
    "decimal-adjustment",
    "Declare a variable named adjustment and store -3.25.",
    "Declare uma variável chamada adjustment e guarde -3.25.",
    decimalIs("adjustment", "-3.25"),
    "adjustment needs to be a Decimal with the value -3.25.",
    "adjustment precisa ser um Decimal com o valor -3.25.",
    "Decimal adjustment = -3.25;",
  ),
  one(
    "decimal-zero",
    "Declare a variable named zero and store 0.0.",
    "Declare uma variável chamada zero e guarde 0.0.",
    decimalIs("zero", "0.0"),
    "zero needs to be a Decimal with the value 0.0.",
    "zero precisa ser um Decimal com o valor 0.0.",
    "Decimal zero = 0.0;",
  ),
  one(
    "decimal-missing",
    "Declare a variable named missing and leave the value off.",
    "Declare uma variável chamada missing e deixe o valor de fora.",
    valueIs("missing", "null"),
    "missing needs to be a Decimal with no value stored.",
    "missing precisa ser um Decimal sem valor guardado.",
    "Decimal missing;",
  ),
  one(
    "decimal-price",
    "Declare a variable named price. On the next line, store 12.5 in price.",
    "Declare uma variável chamada price. Na linha seguinte, guarde 12.5 em price.",
    decimalIs("price", "12.5"),
    "price needs to be a Decimal with the value 12.5.",
    "price precisa ser um Decimal com o valor 12.5.",
    "Decimal price;\nprice = 12.5;",
  ),
  one(
    "decimal-fee",
    "Declare a variable named fee and store 10.5. On the next line, store 8.75 in fee.",
    "Declare uma variável chamada fee e guarde 10.5. Na linha seguinte, guarde 8.75 em fee.",
    decimalIs("fee", "8.75"),
    "fee needs to be a Decimal with the value 8.75.",
    "fee precisa ser um Decimal com o valor 8.75.",
    "Decimal fee = 10.5;\nfee = 8.75;",
  ),
  one(
    "decimal-balance",
    "Declare a variable named balance and store -15.5. On the next line, store 0.0 in balance.",
    "Declare uma variável chamada balance e guarde -15.5. Na linha seguinte, guarde 0.0 em balance.",
    decimalIs("balance", "0.0"),
    "balance needs to be a Decimal with the value 0.0.",
    "balance precisa ser um Decimal com o valor 0.0.",
    "Decimal balance = -15.5;\nbalance = 0.0;",
  ),
  many(
    "decimal-unit-shipping",
    "Declare a variable named unitPrice and store 10.0. Declare a variable named shipping and store 4.5.",
    "Declare uma variável chamada unitPrice e guarde 10.0. Declare uma variável chamada shipping e guarde 4.5.",
    [
      runClean(
        "decimal-unit-shipping-unit",
        decimalIs("unitPrice", "10.0"),
        "unitPrice needs to be a Decimal with the value 10.0.",
        "unitPrice precisa ser um Decimal com o valor 10.0.",
        "Decimal unitPrice = 10.0;\nDecimal shipping = 4.5;",
      ),
      runClean(
        "decimal-unit-shipping-shipping",
        decimalIs("shipping", "4.5"),
        "shipping needs to be a Decimal with the value 4.5.",
        "shipping precisa ser um Decimal com o valor 4.5.",
        "Decimal unitPrice = 10.0;\nDecimal shipping = 4.5;",
      ),
    ],
  ),
];

const dateCloseDate = one(
  "date-close-date",
  "Declare a Date named closeDate and store 15 March 2026.",
  "Declare uma Date chamada closeDate e guarde 15 de março de 2026.",
  valueIs("closeDate", "Date.newInstance(2026, 3, 15)"),
  "closeDate needs to be a Date for 15 March 2026.",
  "closeDate precisa ser uma Date de 15 de março de 2026.",
  "Date closeDate = Date.newInstance(2026, 3, 15);",
);

const dateExercises: ExerciseCard[] = [
  dateCloseDate,
  one(
    "date-start",
    "Declare a Date named startDate and store 1 January 2026.",
    "Declare uma Date chamada startDate e guarde 1 de janeiro de 2026.",
    valueIs("startDate", "Date.newInstance(2026, 1, 1)"),
    "startDate needs to be a Date for 1 January 2026.",
    "startDate precisa ser uma Date de 1 de janeiro de 2026.",
    "Date startDate = Date.newInstance(2026, 1, 1);",
  ),
  one(
    "date-holiday",
    "Declare a variable named holiday and store 4 July 2026.",
    "Declare uma variável chamada holiday e guarde 4 de julho de 2026.",
    valueIs("holiday", "Date.newInstance(2026, 7, 4)"),
    "holiday needs to be a Date for 4 July 2026.",
    "holiday precisa ser uma Date de 4 de julho de 2026.",
    "Date holiday = Date.newInstance(2026, 7, 4);",
  ),
  one(
    "date-end",
    "Declare a variable named endDate and store 31 December 2026.",
    "Declare uma variável chamada endDate e guarde 31 de dezembro de 2026.",
    valueIs("endDate", "Date.newInstance(2026, 12, 31)"),
    "endDate needs to be a Date for 31 December 2026.",
    "endDate precisa ser uma Date de 31 de dezembro de 2026.",
    "Date endDate = Date.newInstance(2026, 12, 31);",
  ),
  one(
    "date-fiscal-start",
    "Declare a variable named fiscalStart and store 28 February 2026.",
    "Declare uma variável chamada fiscalStart e guarde 28 de fevereiro de 2026.",
    valueIs("fiscalStart", "Date.newInstance(2026, 2, 28)"),
    "fiscalStart needs to be a Date for 28 February 2026.",
    "fiscalStart precisa ser uma Date de 28 de fevereiro de 2026.",
    "Date fiscalStart = Date.newInstance(2026, 2, 28);",
  ),
  one(
    "date-due",
    "Declare a variable named dueDate and leave the value off.",
    "Declare uma variável chamada dueDate e deixe o valor de fora.",
    valueIs("dueDate", "null"),
    "dueDate needs to be a Date with no value stored.",
    "dueDate precisa ser uma Date sem valor guardado.",
    "Date dueDate;",
  ),
  one(
    "date-today",
    "Declare a variable named today and store the day this code runs.",
    "Declare uma variável chamada today e guarde o dia em que este código roda.",
    valueIs("today", "Date.today()"),
    "today needs to be a Date for the day this code runs.",
    "today precisa ser uma Date do dia em que este código roda.",
    "Date today = Date.today();",
  ),
  one(
    "date-launch",
    "Declare a variable named launchDate. On the next line, store 1 June 2026 in launchDate.",
    "Declare uma variável chamada launchDate. Na linha seguinte, guarde 1 de junho de 2026 em launchDate.",
    valueIs("launchDate", "Date.newInstance(2026, 6, 1)"),
    "launchDate needs to be a Date for 1 June 2026.",
    "launchDate precisa ser uma Date de 1 de junho de 2026.",
    "Date launchDate;\nlaunchDate = Date.newInstance(2026, 6, 1);",
  ),
  one(
    "date-review",
    "Declare a variable named reviewDate and store 15 March 2026. On the next line, store 16 March 2026 in reviewDate.",
    "Declare uma variável chamada reviewDate e guarde 15 de março de 2026. Na linha seguinte, guarde 16 de março de 2026 em reviewDate.",
    valueIs("reviewDate", "Date.newInstance(2026, 3, 16)"),
    "reviewDate needs to be a Date for 16 March 2026.",
    "reviewDate precisa ser uma Date de 16 de março de 2026.",
    "Date reviewDate = Date.newInstance(2026, 3, 15);\nreviewDate = Date.newInstance(2026, 3, 16);",
  ),
  many(
    "date-window",
    "Declare a variable named kickoff and store 1 April 2026. Declare a variable named deadline and store 30 April 2026.",
    "Declare uma variável chamada kickoff e guarde 1 de abril de 2026. Declare uma variável chamada deadline e guarde 30 de abril de 2026.",
    [
      runClean(
        "date-window-kickoff",
        valueIs("kickoff", "Date.newInstance(2026, 4, 1)"),
        "kickoff needs to be a Date for 1 April 2026.",
        "kickoff precisa ser uma Date de 1 de abril de 2026.",
        "Date kickoff = Date.newInstance(2026, 4, 1);\nDate deadline = Date.newInstance(2026, 4, 30);",
      ),
      runClean(
        "date-window-deadline",
        valueIs("deadline", "Date.newInstance(2026, 4, 30)"),
        "deadline needs to be a Date for 30 April 2026.",
        "deadline precisa ser uma Date de 30 de abril de 2026.",
        "Date kickoff = Date.newInstance(2026, 4, 1);\nDate deadline = Date.newInstance(2026, 4, 30);",
      ),
    ],
  ),
];

const concatenationPreview = [
  "String hello = 'Hello';",
  "String name = 'Ana';",
  "String greeting = hello + ' ' + name;",
].join("\n");

const concatenationGreeting = many(
  "concatenation-greeting",
  "Declare a String named hello and store Hello. Declare a String named name and store Ana. Then declare a String named greeting and store Hello Ana by joining hello, a space, and name.",
  "Declare uma String chamada hello e guarde Hello. Declare uma String chamada name e guarde Ana. Depois declare uma String chamada greeting e guarde Hello Ana, juntando hello, um espaço e name.",
  [
    runClean(
      "concatenation-hello-is-hello",
      valueIs("hello", "'Hello'"),
      "hello needs to be a String with the value Hello.",
      "hello precisa ser uma String com o valor Hello.",
      concatenationPreview,
    ),
    runClean(
      "concatenation-name-is-ana",
      valueIs("name", "'Ana'"),
      "name needs to be a String with the value Ana.",
      "name precisa ser uma String com o valor Ana.",
      concatenationPreview,
    ),
    runClean(
      "concatenation-greeting-is-hello-ana",
      valueIs("greeting", "'Hello Ana'"),
      "greeting needs to be a String with the value Hello Ana.",
      "greeting precisa ser uma String com o valor Hello Ana.",
      concatenationPreview,
    ),
  ],
);

const accountLinePreview = [
  "String accountName = 'Acme';",
  "String line = 'Account: ' + accountName;",
].join("\n");

const guestsPreview = [
  "Integer guestCount = 6;",
  "String label = 'Guests: ' + guestCount;",
].join("\n");

const activePreview = [
  "Boolean isActive = true;",
  "String statusLine = 'Active: ' + isActive;",
].join("\n");

const discountLinePreview = [
  "Boolean hasDiscount = false;",
  "String discountLine = 'Discount: ' + hasDiscount;",
].join("\n");

const totalPreview = [
  "Decimal amount = 19.99;",
  "String totalLine = 'Total: ' + amount;",
].join("\n");

const closeLinePreview = [
  "Date closeDate = Date.newInstance(2026, 3, 15);",
  "String closeLine = 'Closes: ' + closeDate;",
].join("\n");

const fullNamePreview = [
  "String firstName = 'Ana';",
  "String lastName = 'Silva';",
  "String fullName = firstName + ' ' + lastName;",
].join("\n");

const concatenationExercises: ExerciseCard[] = [
  concatenationGreeting,
  one(
    "concatenation-welcome",
    "Declare a String named welcome and store Hello Ana by joining the text Hello, a space, and the text Ana.",
    "Declare uma String chamada welcome e guarde Hello Ana, juntando o texto Hello, um espaço e o texto Ana.",
    valueIs("welcome", "'Hello Ana'"),
    "welcome needs to be a String with the value Hello Ana.",
    "welcome precisa ser uma String com o valor Hello Ana.",
    "String welcome = 'Hello' + ' ' + 'Ana';",
  ),
  one(
    "concatenation-stuck",
    "Declare a variable named stuck and store HelloAna by joining the text Hello and the text Ana, with no space.",
    "Declare uma variável chamada stuck e guarde HelloAna, juntando o texto Hello e o texto Ana, sem espaço.",
    valueIs("stuck", "'HelloAna'"),
    "stuck needs to be a String with the value HelloAna.",
    "stuck precisa ser uma String com o valor HelloAna.",
    "String stuck = 'Hello' + 'Ana';",
  ),
  many(
    "concatenation-account-line",
    "Declare a variable named accountName and store Acme. Then declare a variable named line and store Account: Acme by joining Account: with accountName.",
    "Declare uma variável chamada accountName e guarde Acme. Depois declare uma variável chamada line e guarde Account: Acme, juntando Account: com accountName.",
    [
      runClean(
        "concatenation-account-line-name",
        valueIs("accountName", "'Acme'"),
        "accountName needs to be a String with the value Acme.",
        "accountName precisa ser uma String com o valor Acme.",
        accountLinePreview,
      ),
      runClean(
        "concatenation-account-line-line",
        valueIs("line", "'Account: Acme'"),
        "line needs to be a String with the value Account: Acme.",
        "line precisa ser uma String com o valor Account: Acme.",
        accountLinePreview,
      ),
    ],
  ),
  many(
    "concatenation-guests",
    "Declare a variable named guestCount and store 6. Then declare a variable named label and store Guests: 6 by joining Guests: with guestCount.",
    "Declare uma variável chamada guestCount e guarde 6. Depois declare uma variável chamada label e guarde Guests: 6, juntando Guests: com guestCount.",
    [
      runClean(
        "concatenation-guests-count",
        valueIs("guestCount", "6"),
        "guestCount needs to be an Integer with the value 6.",
        "guestCount precisa ser um Integer com o valor 6.",
        guestsPreview,
      ),
      runClean(
        "concatenation-guests-label",
        valueIs("label", "'Guests: 6'"),
        "label needs to be a String with the value Guests: 6.",
        "label precisa ser uma String com o valor Guests: 6.",
        guestsPreview,
      ),
    ],
  ),
  many(
    "concatenation-active",
    "Declare a variable named isActive and store true. Then declare a variable named statusLine and store Active: true by joining Active: with isActive.",
    "Declare uma variável chamada isActive e guarde true. Depois declare uma variável chamada statusLine e guarde Active: true, juntando Active: com isActive.",
    [
      runClean(
        "concatenation-active-flag",
        valueIs("isActive", "true"),
        "isActive needs to be a Boolean with the value true.",
        "isActive precisa ser um Boolean com o valor true.",
        activePreview,
      ),
      runClean(
        "concatenation-active-line",
        valueIs("statusLine", "'Active: true'"),
        "statusLine needs to be a String with the value Active: true.",
        "statusLine precisa ser uma String com o valor Active: true.",
        activePreview,
      ),
    ],
  ),
  many(
    "concatenation-discount",
    "Declare a variable named hasDiscount and store false. Then declare a variable named discountLine and store Discount: false by joining Discount: with hasDiscount.",
    "Declare uma variável chamada hasDiscount e guarde false. Depois declare uma variável chamada discountLine e guarde Discount: false, juntando Discount: com hasDiscount.",
    [
      runClean(
        "concatenation-discount-flag",
        valueIs("hasDiscount", "false"),
        "hasDiscount needs to be a Boolean with the value false.",
        "hasDiscount precisa ser um Boolean com o valor false.",
        discountLinePreview,
      ),
      runClean(
        "concatenation-discount-line",
        valueIs("discountLine", "'Discount: false'"),
        "discountLine needs to be a String with the value Discount: false.",
        "discountLine precisa ser uma String com o valor Discount: false.",
        discountLinePreview,
      ),
    ],
  ),
  many(
    "concatenation-total",
    "Declare a variable named amount and store 19.99. Then declare a variable named totalLine and store Total: 19.99 by joining Total: with amount.",
    "Declare uma variável chamada amount e guarde 19.99. Depois declare uma variável chamada totalLine e guarde Total: 19.99, juntando Total: com amount.",
    [
      runClean(
        "concatenation-total-amount",
        decimalIs("amount", "19.99"),
        "amount needs to be a Decimal with the value 19.99.",
        "amount precisa ser um Decimal com o valor 19.99.",
        totalPreview,
      ),
      runClean(
        "concatenation-total-line",
        valueIs("totalLine", "'Total: 19.99'"),
        "totalLine needs to be a String with the value Total: 19.99.",
        "totalLine precisa ser uma String com o valor Total: 19.99.",
        totalPreview,
      ),
    ],
  ),
  many(
    "concatenation-close",
    "Declare a variable named closeDate and store 15 March 2026. Then declare a variable named closeLine and store the text for that day by joining Closes: with closeDate.",
    "Declare uma variável chamada closeDate e guarde 15 de março de 2026. Depois declare uma variável chamada closeLine e guarde o texto desse dia, juntando Closes: com closeDate.",
    [
      runClean(
        "concatenation-close-date",
        valueIs("closeDate", "Date.newInstance(2026, 3, 15)"),
        "closeDate needs to be a Date for 15 March 2026.",
        "closeDate precisa ser uma Date de 15 de março de 2026.",
        closeLinePreview,
      ),
      runClean(
        "concatenation-close-line",
        textStarts("closeLine", "Closes: 2026-03-15"),
        "closeLine needs to be a String that starts with Closes: 2026-03-15.",
        "closeLine precisa ser uma String que comece com Closes: 2026-03-15.",
        closeLinePreview,
      ),
    ],
  ),
  many(
    "concatenation-full-name",
    "Declare a variable named firstName and store Ana. Declare a variable named lastName and store Silva. Then declare a variable named fullName and store Ana Silva by joining firstName, a space, and lastName.",
    "Declare uma variável chamada firstName e guarde Ana. Declare uma variável chamada lastName e guarde Silva. Depois declare uma variável chamada fullName e guarde Ana Silva, juntando firstName, um espaço e lastName.",
    [
      runClean(
        "concatenation-full-name-first",
        valueIs("firstName", "'Ana'"),
        "firstName needs to be a String with the value Ana.",
        "firstName precisa ser uma String com o valor Ana.",
        fullNamePreview,
      ),
      runClean(
        "concatenation-full-name-last",
        valueIs("lastName", "'Silva'"),
        "lastName needs to be a String with the value Silva.",
        "lastName precisa ser uma String com o valor Silva.",
        fullNamePreview,
      ),
      runClean(
        "concatenation-full-name-full",
        valueIs("fullName", "'Ana Silva'"),
        "fullName needs to be a String with the value Ana Silva.",
        "fullName precisa ser uma String com o valor Ana Silva.",
        fullNamePreview,
      ),
    ],
  ),
];

const mixedPreview = [
  "Integer seatCount = 3;",
  "String label = 'Seats: ' + seatCount;",
].join("\n");

const mixedSeatLabel = many(
  "mixed-seat-label",
  "Declare an Integer named seatCount and store 3. Then declare a String named label and store Seats: 3 by joining Seats: with seatCount.",
  "Declare um Integer chamado seatCount e guarde 3. Depois declare uma String chamada label e guarde Seats: 3, juntando Seats: com seatCount.",
  [
    runClean(
      "mixed-seat-count-is-3",
      valueIs("seatCount", "3"),
      "seatCount needs to be an Integer with the value 3.",
      "seatCount precisa ser um Integer com o valor 3.",
      mixedPreview,
    ),
    runClean(
      "mixed-label-is-seats-3",
      valueIs("label", "'Seats: 3'"),
      "label needs to be a String with the value Seats: 3.",
      "label precisa ser uma String com o valor Seats: 3.",
      mixedPreview,
    ),
  ],
);

const mixedPlacePreview = [
  "String city = 'Austin';",
  "String region = 'TX';",
  "String place = city + ' ' + region;",
].join("\n");

const mixedYesCodePreview = ["String answer = 'Yes';", "String code = 'yes';"].join("\n");

const mixedBadgePreview = [
  "String prefix = 'SF';",
  "String code = '100';",
  "String badge = prefix + code;",
].join("\n");

const mixedRoomsPreview = [
  "Integer roomCount = 12;",
  "String line = 'Rooms: ' + roomCount;",
].join("\n");

const mixedPaidLinePreview = [
  "Boolean paidFlag = false;",
  "String paidLine = 'Paid: ' + paidFlag;",
].join("\n");

const mixedPriceLinePreview = [
  "Decimal unitPrice = 8.5;",
  "String priceLine = 'Price: ' + unitPrice;",
].join("\n");

const mixedStartsPreview = [
  "Date startDate = Date.newInstance(2026, 6, 1);",
  "String startLine = 'Starts: ' + startDate;",
].join("\n");

const mixedFullNamePreview = [
  "String firstName = 'Leo';",
  "String lastName = 'Costa';",
  "String fullName = firstName + ' ' + lastName;",
].join("\n");

const mixedPartyPreview = ["Integer adultCount = 2;", "Integer childCount = 1;"].join("\n");

const mixedAddressPreview = [
  "Boolean hasStreet = true;",
  "Boolean hasZip = false;",
].join("\n");

const mixedTaxTipPreview = ["Decimal tax = 1.5;", "Decimal tip = 2.0;"].join("\n");

const mixedWindowPreview = [
  "Date openDate = Date.newInstance(2026, 3, 1);",
  "Date closeOut = Date.newInstance(2026, 3, 31);",
].join("\n");

const mixedRushPreview = [
  "Integer quantity = 10;",
  "Boolean isTaxable = true;",
  "String note = 'Rush';",
].join("\n");

const mixedSummaryPreview = [
  "Integer guestCount = 4;",
  "Decimal fee = 12.5;",
  "String summary = 'Guests: ' + guestCount + ' Fee: ' + fee;",
].join("\n");

const mixedReviewExercises: ExerciseCard[] = [
  mixedSeatLabel,
  one(
    "mixed-ticket-count",
    "Declare an Integer named ticketCount and store 8.",
    "Declare um Integer chamado ticketCount e guarde 8.",
    valueIs("ticketCount", "8"),
    "ticketCount needs to be an Integer with the value 8.",
    "ticketCount precisa ser um Integer com o valor 8.",
    "Integer ticketCount = 8;",
  ),
  one(
    "mixed-subject",
    "Declare a String named subject and store Follow up.",
    "Declare uma String chamada subject e guarde Follow up.",
    valueIs("subject", "'Follow up'"),
    "subject needs to be a String with the value Follow up.",
    "subject precisa ser uma String com o valor Follow up.",
    "String subject = 'Follow up';",
  ),
  one(
    "mixed-is-paid",
    "Declare a Boolean named isPaid and store true.",
    "Declare um Boolean chamado isPaid e guarde true.",
    valueIs("isPaid", "true"),
    "isPaid needs to be a Boolean with the value true.",
    "isPaid precisa ser um Boolean com o valor true.",
    "Boolean isPaid = true;",
  ),
  one(
    "mixed-price",
    "Declare a Decimal named price and store 24.5.",
    "Declare um Decimal chamado price e guarde 24.5.",
    decimalIs("price", "24.5"),
    "price needs to be a Decimal with the value 24.5.",
    "price precisa ser um Decimal com o valor 24.5.",
    "Decimal price = 24.5;",
  ),
  one(
    "mixed-meeting",
    "Declare a Date named meetingDate and store 2 May 2026.",
    "Declare uma Date chamada meetingDate e guarde 2 de maio de 2026.",
    valueIs("meetingDate", "Date.newInstance(2026, 5, 2)"),
    "meetingDate needs to be a Date for 2 May 2026.",
    "meetingDate precisa ser uma Date de 2 de maio de 2026.",
    "Date meetingDate = Date.newInstance(2026, 5, 2);",
  ),
  many(
    "mixed-place",
    "Declare a String named city and store Austin. Declare a String named region and store TX. Then declare a String named place and store Austin TX by joining city, a space, and region.",
    "Declare uma String chamada city e guarde Austin. Declare uma String chamada region e guarde TX. Depois declare uma String chamada place e guarde Austin TX, juntando city, um espaço e region.",
    [
      runClean(
        "mixed-place-city",
        valueIs("city", "'Austin'"),
        "city needs to be a String with the value Austin.",
        "city precisa ser uma String com o valor Austin.",
        mixedPlacePreview,
      ),
      runClean(
        "mixed-place-region",
        valueIs("region", "'TX'"),
        "region needs to be a String with the value TX.",
        "region precisa ser uma String com o valor TX.",
        mixedPlacePreview,
      ),
      runClean(
        "mixed-place-place",
        valueIs("place", "'Austin TX'"),
        "place needs to be a String with the value Austin TX.",
        "place precisa ser uma String com o valor Austin TX.",
        mixedPlacePreview,
      ),
    ],
  ),
  one(
    "mixed-queue",
    "Declare an Integer named queueSize and store 0.",
    "Declare um Integer chamado queueSize e guarde 0.",
    valueIs("queueSize", "0"),
    "queueSize needs to be an Integer with the value 0.",
    "queueSize precisa ser um Integer com o valor 0.",
    "Integer queueSize = 0;",
  ),
  one(
    "mixed-code-text",
    "Declare a String named codeText and store the text 42.",
    "Declare uma String chamada codeText e guarde o texto 42.",
    valueIs("codeText", "'42'"),
    "codeText needs to be a String with the value 42.",
    "codeText precisa ser uma String com o valor 42.",
    "String codeText = '42';",
  ),
  one(
    "mixed-is-closed",
    "Declare a Boolean named isClosed and store false.",
    "Declare um Boolean chamado isClosed e guarde false.",
    valueIs("isClosed", "false"),
    "isClosed needs to be a Boolean with the value false.",
    "isClosed precisa ser um Boolean com o valor false.",
    "Boolean isClosed = false;",
  ),
  one(
    "mixed-portion",
    "Declare a variable named portion and store 0.25.",
    "Declare uma variável chamada portion e guarde 0.25.",
    decimalIs("portion", "0.25"),
    "portion needs to be a Decimal with the value 0.25.",
    "portion precisa ser um Decimal com o valor 0.25.",
    "Decimal portion = 0.25;",
  ),
  one(
    "mixed-holiday",
    "Declare a variable named holidayDate and store 9 September 2026.",
    "Declare uma variável chamada holidayDate e guarde 9 de setembro de 2026.",
    valueIs("holidayDate", "Date.newInstance(2026, 9, 9)"),
    "holidayDate needs to be a Date for 9 September 2026.",
    "holidayDate precisa ser uma Date de 9 de setembro de 2026.",
    "Date holidayDate = Date.newInstance(2026, 9, 9);",
  ),
  many(
    "mixed-badge",
    "Declare a variable named prefix and store SF. Declare a variable named code and store the text 100. Then declare a variable named badge and store SF100 by joining prefix and code, with no space.",
    "Declare uma variável chamada prefix e guarde SF. Declare uma variável chamada code e guarde o texto 100. Depois declare uma variável chamada badge e guarde SF100, juntando prefix e code, sem espaço.",
    [
      runClean(
        "mixed-badge-prefix",
        valueIs("prefix", "'SF'"),
        "prefix needs to be a String with the value SF.",
        "prefix precisa ser uma String com o valor SF.",
        mixedBadgePreview,
      ),
      runClean(
        "mixed-badge-code",
        valueIs("code", "'100'"),
        "code needs to be a String with the value 100.",
        "code precisa ser uma String com o valor 100.",
        mixedBadgePreview,
      ),
      runClean(
        "mixed-badge-badge",
        valueIs("badge", "'SF100'"),
        "badge needs to be a String with the value SF100.",
        "badge precisa ser uma String com o valor SF100.",
        mixedBadgePreview,
      ),
    ],
  ),
  one(
    "mixed-floor",
    "Declare a variable named floorNumber and store -3.",
    "Declare uma variável chamada floorNumber e guarde -3.",
    valueIs("floorNumber", "-3"),
    "floorNumber needs to be an Integer with the value -3.",
    "floorNumber precisa ser um Integer com o valor -3.",
    "Integer floorNumber = -3;",
  ),
  many(
    "mixed-yes-code",
    "Declare a variable named answer and store Yes. Declare a variable named code and store yes.",
    "Declare uma variável chamada answer e guarde Yes. Declare uma variável chamada code e guarde yes.",
    [
      runClean(
        "mixed-yes-code-answer",
        valueIs("answer", "'Yes'"),
        "answer needs to be a String with the value Yes.",
        "answer precisa ser uma String com o valor Yes.",
        mixedYesCodePreview,
      ),
      runClean(
        "mixed-yes-code-code",
        valueIs("code", "'yes'"),
        "code needs to be a String with the value yes.",
        "code precisa ser uma String com o valor yes.",
        mixedYesCodePreview,
      ),
    ],
  ),
  one(
    "mixed-can-view",
    "Declare a variable named canView and store true, not the text true.",
    "Declare uma variável chamada canView e guarde true, não o texto true.",
    valueIs("canView", "true"),
    "canView needs to be a Boolean with the value true.",
    "canView precisa ser um Boolean com o valor true.",
    "Boolean canView = true;",
  ),
  one(
    "mixed-offset",
    "Declare a variable named offset and store -1.5.",
    "Declare uma variável chamada offset e guarde -1.5.",
    decimalIs("offset", "-1.5"),
    "offset needs to be a Decimal with the value -1.5.",
    "offset precisa ser um Decimal com o valor -1.5.",
    "Decimal offset = -1.5;",
  ),
  one(
    "mixed-run-date",
    "Declare a variable named runDate and store the day this code runs.",
    "Declare uma variável chamada runDate e guarde o dia em que este código roda.",
    valueIs("runDate", "Date.today()"),
    "runDate needs to be a Date for the day this code runs.",
    "runDate precisa ser uma Date do dia em que este código roda.",
    "Date runDate = Date.today();",
  ),
  many(
    "mixed-rooms",
    "Declare a variable named roomCount and store 12. Then declare a variable named line and store Rooms: 12 by joining Rooms: with roomCount.",
    "Declare uma variável chamada roomCount e guarde 12. Depois declare uma variável chamada line e guarde Rooms: 12, juntando Rooms: com roomCount.",
    [
      runClean(
        "mixed-rooms-count",
        valueIs("roomCount", "12"),
        "roomCount needs to be an Integer with the value 12.",
        "roomCount precisa ser um Integer com o valor 12.",
        mixedRoomsPreview,
      ),
      runClean(
        "mixed-rooms-line",
        valueIs("line", "'Rooms: 12'"),
        "line needs to be a String with the value Rooms: 12.",
        "line precisa ser uma String com o valor Rooms: 12.",
        mixedRoomsPreview,
      ),
    ],
  ),
  one(
    "mixed-attendees",
    "Declare a variable named attendeeCount and store 2400.",
    "Declare uma variável chamada attendeeCount e guarde 2400.",
    valueIs("attendeeCount", "2400"),
    "attendeeCount needs to be an Integer with the value 2400.",
    "attendeeCount precisa ser um Integer com o valor 2400.",
    "Integer attendeeCount = 2400;",
  ),
  one(
    "mixed-tag",
    "Declare a variable named tag and store empty text.",
    "Declare uma variável chamada tag e guarde um texto vazio.",
    valueIs("tag", "''"),
    "tag needs to be a String with no characters.",
    "tag precisa ser uma String sem nenhum caractere.",
    "String tag = '';",
  ),
  one(
    "mixed-is-synced",
    "Declare a variable named isSynced and leave the value off.",
    "Declare uma variável chamada isSynced e deixe o valor de fora.",
    valueIs("isSynced", "null"),
    "isSynced needs to be a Boolean with no value stored.",
    "isSynced precisa ser um Boolean sem valor guardado.",
    "Boolean isSynced;",
  ),
  one(
    "mixed-balance-due",
    "Declare a variable named balanceDue and store 0.0.",
    "Declare uma variável chamada balanceDue e guarde 0.0.",
    decimalIs("balanceDue", "0.0"),
    "balanceDue needs to be a Decimal with the value 0.0.",
    "balanceDue precisa ser um Decimal com o valor 0.0.",
    "Decimal balanceDue = 0.0;",
  ),
  one(
    "mixed-hold",
    "Declare a variable named holdDate and leave the value off.",
    "Declare uma variável chamada holdDate e deixe o valor de fora.",
    valueIs("holdDate", "null"),
    "holdDate needs to be a Date with no value stored.",
    "holdDate precisa ser uma Date sem valor guardado.",
    "Date holdDate;",
  ),
  many(
    "mixed-paid-line",
    "Declare a variable named paidFlag and store false. Then declare a variable named paidLine and store Paid: false by joining Paid: with paidFlag.",
    "Declare uma variável chamada paidFlag e guarde false. Depois declare uma variável chamada paidLine e guarde Paid: false, juntando Paid: com paidFlag.",
    [
      runClean(
        "mixed-paid-line-flag",
        valueIs("paidFlag", "false"),
        "paidFlag needs to be a Boolean with the value false.",
        "paidFlag precisa ser um Boolean com o valor false.",
        mixedPaidLinePreview,
      ),
      runClean(
        "mixed-paid-line-line",
        valueIs("paidLine", "'Paid: false'"),
        "paidLine needs to be a String with the value Paid: false.",
        "paidLine precisa ser uma String com o valor Paid: false.",
        mixedPaidLinePreview,
      ),
    ],
  ),
  one(
    "mixed-spare",
    "Declare a variable named spare and leave the value off.",
    "Declare uma variável chamada spare e deixe o valor de fora.",
    valueIs("spare", "null"),
    "spare needs to be an Integer with no value stored.",
    "spare precisa ser um Integer sem valor guardado.",
    "Integer spare;",
  ),
  one(
    "mixed-reminder",
    "Declare a variable named reminder and leave the value off.",
    "Declare uma variável chamada reminder e deixe o valor de fora.",
    valueIs("reminder", "null"),
    "reminder needs to be a String with no value stored.",
    "reminder precisa ser uma String sem valor guardado.",
    "String reminder;",
  ),
  one(
    "mixed-is-approved",
    "Declare a variable named isApproved. On the next line, store true in isApproved.",
    "Declare uma variável chamada isApproved. Na linha seguinte, guarde true em isApproved.",
    valueIs("isApproved", "true"),
    "isApproved needs to be a Boolean with the value true.",
    "isApproved precisa ser um Boolean com o valor true.",
    "Boolean isApproved;\nisApproved = true;",
  ),
  one(
    "mixed-credit",
    "Declare a variable named credit and leave the value off.",
    "Declare uma variável chamada credit e deixe o valor de fora.",
    valueIs("credit", "null"),
    "credit needs to be a Decimal with no value stored.",
    "credit precisa ser um Decimal sem valor guardado.",
    "Decimal credit;",
  ),
  one(
    "mixed-ship",
    "Declare a variable named shipDate. On the next line, store 20 August 2026 in shipDate.",
    "Declare uma variável chamada shipDate. Na linha seguinte, guarde 20 de agosto de 2026 em shipDate.",
    valueIs("shipDate", "Date.newInstance(2026, 8, 20)"),
    "shipDate needs to be a Date for 20 August 2026.",
    "shipDate precisa ser uma Date de 20 de agosto de 2026.",
    "Date shipDate;\nshipDate = Date.newInstance(2026, 8, 20);",
  ),
  many(
    "mixed-price-line",
    "Declare a variable named unitPrice and store 8.5. Then declare a variable named priceLine and store Price: 8.5 by joining Price: with unitPrice.",
    "Declare uma variável chamada unitPrice e guarde 8.5. Depois declare uma variável chamada priceLine e guarde Price: 8.5, juntando Price: com unitPrice.",
    [
      runClean(
        "mixed-price-line-price",
        decimalIs("unitPrice", "8.5"),
        "unitPrice needs to be a Decimal with the value 8.5.",
        "unitPrice precisa ser um Decimal com o valor 8.5.",
        mixedPriceLinePreview,
      ),
      runClean(
        "mixed-price-line-line",
        valueIs("priceLine", "'Price: 8.5'"),
        "priceLine needs to be a String with the value Price: 8.5.",
        "priceLine precisa ser uma String com o valor Price: 8.5.",
        mixedPriceLinePreview,
      ),
    ],
  ),
  one(
    "mixed-attempts",
    "Declare a variable named attempts and store 1. On the next line, store 5 in attempts.",
    "Declare uma variável chamada attempts e guarde 1. Na linha seguinte, guarde 5 em attempts.",
    valueIs("attempts", "5"),
    "attempts needs to be an Integer with the value 5.",
    "attempts precisa ser um Integer com o valor 5.",
    "Integer attempts = 1;\nattempts = 5;",
  ),
  one(
    "mixed-city",
    "Declare a variable named city. On the next line, store Denver in city.",
    "Declare uma variável chamada city. Na linha seguinte, guarde Denver em city.",
    valueIs("city", "'Denver'"),
    "city needs to be a String with the value Denver.",
    "city precisa ser uma String com o valor Denver.",
    "String city;\ncity = 'Denver';",
  ),
  one(
    "mixed-is-draft",
    "Declare a variable named isDraft and store true. On the next line, store false in isDraft.",
    "Declare uma variável chamada isDraft e guarde true. Na linha seguinte, guarde false em isDraft.",
    valueIs("isDraft", "false"),
    "isDraft needs to be a Boolean with the value false.",
    "isDraft precisa ser um Boolean com o valor false.",
    "Boolean isDraft = true;\nisDraft = false;",
  ),
  one(
    "mixed-cost",
    "Declare a variable named cost. On the next line, store 7.25 in cost.",
    "Declare uma variável chamada cost. Na linha seguinte, guarde 7.25 em cost.",
    decimalIs("cost", "7.25"),
    "cost needs to be a Decimal with the value 7.25.",
    "cost precisa ser um Decimal com o valor 7.25.",
    "Decimal cost;\ncost = 7.25;",
  ),
  one(
    "mixed-event",
    "Declare a variable named eventDate and store 1 May 2026. On the next line, store 2 May 2026 in eventDate.",
    "Declare uma variável chamada eventDate e guarde 1 de maio de 2026. Na linha seguinte, guarde 2 de maio de 2026 em eventDate.",
    valueIs("eventDate", "Date.newInstance(2026, 5, 2)"),
    "eventDate needs to be a Date for 2 May 2026.",
    "eventDate precisa ser uma Date de 2 de maio de 2026.",
    "Date eventDate = Date.newInstance(2026, 5, 1);\neventDate = Date.newInstance(2026, 5, 2);",
  ),
  many(
    "mixed-starts",
    "Declare a variable named startDate and store 1 June 2026. Then declare a variable named startLine and store the text for that day by joining Starts: with startDate.",
    "Declare uma variável chamada startDate e guarde 1 de junho de 2026. Depois declare uma variável chamada startLine e guarde o texto desse dia, juntando Starts: com startDate.",
    [
      runClean(
        "mixed-starts-date",
        valueIs("startDate", "Date.newInstance(2026, 6, 1)"),
        "startDate needs to be a Date for 1 June 2026.",
        "startDate precisa ser uma Date de 1 de junho de 2026.",
        mixedStartsPreview,
      ),
      runClean(
        "mixed-starts-line",
        textStarts("startLine", "Starts: 2026-06-01"),
        "startLine needs to be a String that starts with Starts: 2026-06-01.",
        "startLine precisa ser uma String que comece com Starts: 2026-06-01.",
        mixedStartsPreview,
      ),
    ],
  ),
  one(
    "mixed-room",
    "Declare a variable named roomNumber. On the next line, store 14 in roomNumber.",
    "Declare uma variável chamada roomNumber. Na linha seguinte, guarde 14 em roomNumber.",
    valueIs("roomNumber", "14"),
    "roomNumber needs to be an Integer with the value 14.",
    "roomNumber precisa ser um Integer com o valor 14.",
    "Integer roomNumber;\nroomNumber = 14;",
  ),
  one(
    "mixed-owner",
    "Declare a variable named ownerName and store O'Neil.",
    "Declare uma variável chamada ownerName e guarde O'Neil.",
    valueIs("ownerName", "'O\\'Neil'"),
    "ownerName needs to be a String with the value O'Neil.",
    "ownerName precisa ser uma String com o valor O'Neil.",
    "String ownerName = 'O\\'Neil';",
  ),
  one(
    "mixed-is-member",
    "Declare a variable named isMember and store false. On the next line, store true in isMember.",
    "Declare uma variável chamada isMember e guarde false. Na linha seguinte, guarde true em isMember.",
    valueIs("isMember", "true"),
    "isMember needs to be a Boolean with the value true.",
    "isMember precisa ser um Boolean com o valor true.",
    "Boolean isMember = false;\nisMember = true;",
  ),
  one(
    "mixed-list-price",
    "Declare a variable named listPrice and store 9.99. On the next line, store 7.5 in listPrice.",
    "Declare uma variável chamada listPrice e guarde 9.99. Na linha seguinte, guarde 7.5 em listPrice.",
    decimalIs("listPrice", "7.5"),
    "listPrice needs to be a Decimal with the value 7.5.",
    "listPrice precisa ser um Decimal com o valor 7.5.",
    "Decimal listPrice = 9.99;\nlistPrice = 7.5;",
  ),
  one(
    "mixed-year-end",
    "Declare a variable named yearEnd and store 31 December 2027.",
    "Declare uma variável chamada yearEnd e guarde 31 de dezembro de 2027.",
    valueIs("yearEnd", "Date.newInstance(2027, 12, 31)"),
    "yearEnd needs to be a Date for 31 December 2027.",
    "yearEnd precisa ser uma Date de 31 de dezembro de 2027.",
    "Date yearEnd = Date.newInstance(2027, 12, 31);",
  ),
  many(
    "mixed-leo",
    "Declare a variable named firstName and store Leo. Declare a variable named lastName and store Costa. Then declare a variable named fullName and store Leo Costa by joining firstName, a space, and lastName.",
    "Declare uma variável chamada firstName e guarde Leo. Declare uma variável chamada lastName e guarde Costa. Depois declare uma variável chamada fullName e guarde Leo Costa, juntando firstName, um espaço e lastName.",
    [
      runClean(
        "mixed-leo-first",
        valueIs("firstName", "'Leo'"),
        "firstName needs to be a String with the value Leo.",
        "firstName precisa ser uma String com o valor Leo.",
        mixedFullNamePreview,
      ),
      runClean(
        "mixed-leo-last",
        valueIs("lastName", "'Costa'"),
        "lastName needs to be a String with the value Costa.",
        "lastName precisa ser uma String com o valor Costa.",
        mixedFullNamePreview,
      ),
      runClean(
        "mixed-leo-full",
        valueIs("fullName", "'Leo Costa'"),
        "fullName needs to be a String with the value Leo Costa.",
        "fullName precisa ser uma String com o valor Leo Costa.",
        mixedFullNamePreview,
      ),
    ],
  ),
  many(
    "mixed-party",
    "Declare a variable named adultCount and store 2. Declare a variable named childCount and store 1.",
    "Declare uma variável chamada adultCount e guarde 2. Declare uma variável chamada childCount e guarde 1.",
    [
      runClean(
        "mixed-party-adults",
        valueIs("adultCount", "2"),
        "adultCount needs to be an Integer with the value 2.",
        "adultCount precisa ser um Integer com o valor 2.",
        mixedPartyPreview,
      ),
      runClean(
        "mixed-party-children",
        valueIs("childCount", "1"),
        "childCount needs to be an Integer with the value 1.",
        "childCount precisa ser um Integer com o valor 1.",
        mixedPartyPreview,
      ),
    ],
  ),
  one(
    "mixed-stage",
    "Declare a variable named stage and store New. On the next line, store Working in stage.",
    "Declare uma variável chamada stage e guarde New. Na linha seguinte, guarde Working em stage.",
    valueIs("stage", "'Working'"),
    "stage needs to be a String with the value Working.",
    "stage precisa ser uma String com o valor Working.",
    "String stage = 'New';\nstage = 'Working';",
  ),
  many(
    "mixed-address",
    "Declare a variable named hasStreet and store true. Declare a variable named hasZip and store false.",
    "Declare uma variável chamada hasStreet e guarde true. Declare uma variável chamada hasZip e guarde false.",
    [
      runClean(
        "mixed-address-street",
        valueIs("hasStreet", "true"),
        "hasStreet needs to be a Boolean with the value true.",
        "hasStreet precisa ser um Boolean com o valor true.",
        mixedAddressPreview,
      ),
      runClean(
        "mixed-address-zip",
        valueIs("hasZip", "false"),
        "hasZip needs to be a Boolean with the value false.",
        "hasZip precisa ser um Boolean com o valor false.",
        mixedAddressPreview,
      ),
    ],
  ),
  many(
    "mixed-tax-tip",
    "Declare a variable named tax and store 1.5. Declare a variable named tip and store 2.0.",
    "Declare uma variável chamada tax e guarde 1.5. Declare uma variável chamada tip e guarde 2.0.",
    [
      runClean(
        "mixed-tax-tip-tax",
        decimalIs("tax", "1.5"),
        "tax needs to be a Decimal with the value 1.5.",
        "tax precisa ser um Decimal com o valor 1.5.",
        mixedTaxTipPreview,
      ),
      runClean(
        "mixed-tax-tip-tip",
        decimalIs("tip", "2.0"),
        "tip needs to be a Decimal with the value 2.0.",
        "tip precisa ser um Decimal com o valor 2.0.",
        mixedTaxTipPreview,
      ),
    ],
  ),
  many(
    "mixed-window",
    "Declare a variable named openDate and store 1 March 2026. Declare a variable named closeOut and store 31 March 2026.",
    "Declare uma variável chamada openDate e guarde 1 de março de 2026. Declare uma variável chamada closeOut e guarde 31 de março de 2026.",
    [
      runClean(
        "mixed-window-open",
        valueIs("openDate", "Date.newInstance(2026, 3, 1)"),
        "openDate needs to be a Date for 1 March 2026.",
        "openDate precisa ser uma Date de 1 de março de 2026.",
        mixedWindowPreview,
      ),
      runClean(
        "mixed-window-close",
        valueIs("closeOut", "Date.newInstance(2026, 3, 31)"),
        "closeOut needs to be a Date for 31 March 2026.",
        "closeOut precisa ser uma Date de 31 de março de 2026.",
        mixedWindowPreview,
      ),
    ],
  ),
  many(
    "mixed-rush",
    "Declare a variable named quantity and store the number 10, not the text 10. Declare a variable named isTaxable and store true. Declare a variable named note and store Rush.",
    "Declare uma variável chamada quantity e guarde o número 10, não o texto 10. Declare uma variável chamada isTaxable e guarde true. Declare uma variável chamada note e guarde Rush.",
    [
      runClean(
        "mixed-rush-quantity",
        valueIs("quantity", "10"),
        "quantity needs to be an Integer with the value 10.",
        "quantity precisa ser um Integer com o valor 10.",
        mixedRushPreview,
      ),
      runClean(
        "mixed-rush-taxable",
        valueIs("isTaxable", "true"),
        "isTaxable needs to be a Boolean with the value true.",
        "isTaxable precisa ser um Boolean com o valor true.",
        mixedRushPreview,
      ),
      runClean(
        "mixed-rush-note",
        valueIs("note", "'Rush'"),
        "note needs to be a String with the value Rush.",
        "note precisa ser uma String com o valor Rush.",
        mixedRushPreview,
      ),
    ],
  ),
  many(
    "mixed-summary",
    "Declare a variable named guestCount and store 4. Declare a variable named fee and store 12.5. Then declare a variable named summary and store Guests: 4 Fee: 12.5 by joining the text Guests: , guestCount, the text Fee: , and fee.",
    "Declare uma variável chamada guestCount e guarde 4. Declare uma variável chamada fee e guarde 12.5. Depois declare uma variável chamada summary e guarde Guests: 4 Fee: 12.5, juntando o texto Guests: , guestCount, o texto Fee:  e fee.",
    [
      runClean(
        "mixed-summary-count",
        valueIs("guestCount", "4"),
        "guestCount needs to be an Integer with the value 4.",
        "guestCount precisa ser um Integer com o valor 4.",
        mixedSummaryPreview,
      ),
      runClean(
        "mixed-summary-fee",
        decimalIs("fee", "12.5"),
        "fee needs to be a Decimal with the value 12.5.",
        "fee precisa ser um Decimal com o valor 12.5.",
        mixedSummaryPreview,
      ),
      runClean(
        "mixed-summary-line",
        valueIs("summary", "'Guests: 4 Fee: 12.5'"),
        "summary needs to be a String with the value Guests: 4 Fee: 12.5.",
        "summary precisa ser uma String com o valor Guests: 4 Fee: 12.5.",
        mixedSummaryPreview,
      ),
    ],
  ),
];

/** One list per topic. Theory-only topics stay empty until an exercise is added. */
export const variablesExerciseCards: Record<VariablesTopicId, ExerciseCard[]> = {
  "what-a-variable-is": [],
  "naming-rules": [],
  declaring: [],
  assigning: [],
  "system-debug": [],
  integer: integerExercises,
  string: stringExercises,
  boolean: booleanExercises,
  decimal: decimalExercises,
  date: dateExercises,
  concatenation: concatenationExercises,
  "mixed-review": mixedReviewExercises,
};
