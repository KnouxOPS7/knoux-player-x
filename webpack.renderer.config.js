const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const path = require("path");
const webpack = require("webpack"); // اللازمة للحل

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
  // هذا التوجيه مهم جداً
  target: "web", 
  
  module: { rules },
  plugins: [
    ...plugins,
    // 🔥 هذا هو السطر السحري الذي سيحل المشكلة 100% 🔥
    new webpack.DefinePlugin({
      "__dirname": JSON.stringify(""), // استبدال الخطأ بنص فارغ
      "global": "window",              // توجيه غلوبال للمتصفح
      "process.env": JSON.stringify(process.env) 
    })
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    alias: {
        "@core": path.resolve(__dirname, "src/core"),
        "@ui": path.resolve(__dirname, "src/ui"),
        "@state": path.resolve(__dirname, "src/state"),
        "@constants": path.resolve(__dirname, "src/constants")
    },
    // إخفاء مكتبات نود من المتصفح لمنع الأخطاء
    fallback: {
        "path": false,
        "fs": false,
        "os": false,
        "util": false,
        "assert": false,
        "events": false
    }
  },
};