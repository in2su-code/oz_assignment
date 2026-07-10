// 덧셈 함수
function add(a, b) {
    return a + b;
}

// 뺄셈 함수
function subtract(a, b) {
    return a - b;
}

// 곱셈 함수
function multiply(a, b) {
    return a * b;
}

// 나눗셈 함수
function divide(a, b) {
    return a / b;
}

// 계산식 입력받기
function inputFormula() {
    return prompt("계산식을 입력하세요. (예: 1 + 2 * 3)");
}

// 계산하기
function calculate(formula) {
    const tokens = formula.trim().split(/\s+/);

    if (tokens.length < 3 || tokens.length % 2 === 0) {
        return "잘못된 계산식이 입력되었습니다.";
    }

    // 1단계: 곱셈과 나눗셈 먼저 처리
    const intermediateTokens = [];
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token === "*" || token === "/") {
            const left = Number(intermediateTokens.pop());
            const right = Number(tokens[i + 1]);

            if (isNaN(left) || isNaN(right)) {
                return "잘못된 숫자가 입력되었습니다.";
            }

            let result;

            if (token === "*") {
                result = multiply(left, right);
            } else {
                if (right === 0) {
                    return "0으로 나눌 수 없습니다.";
                }

                result = divide(left, right);
            }

            intermediateTokens.push(result);
            i += 2;
        } else {
            intermediateTokens.push(token);
            i++;
        }
    }

    // 2단계: 덧셈과 뺄셈 처리
    let finalResult = Number(intermediateTokens[0]);

    if (isNaN(finalResult)) {
        return "잘못된 숫자가 입력되었습니다.";
    }

    for (let j = 1; j < intermediateTokens.length; j += 2) {
        const operator = intermediateTokens[j];
        const nextValue = Number(intermediateTokens[j + 1]);

        if (isNaN(nextValue)) {
            return "잘못된 숫자가 입력되었습니다.";
        }

        if (operator === "+") {
            finalResult = add(finalResult, nextValue);
        } else if (operator === "-") {
            finalResult = subtract(finalResult, nextValue);
        } else {
            return `지원하지 않는 연산자입니다: ${operator}`;
        }
    }

    return finalResult;
}

// 계산기 시작
function start(formula) {

    let input = formula;

    // 인자가 없으면 prompt로 입력받기
    if (!input) {
        input = inputFormula();
    }

    // 아무것도 입력하지 않았을 때
    if (!input) {
        console.log("계산식을 입력해주세요.");
        return;
    }

    // 계산 실행
    const result = calculate(input);

    // 결과 출력
    if (typeof result === "string") {
        console.log(`에러 발생: ${result}`);
    } else {
        console.log(`결과: ${result}`);
    }
}