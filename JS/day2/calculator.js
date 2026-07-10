// 페이지가 열리면 ON 상태
window.onload = function () {

    const buttons = document.querySelectorAll(
        "button:not(.on-off)"
    );

    buttons.forEach((button) => {
        button.disabled = false;
    });

};

// 화면(Display) 가져오기
const display = document.querySelector("#display");

// 숫자 버튼 모두 가져오기
const numberButtons = document.querySelectorAll(".number");

// 연산자 버튼 모두 가져오기
const operatorButtons = document.querySelectorAll(".operator");

// 기능 버튼 가져오기
const clearButton = document.querySelector(".clear");
const enterButton = document.querySelector(".enter");
const powerButton = document.querySelector(".on-off");



// 계산기 상태
let currentFormula = "";
let isPowerOn = true;
let isCalculated = false;


// 숫자 버튼 클릭 이벤트
numberButtons.forEach((button) => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.value);

    });

});

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function calculate(formula) {
    const tokens = formula.trim().split(/\s+/);

    if (tokens.length < 3 || tokens.length % 2 === 0) {
        return "Error";
    }

    const intermediateTokens = [];
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token === "*" || token === "/") {
            const left = Number(intermediateTokens.pop());
            const right = Number(tokens[i + 1]);

            if (isNaN(left) || isNaN(right)) {
                return "Error";
            }

            let result;

            if (token === "*") {
                result = multiply(left, right);
            } else {
                if (right === 0) {
                    return "DivBy0";
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

    let finalResult = Number(intermediateTokens[0]);

    if (isNaN(finalResult)) {
        return "Error";
    }

    for (let j = 1; j < intermediateTokens.length; j += 2) {
        const operator = intermediateTokens[j];
        const nextValue = Number(intermediateTokens[j + 1]);

        if (isNaN(nextValue)) {
            return "Error";
        }

        if (operator === "+") {
            finalResult = add(finalResult, nextValue);
        } else if (operator === "-") {
            finalResult = subtract(finalResult, nextValue);
        } else {
            return "Error";
        }
    }

    return finalResult;
}

function appendNumber(number) {
    if (!isPowerOn) {
        return;
    }

    if (isCalculated) {
        display.value = "";
        currentFormula = "";
        isCalculated = false;
    }

    if (
        display.value === "0" ||
        display.value === "Error" ||
        display.value === "DivBy0"
    ) {
        display.value = number;
        currentFormula = number;
    } else {
        display.value += number;
        currentFormula += number;
    }
}

function appendOperator(operator) {
    if (!isPowerOn) {
        return;
    }

    if (display.value === "Error" || display.value === "DivBy0") {
        return;
    }

    if (isCalculated) {
        isCalculated = false;
    }

    if (currentFormula === "") {
        currentFormula = "0";
    }

    if (currentFormula.endsWith(" ")) {
        currentFormula = currentFormula.slice(0, -3);
    }

    currentFormula += ` ${operator} `;
    display.value = currentFormula;
}

// 연산자 버튼 클릭 이벤트
operatorButtons.forEach((button) => {

    button.addEventListener("click", () => {

        appendOperator(button.dataset.operator);

    });

});

// C 버튼
clearButton.addEventListener("click", clearDisplay);

// Enter 버튼
enterButton.addEventListener("click", performCalculate);

// ON/OFF 버튼
powerButton.addEventListener("click", togglePower);




// 화면 초기화
function clearDisplay() {
    if (!isPowerOn) return;

    display.value = "0";
    currentFormula = "";
    isCalculated = false;
}


// 계산 실행
function performCalculate() {
    if (!isPowerOn || !currentFormula) return;

    // 마지막이 연산자로 끝나면 공백 제거
    if (currentFormula.endsWith(" ")) {
        currentFormula = currentFormula.trim();
    }

    const result = calculate(currentFormula);

    display.value = result;
    isCalculated = true;

    if (result === "Error" || result === "DivBy0") {
        currentFormula = "";
    } else {
        currentFormula = result.toString();
    }
}


// ON / OFF
function togglePower() {

    isPowerOn = !isPowerOn;

    const buttons = document.querySelectorAll(
        "button:not(.on-off)"
    );

    if (isPowerOn) {

        display.value = "0";

        buttons.forEach((button) => {
            button.disabled = false;
        });

    } else {

        display.value = "";

        buttons.forEach((button) => {
            button.disabled = true;
        });

        currentFormula = "";
        isCalculated = false;
    }
}