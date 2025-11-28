-- AlterTable: Rename column 'grau' to 'tipo' in Peca
ALTER TABLE `Peca` CHANGE `grau` `tipo` VARCHAR(191) NOT NULL;

-- AlterTable: Rename column 'grau' to 'tipo' in Etapa
ALTER TABLE `Etapa` CHANGE `grau` `tipo` VARCHAR(191) NOT NULL;
