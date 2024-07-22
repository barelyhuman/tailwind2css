import "./index.css";

import { twi } from "tw-to-css";
import prettier from "prettier/standalone";
import css from "prettier/plugins/postcss";

const defSym = Symbol("default");

function classesToCSS(classString) {
  const styleObjects = classString.split(/\s+/).reduce((acc, item) => {
    const [modifier, ...rest] = item.split(":");
    if (!rest.length) {
      (acc[defSym] ||= []).push(item);
    } else {
      (acc[modifier] ||= []).push(item);
    }
    return acc;
  }, {});

  let css = styleObjects[defSym].map((d) => twi(d)).join("\n");

  Object.keys(styleObjects).forEach((key) => {
    const stylesString = styleObjects[key].map((d) => twi(d)).join("\n");
    css +=
      `
      &:${key}{
  ${stylesString}
      }
      `.replace(/\s+/g, "") + "\n\n";
  });
  return css;
}

function updateTextAreaValue(outputTxtArea, value) {
  prettier
    .format(classesToCSS(value), { parser: "css", plugins: [css] })
    .then((d) => {
      outputTxtArea.textContent = d;
    });
}

function debounce(fn, delay) {
  let id;
  return (...args) => {
    if (id) clearTimeout(id);
    id = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function main() {
  const inputTxtArea = document.getElementById("class-input");
  const outputTxtArea = document.getElementById("css-output");

  const defaultInput = "bg-red-400 hover:bg-red-400";
  inputTxtArea.textContent = defaultInput;
  updateTextAreaValue(outputTxtArea, defaultInput);

  const updateTextAreaValueDebounced = debounce(updateTextAreaValue, 350);
  inputTxtArea.addEventListener("keyup", (e) => {
    updateTextAreaValueDebounced(outputTxtArea, e.target.value);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});
