/*
  Warnings:

  - Made the column `created_at` on table `branches` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `branches` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tenant_id` on table `budgets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `budgets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estimated_time` on table `budgets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warranty` on table `budgets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `budgets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `budgets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `checklists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `checklists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `companies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `companies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `features` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `features` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `order_parts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `order_parts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tenant_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customer_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `equipment_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `service_status` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `others` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `others` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `part_movements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `part_movements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `parts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `parts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `periods` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `periods` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `plans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `plans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `receipts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `receipts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sale_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `sale_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `sales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `schedules` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `schedules` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `tenants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `tenants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `whatsapp_messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `whatsapp_messages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `budgets` DROP FOREIGN KEY `budgets_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_equipment_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_tenant_id_fkey`;

-- AlterTable
ALTER TABLE `branches` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `budgets` MODIFY `tenant_id` INTEGER NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `estimated_time` VARCHAR(191) NOT NULL,
    MODIFY `warranty` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `checklists` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `companies` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `customers` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `equipment` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `features` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `images` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `messages` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `order_parts` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `orders` MODIFY `tenant_id` INTEGER NOT NULL,
    MODIFY `customer_id` INTEGER NOT NULL,
    MODIFY `equipment_id` INTEGER NOT NULL,
    MODIFY `service_status` INTEGER NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `others` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `part_movements` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `parts` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `periods` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `plans` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `receipts` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `sale_items` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `sales` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `schedules` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `settings` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tenants` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `whatsapp_messages` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_equipment_id_fkey` FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
