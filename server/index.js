"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = Number(process.env.PORT) || 8050;
app.use(express_1.default.static('dist'));
app.get(`/**`, (req, res) => {
    res.sendFile('/dist/index.html');
});
app.listen(port, () => {
    console.log('app listening on port ' + port);
});
//# sourceMappingURL=index.js.map