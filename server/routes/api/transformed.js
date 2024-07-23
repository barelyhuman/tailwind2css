import postcss from "postcss";
import tailwindPostcss from "tailwindcss/lib/plugin.js";
import postcssnesting from "tailwindcss/lib/postcss-plugins/nesting/index.js";
import prefixer from "autoprefixer";
import { djb2 as hash } from "@dumbjs/quick-hash";
import prettier from "prettier/standalone";
import css from "prettier/plugins/postcss";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    return "";
  }
  const classes = await classesToCSSV2(body).catch((err) => {
    console.error(err);
    return false;
  });
  if (!classes) {
    return "";
  }
  const formatted = await prettier.format(classes, {
    parser: "css",
    plugins: [css],
  });
  return formatted;
});

async function classesToCSSV2(classString) {
  const processor = postcss(tailwindPostcss, postcssnesting.default, prefixer);
  const hashed = hash(classString);
  const output = processor.process(
    `
      .style-${hashed}{@apply ${classString};}
    `,
    {
      from: undefined,
    }
  );

  return output.then((d) => {
    const matched = d.css.match(new RegExp(`.style\-${hashed}`));
    const styles = d.css.slice(matched.index);
    return styles;
  });
}
