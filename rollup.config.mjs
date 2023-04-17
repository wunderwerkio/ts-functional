import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const bundle = (name) => (configCallback) => {
  const config = configCallback(`dist/${name}/index`);

  return {
    ...config,
    input: `src/${name}/index.ts`,
    external: (id) => !/^[./]/.test(id),
  };
};

export default [
  bundle("results")((dist) => ({
    plugins: [esbuild()],
    output: [
      {
        file: `${dist}.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  })),
  bundle("results")((dist) => ({
    plugins: [dts()],
    output: {
      file: `${dist}.d.ts`,
      format: "es",
    },
  })),
];
