import type { TheoryCard, VariablesTopicId } from "@/lib/curriculum";

function block(value: string) {
  const trimmed = value.replace(/^\n/, "").replace(/\s*$/, "");
  const lines = trimmed.split("\n");
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0].length ?? 0);
  const indent = indents.length > 0 ? Math.min(...indents) : 0;
  return lines
    .map((line) => line.slice(indent).trimEnd())
    .join("\n")
    .trim();
}

function theory(
  id: string,
  en: string,
  pt: string,
  sampleApex = "",
): TheoryCard {
  return {
    id,
    type: "theory",
    bodies: { en: block(en), "pt-BR": block(pt) },
    imageRefs: [],
    sampleApex: block(sampleApex),
  };
}

/**
 * Seed theory for Variables. Samples stay English.
 * Mixed review has no cards of its own: its theory pane is every earlier topic.
 */
export const variablesTheoryCards: Record<VariablesTopicId, TheoryCard[]> = {
  "what-a-variable-is": [
    theory(
      "what-a-variable-is-one-value",
      `
        A variable is a name for one value in your code.

        Picture a label on a box. The label is the name. What is inside is the value. The box holds one thing. When the code finishes, the box is gone.

        A variable is not a field on a Salesforce record. It is not saved. It exists only while the code runs.
      `,
      `
        Uma variável é um nome para um valor no seu código.

        Imagine uma etiqueta numa caixa. A etiqueta é o nome. O que está dentro é o valor. A caixa guarda uma coisa só. Quando o código termina, a caixa some.

        Uma variável não é um campo de um registro no Salesforce. Ela não é salva. Ela existe só enquanto o código roda.
      `,
    ),
    theory(
      "what-a-variable-is-one-type",
      `
        Each variable has one type.

        The type is the kind of value the name can hold: a whole number, text, yes or no, a number with a fraction, or a calendar day. You choose the type when you create the variable. That choice stays.

        You will practice each type in its own topic.
      `,
      `
        Cada variável tem um tipo.

        O tipo é a espécie de valor que o nome pode guardar: um número inteiro, um texto, sim ou não, um número com fração, ou um dia do calendário. Você escolhe o tipo ao criar a variável. Essa escolha fica.

        Você vai praticar cada tipo no tópico dele.
      `,
    ),
  ],
  "naming-rules": [
    theory(
      "naming-rules-letters",
      `
        A name starts with a letter.

        After that letter you can use letters, digits, and underscores. A name cannot contain a space. accountName can be a name. 2ndPlace cannot, because it starts with a digit.

        Start with a lowercase letter and capitalize each new word: accountName, closeDate, isActive. In the sample, the first word is the type and the second word is the name.
      `,
      `
        Um nome começa com uma letra.

        Depois dessa letra você pode usar letras, números e sublinhados. Um nome não pode ter espaço. accountName pode ser um nome. 2ndPlace não pode, porque começa com um número.

        Comece com letra minúscula e use maiúscula em cada palavra nova: accountName, closeDate, isActive. Na amostra, a primeira palavra é o tipo e a segunda é o nome.
      `,
      `
        String accountName;
        Integer seatCount;
      `,
    ),
    theory(
      "naming-rules-same-name",
      `
        Capital letters do not make a new variable.

        age and Age are the same name in Apex. You have one variable, not two. The second line stores 30 in that same variable.
      `,
      `
        Maiúsculas não criam outra variável.

        age e Age são o mesmo nome no Apex. Você tem uma variável, não duas. A segunda linha guarda 30 nessa mesma variável.
      `,
      `
        Integer age;
        Age = 30;
      `,
    ),
    theory(
      "naming-rules-text-case",
      `
        Text cares about capital letters.

        The name of a variable ignores capitals. The text inside quotes does not. Hi and hi are different text. The String topic explains the quotes. For now, notice the two values in the sample.
      `,
      `
        No texto, maiúscula muda o valor.

        O nome da variável ignora maiúsculas. O texto entre aspas não ignora. Hi e hi são textos diferentes. O tópico String explica as aspas. Por agora, repare nos dois valores da amostra.
      `,
      `
        String loud = 'Hi';
        String quiet = 'hi';
      `,
    ),
    theory(
      "naming-rules-taken-words",
      `
        Some words are already instructions.

        Do not use them as names. Some of those words are if, else, class, return, new, true, false, and null. Pick a name that says what the value is, such as accountName or seatCount.
      `,
      `
        Algumas palavras já são instruções.

        Não use essas palavras como nomes. Algumas delas são if, else, class, return, new, true, false e null. Escolha um nome que diga o que o valor é, como accountName ou seatCount.
      `,
      `
        String accountName;
        Integer seatCount;
      `,
    ),
  ],
  declaring: [
    theory(
      "declaring-type-name",
      `
        Declaring creates the variable.

        Write the type, then the name, then a semicolon. The semicolon ends the step. Without it, the line is not valid Apex, and the code does not run.

        Integer means a whole number. This line creates one variable, named seatCount.
      `,
      `
        Declarar cria a variável.

        Escreva o tipo, depois o nome, e então um ponto e vírgula. O ponto e vírgula termina o passo. Sem ele, a linha não é Apex válido, e o código não roda.

        Integer significa um número inteiro. Essa linha cria uma variável, chamada seatCount.
      `,
      `
        Integer seatCount;
      `,
    ),
    theory(
      "declaring-same-shape",
      `
        Other types use the same shape.

        The type comes first, then the name, then a semicolon. String is text. Boolean is yes or no. Decimal is a number that can have a fraction. Date is a calendar day. Each one has its own topic later. The shape of the line stays the same.
      `,
      `
        Os outros tipos usam a mesma forma.

        O tipo vem primeiro, depois o nome, e então um ponto e vírgula. String é texto. Boolean é sim ou não. Decimal é um número que pode ter fração. Date é um dia do calendário. Cada um tem seu próprio tópico mais à frente. A forma da linha continua a mesma.
      `,
      `
        String accountName;
        Boolean isActive;
        Decimal amount;
        Date closeDate;
      `,
    ),
    theory(
      "declaring-top-to-bottom",
      `
        Apex runs from the top line to the bottom.

        Each line is one step. The first line finishes before the next line starts. When a later line uses a variable, it sees what the earlier lines already did.
      `,
      `
        O Apex executa de cima para baixo.

        Cada linha é um passo. A primeira linha termina antes de a próxima começar. Quando uma linha de baixo usa uma variável, ela vê o que as linhas de cima já fizeram.
      `,
      `
        Integer seatCount;
        String accountName;
      `,
    ),
    theory(
      "declaring-starts-null",
      `
        A new variable starts with no value.

        No value is written null. null is not zero, and it is not empty text. It means the variable has nothing yet.

        seatCount is null after this line. The next topic shows how to store a number in it.
      `,
      `
        Uma variável nova começa sem valor.

        A falta de valor se escreve null. null não é zero e não é um texto vazio. Significa que a variável ainda não tem nada.

        seatCount fica null depois dessa linha. O próximo tópico mostra como guardar um número nela.
      `,
      `
        Integer seatCount;
      `,
    ),
  ],
  assigning: [
    theory(
      "assigning-store",
      `
        The = sign stores a value.

        Read age = 30 as "put 30 into age". It puts a value in. It does not ask a question.

        The variable must already exist. The first line creates age. The second line stores 30.
      `,
      `
        O sinal = guarda um valor.

        Leia age = 30 como "coloque 30 em age". Ele coloca um valor. Ele não faz uma pergunta.

        A variável já precisa existir. A primeira linha cria age. A segunda linha guarda 30.
      `,
      `
        Integer age;
        age = 30;
      `,
    ),
    theory(
      "assigning-one-line",
      `
        You can create and store on one line.

        This creates age and puts 30 in it. The result is the same as creating age on one line and storing 30 on the next. The value matches the type: an Integer holds a whole number such as 30.
      `,
      `
        Dá para criar e guardar na mesma linha.

        Isso cria age e coloca 30 nela. O resultado é o mesmo de criar age numa linha e guardar 30 na seguinte. O valor combina com o tipo: um Integer guarda um número inteiro, como 30.
      `,
      `
        Integer age = 30;
      `,
    ),
    theory(
      "assigning-replace",
      `
        Storing again replaces the old value.

        A variable holds one value. After the second line, age is 31. The 30 is gone. The name and the type stay the same.
      `,
      `
        Guardar de novo substitui o valor antigo.

        Uma variável guarda um valor. Depois da segunda linha, age é 31. O 30 não está mais lá. O nome e o tipo continuam os mesmos.
      `,
      `
        Integer age = 30;
        age = 31;
      `,
    ),
  ],
  "system-debug": [
    theory(
      "system-debug-log",
      `
        System.debug shows a value in the log.

        Put the value inside the parentheses. The log sits under the editor. It lets you look. It does not decide whether the code is right, and it does not change the variable.

        This prints 30 because age holds 30.
      `,
      `
        System.debug mostra um valor no log.

        Coloque o valor dentro dos parênteses. O log fica embaixo do editor. Ele serve para você olhar. Ele não decide se o código está certo e não muda a variável.

        Isso mostra 30 porque age guarda 30.
      `,
      `
        Integer age = 30;
        System.debug(age);
      `,
    ),
    theory(
      "system-debug-text",
      `
        You can print text.

        Put the text in single quotes. System, debug, and the parentheses stay in English.
      `,
      `
        Dá para imprimir um texto.

        Coloque o texto entre aspas simples. System, debug e os parênteses ficam em inglês.
      `,
      `
        System.debug('Saved');
      `,
    ),
    theory(
      "system-debug-after-store",
      `
        Print after you store the value.

        Apex runs from top to bottom. System.debug reads the value as it is on that line. The first print shows null. The second print shows Acme.
      `,
      `
        Imprima depois de guardar o valor.

        O Apex executa de cima para baixo. System.debug lê o valor como ele está naquela linha. A primeira impressão mostra null. A segunda mostra Acme.
      `,
      `
        String accountName;
        System.debug(accountName);
        accountName = 'Acme';
        System.debug(accountName);
      `,
    ),
  ],
  integer: [
    theory(
      "integer-whole",
      `
        An Integer is a whole number.

        Write digits only, with no comma and no decimal point. 0, 3, 1500, and -2 can be Integers. 3.5 is not an Integer. '3' is text, not an Integer.

        Write the number you want to store. Adding numbers is a later module.
      `,
      `
        Um Integer é um número inteiro.

        Escreva só os dígitos, sem ponto de milhar e sem vírgula. 0, 3, 1500 e -2 podem ser Integers. 3.5 não é um Integer. '3' é texto, não um Integer.

        Escreva o número que você quer guardar. Somar números fica para um módulo mais à frente.
      `,
      `
        Integer seatCount = 3;
      `,
    ),
    theory(
      "integer-zero-negative",
      `
        Zero and negative numbers are Integers.

        0 is a real number. A negative number has a minus sign in front, with no space.
      `,
      `
        Zero e números negativos são Integers.

        0 é um número de verdade. Um número negativo tem um sinal de menos na frente, sem espaço.
      `,
      `
        Integer temperature = -2;
        Integer emptySeats = 0;
      `,
    ),
    theory(
      "integer-null",
      `
        An Integer with no number is null.

        Leaving the value off means null. Writing = null means the same thing. 0 is a number. null means there is no number.
      `,
      `
        Um Integer sem número é null.

        Deixar o valor de fora significa null. Escrever = null significa a mesma coisa. 0 é um número. null significa que não há número.
      `,
      `
        Integer missing;
        Integer alsoMissing = null;
      `,
    ),
    theory(
      "integer-replace",
      `
        To change an Integer, store a new number.

        The second line replaces 3 with 4. You write the new whole number yourself.
      `,
      `
        Para mudar um Integer, guarde outro número.

        A segunda linha troca 3 por 4. Você mesmo escreve o novo número inteiro.
      `,
      `
        Integer seatCount = 3;
        seatCount = 4;
      `,
    ),
  ],
  string: [
    theory(
      "string-quotes",
      `
        A String is text in single quotes.

        The quotes mark the text. They are not part of the stored value. The value here is Acme. Apex writes text with single quotes.
      `,
      `
        Uma String é texto entre aspas simples.

        As aspas marcam o texto. Elas não fazem parte do valor guardado. O valor aqui é Acme. O Apex escreve texto com aspas simples.
      `,
      `
        String accountName = 'Acme';
      `,
    ),
    theory(
      "string-capitals",
      `
        Capital letters change the text.

        Hi and hi are different Strings. loud and quiet are two variables. loud and Loud would be the same name.
      `,
      `
        Maiúscula muda o texto.

        Hi e hi são Strings diferentes. loud e quiet são duas variáveis. loud e Loud seriam o mesmo nome.
      `,
      `
        String loud = 'Hi';
        String quiet = 'hi';
      `,
    ),
    theory(
      "string-empty-null",
      `
        Empty text is not null.

        '' is a String with no characters. It is still text. null means there is no String yet. A blank nickname and a missing nickname are different.
      `,
      `
        Texto vazio não é null.

        '' é uma String sem nenhum caractere. Ainda é texto. null significa que ainda não há String. Um apelido em branco e um apelido ausente são coisas diferentes.
      `,
      `
        String blank = '';
        String missing = null;
      `,
    ),
    theory(
      "string-apostrophe",
      `
        A quote inside the text needs a backslash.

        The backslash tells Apex that the quote is part of the text, not the end of it. The value stored is O'Brien, without the backslash.
      `,
      `
        Aspas dentro do texto pedem uma barra invertida.

        A barra invertida avisa ao Apex que a aspa faz parte do texto, e não é o fim dele. O valor guardado é O'Brien, sem a barra.
      `,
      `
        String contactName = 'O\\'Brien';
      `,
    ),
  ],
  boolean: [
    theory(
      "boolean-true-false",
      `
        A Boolean is true or false.

        Those are the two values. Neither has quotes. true means yes. false means no. Write them in lowercase. A name such as isActive or hasDiscount reads as a question.
      `,
      `
        Um Boolean é true ou false.

        São esses dois valores. Nenhum leva aspas. true significa sim. false significa não. Escreva os dois em minúsculas. Um nome como isActive ou hasDiscount soa como uma pergunta.
      `,
      `
        Boolean isActive = true;
        Boolean hasDiscount = false;
      `,
    ),
    theory(
      "boolean-not-text",
      `
        true without quotes is a Boolean.

        The word true inside quotes would be text, a String. When you want yes or no, leave the quotes off.
      `,
      `
        true sem aspas é um Boolean.

        A palavra true entre aspas seria texto, uma String. Quando você quer sim ou não, deixe as aspas de fora.
      `,
      `
        Boolean isActive = true;
      `,
    ),
    theory(
      "boolean-null",
      `
        A Boolean can be null.

        false is an answer: no. null means yes or no has not been stored. Leaving the value off is also null.
      `,
      `
        Um Boolean pode ser null.

        false é uma resposta: não. null significa que sim ou não ainda não foi guardado. Deixar o valor de fora também é null.
      `,
      `
        Boolean isActive;
        Boolean isClosed = null;
      `,
    ),
  ],
  decimal: [
    theory(
      "decimal-fraction",
      `
        A Decimal can include a fraction.

        Write a dot before the fraction, as in 19.99 or 0.5. Do not write a comma. Salesforce uses Decimal for amounts of money. A number with no dot, such as 19, is a whole number, an Integer.
      `,
      `
        Um Decimal pode ter fração.

        Escreva um ponto antes da fração, como em 19.99 ou 0.5. Não escreva vírgula. O Salesforce usa Decimal para valores em dinheiro. Um número sem ponto, como 19, é um número inteiro, um Integer.
      `,
      `
        Decimal amount = 19.99;
      `,
    ),
    theory(
      "decimal-negative",
      `
        A Decimal can be negative.

        Put the minus sign in front, with no space. 0.5 is a real Decimal.
      `,
      `
        Um Decimal pode ser negativo.

        Coloque o sinal de menos na frente, sem espaço. 0.5 é um Decimal de verdade.
      `,
      `
        Decimal discount = 0.5;
        Decimal adjustment = -3.25;
      `,
    ),
    theory(
      "decimal-null",
      `
        A Decimal with no number is null.

        null means no amount. Zero is an amount, so write it with a dot: 0.0. That dot makes it a Decimal. You do not have to add extra zeros to other amounts. 0.5 and 19.99 are complete.
      `,
      `
        Um Decimal sem número é null.

        null significa que não há valor. Zero é um valor, então escreva com ponto: 0.0. Esse ponto faz dele um Decimal. Você não precisa acrescentar zeros extras em outros valores. 0.5 e 19.99 já estão completos.
      `,
      `
        Decimal missing = null;
        Decimal zero = 0.0;
      `,
    ),
  ],
  date: [
    theory(
      "date-calendar-day",
      `
        A Date is a calendar day.

        It stores a year, a month, and a day. It does not store a time of day. In this topic you create a date and store it.
      `,
      `
        Uma Date é um dia do calendário.

        Ela guarda um ano, um mês e um dia. Ela não guarda um horário. Neste tópico você cria uma data e a guarda numa variável.
      `,
    ),
    theory(
      "date-new-instance",
      `
        Date.newInstance builds a date.

        The numbers are year, month, then day. The month is a number from 1 to 12. January is 1. March is 3. December is 12. Use a day that exists. April 31 is not a day.

        This line stores 15 March 2026.
      `,
      `
        Date.newInstance monta uma data.

        Os números são ano, mês e depois dia. O mês é um número de 1 a 12. Janeiro é 1. Março é 3. Dezembro é 12. Use um dia que existe. 31 de abril não é um dia.

        Essa linha guarda 15 de março de 2026. A ordem é ano, mês e dia.
      `,
      `
        Date closeDate = Date.newInstance(2026, 3, 15);
      `,
    ),
    theory(
      "date-today",
      `
        Date.today gives the day the code runs.

        Leave the parentheses empty. Each run uses the day of that run.
      `,
      `
        Date.today devolve o dia em que o código roda.

        Deixe os parênteses vazios. Cada execução usa o dia daquela execução.
      `,
      `
        Date today = Date.today();
      `,
    ),
    theory(
      "date-null",
      `
        A Date can be null.

        null means no day is stored. It is not today. Declare the variable, or store null, when you have no date yet.
      `,
      `
        Uma Date pode ser null.

        null significa que nenhum dia foi guardado. Não é o dia de hoje. Declare a variável, ou guarde null, quando você ainda não tem uma data.
      `,
      `
        Date closeDate;
        Date startDate = null;
      `,
    ),
  ],
  concatenation: [
    theory(
      "concatenation-join-text",
      `
        A + between Strings joins text.

        It sticks the next text onto the end of the first. Without a space, Hello and Ana become HelloAna. The sample puts that space in its own quotes. Adding numbers is a later module. Here + joins.
      `,
      `
        Um + entre Strings junta texto.

        Ele cola o texto seguinte no fim do primeiro. Sem espaço, Hello e Ana ficam HelloAna. A amostra coloca esse espaço entre aspas. Somar números fica para um módulo mais à frente. Aqui o + junta.
      `,
      `
        String greeting = 'Hello' + ' ' + 'Ana';
      `,
    ),
    theory(
      "concatenation-text-first",
      `
        Start with text when you join a number.

        The String comes first. Then + attaches the Integer. The result is text, Seats: 3. The number is now part of that text.
      `,
      `
        Comece pelo texto ao juntar um número.

        A String vem primeiro. Depois o + cola o Integer. O resultado é texto, Seats: 3. O número passa a fazer parte desse texto.
      `,
      `
        Integer seatCount = 3;
        String label = 'Seats: ' + seatCount;
      `,
    ),
    theory(
      "concatenation-other-types",
      `
        A Date, a Boolean, or a Decimal joins the same way.

        Start with the text, then + the value. A Boolean becomes the word true or false. A Decimal becomes digits with a dot. A Date becomes text for that day. You do not choose a format in this topic.
      `,
      `
        Date, Boolean e Decimal também juntam.

        Comece pelo texto e depois use + com o valor. Um Boolean vira a palavra true ou false. Um Decimal vira dígitos com ponto. Uma Date vira texto daquele dia. Neste tópico você não escolhe um formato.
      `,
      `
        Boolean isActive = true;
        String statusLine = 'Active: ' + isActive;
        Decimal amount = 19.99;
        String totalLine = 'Total: ' + amount;
        Date closeDate = Date.newInstance(2026, 3, 15);
        String closeLine = 'Closes: ' + closeDate;
      `,
    ),
    theory(
      "concatenation-stored-value",
      `
        Join a value that is already stored.

        Use text, a number, true or false, or a Date that holds a real day. Store that value first, as the sample does, and then join it.
      `,
      `
        Junte um valor que já está guardado.

        Use texto, um número, true ou false, ou uma Date que tenha um dia de verdade. Guarde esse valor antes, como na amostra, e depois junte.
      `,
      `
        String accountName = 'Acme';
        String line = 'Account: ' + accountName;
      `,
    ),
  ],
  "mixed-review": [],
};
