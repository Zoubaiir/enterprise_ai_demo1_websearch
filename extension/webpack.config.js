import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveEntry = (entry) => path.resolve(__dirname, "src", entry);

export default {
  mode: "development",
  devtool: "source-map",
  entry: {
    background: resolveEntry("application/background/index.ts"),
    content: resolveEntry("presentation/content/index.ts"),
    popup: resolveEntry("presentation/popup/index.ts")
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@application": path.resolve(__dirname, "src/application"),
      "@domain": path.resolve(__dirname, "src/domain"),
      "@infrastructure": path.resolve(__dirname, "src/infrastructure"),
      "@presentation": path.resolve(__dirname, "src/presentation")
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};
