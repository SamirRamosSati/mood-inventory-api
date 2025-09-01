"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
process.on("SIGTERM", () =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    server.close(() => {
      console.log("Server was shut down.");
      process.exit(0);
    });
  })
);
process.on("SIGINT", () =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    server.close(() => {
      console.log("Server was shut down.");
      process.exit(0);
    });
  })
);
