var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { server } = require('./app');
require('./db/index');
require('./sockets/index');
const PORT = process.env.PORT || 1000;
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        server.listen(PORT, (err) => {
            if (err) {
                throw new Error(err);
            }
            console.log(`server has been started on PORT ${PORT}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}))();
//# sourceMappingURL=index.js.map