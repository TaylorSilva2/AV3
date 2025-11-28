/*
  Warnings:

  - You are about to alter the column `funcionarioId` on the `etapafuncionario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `funcionario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idFunc` on the `funcionario` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `funcionario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `funcionarioId` on the `teste` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `etapafuncionario` DROP FOREIGN KEY `EtapaFuncionario_funcionarioId_fkey`;

-- DropForeignKey
ALTER TABLE `teste` DROP FOREIGN KEY `Teste_funcionarioId_fkey`;

-- DropIndex
DROP INDEX `Funcionario_idFunc_key` ON `funcionario`;

-- AlterTable
ALTER TABLE `etapafuncionario` MODIFY `funcionarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `funcionario` DROP PRIMARY KEY,
    DROP COLUMN `idFunc`,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `teste` MODIFY `funcionarioId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `EtapaFuncionario` ADD CONSTRAINT `EtapaFuncionario_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teste` ADD CONSTRAINT `Teste_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
