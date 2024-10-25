-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEST_USER');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CASH', 'SAVINGS', 'INVESTMENT', 'CREDIT', 'LOAN', 'LONG_TERM_SAVINGS', 'PRE_ASSIGNED_CASH');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "TransactionTemplateType" AS ENUM ('MANUAL', 'AUTO');

-- CreateEnum
CREATE TYPE "UserPreferenceProperty" AS ENUM ('DEFAULT_INCOME_ACCOUNT', 'DEFAULT_EXPENSE_ACCOUNT', 'DEFAULT_TRANSFER_SOURCE_ACCOUNT', 'DEFAULT_TRANSFER_TARGET_ACCOUNT', 'TRANSACTION_LIST_CHUNK_SIZE', 'UPDATE_INVESTMENT_MARKET_VALUE', 'DASHBOARD_SETTINGS', 'STATISTICS_SETTINGS');

-- CreateEnum
CREATE TYPE "SystemLogLevel" AS ENUM ('ERROR', 'INFO', 'DEBUG');

-- CreateTable
CREATE TABLE "account_balance_change" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_balance_change_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "systemlogs" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "level" "SystemLogLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "systemlogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentCategoryId" TEXT,
    "visibility" "TransactionType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_mapping" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_log" (
    "id" TEXT NOT NULL,
    "eventType" "TransactionTemplateType" NOT NULL,
    "executed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "templateId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_template" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2),
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dayOfMonth" INTEGER,
    "dayOfMonthToCreate" INTEGER,
    "description" TEXT NOT NULL,
    "fromAccount" TEXT,
    "toAccount" TEXT,
    "templateName" TEXT NOT NULL,
    "templateType" "TransactionTemplateType"[],
    "templateVisibility" "TransactionType",
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "fromAccount" TEXT,
    "toAccount" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preference" (
    "id" TEXT NOT NULL,
    "key" "UserPreferenceProperty" NOT NULL,
    "userId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "auth0Id" TEXT,
    "githubId" TEXT,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "roles" "Role"[] DEFAULT ARRAY[]::"Role"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "account_type_idx" ON "account"("type");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "account_isDeleted_idx" ON "account"("isDeleted");

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");

-- CreateIndex
CREATE INDEX "category_userId_idx" ON "category"("userId");

-- CreateIndex
CREATE INDEX "category_visibility_idx" ON "category"("visibility");

-- CreateIndex
CREATE INDEX "category_deleted_idx" ON "category"("deleted");

-- CreateIndex
CREATE INDEX "category_mapping_userId_idx" ON "category_mapping"("userId");

-- CreateIndex
CREATE INDEX "category_mapping_transactionId_idx" ON "category_mapping"("transactionId");

-- CreateIndex
CREATE INDEX "template_log_userId_idx" ON "template_log"("userId");

-- CreateIndex
CREATE INDEX "template_log_eventType_idx" ON "template_log"("eventType");

-- CreateIndex
CREATE INDEX "template_log_transactionId_idx" ON "template_log"("transactionId");

-- CreateIndex
CREATE INDEX "template_log_templateId_idx" ON "template_log"("templateId");

-- CreateIndex
CREATE INDEX "template_log_executed_idx" ON "template_log"("executed");

-- CreateIndex
CREATE INDEX "transaction_template_userId_idx" ON "transaction_template"("userId");

-- CreateIndex
CREATE INDEX "transaction_template_templateType_idx" ON "transaction_template"("templateType");

-- CreateIndex
CREATE INDEX "transaction_template_templateVisibility_idx" ON "transaction_template"("templateVisibility");

-- CreateIndex
CREATE INDEX "transaction_template_dayOfMonthToCreate_idx" ON "transaction_template"("dayOfMonthToCreate");

-- CreateIndex
CREATE INDEX "transaction_fromAccount_idx" ON "transaction"("fromAccount");

-- CreateIndex
CREATE INDEX "transaction_toAccount_idx" ON "transaction"("toAccount");

-- CreateIndex
CREATE INDEX "transaction_date_idx" ON "transaction"("date");

-- CreateIndex
CREATE INDEX "transaction_userId_idx" ON "transaction"("userId");

-- CreateIndex
CREATE INDEX "user_preference_userId_idx" ON "user_preference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_userId_key_key" ON "user_preference"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth0Id_key" ON "user"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "user_githubId_key" ON "user"("githubId");

-- AddForeignKey
ALTER TABLE "account_balance_change" ADD CONSTRAINT "account_balance_change_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_balance_change" ADD CONSTRAINT "account_balance_change_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_mapping" ADD CONSTRAINT "category_mapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_mapping" ADD CONSTRAINT "category_mapping_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_mapping" ADD CONSTRAINT "category_mapping_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_log" ADD CONSTRAINT "template_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_log" ADD CONSTRAINT "template_log_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_log" ADD CONSTRAINT "template_log_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "transaction_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_template" ADD CONSTRAINT "transaction_template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_template" ADD CONSTRAINT "transaction_template_fromAccount_fkey" FOREIGN KEY ("fromAccount") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_template" ADD CONSTRAINT "transaction_template_toAccount_fkey" FOREIGN KEY ("toAccount") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_fromAccount_fkey" FOREIGN KEY ("fromAccount") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_toAccount_fkey" FOREIGN KEY ("toAccount") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
