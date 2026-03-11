import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configService.get<string>("FRONTEND_URL", "http://localhost:3000"),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle("LedgerFlow Studio API")
    .setDescription(
      "Financial Ledger & Audit Infrastructure Platform - A production-grade immutable ledger system for South African fintechs",
    )
    .setVersion("1.0.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Enter your JWT token",
    })
    .addTag("auth", "Authentication and user management endpoints")
    .addTag("ledger", "Immutable financial ledger operations")
    .addTag("audit", "Audit trail and compliance endpoints")
    .addTag("reconciliation", "Financial reconciliation workflows")
    .addContact(
      "Support",
      "https://ledgerflow.studio",
      "support@ledgerflow.studio",
    )
    .setLicense("MIT", "https://opensource.org/licenses/MIT")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = configService.get<number>("PORT", 3001);
  await app.listen(port);

  const appUrl = `http://localhost:${port}`;
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                     🚀 LedgerFlow Studio API Server                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

  Environment: ${configService.get<string>("NODE_ENV", "development")}
  Version: 1.0.0

  📍 Server:     ${appUrl}
  📚 API Docs:   ${appUrl}/api/docs
  🔐 Auth:       JWT Bearer Token
  💾 Database:   PostgreSQL (${configService.get<string>("DB_HOST")}:${configService.get<number>("DB_PORT")})

  Core Modules:
  ├── Authentication & RBAC
  ├── Immutable Ledger (Hash-Chaining)
  ├── Double-Entry Accounting
  ├── Audit Trail Logging
  ├── Reconciliation Workflows
  └── Compliance Management

  Ready to serve requests! ✓
`);
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
