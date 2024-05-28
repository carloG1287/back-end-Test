import { PrismaClient } from "@prisma/client";

// Initialize a new instance of PrismaClient
const prisma = new PrismaClient();

// Export the prisma instance for use in other parts of the application
export default prisma;