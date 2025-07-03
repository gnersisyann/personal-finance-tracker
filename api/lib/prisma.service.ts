import { PrismaClient } from "../generated/prisma/index.js";

export class PrismaService extends PrismaClient {
  async connect() {
    await this.$connect();
  }

  async disconnect() {
    await this.$disconnect();
  }
}
